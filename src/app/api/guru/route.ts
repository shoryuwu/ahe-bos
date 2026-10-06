import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const activeOnly = searchParams.get("active") === "true";

    const db = readDB();

    let items = db.guru.map((g) => {
      const activeClasses = db.kelas.filter((k) => k.guru_id === g.id && k.status === "aktif");
      const user = db.users.find((u) => u.id === g.user_id);
      const totalStudents = db.siswa.filter(
        (s) => activeClasses.some((k) => k.id === s.kelas_id) && s.status === "aktif"
      ).length;

      return {
        ...g,
        total_kelas: activeClasses.length,
        jumlah_kelas: activeClasses.length,
        total_siswa: totalStudents,
        kelas_list: activeClasses.map((k) => {
          const students = db.siswa.filter((s) => s.kelas_id === k.id && s.status === "aktif");
          return {
            id: k.id,
            nama: k.nama,
            jam: `${k.jam_mulai} - ${k.jam_selesai}`,
            hari: k.jadwal_hari,
            siswa_count: students.length,
            kapasitas: k.kapasitas,
          };
        }),
        user_active: user ? user.is_active : false,
      };
    });

    if (activeOnly) {
      items = items.filter((g) => g.is_active);
    }

    if (search) {
      items = items.filter(
        (g) =>
          g.nama.toLowerCase().includes(search) ||
          g.no_wa.includes(search) ||
          g.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data guru." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, no_wa, email, spesialisasi, tanggal_gabung } = body;

    if (!nama || !no_wa || !email) {
      return NextResponse.json(
        { success: false, error: "Nama, nomor WhatsApp, dan email tutor wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();

    // Check email uniqueness
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar untuk akun lain." },
        { status: 400 }
      );
    }

    // Auto-create tutor user account
    const generatedPass = `tutor-${Math.random().toString(36).substring(2, 8)}`;
    const passHash = await hashPassword(generatedPass);

    const newUser = {
      id: generateId("usr-tutor"),
      email: cleanEmail,
      password_hash: passHash,
      role: "tutor" as const,
      nama,
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

    const newGuru = {
      id: generateId("guru"),
      user_id: newUser.id,
      nama,
      no_wa,
      email: cleanEmail,
      spesialisasi: Array.isArray(spesialisasi) ? spesialisasi : ["level-1", "level-2"],
      tanggal_gabung: tanggal_gabung || now().split("T")[0],
      foto_url: null,
      is_active: true,
      created_at: now(),
      updated_at: now(),
    };
    db.guru.push(newGuru);

    logActivity(db, "system", "Tambah Guru", `Menambahkan tutor baru ${nama} (${cleanEmail})`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: {
          guru: newGuru,
          akun_baru: {
            email: cleanEmail,
            password: generatedPass,
          },
        },
        message: "Data guru dan akun tutor berhasil dibuat.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat data guru baru." },
      { status: 500 }
    );
  }
}
