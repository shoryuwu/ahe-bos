import { NextResponse } from "next/server";
import { getSession, hashPassword, comparePassword } from "@/lib/auth";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { password_lama, password_baru, konfirmasi } = body;

    if (!password_lama || !password_baru || !konfirmasi) {
      return NextResponse.json(
        { success: false, error: "Semua kolom password wajib diisi." },
        { status: 400 }
      );
    }

    if (password_baru.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    if (password_baru !== konfirmasi) {
      return NextResponse.json(
        { success: false, error: "Konfirmasi password baru tidak cocok." },
        { status: 400 }
      );
    }

    const db = readDB();
    const user = db.users.find((u) => u.id === auth.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(password_lama, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Password lama tidak sesuai." },
        { status: 400 }
      );
    }

    user.password_hash = await hashPassword(password_baru);
    user.password_reset_required = false;
    user.updated_at = now();

    logActivity(db, user.id, "Ganti Password", "Pengguna berhasil mengganti kata sandi.");
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: null,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengganti password." },
      { status: 500 }
    );
  }
}
