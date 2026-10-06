import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const db = readDB();

    let items = db.orangtua.map((o) => {
      const children = db.siswa.filter((s) => s.orangtua_id === o.id);
      const user = db.users.find((u) => u.id === o.user_id);
      return {
        ...o,
        anak: children.map((c) => ({
          id: c.id,
          nama: c.nama,
          level: c.level_saat_ini,
          status: c.status,
        })),
        user_active: user ? user.is_active : false,
        user_email: user ? user.email : o.email,
        last_login_at: user ? user.last_login_at : null,
        has_account: !!user,
      };
    });

    if (search) {
      items = items.filter(
        (o) =>
          o.nama.toLowerCase().includes(search) ||
          o.no_wa.includes(search) ||
          o.anak.some((a) => a.nama.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get orangtua error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data orang tua." },
      { status: 500 }
    );
  }
}
