import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const badges = db.pencapaian
      .filter((p) => p.siswa_id === id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: badges,
    });
  } catch (error) {
    console.error("Get badges error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pencapaian siswa." },
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
    const { nama_badge, ikon, kategori, deskripsi } = body;

    if (!nama_badge) {
      return NextResponse.json(
        { success: false, error: "Nama badge wajib diisi." },
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

    const newBadge = {
      id: generateId("badge"),
      siswa_id: id,
      nama_badge,
      ikon: ikon || "Award",
      kategori: (kategori || "milestone") as any,
      deskripsi: deskripsi || "Pencapaian belajar istimewa anak hebat.",
      tanggal_raih: today(),
      created_at: now(),
    };

    db.pencapaian.push(newBadge);
    logActivity(db, "tutor", "Beri Badge", `Memberikan badge ${nama_badge} kepada ${siswa.nama}`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newBadge,
        message: "Badge pencapaian berhasil diberikan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create badge error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memberikan badge pencapaian." },
      { status: 500 }
    );
  }
}
