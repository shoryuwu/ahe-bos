import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const idx = db.waiting_list.findIndex((w) => w.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Data antrean waiting list tidak ditemukan." },
        { status: 404 }
      );
    }

    const removed = db.waiting_list.splice(idx, 1)[0];
    logActivity(
      db,
      "admin",
      "Hapus Waiting List",
      `Menghapus antrean ${id} dari waiting list.`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: removed,
      message: "Data berhasil dihapus dari antrean waiting list.",
    });
  } catch (error) {
    console.error("Delete waiting list error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus antrean waiting list." },
      { status: 500 }
    );
  }
}
