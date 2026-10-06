import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const programs = db.program.sort((a, b) => a.urutan - b.urutan);

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get program error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar program belajar." },
      { status: 500 }
    );
  }
}
