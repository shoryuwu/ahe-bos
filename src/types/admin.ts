export interface AdminKpi {
  siswaAktif: number;
  totalSiswa: number;
  persentaseKehadiran: number;
  pendaftaranMenunggu: number;
  asesmenMenunggu: number;
  totalGuru: number;
  totalKelas: number;
}

export interface AdminKapasitasKelas {
  id: string;
  nama: string;
  guru: string;
  terisi: number;
  kapasitas: number;
}

export interface AdminStats {
  kpi: AdminKpi;
  kapasitasKelas?: AdminKapasitasKelas[];
  distribusiLevel?: Record<string, number>;
}

export interface PendaftaranItem {
  id: string;
  no_registrasi: string;
  nama_anak: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  nama_ortu: string;
  no_wa_ortu?: string;
  program_nama?: string;
  program_diminati?: string;
  preferensi_jadwal?: string;
  status: string;
}

export interface WaitingListItem {
  id: string;
  urutan_antrian: number;
  preferensi_jadwal?: string;
  status: string;
  catatan?: string;
  pendaftaran?: {
    nama_anak?: string;
    no_registrasi?: string;
    nama_ortu?: string;
    no_wa_ortu?: string;
  };
  program?: {
    nama?: string;
  };
}

export interface SiswaAdminItem {
  id: string;
  nama: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  level_saat_ini: string;
  status: string;
  kehadiran_persen: number;
  kelas?: {
    nama?: string;
    guru_nama?: string;
  };
  orangtua?: {
    nama?: string;
    no_wa?: string;
  };
}

export interface OrangtuaAdminItem {
  id: string;
  nama: string;
  hubungan?: string;
  user_email?: string;
  email?: string;
  no_wa?: string;
  user_active?: boolean;
  alamat?: string;
  anak?: Array<{
    id: string;
    nama: string;
    level: string;
  }>;
}

export interface GuruAdminItem {
  id: string;
  nama: string;
  email: string;
  no_wa?: string;
  is_active: boolean;
  total_kelas?: number;
  total_siswa?: number;
  spesialisasi?: string[];
  kelas_list?: Array<{
    id: string;
    nama: string;
    jam?: string;
    siswa_count?: number;
    kapasitas?: number;
  }>;
}

export interface KelasAdminItem {
  id: string;
  nama: string;
  program_nama?: string;
  program?: { nama?: string };
  status: string;
  guru_nama?: string;
  guru?: { nama?: string };
  jadwal_hari?: string[];
  jam_mulai?: string;
  jam_selesai?: string;
  siswa_count?: number;
  jumlah_siswa?: number;
  kapasitas: number;
}

export interface SesiAdminItem {
  id: string;
  tanggal: string;
  jam_mulai?: string;
  jam_selesai?: string;
  status_sesi: string;
  materi?: string;
  catatan_umum?: string;
  hadir_count?: number;
  total_siswa?: number;
  rata_rata_nilai?: number | string;
  kelas?: { nama?: string };
  guru?: { nama?: string };
  guru_pengganti?: { nama?: string };
  modul?: { judul?: string };
}

export interface AsesmenAdminItem {
  id: string;
  siswa_id: string;
  siswa_nama?: string;
  siswa?: { nama?: string };
  dari_level?: string;
  ke_level?: string;
  nilai_tertulis?: number | string;
  nilai_praktik?: number | string;
  guru_nama?: string;
  guru?: { nama?: string };
  catatan?: string;
  status: string;
}

export interface AkunAdminItem {
  id: string;
  nama: string;
  email: string;
  role: string;
  is_locked?: boolean;
  is_active: boolean;
  last_login_at?: string;
}

export interface FaqAdminItem {
  id: string;
  pertanyaan: string;
  jawaban: string;
}

export interface GaleriAdminItem {
  id: string;
  image_url: string;
  caption: string;
  kategori: string;
  urutan?: number;
  created_at?: string;
}

export interface TestimoniAdminItem {
  id: string;
  nama_ortu: string;
  nama_anak: string;
  ulasan: string;
  rating?: number;
  is_tampil: boolean;
}

export interface LogAdminItem {
  id: string;
  aksi: string;
  detail: string;
  created_at: string;
}
