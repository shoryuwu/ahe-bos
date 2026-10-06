import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getSession();
    const db = readDB();

    const asm = db.asesmen.find((a) => a.id === id);
    if (!asm) {
      return NextResponse.json(
        { success: false, error: "Asesmen tidak ditemukan." },
        { status: 404 }
      );
    }

    if (asm.status === "disetujui") {
      return NextResponse.json(
        { success: false, error: "Asesmen sudah disetujui sebelumnya." },
        { status: 400 }
      );
    }

    const siswa = db.siswa.find((s) => s.id === asm.siswa_id);
    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    // 1. Update Asesmen status
    asm.status = "disetujui";
    asm.disetujui_oleh = auth ? auth.user.nama : "Administrator";
    asm.tanggal_disetujui = today();

    // 2. Update Student current level
    const oldLevel = siswa.level_saat_ini;
    siswa.level_saat_ini = asm.ke_level;
    siswa.updated_at = now();

    // 3. Update Riwayat Level
    const currentRiwayat = db.riwayat_level.find(
      (r) => r.siswa_id === siswa.id && r.level === oldLevel
    );
    if (currentRiwayat) {
      currentRiwayat.status = "selesai";
      currentRiwayat.progress_persen = 100;
      currentRiwayat.tanggal_selesai = today();
    }

    db.riwayat_level.push({
      id: generateId("rl"),
      siswa_id: siswa.id,
      level: asm.ke_level,
      tanggal_mulai: today(),
      tanggal_selesai: null,
      status: "sedang",
      progress_persen: 0,
      created_at: now(),
    });

    // 4. Award Achievement Badge
    db.pencapaian.push({
      id: generateId("badge"),
      siswa_id: siswa.id,
      nama_badge: `Naik ke ${asm.ke_level.toUpperCase()}`,
      ikon: "Award",
      kategori: "milestone",
      deskripsi: `Berhasil menyelesaikan tahapan ${oldLevel} dan resmi naik ke level ${asm.ke_level}.`,
      tanggal_raih: today(),
      created_at: now(),
    });

    // 5. Notify Parent
    const ortu = db.orangtua.find((o) => o.id === siswa.orangtua_id);
    if (ortu) {
      addNotification(
        db,
        ortu.user_id,
        "Selamat! Ananda Naik Level",
        `Alhamdulillah, ananda ${siswa.nama} telah resmi naik jenjang ke ${asm.ke_level.toUpperCase()}. Terus dukung semangat belajarnya!`,
        "achievement",
        "/dashboard"
      );
    }

    // 6. Notify Tutor
    const guru = db.guru.find((g) => g.id === asm.guru_id);
    if (guru) {
      addNotification(
        db,
        guru.user_id,
        "Pengajuan Kenaikan Disetujui",
        `Asesmen kenaikan level untuk ${siswa.nama} telah disetujui Admin.`,
        "system",
        "/tutor"
      );
    }

    logActivity(
      db,
      auth ? auth.user.id : "admin",
      "Setujui Asesmen",
      `Menyetujui kenaikan level ${siswa.nama} dari ${oldLevel} ke ${asm.ke_level}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: asm,
      message: `Kenaikan level ${siswa.nama} ke ${asm.ke_level} berhasil disetujui.`,
    });
  } catch (error) {
    console.error("Approve asesmen error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses persetujuan kenaikan level." },
      { status: 500 }
    );
  }
}
