import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const auth = await getSession();
    const isAdmin = auth?.user?.role === "admin";

    const db = readDB();
    const items = showAll || isAdmin
      ? db.faq.slice().sort((a, b) => a.urutan - b.urutan)
      : db.faq.filter((f) => f.is_aktif).sort((a, b) => a.urutan - b.urutan);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil FAQ." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { pertanyaan, jawaban, urutan } = body;

    if (!pertanyaan || !jawaban) {
      return NextResponse.json({ success: false, error: "Pertanyaan dan jawaban wajib diisi." }, { status: 400 });
    }

    const db = readDB();
    const newFaq = {
      id: generateId("faq"),
      pertanyaan,
      jawaban,
      urutan: Number(urutan) || db.faq.length + 1,
      is_aktif: true,
      created_at: now(),
    };

    db.faq.push(newFaq);
    writeDB(db);

    return NextResponse.json({ success: true, data: newFaq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal membuat FAQ." }, { status: 500 });
  }
}
