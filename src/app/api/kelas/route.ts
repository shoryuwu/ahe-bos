import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("program_id") || "";
    const guruId = searchParams.get("guru_id") || "";
    const status = searchParams.get("status") || "";

    const db = readDB();

    let items = db.kelas.map((k) => {
      const prog = db.program.find((p) => p.id === k.program_id);
      const guru = db.guru.find((g) => g.id === k.guru_id);
      const students = db.siswa.filter((s) => s.kelas_id === k.id && s.status === "aktif");

      return {
        ...k,
        program: prog ? { id: prog.id, nama: prog.nama, kode: prog.kode } : null,
        program_nama: prog ? prog.nama : null,
        guru: guru ? { id: guru.id, nama: guru.nama } : null,
        guru_nama: guru ? guru.nama : null,
        jumlah_siswa: students.length,
        siswa_count: students.length,
        is_penuh: students.length >= k.kapasitas,
      };
    });

    if (programId) {
      items = items.filter((k) => k.program_id === programId);
    }

    if (guruId) {
      items = items.filter((k) => k.guru_id === guruId);
    }

    if (status) {
      items = items.filter((k) => k.status === status);
    }

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kelas." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nama,
      program_id,
      guru_id,
      jadwal_hari,
      jam_mulai,
      jam_selesai,
      kapasitas,
    } = body;

    if (!nama || !program_id || !guru_id || !jam_mulai || !jam_selesai) {
      return NextResponse.json(
        { success: false, error: "Nama kelas, program, tutor, dan jam belajar wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();

    const newKelas = {
      id: generateId("kls"),
      nama,
      program_id,
      guru_id,
      jadwal_hari: Array.isArray(jadwal_hari) ? jadwal_hari : ["Senin", "Rabu", "Jumat"],
      jam_mulai,
      jam_selesai,
      kapasitas: Number(kapasitas) || 6,
      status: "aktif" as const,
      created_at: now(),
      updated_at: now(),
    };

    db.kelas.push(newKelas);
    logActivity(db, "system", "Tambah Kelas", `Membuat kelas baru ${nama}`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newKelas,
        message: "Kelas berhasil dibuat.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kelas baru." },
      { status: 500 }
    );
  }
}
