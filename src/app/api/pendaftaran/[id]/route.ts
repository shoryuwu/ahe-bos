import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const item = db.pendaftaran.find((p) => p.id === id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Data pendaftaran tidak ditemukan." },
        { status: 404 }
      );
    }

    const prog = db.program.find(
      (pr) => pr.id === item.program_diminati || pr.kode === item.program_diminati
    );

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        program_nama: prog ? prog.nama : item.program_diminati,
      },
    });
  } catch (error) {
    console.error("Get detail pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rincian pendaftaran." },
      { status: 500 }
    );
  }
}
