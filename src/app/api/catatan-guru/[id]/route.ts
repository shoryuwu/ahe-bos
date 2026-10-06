import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.catatan_guru.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Catatan tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.catatan_guru[idx];
    db.catatan_guru[idx] = {
      ...current,
      catatan: body.catatan !== undefined ? body.catatan : current.catatan,
      tipe: body.tipe !== undefined ? body.tipe : current.tipe,
    };

    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.catatan_guru[idx],
      message: "Catatan berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update catatan error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui catatan." },
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

    const idx = db.catatan_guru.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Catatan tidak ditemukan." },
        { status: 404 }
      );
    }

    const removed = db.catatan_guru.splice(idx, 1)[0];
    logActivity(db, "tutor", "Hapus Catatan", `Menghapus catatan ${id}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: removed,
      message: "Catatan berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete catatan error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus catatan." },
      { status: 500 }
    );
  }
}
