import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";
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

    const user = db.users.find((u) => u.id === id);
    if (!user) {
      return NextResponse.json({ success: false, error: "Akun tidak ditemukan." }, { status: 404 });
    }

    // Protect self-deactivation
    if (auth.user.id === id && body.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun sendiri." },
        { status: 400 }
      );
    }

    if (body.nama !== undefined) user.nama = body.nama;
    if (body.role !== undefined && ["admin", "tutor", "orangtua"].includes(body.role)) {
      user.role = body.role;
    }
    if (body.is_active !== undefined) user.is_active = Boolean(body.is_active);
    user.updated_at = now();

    logActivity(
      db,
      auth.user.id,
      "Update Akun",
      `Memperbarui status/profil akun ${user.nama} (${user.email})`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
      message: `Akun ${user.nama} berhasil diperbarui.`,
    });
  } catch (error) {
    console.error("Update akun error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui akun." },
      { status: 500 }
    );
  }
}
