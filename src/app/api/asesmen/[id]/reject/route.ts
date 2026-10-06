import { NextResponse } from "next/server";
import { readDB, writeDB, now, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getSession();
    const body = await req.json();
    const { catatan_admin } = body;

    const db = readDB();
    const asm = db.asesmen.find((a) => a.id === id);

    if (!asm) {
      return NextResponse.json(
        { success: false, error: "Asesmen tidak ditemukan." },
        { status: 404 }
      );
    }

    asm.status = "ditolak";
    asm.catatan_admin = catatan_admin || "Perlu penguatan materi sebelum kenaikan level.";

    // Notify Tutor
    const guru = db.guru.find((g) => g.id === asm.guru_id);
    const siswa = db.siswa.find((s) => s.id === asm.siswa_id);
    if (guru) {
      addNotification(
        db,
        guru.user_id,
        "Pengajuan Kenaikan Ditolak",
        `Asesmen kenaikan untuk ${siswa?.nama || "Siswa"} belum disetujui: ${asm.catatan_admin}`,
        "warning",
        "/tutor"
      );
    }

    logActivity(
      db,
      auth ? auth.user.id : "admin",
      "Tolak Asesmen",
      `Menolak pengajuan asesmen ${id}: ${asm.catatan_admin}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: asm,
      message: "Pengajuan asesmen berhasil ditolak dengan catatan.",
    });
  } catch (error) {
    console.error("Reject asesmen error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menolak pengajuan asesmen." },
      { status: 500 }
    );
  }
}
