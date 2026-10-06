import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("program_id") || "";

    const db = readDB();
    let items = db.modul.map((m) => {
      const prog = db.program.find((p) => p.id === m.program_id);
      return {
        ...m,
        program: prog ? { id: prog.id, nama: prog.nama, kode: prog.kode } : null,
      };
    });

    if (programId) {
      items = items.filter((m) => m.program_id === programId);
    }

    items.sort((a, b) => a.urutan - b.urutan);

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get modul error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data modul materi." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { program_id, kode, judul, deskripsi, urutan } = body;

    if (!program_id || !judul) {
      return NextResponse.json(
        { success: false, error: "Program dan judul modul wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const newModul = {
      id: generateId("mod"),
      program_id,
      kode: kode || `MOD-${Math.floor(100 + Math.random() * 900)}`,
      judul,
      deskripsi: deskripsi || "",
      urutan: Number(urutan) || db.modul.length + 1,
      created_at: now(),
      updated_at: now(),
    };

    db.modul.push(newModul);
    logActivity(db, "admin", "Tambah Modul", `Membuat modul ${newModul.kode} - ${judul}`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newModul,
        message: "Modul pembelajaran berhasil dibuat.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create modul error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat modul pembelajaran." },
      { status: 500 }
    );
  }
}
