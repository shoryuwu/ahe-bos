import { NextResponse } from "next/server";
import { readDB, writeDB, today } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.kosakata.findIndex((k) => k.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Kosakata tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.kosakata[idx];
    const isMastered = body.dikuasai !== undefined ? Boolean(body.dikuasai) : !current.dikuasai;

    db.kosakata[idx] = {
      ...current,
      dikuasai: isMastered,
      tanggal_dikuasai: isMastered ? (current.tanggal_dikuasai || today()) : null,
    };

    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.kosakata[idx],
      message: isMastered ? "Kosakata ditandai telah dikuasai." : "Status kosakata diperbarui.",
    });
  } catch (error) {
    console.error("Update kosakata error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kosakata." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const idx = db.kosakata.findIndex((k) => k.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Kosakata tidak ditemukan." },
        { status: 404 }
      );
    }

    const removed = db.kosakata.splice(idx, 1)[0];
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: removed,
      message: "Kosakata berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete kosakata error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kosakata." },
      { status: 500 }
    );
  }
}
