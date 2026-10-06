import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ noRegistrasi: string }> }
) {
  try {
    const { noRegistrasi } = await params;
    const cleanNo = decodeURIComponent(noRegistrasi).trim().toUpperCase();

    const db = readDB();
    const reg = db.pendaftaran.find(
      (p) => p.no_registrasi.toUpperCase() === cleanNo
    );

    if (!reg) {
      return NextResponse.json(
        {
          success: false,
          error: `Nomor registrasi "${cleanNo}" tidak ditemukan dalam sistem. Pastikan format nomor benar (contoh: REG-2026-001 atau TRL-2026-001).`,
        },
        { status: 404 }
      );
    }

    const prog = db.program.find(
      (pr) => pr.id === reg.program_diminati || pr.kode === reg.program_diminati
    );

    let statusDescription = "";
    switch (reg.status) {
      case "menunggu":
        statusDescription = "Berkas pendaftaran sedang dalam antrean verifikasi tim admin AHE.";
        break;
      case "diproses":
        statusDescription = "Data sedang ditinjau dan penjadwalan kelas sedang disiapkan.";
        break;
      case "diterima":
        statusDescription =
          "Selamat! Pendaftaran telah disetujui. Akun orang tua telah aktif. Silakan cek WhatsApp Anda untuk informasi jadwal dan kata sandi masuk.";
        break;
      case "ditunda":
        statusDescription = `Pendaftaran ditunda sementara: ${reg.catatan_admin || "Menunggu pembukaan jadwal baru"}.`;
        break;
      case "ditolak":
        statusDescription = `Mohon maaf, pendaftaran belum dapat diterima: ${reg.alasan_tolak || "-"}. Hubungi admin kami untuk informasi lebih lanjut.`;
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        no_registrasi: reg.no_registrasi,
        tipe_pendaftaran: reg.tipe_pendaftaran || "reguler",
        nama_anak: reg.nama_anak,
        program_diminati: prog ? prog.nama : reg.program_diminati,
        status: reg.status,
        keterangan: statusDescription,
        tanggal_daftar: reg.created_at.split("T")[0],
        terakhir_diperbarui: reg.updated_at.split("T")[0],
      },
    });
  } catch (error) {
    console.error("Cek status pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa status pendaftaran." },
      { status: 500 }
    );
  }
}
