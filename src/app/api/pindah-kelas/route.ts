import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, today, addNotification, logActivity } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = await getSession();
    if (!auth || auth.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siswa_id, ke_kelas_id, alasan, catatan } = body;

    if (!siswa_id || !ke_kelas_id) {
      return NextResponse.json(
        { success: false, error: "ID siswa dan kelas tujuan wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const siswa = db.siswa.find((s) => s.id === siswa_id);
    if (!siswa) {
      return NextResponse.json({ success: false, error: "Siswa tidak ditemukan." }, { status: 404 });
    }

    const targetKelas = db.kelas.find((k) => k.id === ke_kelas_id);
    if (!targetKelas || targetKelas.status === "nonaktif") {
      return NextResponse.json(
        { success: false, error: "Kelas tujuan tidak aktif atau tidak ditemukan." },
        { status: 400 }
      );
    }

    // Check capacity
    const studentCount = db.siswa.filter(
      (s) => s.kelas_id === targetKelas.id && s.status === "aktif"
    ).length;

    if (studentCount >= targetKelas.kapasitas) {
      return NextResponse.json(
        { success: false, error: "Kelas tujuan sudah penuh kuotanya (maks 6 siswa)." },
        { status: 400 }
      );
    }

    const oldKelasId = siswa.kelas_id || "";
    const oldKelas = db.kelas.find((k) => k.id === oldKelasId);

    // 1. Update Student
    siswa.kelas_id = ke_kelas_id;
    siswa.updated_at = now();

    // 2. Record Transfer History
    const transferRecord = {
      id: generateId("rpk"),
      siswa_id,
      dari_kelas_id: oldKelasId,
      ke_kelas_id,
      alasan: alasan || "Penyesuaian jadwal orang tua",
      catatan: catatan || "",
      dipindah_oleh: auth.user.nama,
      tanggal_pindah: today(),
      created_at: now(),
    };
    db.riwayat_pindah_kelas.push(transferRecord);

    // 3. Notify Parent
    const ortu = db.orangtua.find((o) => o.id === siswa.orangtua_id);
    if (ortu) {
      addNotification(
        db,
        ortu.user_id,
        "Pemberitahuan Pindah Kelas",
        `Ananda ${siswa.nama} telah resmi dipindahkan ke ${targetKelas.nama}. Jadwal baru: ${targetKelas.jadwal_hari.join(", ")} (${targetKelas.jam_mulai} WITA).`,
        "system",
        "/dashboard"
      );
    }

    logActivity(
      db,
      auth.user.id,
      "Pindah Kelas",
      `Memindahkan ${siswa.nama} dari ${oldKelas?.nama || "tanpa kelas"} ke ${targetKelas.nama}`
    );
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: transferRecord,
      message: `Siswa ${siswa.nama} berhasil dipindahkan ke ${targetKelas.nama}.`,
    });
  } catch (error) {
    console.error("Transfer class error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pemindahan kelas." },
      { status: 500 }
    );
  }
}
