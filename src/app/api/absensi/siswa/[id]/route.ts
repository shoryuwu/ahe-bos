import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const attendances = db.absensi.filter((a) => a.siswa_id === id);
    const detailList = attendances.map((att) => {
      const sesi = db.sesi_belajar.find((s) => s.id === att.sesi_id);
      const kelas = sesi ? db.kelas.find((k) => k.id === sesi.kelas_id) : null;
      return {
        id: att.id,
        sesi_id: att.sesi_id,
        tanggal: sesi?.tanggal || "",
        materi: sesi?.materi || "",
        kelas_nama: kelas?.nama || "",
        status: att.status,
      };
    });

    const hadirCount = attendances.filter((a) => a.status === "hadir").length;
    const izinCount = attendances.filter((a) => a.status === "izin").length;
    const sakitCount = attendances.filter((a) => a.status === "sakit").length;
    const alphaCount = attendances.filter((a) => a.status === "alpha").length;
    const total = attendances.length;

    return NextResponse.json({
      success: true,
      data: {
        total,
        rekap: {
          hadir: hadirCount,
          izin: izinCount,
          sakit: sakitCount,
          alpha: alphaCount,
          persen_hadir: total > 0 ? Math.round((hadirCount / total) * 100) : 100,
        },
        riwayat: detailList,
      },
    });
  } catch (error) {
    console.error("Get absensi siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data rekap absensi siswa." },
      { status: 500 }
    );
  }
}
