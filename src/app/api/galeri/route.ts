import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const db = readDB();
    const items = [...db.galeri].sort((a, b) => a.urutan - b.urutan);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil galeri." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image_url, caption, kategori, urutan } = body;

    if (!image_url) {
      return NextResponse.json({ success: false, error: "URL gambar wajib diisi." }, { status: 400 });
    }

    const db = readDB();
    const newGaleri = {
      id: generateId("gal"),
      image_url,
      caption: caption || "",
      kategori: kategori || "kegiatan",
      urutan: Number(urutan) || db.galeri.length + 1,
      created_at: now(),
    };

    db.galeri.push(newGaleri);
    logActivity(db, auth.user.id, "Tambah Galeri", `Menambahkan foto galeri: ${caption}`);
    writeDB(db);

    return NextResponse.json({ success: true, data: newGaleri }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan galeri." }, { status: 500 });
  }
}
