import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { alasan_tolak } = body;

    const db = readDB();
    const reg = db.pendaftaran.find((p) => p.id === id);

    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Pendaftaran tidak ditemukan." },
        { status: 404 }
      );
    }

    reg.status = "ditolak";
    reg.alasan_tolak = alasan_tolak || "Kapasitas penuh atau syarat belum terpenuhi.";
    reg.updated_at = now();

    logActivity(db, "admin", "Tolak Pendaftaran", `Pendaftaran ${reg.no_registrasi} ditolak.`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: reg,
      message: "Pendaftaran telah ditolak.",
    });
  } catch (error) {
    console.error("Reject pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menolak pendaftaran." },
      { status: 500 }
    );
  }
}
