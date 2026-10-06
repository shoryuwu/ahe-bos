import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { guru_pengganti_id } = body;

    if (!guru_pengganti_id) {
      return NextResponse.json(
        { success: false, error: "ID tutor pengganti wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const sesi = db.sesi_belajar.find((s) => s.id === id);

    if (!sesi) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan." },
        { status: 404 }
      );
    }

    const pengganti = db.guru.find((g) => g.id === guru_pengganti_id);
    if (!pengganti) {
      return NextResponse.json(
        { success: false, error: "Tutor pengganti tidak ditemukan." },
        { status: 404 }
      );
    }

    sesi.guru_pengganti_id = guru_pengganti_id;
    logActivity(
      db,
      "admin",
      "Tutor Pengganti",
      `Menugaskan ${pengganti.nama} sebagai tutor pengganti pada sesi ${id}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: sesi,
      message: `Tutor pengganti ${pengganti.nama} berhasil ditugaskan.`,
    });
  } catch (error) {
    console.error("Assign substitute tutor error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menugaskan tutor pengganti." },
      { status: 500 }
    );
  }
}
