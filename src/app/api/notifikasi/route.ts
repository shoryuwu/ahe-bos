import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = readDB();
    const list = db.notifikasi
      .filter((n) => n.user_id === auth.user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const unreadCount = list.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      data: {
        total: list.length,
        unread: unreadCount,
        items: list,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil notifikasi." }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = readDB();
    db.notifikasi.forEach((n) => {
      if (n.user_id === auth.user.id) {
        n.is_read = true;
      }
    });

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Semua notifikasi ditandai telah dibaca.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui notifikasi." }, { status: 500 });
  }
}
