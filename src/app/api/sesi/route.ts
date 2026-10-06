import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kelasId = searchParams.get("kelas_id") || "";
    const guruId = searchParams.get("guru_id") || "";
    const tanggal = searchParams.get("tanggal") || "";

    const db = readDB();

    let items = db.sesi_belajar.map((s) => {
      const kelas = db.kelas.find((k) => k.id === s.kelas_id);
      const guru = db.guru.find((g) => g.id === s.guru_id);
      const guruPengganti = s.guru_pengganti_id
        ? db.guru.find((g) => g.id === s.guru_pengganti_id)
        : null;
      const modul = s.modul_id ? db.modul.find((m) => m.id === s.modul_id) : null;
      const absensiList = db.absensi.filter((a) => a.sesi_id === s.id);
      const nilaiList = db.nilai_sesi.filter((n) => n.sesi_id === s.id);

      return {
        ...s,
        kelas: kelas ? { id: kelas.id, nama: kelas.nama } : null,
        guru: guru ? { id: guru.id, nama: guru.nama } : null,
        guru_pengganti: guruPengganti ? { id: guruPengganti.id, nama: guruPengganti.nama } : null,
        modul: modul ? { id: modul.id, judul: modul.judul, kode: modul.kode } : null,
        total_siswa: absensiList.length,
        hadir_count: absensiList.filter((a) => a.status === "hadir").length,
        rata_rata_nilai:
          nilaiList.length > 0
            ? Math.round(
                nilaiList.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / nilaiList.length
              )
            : null,
      };
    });

    if (kelasId) {
      items = items.filter((s) => s.kelas_id === kelasId);
    }
    if (guruId) {
      items = items.filter((s) => s.guru_id === guruId || s.guru_pengganti_id === guruId);
    }
    if (tanggal) {
      items = items.filter((s) => s.tanggal === tanggal);
    }

    items.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get sesi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data sesi belajar." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    const db = readDB();

    const body = await req.json();
    const {
      kelas_id,
      tanggal,
      jam_mulai,
      jam_selesai,
      modul_id,
      materi,
      catatan_umum,
      siswa_data,
    } = body;

    if (!kelas_id || !tanggal || !materi || !Array.isArray(siswa_data)) {
      return NextResponse.json(
        { success: false, error: "Data kelas, tanggal, materi, dan absensi siswa wajib diisi." },
        { status: 400 }
      );
    }

    const kelas = db.kelas.find((k) => k.id === kelas_id);
    if (!kelas) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    // Determine teacher id (from session if tutor, or from class)
    let guruId = kelas.guru_id;
    if (auth && auth.user.role === "tutor") {
      const guru = db.guru.find((g) => g.user_id === auth.user.id);
      if (guru) guruId = guru.id;
    }

    // 1. Create Sesi Belajar
    const newSesi = {
      id: generateId("sesi"),
      kelas_id,
      guru_id: guruId,
      modul_id: modul_id || null,
      guru_pengganti_id: null,
      periode_id: null,
      tanggal,
      jam_mulai: jam_mulai || kelas.jam_mulai,
      jam_selesai: jam_selesai || kelas.jam_selesai,
      materi,
      catatan_umum: catatan_umum || "Sesi belajar berjalan dengan baik.",
      status_sesi: "selesai" as const,
      alasan_batal: null,
      created_at: now(),
    };
    db.sesi_belajar.push(newSesi);

    // 2. Process each student's attendance & scores
    for (const item of siswa_data) {
      const {
        siswa_id,
        absensi: statusAbsen,
        nilai,
        mood,
        langkah_selesai,
        catatan,
      } = item;

      // Add Absensi
      db.absensi.push({
        id: generateId("abs"),
        sesi_id: newSesi.id,
        siswa_id,
        status: statusAbsen || "hadir",
        created_at: now(),
      });

      // If student attended, record score and learning notes
      if (statusAbsen === "hadir") {
        db.nilai_sesi.push({
          id: generateId("ns"),
          sesi_id: newSesi.id,
          siswa_id,
          nilai: nilai !== undefined && nilai !== null ? Number(nilai) : 80,
          mood: mood !== undefined && mood !== null ? Number(mood) : 5,
          langkah_selesai: Array.isArray(langkah_selesai) ? langkah_selesai : [1, 2, 3, 4, 5, 6],
          catatan: catatan || "Mengikuti sesi dengan baik.",
          created_at: now(),
        });

        // Also record in catatan_guru so it appears in parent timeline
        if (catatan) {
          db.catatan_guru.push({
            id: generateId("cg"),
            siswa_id,
            guru_id: guruId,
            tanggal,
            catatan,
            tipe: "progress",
            created_at: now(),
          });
        }

        // If module tracking is attached
        if (modul_id) {
          const existingModulSiswa = db.modul_siswa.find(
            (ms) => ms.modul_id === modul_id && ms.siswa_id === siswa_id
          );
          if (existingModulSiswa) {
            existingModulSiswa.status = "selesai";
            existingModulSiswa.nilai = nilai ? Number(nilai) : 80;
            existingModulSiswa.tanggal_selesai = tanggal;
            existingModulSiswa.updated_at = now();
          } else {
            db.modul_siswa.push({
              id: generateId("ms"),
              modul_id,
              siswa_id,
              sesi_id: newSesi.id,
              status: "selesai",
              nilai: nilai ? Number(nilai) : 80,
              tanggal_selesai: tanggal,
              created_at: now(),
              updated_at: now(),
            });
          }
        }
      }

      // 3. Early Warning Alert: Check if student has >= 3 alphas this month
      const currentMonth = tanggal.substring(0, 7);
      const studentAlphasThisMonth = db.absensi.filter((a) => {
        if (a.siswa_id !== siswa_id || a.status !== "alpha") return false;
        const sRecord = db.sesi_belajar.find((sb) => sb.id === a.sesi_id);
        return sRecord && sRecord.tanggal.startsWith(currentMonth);
      }).length;

      if (studentAlphasThisMonth >= 3) {
        const studentObj = db.siswa.find((s) => s.id === siswa_id);
        const ortuObj = studentObj ? db.orangtua.find((o) => o.id === studentObj.orangtua_id) : null;

        // Notify Admins
        const admins = db.users.filter((u) => u.role === "admin");
        admins.forEach((adm) => {
          addNotification(
            db,
            adm.id,
            "Peringatan Absensi Siswa",
            `Siswa ${studentObj?.nama || "Anak"} telah tidak hadir (Alpha) sebanyak ${studentAlphasThisMonth} kali pada bulan ini.`,
            "warning",
            "/admin"
          );
        });

        // Notify Parent
        if (ortuObj) {
          addNotification(
            db,
            ortuObj.user_id,
            "Perhatian Kehadiran Belajar",
            `Ananda ${studentObj?.nama || "Anak"} tercatat tidak hadir pada ${studentAlphasThisMonth} pertemuan bulan ini. Mohon konfirmasikan kendala ke pihak AHE.`,
            "warning",
            "/dashboard"
          );
        }
      }
    }

    logActivity(
      db,
      auth ? auth.user.id : "tutor",
      "Input Sesi Belajar",
      `Mencatat sesi ${newSesi.id} untuk kelas ${kelas.nama} (${materi})`
    );
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newSesi,
        message: "Sesi belajar, absensi, dan penilaian harian berhasil disimpan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create sesi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan sesi belajar harian." },
      { status: 500 }
    );
  }
}
