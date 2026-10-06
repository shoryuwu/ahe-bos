import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
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

    const idx = db.faq.findIndex((f) => f.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "FAQ tidak ditemukan." }, { status: 404 });
    }

    const current = db.faq[idx];
    db.faq[idx] = {
      ...current,
      pertanyaan: body.pertanyaan !== undefined ? body.pertanyaan : current.pertanyaan,
      jawaban: body.jawaban !== undefined ? body.jawaban : current.jawaban,
      is_aktif: body.is_aktif !== undefined ? Boolean(body.is_aktif) : current.is_aktif,
      urutan: body.urutan !== undefined ? Number(body.urutan) : current.urutan,
    };

    writeDB(db);

    return NextResponse.json({ success: true, data: db.faq[idx] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui FAQ." }, { status: 500 });
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

    const idx = db.faq.findIndex((f) => f.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "FAQ tidak ditemukan." }, { status: 404 });
    }

    const removed = db.faq.splice(idx, 1)[0];
    writeDB(db);

    return NextResponse.json({ success: true, data: removed });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menghapus FAQ." }, { status: 500 });
  }
}
