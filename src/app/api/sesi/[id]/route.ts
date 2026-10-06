import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const sesi = db.sesi_belajar.find((s) => s.id === id);

    if (!sesi) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan." },
        { status: 404 }
      );
    }

    const kelas = db.kelas.find((k) => k.id === sesi.kelas_id);
    const guru = db.guru.find((g) => g.id === sesi.guru_id);
    const absensiList = db.absensi.filter((a) => a.sesi_id === id);
    const nilaiList = db.nilai_sesi.filter((n) => n.sesi_id === id);

    const siswaDetails = absensiList.map((att) => {
      const siswa = db.siswa.find((s) => s.id === att.siswa_id);
      const nilai = nilaiList.find((n) => n.siswa_id === att.siswa_id);
      return {
        siswa_id: att.siswa_id,
        nama: siswa ? siswa.nama : "Siswa",
        status_absen: att.status,
        nilai: nilai?.nilai ?? null,
        mood: nilai?.mood ?? null,
        langkah_selesai: nilai?.langkah_selesai ?? [],
        catatan: nilai?.catatan ?? "",
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...sesi,
        kelas: kelas ? { id: kelas.id, nama: kelas.nama } : null,
        guru: guru ? { id: guru.id, nama: guru.nama } : null,
        peserta: siswaDetails,
      },
    });
  } catch (error) {
    console.error("Get detail sesi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data sesi." },
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

    const idx = db.sesi_belajar.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.sesi_belajar[idx];
    db.sesi_belajar[idx] = {
      ...current,
      materi: body.materi !== undefined ? body.materi : current.materi,
      catatan_umum: body.catatan_umum !== undefined ? body.catatan_umum : current.catatan_umum,
      status_sesi: body.status_sesi !== undefined ? body.status_sesi : current.status_sesi,
    };

    logActivity(db, "tutor", "Edit Sesi", `Memperbarui materi/catatan sesi ${id}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.sesi_belajar[idx],
      message: "Data sesi belajar berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update sesi error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data sesi." },
      { status: 500 }
    );
  }
}
