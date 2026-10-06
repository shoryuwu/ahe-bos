import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, logActivity } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    const db = readDB();

    let items = db.waiting_list.map((w) => {
      const reg = db.pendaftaran.find((p) => p.id === w.pendaftaran_id);
      const prog = db.program.find((pr) => pr.id === w.program_id);
      return {
        ...w,
        pendaftaran: reg
          ? {
              no_registrasi: reg.no_registrasi,
              nama_anak: reg.nama_anak,
              nama_ortu: reg.nama_ortu,
              no_wa_ortu: reg.no_wa_ortu,
            }
          : null,
        program: prog ? { id: prog.id, nama: prog.nama } : null,
      };
    });

    if (status) {
      items = items.filter((w) => w.status === status);
    }

    items.sort((a, b) => a.urutan_antrian - b.urutan_antrian);

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get waiting list error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar antrean (waiting list)." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pendaftaran_id, program_id, preferensi_jadwal, catatan } = body;

    if (!pendaftaran_id || !program_id) {
      return NextResponse.json(
        { success: false, error: "Pendaftaran dan program wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const currentQueueCount = db.waiting_list.filter((w) => w.status === "menunggu").length;

    const newItem = {
      id: generateId("wl"),
      pendaftaran_id,
      program_id,
      preferensi_jadwal: preferensi_jadwal || "fleksibel",
      urutan_antrian: currentQueueCount + 1,
      status: "menunggu" as const,
      catatan: catatan || "Menunggu kuota kelas tersedia",
      created_at: now(),
      updated_at: now(),
    };

    db.waiting_list.push(newItem);

    // Set pendaftaran status to ditunda
    const reg = db.pendaftaran.find((p) => p.id === pendaftaran_id);
    if (reg) {
      reg.status = "ditunda";
      reg.catatan_admin = `Masuk ke antrean waiting list urutan ke-${newItem.urutan_antrian}`;
      reg.updated_at = now();
    }

    logActivity(db, "admin", "Masuk Waiting List", `Pendaftaran ${pendaftaran_id} masuk daftar tunggu.`);
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: newItem,
        message: "Berhasil dimasukkan ke waiting list antrean kelas.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add waiting list error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan ke antrean waiting list." },
      { status: 500 }
    );
  }
}
