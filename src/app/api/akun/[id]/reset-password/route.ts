import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = readDB();

    const user = db.users.find((u) => u.id === id);
    if (!user) {
      return NextResponse.json({ success: false, error: "Akun tidak ditemukan." }, { status: 404 });
    }

    const generatedPass = `ahe-${Math.random().toString(36).substring(2, 8)}`;
    const passHash = await hashPassword(generatedPass);

    user.password_hash = passHash;
    user.password_reset_required = true;
    user.failed_logins = 0;
    user.locked_until = null;
    user.updated_at = now();

    // If user is parent or tutor, get contact phone
    let phone = "";
    if (user.role === "orangtua") {
      const ortu = db.orangtua.find((o) => o.user_id === user.id);
      if (ortu) phone = ortu.no_wa;
    } else if (user.role === "tutor") {
      const guru = db.guru.find((g) => g.user_id === user.id);
      if (guru) phone = guru.no_wa;
    }

    logActivity(
      db,
      auth.user.id,
      "Reset Password Akun",
      `Mereset kata sandi akun ${user.nama} (${user.email})`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        password_baru: generatedPass,
        no_wa: phone,
      },
      message: `Password akun ${user.nama} berhasil direset.`,
    });
  } catch (error) {
    console.error("Reset password akun error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mereset kata sandi akun." },
      { status: 500 }
    );
  }
}
