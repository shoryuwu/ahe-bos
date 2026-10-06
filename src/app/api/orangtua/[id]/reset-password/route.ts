import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(
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

    const generatedPass = `ahe-${Math.random().toString(36).substring(2, 8)}`;
    const passHash = await hashPassword(generatedPass);
    const cleanEmail =
      ortu.email?.trim() || `${ortu.no_wa.replace(/\D/g, "")}@ahe.id`;

    let user = db.users.find((u) => u.id === ortu.user_id);

    if (user) {
      user.password_hash = passHash;
      user.password_reset_required = true;
      user.failed_logins = 0;
      user.locked_until = null;
      user.updated_at = now();
    } else {
      user = {
        id: generateId("usr-ortu"),
        email: cleanEmail,
        password_hash: passHash,
        role: "orangtua" as const,
        nama: ortu.nama,
        is_active: true,
        foto_url: null,
        failed_logins: 0,
        locked_until: null,
        last_login_at: null,
        password_reset_required: true,
        created_at: now(),
        updated_at: now(),
      };
      db.users.push(user);
      ortu.user_id = user.id;
      ortu.updated_at = now();
    }

    logActivity(
      db,
      "admin",
      "Reset Password Ortu",
      `Mereset kata sandi akun orang tua ${ortu.nama} (${user.email})`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        password_baru: generatedPass,
        nama: ortu.nama,
        no_wa: ortu.no_wa,
      },
      message: `Password akun untuk ${ortu.nama} berhasil direset.`,
    });
  } catch (error) {
    console.error("Reset password ortu error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mereset kata sandi orang tua." },
      { status: 500 }
    );
  }
}
