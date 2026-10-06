import { NextResponse } from "next/server";
import { readDB, writeDB, now } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const db = readDB();
    const map: Record<string, string> = {};
    db.pengaturan.forEach((p) => {
      map[p.key] = p.value;
    });
    return NextResponse.json({ success: true, data: map });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil pengaturan." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const db = readDB();

    Object.entries(body).forEach(([k, v]) => {
      const idx = db.pengaturan.findIndex((p) => p.key === k);
      if (idx !== -1) {
        db.pengaturan[idx].value = String(v);
        db.pengaturan[idx].updated_at = now();
      } else {
        db.pengaturan.push({
          key: k,
          value: String(v),
          updated_at: now(),
        });
      }
    });

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengaturan." }, { status: 500 });
  }
}
