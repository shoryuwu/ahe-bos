import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const items = db.progress_indikator
      .filter((p) => p.siswa_id === id)
      .sort((a, b) => a.bulan.localeCompare(b.bulan));

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get progress indikator error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data progress indikator." },
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
    const auth = await getSession();
    const body = await req.json();
    const {
      bulan,
      mengenal_huruf,
      membaca_suku_kata,
      membaca_kata,
      membaca_kalimat,
      membaca_cerita,
    } = body;

    const currentMonth = today().substring(0, 7);
    const bulanVal = bulan || currentMonth;

    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === id);
    if (!siswa) {
      return NextResponse.json(
        { success: false, error: "Siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    let item = db.progress_indikator.find(
      (p) => p.siswa_id === id && p.bulan === bulanVal
    );

    if (item) {
      item.mengenal_huruf = Number(mengenal_huruf ?? item.mengenal_huruf);
      item.membaca_suku_kata = Number(membaca_suku_kata ?? item.membaca_suku_kata);
      item.membaca_kata = Number(membaca_kata ?? item.membaca_kata);
      item.membaca_kalimat = Number(membaca_kalimat ?? item.membaca_kalimat);
      item.membaca_cerita = Number(membaca_cerita ?? item.membaca_cerita);
      item.updated_by = auth ? auth.user.nama : "Tutor";
      item.updated_at = now();
    } else {
      item = {
        id: generateId("prog"),
        siswa_id: id,
        bulan: bulanVal,
        mengenal_huruf: Number(mengenal_huruf ?? 0),
        membaca_suku_kata: Number(membaca_suku_kata ?? 0),
        membaca_kata: Number(membaca_kata ?? 0),
        membaca_kalimat: Number(membaca_kalimat ?? 0),
        membaca_cerita: Number(membaca_cerita ?? 0),
        updated_by: auth ? auth.user.nama : "Tutor",
        created_at: now(),
        updated_at: now(),
      };
      db.progress_indikator.push(item);
    }

    logActivity(
      db,
      auth ? auth.user.id : "tutor",
      "Update Indikator",
      `Memperbarui indikator perkembangan ${siswa.nama} bulan ${bulanVal}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: item,
      message: "Indikator perkembangan membaca berhasil disimpan.",
    });
  } catch (error) {
    console.error("Update progress indikator error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui indikator perkembangan." },
      { status: 500 }
    );
  }
}
