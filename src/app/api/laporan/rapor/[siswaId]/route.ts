import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ siswaId: string }> }
) {
  try {
    const { siswaId } = await params;
    const db = readDB();

    const siswa = db.siswa.find((s) => s.id === siswaId);
    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const ortu = db.orangtua.find((o) => o.id === siswa.orangtua_id);
    const kelas = siswa.kelas_id ? db.kelas.find((k) => k.id === siswa.kelas_id) : null;
    const guru = kelas ? db.guru.find((g) => g.id === kelas.guru_id) : null;
    const program = kelas ? db.program.find((p) => p.id === kelas.program_id) : null;

    // Absensi
    const attendances = db.absensi.filter((a) => a.siswa_id === siswaId);
    const totalAbsen = attendances.length;
    const hadir = attendances.filter((a) => a.status === "hadir").length;
    const izin = attendances.filter((a) => a.status === "izin").length;
    const sakit = attendances.filter((a) => a.status === "sakit").length;
    const alpha = attendances.filter((a) => a.status === "alpha").length;

    // Indikator
    const indList = db.progress_indikator
      .filter((p) => p.siswa_id === siswaId)
      .sort((a, b) => b.bulan.localeCompare(a.bulan));
    const latestIndikator = indList[0] || {
      bulan: new Date().toISOString().substring(0, 7),
      mengenal_huruf: 80,
      membaca_suku_kata: 75,
      membaca_kata: 70,
      membaca_kalimat: 60,
      membaca_cerita: 50,
    };

    // Kosakata
    const vocabs = db.kosakata.filter((k) => k.siswa_id === siswaId);
    const dikuasaiCount = vocabs.filter((k) => k.dikuasai).length;

    // Catatan guru terbaru
    const notes = db.catatan_guru
      .filter((c) => c.siswa_id === siswaId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: {
        siswa: {
          id: siswa.id,
          nama: siswa.nama,
          tempat_lahir: siswa.tempat_lahir,
          tanggal_lahir: siswa.tanggal_lahir,
          level: siswa.level_saat_ini,
          tanggal_masuk: siswa.tanggal_masuk,
          status: siswa.status,
        },
        orangtua: ortu ? { nama: ortu.nama, no_wa: ortu.no_wa, alamat: ortu.alamat } : null,
        kelas: kelas ? { nama: kelas.nama, program: program?.nama || "AHE" } : null,
        guru: guru ? { nama: guru.nama } : null,
        kehadiran: {
          total: totalAbsen,
          hadir,
          izin,
          sakit,
          alpha,
          persen: totalAbsen > 0 ? Math.round((hadir / totalAbsen) * 100) : 100,
        },
        indikator: latestIndikator,
        kosakata: {
          total: vocabs.length,
          dikuasai: dikuasaiCount,
        },
        catatan_evaluasi: notes[0]?.catatan || "Ananda aktif dan bersemangat dalam setiap sesi belajar.",
      },
    });
  } catch (error) {
    console.error("Get rapor data error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data rapor." },
      { status: 500 }
    );
  }
}
