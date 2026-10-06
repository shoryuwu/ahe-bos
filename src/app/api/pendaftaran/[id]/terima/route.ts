import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { Kelas } from "@/types/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kelas_id, catatan_admin } = body;

    const db = readDB();
    const reg = db.pendaftaran.find((p) => p.id === id);

    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Data pendaftaran tidak ditemukan." },
        { status: 404 }
      );
    }

    if (reg.status === "diterima") {
      return NextResponse.json(
        { success: false, error: "Pendaftaran ini sudah disetujui sebelumnya." },
        { status: 400 }
      );
    }

    let targetKelas: Kelas | undefined = undefined;
    let levelSiswa = "pra-membaca";

    if (kelas_id) {
      const foundKelas = db.kelas.find((k) => k.id === kelas_id);
      if (foundKelas) {
        targetKelas = foundKelas;
        const studentCount = db.siswa.filter(
          (s) => s.kelas_id === foundKelas.id && s.status === "aktif"
        ).length;
        if (studentCount >= foundKelas.kapasitas) {
          return NextResponse.json(
            { success: false, error: "Kelas yang dipilih sudah penuh kuotanya." },
            { status: 400 }
          );
        }
        const prog = db.program.find((pr) => pr.id === foundKelas.program_id);
        if (prog) levelSiswa = prog.kode;
      }
    }

    // 1. Check or create parent & user account
    let ortu = db.orangtua.find((o) => o.no_wa === reg.no_wa_ortu);
    let createdAccount = null;

    if (!ortu) {
      const generatedPass = `ahe-${Math.random().toString(36).substring(2, 8)}`;
      const passHash = await hashPassword(generatedPass);
      const cleanEmail =
        reg.email_ortu?.trim() || `${reg.no_wa_ortu.replace(/\D/g, "")}@ahe.id`;

      const newUser = {
        id: generateId("usr-ortu"),
        email: cleanEmail,
        password_hash: passHash,
        role: "orangtua" as const,
        nama: reg.nama_ortu,
        is_active: true,
        foto_url: null,
        failed_logins: 0,
        locked_until: null,
        last_login_at: null,
        password_reset_required: true,
        created_at: now(),
        updated_at: now(),
      };
      db.users.push(newUser);

      ortu = {
        id: generateId("ortu"),
        user_id: newUser.id,
        nama: reg.nama_ortu,
        no_wa: reg.no_wa_ortu,
        email: cleanEmail,
        alamat: reg.alamat,
        hubungan: reg.hubungan,
        created_at: now(),
        updated_at: now(),
      };
      db.orangtua.push(ortu);

      createdAccount = {
        email: cleanEmail,
        password: generatedPass,
      };
    } else {
      const targetUserId = ortu.user_id;
      const existingUser = db.users.find((u) => u.id === targetUserId);
      if (existingUser) {
        createdAccount = {
          email: existingUser.email,
          password: "Gunakan password akun terdaftar",
          password_default: "ortu123",
        };
      }
    }

    // 2. Create student
    const newSiswa = {
      id: generateId("siswa"),
      orangtua_id: ortu ? ortu.id : generateId("ortu"),
      nama: reg.nama_anak,
      tempat_lahir: reg.tempat_lahir,
      tanggal_lahir: reg.tanggal_lahir,
      jenis_kelamin: reg.jenis_kelamin,
      level_saat_ini: levelSiswa,
      kelas_id: targetKelas ? targetKelas.id : null,
      foto_url: null,
      tanggal_masuk: today(),
      tanggal_keluar: null,
      status: "aktif" as const,
      alasan_keluar: null,
      created_at: now(),
      updated_at: now(),
    };
    db.siswa.push(newSiswa);

    // 3. Create level history
    db.riwayat_level.push({
      id: generateId("rl"),
      siswa_id: newSiswa.id,
      level: levelSiswa,
      tanggal_mulai: today(),
      tanggal_selesai: null,
      status: "sedang",
      progress_persen: 0,
      created_at: now(),
    });

    // 4. Initial progress indicator
    const currentMonth = today().substring(0, 7);
    db.progress_indikator.push({
      id: generateId("pi"),
      siswa_id: newSiswa.id,
      bulan: currentMonth,
      mengenal_huruf: 20,
      membaca_suku_kata: 0,
      membaca_kata: 0,
      membaca_kalimat: 0,
      membaca_cerita: 0,
      updated_by: "Admin",
      created_at: now(),
      updated_at: now(),
    });

    // 5. Update registration record
    reg.status = "diterima";
    reg.siswa_id = newSiswa.id;
    reg.catatan_admin = catatan_admin || "Pendaftaran disetujui.";
    reg.updated_at = now();

    logActivity(
      db,
      "admin",
      "Persetujuan Pendaftaran",
      `Pendaftaran ${reg.no_registrasi} (${reg.nama_anak}) disetujui. Siswa terdaftar resmi.`
    );
    writeDB(db);

    const accountResult = createdAccount
      ? {
          email: createdAccount.email,
          password: createdAccount.password,
          password_default: createdAccount.password,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        pendaftaran: reg,
        siswa: newSiswa,
        akun_orangtua: accountResult,
        akun_dibuat: accountResult,
      },
      message: `Pendaftaran ${reg.nama_anak} berhasil disetujui. Siswa telah masuk ke sistem.`,
    });
  } catch (error) {
    console.error("Approve pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses persetujuan pendaftaran." },
      { status: 500 }
    );
  }
}
