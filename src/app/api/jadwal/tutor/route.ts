import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getSession();
    if (!auth || (auth.user.role !== "tutor" && auth.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = readDB();

    let guruId = "";
    if (auth.user.role === "tutor") {
      const guru = db.guru.find((g) => g.user_id === auth.user.id);
      if (!guru) {
        return NextResponse.json(
          { success: false, error: "Profil guru tidak ditemukan." },
          { status: 404 }
        );
      }
      guruId = guru.id;
    }

    // Get classes for this teacher
    const myClasses = guruId
      ? db.kelas.filter((k) => k.guru_id === guruId && k.status === "aktif")
      : db.kelas.filter((k) => k.status === "aktif");

    const result = myClasses.map((k) => {
      const prog = db.program.find((p) => p.id === k.program_id);
      const students = db.siswa.filter((s) => s.kelas_id === k.id && s.status === "aktif");

      return {
        id: k.id,
        nama: k.nama,
        program: prog ? prog.nama : "Program AHE",
        level_kode: prog ? prog.kode : "pra-membaca",
        jadwal_hari: k.jadwal_hari,
        jam_mulai: k.jam_mulai,
        jam_selesai: k.jam_selesai,
        kapasitas: k.kapasitas,
        jumlah_siswa: students.length,
        siswa: students.map((s) => ({
          id: s.id,
          nama: s.nama,
          level: s.level_saat_ini,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get jadwal tutor error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil jadwal mengajar tutor." },
      { status: 500 }
    );
  }
}
