export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'tutor' | 'orangtua';
  nama: string;
  is_active: boolean;
  foto_url: string | null;
  failed_logins: number;
  locked_until: string | null;
  last_login_at: string | null;
  password_reset_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Guru {
  id: string;
  user_id: string;
  nama: string;
  no_wa: string;
  email: string;
  spesialisasi: string[];
  tanggal_gabung: string;
  foto_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrangTua {
  id: string;
  user_id: string;
  nama: string;
  no_wa: string;
  email: string;
  alamat: string;
  hubungan: 'ayah' | 'ibu' | 'wali';
  created_at: string;
  updated_at: string;
}

export interface Siswa {
  id: string;
  orangtua_id: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  level_saat_ini: string;
  kelas_id: string | null;
  foto_url: string | null;
  tanggal_masuk: string;
  tanggal_keluar: string | null;
  status: 'aktif' | 'nonaktif' | 'lulus';
  alasan_keluar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  target_capaian: string[];
  durasi_estimasi: string;
  rentang_usia: string;
  urutan: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Kelas {
  id: string;
  nama: string;
  program_id: string;
  guru_id: string;
  jadwal_hari: string[];
  jam_mulai: string;
  jam_selesai: string;
  kapasitas: number;
  status: 'aktif' | 'penuh' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface SesiBelajar {
  id: string;
  kelas_id: string;
  guru_id: string;
  modul_id?: string | null;
  guru_pengganti_id?: string | null;
  periode_id?: string | null;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  materi: string;
  catatan_umum: string;
  status_sesi: 'terjadwal' | 'selesai' | 'dibatalkan';
  alasan_batal?: string | null;
  created_at: string;
}

export interface Absensi {
  id: string;
  sesi_id: string;
  siswa_id: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  created_at: string;
}

export interface NilaiSesi {
  id: string;
  sesi_id: string;
  siswa_id: string;
  nilai: number | null;
  mood: number | null;
  langkah_selesai: number[];
  catatan: string | null;
  created_at: string;
}

export interface CatatanGuru {
  id: string;
  siswa_id: string;
  guru_id: string;
  tanggal: string;
  catatan: string;
  tipe: 'progress' | 'saran' | 'pencapaian';
  created_at: string;
}

export interface ProgressIndikator {
  id: string;
  siswa_id: string;
  bulan: string; // YYYY-MM
  mengenal_huruf: number;
  membaca_suku_kata: number;
  membaca_kata: number;
  membaca_kalimat: number;
  membaca_cerita: number;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Kosakata {
  id: string;
  siswa_id: string;
  kata: string;
  kategori: 'huruf' | 'suku-kata' | 'kata' | 'kalimat';
  dikuasai: boolean;
  tanggal_dikuasai?: string | null;
  created_at: string;
}

export interface RiwayatLevel {
  id: string;
  siswa_id: string;
  level: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  status: 'selesai' | 'sedang' | 'belum';
  progress_persen: number;
  created_at: string;
}

export interface Asesmen {
  id: string;
  siswa_id: string;
  guru_id: string;
  dari_level: string;
  ke_level: string;
  nilai_tertulis: number;
  nilai_praktik: number;
  checklist_indikator: string[];
  catatan: string;
  rekomendasi: 'lulus' | 'belum-siap';
  status: 'menunggu' | 'disetujui' | 'ditolak';
  disetujui_oleh: string | null;
  tanggal_disetujui: string | null;
  catatan_admin: string | null;
  created_at: string;
}

export interface Pencapaian {
  id: string;
  siswa_id: string;
  nama_badge: string;
  ikon: string;
  kategori: 'kehadiran' | 'nilai' | 'milestone' | 'kosakata' | 'semangat';
  deskripsi: string;
  tanggal_raih: string;
  created_at: string;
}

export interface Pendaftaran {
  id: string;
  no_registrasi: string;
  tipe_pendaftaran: 'reguler' | 'trial';
  nama_anak: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  nama_ortu: string;
  no_wa_ortu: string;
  email_ortu: string;
  alamat: string;
  hubungan: 'ayah' | 'ibu' | 'wali';
  program_diminati: string;
  preferensi_jadwal: 'pagi' | 'siang' | 'fleksibel';
  pengalaman: string;
  sumber_info: string;
  status: 'menunggu' | 'diproses' | 'diterima' | 'ditolak' | 'ditunda';
  catatan_admin: string | null;
  alasan_tolak: string | null;
  siswa_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Modul {
  id: string;
  program_id: string;
  kode: string;
  judul: string;
  deskripsi: string;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface ModulSiswa {
  id: string;
  modul_id: string;
  siswa_id: string;
  sesi_id: string | null;
  status: 'belum' | 'sedang' | 'selesai';
  nilai: number | null;
  tanggal_selesai: string | null;
  created_at: string;
  updated_at: string;
}

export interface MateriPendukung {
  id: string;
  modul_id: string;
  tipe: 'pdf' | 'video' | 'gambar';
  judul: string;
  url: string;
  uploaded_by: string;
  share_ke_ortu: boolean;
  created_at: string;
}

export interface WaitingList {
  id: string;
  pendaftaran_id: string;
  program_id: string;
  preferensi_jadwal: string;
  urutan_antrian: number;
  status: 'menunggu' | 'ditempatkan' | 'dibatalkan';
  catatan: string;
  created_at: string;
  updated_at: string;
}

export interface RiwayatPindahKelas {
  id: string;
  siswa_id: string;
  dari_kelas_id: string;
  ke_kelas_id: string;
  alasan: string;
  catatan: string;
  dipindah_oleh: string;
  tanggal_pindah: string;
  created_at: string;
}

export interface Notifikasi {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  tipe: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export interface VideoPembelajaran {
  id: string;
  guru_id: string;
  judul: string;
  deskripsi: string;
  youtube_url: string;
  level: string;
  target_tipe: 'kelas' | 'siswa';
  target_id: string;
  created_at: string;
  updated_at: string;
}

export interface VideoSiswa {
  id: string;
  video_id: string;
  siswa_id: string;
  created_at: string;
}

export interface PeriodeAkademik {
  id: string;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: 'aktif' | 'selesai';
  catatan: string;
  created_at: string;
  updated_at: string;
}

export interface Galeri {
  id: string;
  image_url: string;
  caption: string;
  kategori: string;
  urutan: number;
  created_at: string;
}

export interface Testimoni {
  id: string;
  nama_ortu: string;
  nama_anak: string;
  usia_anak: string;
  ulasan: string;
  rating: number;
  program: string;
  is_tampil: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  is_aktif: boolean;
  created_at: string;
}

export interface Pengaturan {
  key: string;
  value: string;
  updated_at: string;
}

export interface LogAktivitas {
  id: string;
  user_id: string;
  aksi: string;
  detail: string;
  ip_address: string;
  created_at: string;
}
