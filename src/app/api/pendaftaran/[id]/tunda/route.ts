import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { catatan_admin } = body;

    const db = readDB();
    const reg = db.pendaftaran.find((p) => p.id === id);

    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Pendaftaran tidak ditemukan." },
        { status: 404 }
      );
    }

    reg.status = "ditunda";
    reg.catatan_admin = catatan_admin || "Menunggu pembukaan jadwal kelas baru.";
    reg.updated_at = now();

    logActivity(db, "admin", "Tunda Pendaftaran", `Pendaftaran ${reg.no_registrasi} ditunda.`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: reg,
      message: "Status pendaftaran berhasil ditunda.",
    });
  } catch (error) {
    console.error("Postpone pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menunda pendaftaran." },
      { status: 500 }
    );
  }
}
