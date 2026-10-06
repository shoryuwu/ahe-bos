import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth";

export async function POST() {
  try {
    await clearSessionCookies();
    return NextResponse.json({
      success: true,
      data: null,
      message: "Berhasil keluar dari akun.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses logout." },
      { status: 500 }
    );
  }
}
