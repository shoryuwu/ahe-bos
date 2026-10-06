import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;

    const db = readDB();
    const logs = [...db.log_aktivitas]
      .reverse()
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil log aktivitas." },
      { status: 500 }
    );
  }
}
