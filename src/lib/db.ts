import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  User,
  Session,
  Guru,
  OrangTua,
  Siswa,
  Program,
  Kelas,
  SesiBelajar,
  Absensi,
  NilaiSesi,
  CatatanGuru,
  ProgressIndikator,
  Kosakata,
  RiwayatLevel,
  Asesmen,
  Pencapaian,
  Pendaftaran,
  Galeri,
  Testimoni,
  FAQ,
  Pengaturan,
  LogAktivitas,
  Modul,
  ModulSiswa,
  MateriPendukung,
  WaitingList,
  RiwayatPindahKelas,
  Notifikasi,
  VideoPembelajaran,
  VideoSiswa,
  PeriodeAkademik,
} from "@/types/db";

const DB_PATH = path.join(process.cwd(), "db_store.json");

export interface DB {
  users: User[];
  sessions: Session[];
  guru: Guru[];
  orangtua: OrangTua[];
  siswa: Siswa[];
  program: Program[];
  kelas: Kelas[];
  sesi_belajar: SesiBelajar[];
  absensi: Absensi[];
  nilai_sesi: NilaiSesi[];
  catatan_guru: CatatanGuru[];
  progress_indikator: ProgressIndikator[];
  kosakata: Kosakata[];
  riwayat_level: RiwayatLevel[];
  asesmen: Asesmen[];
  pencapaian: Pencapaian[];
  pendaftaran: Pendaftaran[];
  galeri: Galeri[];
  testimoni: Testimoni[];
  faq: FAQ[];
  pengaturan: Pengaturan[];
  log_aktivitas: LogAktivitas[];
  modul: Modul[];
  modul_siswa: ModulSiswa[];
  materi_pendukung: MateriPendukung[];
  waiting_list: WaitingList[];
  riwayat_pindah_kelas: RiwayatPindahKelas[];
  notifikasi: Notifikasi[];
  video_pembelajaran: VideoPembelajaran[];
  video_siswa: VideoSiswa[];
  periode_akademik: PeriodeAkademik[];
}

export function createEmptyDB(): DB {
  return {
    users: [],
    sessions: [],
    guru: [],
    orangtua: [],
    siswa: [],
    program: [],
    kelas: [],
    sesi_belajar: [],
    absensi: [],
    nilai_sesi: [],
    catatan_guru: [],
    progress_indikator: [],
    kosakata: [],
    riwayat_level: [],
    asesmen: [],
    pencapaian: [],
    pendaftaran: [],
    galeri: [],
    testimoni: [],
    faq: [],
    pengaturan: [],
    log_aktivitas: [],
    modul: [],
    modul_siswa: [],
    materi_pendukung: [],
    waiting_list: [],
    riwayat_pindah_kelas: [],
    notifikasi: [],
    video_pembelajaran: [],
    video_siswa: [],
    periode_akademik: [],
  };
}

export function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const empty = createEmptyDB();
    writeDB(empty);
    return empty;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read DB, returning fresh empty DB:", err);
    return createEmptyDB();
  }
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function generateId(prefix: string = ""): string {
  const uid = crypto.randomUUID();
  return prefix ? `${prefix}-${uid.substring(0, 8)}` : uid;
}

export function now(): string {
  return new Date().toISOString();
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function addNotification(
  db: DB,
  userId: string,
  judul: string,
  pesan: string,
  tipe: string = "info",
  link: string = ""
) {
  db.notifikasi.push({
    id: generateId("notif"),
    user_id: userId,
    judul,
    pesan,
    tipe,
    link,
    is_read: false,
    created_at: now(),
  });
}

export function logActivity(
  db: DB,
  userId: string,
  aksi: string,
  detail: string,
  ipAddress: string = "127.0.0.1"
) {
  db.log_aktivitas.push({
    id: generateId("log"),
    user_id: userId,
    aksi,
    detail,
    ip_address: ipAddress,
    created_at: now(),
  });
}
