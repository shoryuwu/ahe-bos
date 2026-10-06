import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { alasan_batal } = body;

    const db = readDB();
    const sesi = db.sesi_belajar.find((s) => s.id === id);

    if (!sesi) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan." },
        { status: 404 }
      );
    }

    sesi.status_sesi = "dibatalkan";
    sesi.alasan_batal = alasan_batal || "Dibatalkan oleh pengajar/admin.";

    logActivity(
      db,
      "system",
      "Batalkan Sesi",
      `Sesi ${id} dibatalkan: ${sesi.alasan_batal}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: sesi,
      message: "Sesi berhasil dibatalkan.",
    });
  } catch (error) {
    console.error("Cancel sesi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membatalkan sesi belajar." },
      { status: 500 }
    );
  }
}
