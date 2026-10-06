import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const db = readDB();

    let items = db.users.map((u) => {
      const isLocked = u.locked_until ? new Date(u.locked_until) > new Date() : false;
      return {
        id: u.id,
        nama: u.nama,
        email: u.email,
        role: u.role,
        is_active: u.is_active,
        is_locked: isLocked,
        locked_until: u.locked_until,
        failed_logins: u.failed_logins || 0,
        last_login_at: u.last_login_at,
        password_reset_required: u.password_reset_required,
        created_at: u.created_at,
      };
    });

    if (role) {
      items = items.filter((u) => u.role === role);
    }

    if (status) {
      if (status === "terkunci") {
        items = items.filter((u) => u.is_locked);
      } else if (status === "aktif") {
        items = items.filter((u) => u.is_active && !u.is_locked);
      } else if (status === "nonaktif") {
        items = items.filter((u) => !u.is_active);
      }
    }

    if (search) {
      items = items.filter(
        (u) =>
          u.nama.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    // Sort: admin first, then by created_at desc
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get akun error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data akun pengguna." },
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
    const { nama, email, password, role } = body;

    if (!nama || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Nama, email, password, dan role wajib diisi." },
        { status: 400 }
      );
    }

    if (!["admin", "tutor", "orangtua"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Role pengguna tidak valid." },
        { status: 400 }
      );
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();

    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar untuk akun lain." },
        { status: 400 }
      );
    }

    const passHash = await hashPassword(password);
    const prefix = role === "admin" ? "usr-adm" : role === "tutor" ? "usr-tutor" : "usr-ortu";

    const newUser = {
      id: generateId(prefix),
      email: cleanEmail,
      password_hash: passHash,
      role: role as "admin" | "tutor" | "orangtua",
      nama,
      is_active: true,
      foto_url: null,
      failed_logins: 0,
      locked_until: null,
      last_login_at: null,
      password_reset_required: true,
      created_at: now(),
      updated_at: now(),
    };

    db.users.push(newUser);
    logActivity(
      db,
      auth.user.id,
      "Buat Akun",
      `Membuat akun baru ${nama} (${cleanEmail}) dengan role ${role}`
    );
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
          role: newUser.role,
        },
        message: `Akun ${nama} (${role}) berhasil dibuat.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create akun error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat akun baru." },
      { status: 500 }
    );
  }
}
