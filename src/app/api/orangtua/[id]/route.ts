import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const ortu = db.orangtua.find((o) => o.id === id);

    if (!ortu) {
      return NextResponse.json(
        { success: false, error: "Data orang tua tidak ditemukan." },
        { status: 404 }
      );
    }

    const children = db.siswa.filter((s) => s.orangtua_id === id);
    const user = db.users.find((u) => u.id === ortu.user_id);

    return NextResponse.json({
      success: true,
      data: {
        ...ortu,
        user: user
          ? {
              id: user.id,
              email: user.email,
              is_active: user.is_active,
              last_login_at: user.last_login_at,
            }
          : null,
        anak: children,
      },
    });
  } catch (error) {
    console.error("Get detail orangtua error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rincian orang tua." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.orangtua.findIndex((o) => o.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Data orang tua tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.orangtua[idx];
    db.orangtua[idx] = {
      ...current,
      nama: body.nama !== undefined ? body.nama : current.nama,
      no_wa: body.no_wa !== undefined ? body.no_wa : current.no_wa,
      email: body.email !== undefined ? body.email : current.email,
      alamat: body.alamat !== undefined ? body.alamat : current.alamat,
      hubungan: body.hubungan !== undefined ? body.hubungan : current.hubungan,
      updated_at: now(),
    };

    logActivity(db, "system", "Edit Orang Tua", `Memperbarui data orang tua ${db.orangtua[idx].nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.orangtua[idx],
      message: "Data orang tua berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update orangtua error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data orang tua." },
      { status: 500 }
    );
  }
}
