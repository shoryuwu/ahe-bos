import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === id);

    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const ortu = db.orangtua.find((o) => o.id === siswa.orangtua_id);
    const kelas = siswa.kelas_id ? db.kelas.find((k) => k.id === siswa.kelas_id) : null;
    const guru = kelas ? db.guru.find((g) => g.id === kelas.guru_id) : null;
    const program = kelas ? db.program.find((p) => p.id === kelas.program_id) : null;

    const riwayatLevel = db.riwayat_level.filter((r) => r.siswa_id === id);
    const progressIndikator = db.progress_indikator.filter((p) => p.siswa_id === id);
    const catatanGuru = db.catatan_guru.filter((c) => c.siswa_id === id);
    const pencapaian = db.pencapaian.filter((p) => p.siswa_id === id);
    const kosakata = db.kosakata.filter((k) => k.siswa_id === id);

    // Learning sessions history
    const studentAttendance = db.absensi.filter((a) => a.siswa_id === id);
    const riwayatSesi = studentAttendance.map((att) => {
      const sesi = db.sesi_belajar.find((sb) => sb.id === att.sesi_id);
      const nilai = db.nilai_sesi.find(
        (ns) => ns.sesi_id === att.sesi_id && ns.siswa_id === id
      );
      return {
        id: att.id,
        sesi_id: att.sesi_id,
        tanggal: sesi?.tanggal || "",
        materi: sesi?.materi || "",
        status_hadir: att.status,
        nilai: nilai?.nilai ?? null,
        mood: nilai?.mood ?? null,
        langkah_selesai: nilai?.langkah_selesai ?? [],
        catatan: nilai?.catatan ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...siswa,
        orangtua: ortu || null,
        kelas: kelas || null,
        guru: guru || null,
        program: program || null,
        riwayat_level: riwayatLevel,
        progress_indikator: progressIndikator,
        catatan_guru: catatanGuru,
        pencapaian,
        kosakata,
        riwayat_sesi: riwayatSesi,
      },
    });
  } catch (error) {
    console.error("Get detail siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rincian data siswa." },
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

    const idx = db.siswa.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.siswa[idx];
    db.siswa[idx] = {
      ...current,
      nama: body.nama !== undefined ? body.nama : current.nama,
      tempat_lahir: body.tempat_lahir !== undefined ? body.tempat_lahir : current.tempat_lahir,
      tanggal_lahir: body.tanggal_lahir !== undefined ? body.tanggal_lahir : current.tanggal_lahir,
      jenis_kelamin: body.jenis_kelamin !== undefined ? body.jenis_kelamin : current.jenis_kelamin,
      level_saat_ini: body.level_saat_ini !== undefined ? body.level_saat_ini : current.level_saat_ini,
      kelas_id: body.kelas_id !== undefined ? body.kelas_id : current.kelas_id,
      foto_url: body.foto_url !== undefined ? body.foto_url : current.foto_url,
      updated_at: now(),
    };

    // If parent data passed, update parent too
    if (body.orangtua && current.orangtua_id) {
      const oIdx = db.orangtua.findIndex((o) => o.id === current.orangtua_id);
      if (oIdx !== -1) {
        db.orangtua[oIdx] = {
          ...db.orangtua[oIdx],
          nama: body.orangtua.nama || db.orangtua[oIdx].nama,
          no_wa: body.orangtua.no_wa || db.orangtua[oIdx].no_wa,
          alamat: body.orangtua.alamat || db.orangtua[oIdx].alamat,
          updated_at: now(),
        };
      }
    }

    logActivity(db, "system", "Edit Siswa", `Memperbarui profil siswa ${db.siswa[idx].nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.siswa[idx],
      message: "Data siswa berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update siswa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data siswa." },
      { status: 500 }
    );
  }
}
