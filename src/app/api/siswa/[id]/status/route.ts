import { NextResponse } from "next/server";
import { readDB, writeDB, now, today, logActivity } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, alasan, kelas_id } = body;

    if (!["aktif", "nonaktif", "lulus"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status harus salah satu dari: aktif, nonaktif, atau lulus." },
        { status: 400 }
      );
    }

    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === id);

    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    siswa.status = status;
    siswa.updated_at = now();

    if (status === "nonaktif" || status === "lulus") {
      siswa.tanggal_keluar = today();
      siswa.alasan_keluar = alasan || (status === "lulus" ? "Lulus Program AHE" : "Mengundurkan diri");
      siswa.kelas_id = null;
    } else if (status === "aktif") {
      siswa.tanggal_keluar = null;
      siswa.alasan_keluar = null;
      if (kelas_id) {
        siswa.kelas_id = kelas_id;
      }
    }

    logActivity(
      db,
      "system",
      "Ubah Status Siswa",
      `Status siswa ${siswa.nama} diubah menjadi ${status} (${alasan || "-"})`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: siswa,
      message: `Status siswa berhasil diubah menjadi ${status}.`,
    });
  } catch (error) {
    console.error("Toggle student status error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status siswa." },
      { status: 500 }
    );
  }
}
