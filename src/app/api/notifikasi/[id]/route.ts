import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = readDB();

    const notif = db.notifikasi.find((n) => n.id === id);
    if (!notif) {
      return NextResponse.json({ success: false, error: "Notifikasi tidak ditemukan." }, { status: 404 });
    }

    notif.is_read = true;
    writeDB(db);

    return NextResponse.json({ success: true, data: notif });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui notifikasi." }, { status: 500 });
  }
}
