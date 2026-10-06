import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    const body = await req.json();
    const { siswa_id, catatan, tipe, tanggal } = body;

    if (!siswa_id || !catatan) {
      return NextResponse.json(
        { success: false, error: "Siswa dan isi catatan wajib diisi." },
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

    const newNote = {
      id: generateId("cg"),
      siswa_id,
      guru_id: guruId,
      tanggal: tanggal || now().split("T")[0],
      catatan,
      tipe: (tipe || "progress") as "progress" | "saran" | "pencapaian",
      created_at: now(),
    };

    db.catatan_guru.push(newNote);

    // Notify Parent
    const ortu = db.orangtua.find((o) => o.id === siswa.orangtua_id);
    if (ortu) {
      const guruObj = db.guru.find((g) => g.id === guruId);
      addNotification(
        db,
        ortu.user_id,
        "Catatan Perkembangan Anak",
        `${guruObj?.nama || "Tutor"} menambahkan catatan baru untuk ananda ${siswa.nama}.`,
        "tutor",
        "/dashboard"
      );
    }

    logActivity(
      db,
      auth ? auth.user.id : "tutor",
      "Tambah Catatan Guru",
      `Catatan untuk ${siswa.nama}: ${catatan.substring(0, 40)}...`
    );
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newNote,
        message: "Catatan guru berhasil ditambahkan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create catatan guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan catatan guru." },
      { status: 500 }
    );
  }
}
