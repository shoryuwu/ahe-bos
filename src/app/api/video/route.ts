import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const db = readDB();
    const items = [...db.video_pembelajaran].reverse();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil video." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || (auth.user.role !== "tutor" && auth.user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { judul, deskripsi, youtube_url, level, target_tipe, target_id } = body;

    if (!judul || !youtube_url) {
      return NextResponse.json(
        { success: false, error: "Judul dan tautan video wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const newVideo = {
      id: generateId("vid"),
      guru_id: auth.user.role === "tutor" ? auth.user.id : "guru-001",
      judul,
      deskripsi: deskripsi || "",
      youtube_url,
      level: level || "Semua Level",
      target_tipe: (target_tipe || "kelas") as "kelas" | "siswa",
      target_id: target_id || "kls-001",
      created_at: now(),
      updated_at: now(),
    };

    db.video_pembelajaran.push(newVideo);
    writeDB(db);

    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan video." }, { status: 500 });
  }
}
