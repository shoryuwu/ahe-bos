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
    const body = await req.json();
    const db = readDB();

    const idx = db.video_pembelajaran.findIndex((v) => v.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Video tidak ditemukan." }, { status: 404 });
    }

    const current = db.video_pembelajaran[idx];
    db.video_pembelajaran[idx] = {
      ...current,
      judul: body.judul !== undefined ? body.judul : current.judul,
      deskripsi: body.deskripsi !== undefined ? body.deskripsi : current.deskripsi,
      youtube_url: body.youtube_url !== undefined ? body.youtube_url : current.youtube_url,
      level: body.level !== undefined ? body.level : current.level,
    };

    writeDB(db);

    return NextResponse.json({ success: true, data: db.video_pembelajaran[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui video." }, { status: 500 });
  }
}

export async function DELETE(
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

    const idx = db.video_pembelajaran.findIndex((v) => v.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Video tidak ditemukan." }, { status: 404 });
    }

    const removed = db.video_pembelajaran.splice(idx, 1)[0];
    writeDB(db);

    return NextResponse.json({ success: true, data: removed });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus video." }, { status: 500 });
  }
}
