import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const auth = await getSession();
    const isAdmin = auth?.user?.role === "admin";

    const db = readDB();
    const items = showAll || isAdmin ? db.testimoni : db.testimoni.filter((t) => t.is_tampil);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil testimoni." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_ortu, nama_anak, usia_anak, ulasan, rating, program } = body;

    if (!nama_ortu || !ulasan) {
      return NextResponse.json(
        { success: false, error: "Nama orang tua dan ulasan wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const newTesti = {
      id: generateId("testi"),
      nama_ortu,
      nama_anak: nama_anak || "Ananda",
      usia_anak: usia_anak || "5 tahun",
      ulasan,
      rating: Number(rating) || 5,
      program: program || "Membaca Fonik",
      is_tampil: true,
      created_at: now(),
    };

    db.testimoni.unshift(newTesti);
    writeDB(db);

    return NextResponse.json({ success: true, data: newTesti }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan ulasan testimoni." },
      { status: 500 }
    );
  }
}
