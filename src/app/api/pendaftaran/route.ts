import { NextResponse } from "next/server";
import { readDB, writeDB, generateId, now, addNotification, logActivity } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const db = readDB();

    let items = db.pendaftaran.map((p) => {
      const prog = db.program.find((pr) => pr.id === p.program_diminati || pr.kode === p.program_diminati);
      return {
        ...p,
        program_nama: prog ? prog.nama : p.program_diminati,
      };
    });

    if (status) {
      items = items.filter((p) => p.status === status);
    }

    if (search) {
      items = items.filter(
        (p) =>
          p.no_registrasi.toLowerCase().includes(search) ||
          p.nama_anak.toLowerCase().includes(search) ||
          p.nama_ortu.toLowerCase().includes(search) ||
          p.no_wa_ortu.includes(search)
      );
    }

    // Sort descending by created_at
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pendaftaran." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tipe_pendaftaran,
      nama_anak,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      nama_ortu,
      no_wa_ortu,
      email_ortu,
      alamat,
      hubungan,
      program_diminati,
      preferensi_jadwal,
      pengalaman,
      sumber_info,
    } = body;

    if (!nama_anak || !tanggal_lahir || !jenis_kelamin || !nama_ortu || !no_wa_ortu) {
      return NextResponse.json(
        { success: false, error: "Data anak dan orang tua wajib diisi dengan lengkap." },
        { status: 400 }
      );
    }

    const db = readDB();

    const tipe = tipe_pendaftaran === "trial" ? "trial" : "reguler";
    const noPrefix = tipe === "trial" ? "TRL" : "REG";
    const year = new Date().getFullYear();
    const count = db.pendaftaran.length + 1;
    const padded = String(count).padStart(3, "0");
    const noRegistrasi = `${noPrefix}-${year}-${padded}`;

    const newPendaftaran = {
      id: generateId("reg"),
      no_registrasi: noRegistrasi,
      tipe_pendaftaran: tipe as "reguler" | "trial",
      nama_anak,
      tempat_lahir: tempat_lahir || "Balikpapan",
      tanggal_lahir,
      jenis_kelamin: jenis_kelamin as "L" | "P",
      nama_ortu,
      no_wa_ortu,
      email_ortu: email_ortu || "",
      alamat: alamat || "Balikpapan",
      hubungan: hubungan || "ibu",
      program_diminati: program_diminati || "prg-001",
      preferensi_jadwal: preferensi_jadwal || "pagi",
      pengalaman: pengalaman || "Belum pernah les membaca",
      sumber_info: sumber_info || "Instagram",
      status: "menunggu" as const,
      catatan_admin: null,
      alasan_tolak: null,
      siswa_id: null,
      created_at: now(),
      updated_at: now(),
    };

    db.pendaftaran.push(newPendaftaran);

    // Notify all admins
    const admins = db.users.filter((u) => u.role === "admin");
    admins.forEach((adm) => {
      const tipeLabel = tipe === "trial" ? "Kelas Trial" : "Pendaftaran Reguler";
      addNotification(
        db,
        adm.id,
        `${tipeLabel} Baru`,
        `${nama_anak} (Orang tua: ${nama_ortu}) mendaftar ${tipeLabel.toLowerCase()}. Mohon diverifikasi.`,
        "pendaftaran",
        "/admin"
      );
    });

    logActivity(
      db,
      "publik",
      "Pendaftaran Online",
      `Calon siswa ${nama_anak} mendaftar ${tipe === "trial" ? "kelas trial" : "program reguler"} via web dengan no. reg ${noRegistrasi}`
    );
    writeDB(db);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newPendaftaran.id,
          no_registrasi: noRegistrasi,
          tipe_pendaftaran: tipe,
          nama_anak,
          status: "menunggu",
          tanggal_daftar: now().split("T")[0],
          pesan:
            tipe === "trial"
              ? "Pendaftaran kelas trial berhasil! Tim kami akan menghubungi Anda untuk penjadwalan sesi trial gratis."
              : "Pendaftaran berhasil dikirim! Silakan simpan nomor registrasi untuk memantau status persetujuan.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create pendaftaran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pendaftaran online." },
      { status: 500 }
    );
  }
}
