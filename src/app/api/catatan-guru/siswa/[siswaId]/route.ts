import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ siswaId: string }> }
) {
  try {
    const { siswaId } = await params;
    const db = readDB();

    const notes = db.catatan_guru
      .filter((c) => c.siswa_id === siswaId)
      .map((c) => {
        const guru = db.guru.find((g) => g.id === c.guru_id);
        return {
          ...c,
          guru_nama: guru ? guru.nama : "Tutor AHE",
        };
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Get catatan siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil catatan guru untuk siswa." },
      { status: 500 }
    );
  }
}
