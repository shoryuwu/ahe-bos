import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kelas_id } = body;

    if (!kelas_id) {
      return NextResponse.json(
        { success: false, error: "Kelas tujuan wajib dipilih." },
        { status: 400 }
      );
    }

    const db = readDB();
    const wl = db.waiting_list.find((w) => w.id === id);

    if (!wl) {
      return NextResponse.json(
        { success: false, error: "Data antrean waiting list tidak ditemukan." },
        { status: 404 }
      );
    }

    const kelas = db.kelas.find((k) => k.id === kelas_id);
    if (!kelas || kelas.status === "nonaktif") {
      return NextResponse.json(
        { success: false, error: "Kelas tujuan tidak aktif atau tidak ditemukan." },
        { status: 404 }
      );
    }

    // Verify class capacity
    const studentCount = db.siswa.filter(
      (s) => s.kelas_id === kelas.id && s.status === "aktif"
    ).length;

    if (studentCount >= kelas.kapasitas) {
      return NextResponse.json(
        {
          success: false,
          error: `Kelas ${kelas.nama} sudah penuh (${studentCount}/${kelas.kapasitas} siswa). Pilih kelas lain.`,
        },
        { status: 400 }
      );
    }

    // Find the associated registration
    const reg = db.pendaftaran.find((p) => p.id === wl.pendaftaran_id);

    // Determine student level based on class program
    const prog = db.program.find((pr) => pr.id === kelas.program_id);
    const levelSiswa = prog ? prog.kode : "pra-membaca";

    let targetSiswaId: string | null = null;
    let createdAccount: { email: string; password: string } | null = null;

    if (reg) {
      // 1. Check or create parent & user account
      let ortu = db.orangtua.find((o) => o.no_wa === reg.no_wa_ortu);
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

        // Save credentials to show admin
        createdAccount = { email: cleanEmail, password: generatedPass };
      } else {
        // Parent already has an account — retrieve it
        const existingUser = db.users.find((u) => u.id === ortu!.user_id);
        if (existingUser) {
          createdAccount = {
            email: existingUser.email,
            password: "(Gunakan password akun yang sudah ada)",
          };
        }
      }

      // 2. Check if student already exists or create new student
      let existingSiswa = reg.siswa_id ? db.siswa.find((s) => s.id === reg.siswa_id) : null;

      if (existingSiswa) {
        existingSiswa.kelas_id = kelas.id;
        existingSiswa.status = "aktif";
        existingSiswa.updated_at = now();
        targetSiswaId = existingSiswa.id;
      } else {
        const newSiswa = {
          id: generateId("siswa"),
          orangtua_id: ortu.id,
          nama: reg.nama_anak,
          tempat_lahir: reg.tempat_lahir || "Balikpapan",
          tanggal_lahir: reg.tanggal_lahir,
          jenis_kelamin: reg.jenis_kelamin,
          level_saat_ini: levelSiswa,
          kelas_id: kelas.id,
          foto_url: null,
          tanggal_masuk: today(),
          tanggal_keluar: null,
          status: "aktif" as const,
          alasan_keluar: null,
          created_at: now(),
          updated_at: now(),
        };
        db.siswa.push(newSiswa);
        targetSiswaId = newSiswa.id;

        // Create level history
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

        // Create initial progress indicator
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
      }

      // Update registration record
      reg.status = "diterima";
      reg.siswa_id = targetSiswaId;
      reg.catatan_admin = `Dialokasikan dari waiting list ke kelas ${kelas.nama}`;
      reg.updated_at = now();
    }

    // Update waiting list record
    wl.status = "ditempatkan";
    wl.catatan = `Ditempatkan ke kelas ${kelas.nama}`;
    wl.updated_at = now();

    logActivity(
      db,
      "admin",
      "Alokasi Waiting List",
      `Siswa antrean ${wl.id} (${reg?.nama_anak || "Siswa"}) resmi masuk ke kelas ${kelas.nama}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: {
        waiting_list: wl,
        kelas,
        siswa_id: targetSiswaId,
        akun_orangtua: createdAccount,
        nama_anak: reg?.nama_anak || null,
        nama_ortu: reg?.nama_ortu || null,
        no_wa_ortu: reg?.no_wa_ortu || null,
      },
      message: `Siswa ${reg?.nama_anak || "antrean"} berhasil dialokasikan dan terdaftar di ${kelas.nama}.`,
    });
  } catch (error) {
    console.error("Assign waiting list error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengalokasikan dari waiting list." },
      { status: 500 }
    );
  }
}
