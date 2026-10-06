import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = readDB();

    const totalSiswa = db.siswa.length;
    const siswaAktif = db.siswa.filter((s) => s.status === "aktif").length;
    const siswaLulus = db.siswa.filter((s) => s.status === "lulus").length;
    const totalGuru = db.guru.filter((g) => g.is_active).length;
    const totalKelas = db.kelas.filter((k) => k.status === "aktif").length;

    // Registrations
    const pendaftaranMenunggu = db.pendaftaran.filter((p) => p.status === "menunggu").length;
    const waitingListCount = db.waiting_list.filter((w) => w.status === "menunggu").length;

    // Assessments awaiting approval
    const asesmenMenunggu = db.asesmen.filter((a) => a.status === "menunggu").length;

    // Overall attendance rate
    const totalAbsensi = db.absensi.length;
    const hadirAbsensi = db.absensi.filter((a) => a.status === "hadir").length;
    const persentaseKehadiran =
      totalAbsensi > 0 ? Math.round((hadirAbsensi / totalAbsensi) * 100) : 100;

    // Level distribution
    const levelCounts: Record<string, number> = {
      "pra-membaca": 0,
      "level-1": 0,
      "level-2": 0,
      "level-3": 0,
      lanjutan: 0,
    };
    db.siswa.forEach((s) => {
      if (s.status === "aktif") {
        levelCounts[s.level_saat_ini] = (levelCounts[s.level_saat_ini] || 0) + 1;
      }
    });

    // Recent activity logs
    const recentLogs = db.log_aktivitas
      .slice(-8)
      .reverse();

    // Capacity status across classes
    const classCapacities = db.kelas
      .filter((k) => k.status === "aktif")
      .map((k) => {
        const studentCount = db.siswa.filter(
          (s) => s.kelas_id === k.id && s.status === "aktif"
        ).length;
        const prog = db.program.find((p) => p.id === k.program_id);
        const guru = db.guru.find((g) => g.id === k.guru_id);
        return {
          id: k.id,
          nama: k.nama,
          program: prog ? prog.nama : "AHE",
          guru: guru ? guru.nama : "Tutor",
          terisi: studentCount,
          kapasitas: k.kapasitas,
          isFull: studentCount >= k.kapasitas,
        };
      });

    return NextResponse.json({
      success: true,
      data: {
        kpi: {
          totalSiswa,
          siswaAktif,
          siswaLulus,
          totalGuru,
          totalKelas,
          pendaftaranMenunggu,
          waitingListCount,
          asesmenMenunggu,
          persentaseKehadiran,
        },
        distribusiLevel: levelCounts,
        kapasitasKelas: classCapacities,
        logAktivitas: recentLogs,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil statistik dashboard admin." },
      { status: 500 }
    );
  }
}
