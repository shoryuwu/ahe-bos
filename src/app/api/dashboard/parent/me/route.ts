import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = readDB();

    // Find parent record
    let ortu = db.orangtua.find((o) => o.user_id === auth.user.id);
    if (!ortu) {
      // If user is admin testing parent dashboard, fallback to first parent
      if (auth.user.role === "admin" && db.orangtua.length > 0) {
        ortu = db.orangtua[0];
      } else {
        return NextResponse.json(
          { success: false, error: "Data orang tua tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    // Find children of this parent
    const children = db.siswa.filter((s) => s.orangtua_id === ortu!.id);

    if (children.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          ortu: {
            id: ortu.id,
            nama: ortu.nama,
            no_wa: ortu.no_wa,
          },
          children: [],
          selectedChild: null,
        },
      });
    }

    // Check if a specific child is requested via query param
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("siswa_id") || children[0].id;
    const selectedChild = children.find((c) => c.id === childId) || children[0];

    // Get Class & Tutor
    const kelas = selectedChild.kelas_id
      ? db.kelas.find((k) => k.id === selectedChild.kelas_id)
      : null;
    const tutor = kelas ? db.guru.find((g) => g.id === kelas.guru_id) : null;
    const program = kelas ? db.program.find((p) => p.id === kelas.program_id) : null;

    // Attendance stats
    const studentAbs = db.absensi.filter((a) => a.siswa_id === selectedChild.id);
    const totalAbs = studentAbs.length;
    const hadir = studentAbs.filter((a) => a.status === "hadir").length;
    const izin = studentAbs.filter((a) => a.status === "izin").length;
    const sakit = studentAbs.filter((a) => a.status === "sakit").length;
    const alpha = studentAbs.filter((a) => a.status === "alpha").length;
    const persentaseHadir = totalAbs > 0 ? Math.round((hadir / totalAbs) * 100) : 100;

    // Recent 5 attendance logs
    const riwayatAbsensi = studentAbs.slice(-5).reverse().map((att) => {
      const sesi = db.sesi_belajar.find((s) => s.id === att.sesi_id);
      return {
        id: att.id,
        tanggal: sesi?.tanggal || "",
        materi: sesi?.materi || "",
        status: att.status,
      };
    });

    // 5-Dimension Progress Indicators (Latest record)
    const indikatorList = db.progress_indikator
      .filter((p) => p.siswa_id === selectedChild.id)
      .sort((a, b) => b.bulan.localeCompare(a.bulan));
    const latestIndikator = indikatorList[0] || {
      bulan: new Date().toISOString().substring(0, 7),
      mengenal_huruf: 75,
      membaca_suku_kata: 70,
      membaca_kata: 60,
      membaca_kalimat: 50,
      membaca_cerita: 40,
    };

    // Vocabulary progress
    const vocabs = db.kosakata.filter((k) => k.siswa_id === selectedChild.id);
    const totalVocab = vocabs.length;
    const dikuasaiVocab = vocabs.filter((k) => k.dikuasai).length;

    // Badges / Pencapaian
    const badges = db.pencapaian
      .filter((p) => p.siswa_id === selectedChild.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Teacher Notes
    const notes = db.catatan_guru
      .filter((c) => c.siswa_id === selectedChild.id)
      .map((c) => {
        const guru = db.guru.find((g) => g.id === c.guru_id);
        return {
          ...c,
          guru_nama: guru ? guru.nama : "Tutor AHE",
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Modules
    const modules = db.modul_siswa
      .filter((ms) => ms.siswa_id === selectedChild.id)
      .map((ms) => {
        const mod = db.modul.find((m) => m.id === ms.modul_id);
        return {
          ...ms,
          modul_judul: mod?.judul || "Modul",
          modul_kode: mod?.kode || "MOD",
        };
      });

    // Videos shared with this student or student's class
    const videos = db.video_pembelajaran.filter((v) => {
      if (v.target_tipe === "siswa" && v.target_id === selectedChild.id) return true;
      if (v.target_tipe === "kelas" && kelas && v.target_id === kelas.id) return true;
      return false;
    });

    const childDetailObj = {
      ...selectedChild,
      kelas: kelas
        ? {
            id: kelas.id,
            nama: kelas.nama,
            jadwal_hari: kelas.jadwal_hari,
            jam_mulai: kelas.jam_mulai,
            jam_selesai: kelas.jam_selesai,
            program: program?.nama || "AHE",
          }
        : null,
      tutor: tutor
        ? {
            id: tutor.id,
            nama: tutor.nama,
            no_wa: tutor.no_wa,
          }
        : null,
      kehadiran: {
        total: totalAbs,
        hadir,
        izin,
        sakit,
        alpha,
        persentase: persentaseHadir,
        riwayat: riwayatAbsensi,
      },
      indikator: latestIndikator,
      kosakata: {
        total: totalVocab,
        dikuasai: dikuasaiVocab,
        persen: totalVocab > 0 ? Math.round((dikuasaiVocab / totalVocab) * 100) : 0,
        daftar: vocabs.slice(0, 12),
      },
      pencapaian: badges,
      catatan: notes,
      modul: modules,
      video: videos,
    };

    return NextResponse.json({
      success: true,
      data: {
        ortu: {
          id: ortu.id,
          nama: ortu.nama,
          no_wa: ortu.no_wa,
        },
        children: children.map((c) => ({
          id: c.id,
          nama: c.nama,
          level_saat_ini: c.level_saat_ini,
          status: c.status,
        })),
        childDetail: childDetailObj,
        child: childDetailObj,
        kehadiran: childDetailObj.kehadiran,
        indikator: childDetailObj.indikator,
        kosakata: childDetailObj.kosakata,
        pencapaian: childDetailObj.pencapaian,
        catatan: notes,
      },
    });
  } catch (error) {
    console.error("Get parent dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dashboard orang tua." },
      { status: 500 }
    );
  }
}
