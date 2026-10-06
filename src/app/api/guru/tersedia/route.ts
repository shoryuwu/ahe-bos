import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const activeTutors = db.guru
      .filter((g) => g.is_active)
      .map((g) => ({
        id: g.id,
        nama: g.nama,
        email: g.email,
        spesialisasi: g.spesialisasi,
      }));

    return NextResponse.json({
      success: true,
      data: activeTutors,
    });
  } catch (error) {
    console.error("Get guru tersedia error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar tutor tersedia." },
      { status: 500 }
    );
  }
}
