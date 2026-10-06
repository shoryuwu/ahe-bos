import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const students = db.siswa
      .filter((s) => s.kelas_id === id && s.status === "aktif")
      .map((s) => {
        const ortu = db.orangtua.find((o) => o.id === s.orangtua_id);
        return {
          id: s.id,
          nama: s.nama,
          tanggal_lahir: s.tanggal_lahir,
          jenis_kelamin: s.jenis_kelamin,
          level_saat_ini: s.level_saat_ini,
          orangtua: ortu ? { nama: ortu.nama, no_wa: ortu.no_wa } : null,
        };
      });

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get siswa kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar siswa di kelas ini." },
      { status: 500 }
    );
  }
}
