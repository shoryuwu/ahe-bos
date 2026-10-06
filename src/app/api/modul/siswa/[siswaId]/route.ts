import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ siswaId: string }> }
) {
  try {
    const { siswaId } = await params;
    const db = readDB();

    const modules = db.modul_siswa
      .filter((ms) => ms.siswa_id === siswaId)
      .map((ms) => {
        const modul = db.modul.find((m) => m.id === ms.modul_id);
        return {
          ...ms,
          modul_judul: modul ? modul.judul : "Modul Belajar",
          modul_kode: modul ? modul.kode : "MOD",
        };
      });

    return NextResponse.json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.error("Get modul siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data modul siswa." },
      { status: 500 }
    );
  }
}
