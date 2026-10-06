import { NextResponse } from "next/server";
import { readDB, writeDB, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.testimoni.findIndex((t) => t.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Testimoni tidak ditemukan." }, { status: 404 });
    }

    const current = db.testimoni[idx];
    db.testimoni[idx] = {
      ...current,
      is_tampil: body.is_tampil !== undefined ? Boolean(body.is_tampil) : current.is_tampil,
      ulasan: body.ulasan !== undefined ? body.ulasan : current.ulasan,
      rating: body.rating !== undefined ? Number(body.rating) : current.rating,
    };

    writeDB(db);

    return NextResponse.json({ success: true, data: db.testimoni[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui testimoni." }, { status: 500 });
  }
}

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

    const idx = db.testimoni.findIndex((t) => t.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Testimoni tidak ditemukan." }, { status: 404 });
    }

    const removed = db.testimoni.splice(idx, 1)[0];
    writeDB(db);

    return NextResponse.json({ success: true, data: removed });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus testimoni." }, { status: 500 });
  }
}
