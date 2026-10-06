import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const level = searchParams.get("level") || "";
    const status = searchParams.get("status") || "";
    const kelasId = searchParams.get("kelas_id") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const db = readDB();

    let items = db.siswa.map((s) => {
      const ortu = db.orangtua.find((o) => o.id === s.orangtua_id);
      const kelas = s.kelas_id ? db.kelas.find((k) => k.id === s.kelas_id) : null;
      const guru = kelas ? db.guru.find((g) => g.id === kelas.guru_id) : null;

      // Calculate attendance percentage
      const studentAttendance = db.absensi.filter((a) => a.siswa_id === s.id);
      const hadirCount = studentAttendance.filter((a) => a.status === "hadir").length;
      const kehadiranPersen =
        studentAttendance.length > 0
          ? Math.round((hadirCount / studentAttendance.length) * 100)
          : 100;

      // Calculate progress indicator average
      const indicators = db.progress_indikator.filter((p) => p.siswa_id === s.id);
      const latestInd = indicators[indicators.length - 1];
      const progressPersen = latestInd
        ? Math.round(
            (latestInd.mengenal_huruf +
              latestInd.membaca_suku_kata +
              latestInd.membaca_kata +
              latestInd.membaca_kalimat +
              latestInd.membaca_cerita) /
              5
          )
        : 50;

      return {
        ...s,
        orangtua: ortu
          ? { id: ortu.id, nama: ortu.nama, no_wa: ortu.no_wa, email: ortu.email }
          : null,
        kelas: kelas ? { id: kelas.id, nama: kelas.nama } : null,
        guru: guru ? { id: guru.id, nama: guru.nama } : null,
        progress_persen: progressPersen,
        kehadiran_persen: kehadiranPersen,
      };
    });

    if (search) {
      items = items.filter(
        (s) =>
          s.nama.toLowerCase().includes(search) ||
          (s.orangtua && s.orangtua.nama.toLowerCase().includes(search))
      );
    }

    if (level) {
      items = items.filter((s) => s.level_saat_ini === level);
    }

    if (status) {
      items = items.filter((s) => s.status === status);
    }

    if (kelasId) {
      items = items.filter((s) => s.kelas_id === kelasId);
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: {
        items: paginatedItems,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Get siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data siswa." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      kelas_id,
      orangtua,
    } = body;

    if (!nama || !tanggal_lahir || !jenis_kelamin || !orangtua?.nama || !orangtua?.no_wa) {
      return NextResponse.json(
        { success: false, error: "Nama siswa, tanggal lahir, jenis kelamin, dan data orang tua wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();

    // Determine level from selected class or default to pra-membaca
    let levelSaatIni = "pra-membaca";
    if (kelas_id) {
      const selectedKelas = db.kelas.find((k) => k.id === kelas_id);
      if (selectedKelas) {
        const prog = db.program.find((p) => p.id === selectedKelas.program_id);
        if (prog) levelSaatIni = prog.kode;
      }
    }

    // Check or create parent
    let ortuRecord = db.orangtua.find((o) => o.no_wa === orangtua.no_wa);
    let createdUser = null;

    if (!ortuRecord) {
      const generatedPass = `ahe-${Math.random().toString(36).substring(2, 8)}`;
      const passHash = await hashPassword(generatedPass);
      const cleanEmail =
        orangtua.email?.trim() || `${orangtua.no_wa.replace(/\D/g, "")}@ahe.id`;

      const newUser = {
        id: generateId("usr-ortu"),
        email: cleanEmail,
        password_hash: passHash,
        role: "orangtua" as const,
        nama: orangtua.nama,
        is_active: true,
        foto_url: null,
        failed_logins: 0,
        locked_until: null,
        last_login_at: null,
        password_reset_required: true,
        created_at: now(),
        updated_at: now(),
      };
      db.users.push(newUser);

      ortuRecord = {
        id: generateId("ortu"),
        user_id: newUser.id,
        nama: orangtua.nama,
        no_wa: orangtua.no_wa,
        email: cleanEmail,
        alamat: orangtua.alamat || "Karang Joang, Balikpapan",
        hubungan: orangtua.hubungan || "ibu",
        created_at: now(),
        updated_at: now(),
      };
      db.orangtua.push(ortuRecord);

      createdUser = {
        email: cleanEmail,
        password: generatedPass,
      };
    }

    // Create student
    const newSiswa = {
      id: generateId("siswa"),
      orangtua_id: ortuRecord.id,
      nama,
      tempat_lahir: tempat_lahir || "Balikpapan",
      tanggal_lahir,
      jenis_kelamin: jenis_kelamin as "L" | "P",
      level_saat_ini: levelSaatIni,
      kelas_id: kelas_id || null,
      foto_url: null,
      tanggal_masuk: today(),
      tanggal_keluar: null,
      status: "aktif" as const,
      alasan_keluar: null,
      created_at: now(),
      updated_at: now(),
    };
    db.siswa.push(newSiswa);

    // Initial level history
    db.riwayat_level.push({
      id: generateId("rl"),
      siswa_id: newSiswa.id,
      level: levelSaatIni,
      tanggal_mulai: today(),
      tanggal_selesai: null,
      status: "sedang",
      progress_persen: 0,
      created_at: now(),
    });

    // Initial progress indicator
    const currentMonth = today().substring(0, 7);
    db.progress_indikator.push({
      id: generateId("pi"),
      siswa_id: newSiswa.id,
      bulan: currentMonth,
      mengenal_huruf: 20,
      membaca_suku_kata: 0,
      membaca_kata: 0,
      membaca_kalimat: 0,
      membaca_cerita: 0,
      updated_by: "Admin",
      created_at: now(),
      updated_at: now(),
    });

    logActivity(db, "system", "Tambah Siswa", `Siswa baru ${newSiswa.nama} didaftarkan ke sistem.`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: {
          siswa: newSiswa,
          orangtua: ortuRecord,
          akun_baru: createdUser,
        },
        message: "Data siswa berhasil ditambahkan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan data siswa." },
      { status: 500 }
    );
  }
}
