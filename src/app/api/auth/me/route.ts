import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getSession();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan atau telah berakhir." },
        { status: 401 }
      );
    }

    const { user } = auth;
    const db = readDB();

    let meta: Record<string, unknown> = {};

    if (user.role === "tutor") {
      const guru = db.guru.find((g) => g.user_id === user.id);
      meta = { guru: guru || null };
    } else if (user.role === "orangtua") {
      const ortu = db.orangtua.find((o) => o.user_id === user.id);
      const anakList = ortu
        ? db.siswa.filter((s) => s.orangtua_id === ortu.id)
        : [];
      meta = {
        orangtua: ortu || null,
        anak: anakList,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama: user.nama,
        foto_url: user.foto_url,
        last_login_at: user.last_login_at,
        password_reset_required: user.password_reset_required,
        meta,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pengguna." },
      { status: 500 }
    );
  }
}
