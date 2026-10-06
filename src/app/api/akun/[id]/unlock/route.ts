import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

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

    user.failed_logins = 0;
    user.locked_until = null;
    user.updated_at = now();

    logActivity(
      db,
      auth.user.id,
      "Buka Kunci Akun",
      `Membuka status kunci (unlock) akun ${user.nama} (${user.email})`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Akun ${user.nama} berhasil dibuka kuncinya. Pengguna dapat login kembali.`,
    });
  } catch (error) {
    console.error("Unlock akun error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuka kunci akun." },
      { status: 500 }
    );
  }
}
