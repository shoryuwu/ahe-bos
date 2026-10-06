import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const siswaId = searchParams.get("siswa_id") || "";

    const db = readDB();

    let items = db.asesmen.map((a) => {
      const siswa = db.siswa.find((s) => s.id === a.siswa_id);
      const guru = db.guru.find((g) => g.id === a.guru_id);
      return {
        ...a,
        siswa_nama: siswa ? siswa.nama : "Siswa Tidak Ditemukan",
        guru_nama: guru ? guru.nama : "Tutor AHE",
        siswa: siswa
          ? {
              id: siswa.id,
              nama: siswa.nama,
              level_saat_ini: siswa.level_saat_ini,
            }
          : null,
        guru: guru ? { id: guru.id, nama: guru.nama } : null,
      };
    });

    if (status) {
      items = items.filter((a) => a.status === status);
    }
    if (siswaId) {
      items = items.filter((a) => a.siswa_id === siswaId);
    }

    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get asesmen error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data asesmen kenaikan level." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    const body = await req.json();
    const {
      siswa_id,
      dari_level,
      ke_level,
      nilai_tertulis,
      nilai_praktik,
      checklist_indikator,
      catatan,
      rekomendasi,
    } = body;

    if (!siswa_id || !dari_level || !ke_level || !rekomendasi) {
      return NextResponse.json(
        { success: false, error: "Data siswa, level asal, level tujuan, dan rekomendasi wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === siswa_id);
    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    let guruId = "guru-001";
    if (auth) {
      const g = db.guru.find((x) => x.user_id === auth.user.id);
      if (g) guruId = g.id;
    }

    const newAsesmen = {
      id: generateId("asm"),
      siswa_id,
      guru_id: guruId,
      dari_level,
      ke_level,
      nilai_tertulis: Number(nilai_tertulis) || 85,
      nilai_praktik: Number(nilai_praktik) || 90,
      checklist_indikator: Array.isArray(checklist_indikator) ? checklist_indikator : [],
      catatan: catatan || "Siap untuk melanjutkan ke jenjang berikutnya.",
      rekomendasi: (rekomendasi || "lulus") as "lulus" | "belum-siap",
      status: "menunggu" as const,
      disetujui_oleh: null,
      tanggal_disetujui: null,
      catatan_admin: null,
      created_at: now(),
    };

    db.asesmen.push(newAsesmen);

    // Notify Admins to verify
    const admins = db.users.filter((u) => u.role === "admin");
    admins.forEach((adm) => {
      addNotification(
        db,
        adm.id,
        "Pengajuan Kenaikan Level",
        `Tutor mengajukan asesmen kenaikan level untuk ${siswa.nama} dari ${dari_level} ke ${ke_level}.`,
        "system",
        "/admin"
      );
    });

    logActivity(
      db,
      auth ? auth.user.id : "tutor",
      "Ajukan Asesmen",
      `Mengajukan kenaikan level ${siswa.nama} ke ${ke_level}`
    );
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newAsesmen,
        message: "Pengajuan asesmen kenaikan level berhasil dikirim ke Admin untuk verifikasi.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create asesmen error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengajukan asesmen." },
      { status: 500 }
    );
  }
}
