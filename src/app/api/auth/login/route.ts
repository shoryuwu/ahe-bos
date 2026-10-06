import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";
import { comparePassword, setSessionCookies } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akun dengan email ini tidak ditemukan." },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: "Akun Anda berstatus nonaktif. Silakan hubungi admin AHE." },
        { status: 403 }
      );
    }

    // Check locked state
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMinutes = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Akun terkunci karena percobaan gagal berulang. Silakan coba lagi dalam ${remainingMinutes} menit.`,
        },
        { status: 423 }
      );
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      user.failed_logins = (user.failed_logins || 0) + 1;
      if (user.failed_logins >= 5) {
        user.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      writeDB(db);

      const attemptsLeft = Math.max(0, 5 - user.failed_logins);
      return NextResponse.json(
        {
          success: false,
          error:
            attemptsLeft > 0
              ? `Password salah. Sisa kesempatan sebelum akun terkunci: ${attemptsLeft} kali.`
              : "Akun terkunci selama 15 menit karena 5 kali salah memasukkan password.",
        },
        { status: 401 }
      );
    }

    // Success login
    user.failed_logins = 0;
    user.locked_until = null;
    user.last_login_at = now();
    user.updated_at = now();
    logActivity(db, user.id, "Login", `User ${user.nama} (${user.role}) berhasil masuk`);
    writeDB(db);

    await setSessionCookies(user.id, user.role);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama: user.nama,
        foto_url: user.foto_url,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
