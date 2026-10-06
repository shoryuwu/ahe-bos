import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const words = db.kosakata
      .filter((k) => k.siswa_id === id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = words.length;
    const dikuasaiCount = words.filter((w) => w.dikuasai).length;

    return NextResponse.json({
      success: true,
      data: {
        total,
        dikuasai: dikuasaiCount,
        persen: total > 0 ? Math.round((dikuasaiCount / total) * 100) : 0,
        items: words,
      },
    });
  } catch (error) {
    console.error("Get kosakata error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kosakata siswa." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kata, kategori, dikuasai } = body;

    if (!kata || !kata.trim()) {
      return NextResponse.json(
        { success: false, error: "Kata tidak boleh kosong." },
        { status: 400 }
      );
    }

    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === id);
    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const isMastered = Boolean(dikuasai);
    const newWord = {
      id: generateId("voc"),
      siswa_id: id,
      kata: kata.trim().toLowerCase(),
      kategori: (kategori || "kata") as "huruf" | "suku-kata" | "kata" | "kalimat",
      dikuasai: isMastered,
      tanggal_dikuasai: isMastered ? today() : null,
      created_at: now(),
    };

    db.kosakata.push(newWord);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newWord,
        message: "Kosakata berhasil ditambahkan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create kosakata error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan kosakata." },
      { status: 500 }
    );
  }
}
