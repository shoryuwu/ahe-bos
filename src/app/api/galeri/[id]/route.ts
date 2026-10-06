import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = readDB();

    const idx = db.galeri.findIndex((g) => g.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Item galeri tidak ditemukan." }, { status: 404 });
    }

    const removed = db.galeri.splice(idx, 1)[0];
    logActivity(db, auth.user.id, "Hapus Galeri", `Menghapus item galeri ${id}`);
    writeDB(db);

    return NextResponse.json({ success: true, data: removed });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus item galeri." }, { status: 500 });
  }
}
