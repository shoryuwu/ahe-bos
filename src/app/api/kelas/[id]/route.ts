import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const kelas = db.kelas.find((k) => k.id === id);

    if (!kelas) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const prog = db.program.find((p) => p.id === kelas.program_id);
    const guru = db.guru.find((g) => g.id === kelas.guru_id);
    const students = db.siswa.filter((s) => s.kelas_id === id && s.status === "aktif");

    return NextResponse.json({
      success: true,
      data: {
        ...kelas,
        program: prog || null,
        guru: guru || null,
        siswa: students,
      },
    });
  } catch (error) {
    console.error("Get detail kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rincian kelas." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.kelas.findIndex((k) => k.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.kelas[idx];
    const updated = {
      ...current,
      nama: body.nama !== undefined ? body.nama : current.nama,
      program_id: body.program_id !== undefined ? body.program_id : current.program_id,
      guru_id: body.guru_id !== undefined ? body.guru_id : current.guru_id,
      jadwal_hari: Array.isArray(body.jadwal_hari) ? body.jadwal_hari : current.jadwal_hari,
      jam_mulai: body.jam_mulai !== undefined ? body.jam_mulai : current.jam_mulai,
      jam_selesai: body.jam_selesai !== undefined ? body.jam_selesai : current.jam_selesai,
      kapasitas: body.kapasitas !== undefined ? Number(body.kapasitas) : current.kapasitas,
      status: body.status !== undefined ? body.status : current.status,
      updated_at: now(),
    };

    db.kelas[idx] = updated;
    logActivity(db, "system", "Edit Kelas", `Memperbarui konfigurasi kelas ${updated.nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data kelas berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data kelas." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const kelas = db.kelas.find((k) => k.id === id);
    if (!kelas) {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    // Safety rule: check if class still has active students
    const activeStudents = db.siswa.filter(
      (s) => s.kelas_id === id && s.status === "aktif"
    );

    if (activeStudents.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Kelas ${kelas.nama} tidak dapat dihapus/dinonaktifkan karena masih memiliki ${activeStudents.length} siswa aktif. Silakan pindahkan siswa terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    kelas.status = "nonaktif";
    kelas.updated_at = now();
    logActivity(db, "admin", "Nonaktifkan Kelas", `Menonaktifkan rombel kelas ${kelas.nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Kelas ${kelas.nama} berhasil dinonaktifkan.`,
    });
  } catch (error) {
    console.error("Delete kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menonaktifkan kelas." },
      { status: 500 }
    );
  }
}
