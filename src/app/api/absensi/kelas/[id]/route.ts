import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const kelas = db.kelas.find((k) => k.id === id);
    if (!kelas) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const students = db.siswa.filter((s) => s.kelas_id === id && s.status === "aktif");
    const classSessions = db.sesi_belajar.filter((sb) => sb.kelas_id === id);

    const rekapPerSiswa = students.map((s) => {
      const studentAbs = db.absensi.filter((a) => a.siswa_id === s.id);
      const hadir = studentAbs.filter((a) => a.status === "hadir").length;
      const izin = studentAbs.filter((a) => a.status === "izin").length;
      const sakit = studentAbs.filter((a) => a.status === "sakit").length;
      const alpha = studentAbs.filter((a) => a.status === "alpha").length;
      const total = studentAbs.length;

      return {
        siswa_id: s.id,
        nama: s.nama,
        hadir,
        izin,
        sakit,
        alpha,
        total,
        persentase: total > 0 ? Math.round((hadir / total) * 100) : 100,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        kelas_id: kelas.id,
        kelas_nama: kelas.nama,
        total_sesi: classSessions.length,
        siswa: rekapPerSiswa,
      },
    });
  } catch (error) {
    console.error("Get absensi kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rekap absensi kelas." },
      { status: 500 }
    );
  }
}
