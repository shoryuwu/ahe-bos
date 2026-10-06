import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.modul.findIndex((m) => m.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.modul[idx];
    db.modul[idx] = {
      ...current,
      judul: body.judul !== undefined ? body.judul : current.judul,
      deskripsi: body.deskripsi !== undefined ? body.deskripsi : current.deskripsi,
      kode: body.kode !== undefined ? body.kode : current.kode,
      urutan: body.urutan !== undefined ? Number(body.urutan) : current.urutan,
      updated_at: now(),
    };

    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.modul[idx],
      message: "Modul berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update modul error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui modul." },
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

    const idx = db.modul.findIndex((m) => m.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }

    const removed = db.modul.splice(idx, 1)[0];
    logActivity(db, "admin", "Hapus Modul", `Menghapus modul ${removed.kode} - ${removed.judul}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: removed,
      message: "Modul berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete modul error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus modul." },
      { status: 500 }
    );
  }
}
