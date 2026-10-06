import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const db = readDB();
    const items = [...db.periode_akademik].reverse();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil periode akademik." },
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
    const { nama, tanggal_mulai, tanggal_selesai, catatan } = body;

    if (!nama || !tanggal_mulai || !tanggal_selesai) {
      return NextResponse.json(
        { success: false, error: "Nama periode dan tanggal mulai/selesai wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const newPeriode = {
      id: generateId("per"),
      nama,
      tanggal_mulai,
      tanggal_selesai,
      status: "aktif" as const,
      catatan: catatan || "",
      created_at: now(),
      updated_at: now(),
    };

    db.periode_akademik.push(newPeriode);
    logActivity(db, auth.user.id, "Tambah Periode", `Membuat periode akademik ${nama}`);
    writeDB(db);

    return NextResponse.json({ success: true, data: newPeriode }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal membuat periode akademik." },
      { status: 500 }
    );
  }
}
