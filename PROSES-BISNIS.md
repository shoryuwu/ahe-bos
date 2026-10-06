# Proses Bisnis Website AHE Karang Joang

> Dokumen ini mendeskripsikan proses bisnis lengkap untuk sistem backend dan dashboard administrasi Bimbingan Belajar Anak Hebat (AHE) Karang Joang. Disusun berdasarkan analisis frontend yang ada dan kebutuhan digitalisasi administrasi yang sebenarnya.

---

## Daftar Isi

1. [Analisis Kondisi Saat Ini](#1-analisis-kondisi-saat-ini)
2. [Arsitektur Sistem & Aktor](#2-arsitektur-sistem--aktor)
3. [Proses Bisnis: Autentikasi & Otorisasi](#3-proses-bisnis-autentikasi--otorisasi)
4. [Proses Bisnis: Pendaftaran Peserta Didik (PPDB)](#4-proses-bisnis-pendaftaran-peserta-didik-ppdb)
5. [Proses Bisnis: Manajemen Data Siswa](#5-proses-bisnis-manajemen-data-siswa)
6. [Proses Bisnis: Manajemen Orang Tua](#6-proses-bisnis-manajemen-orang-tua)
7. [Proses Bisnis: Manajemen Tutor/Guru](#7-proses-bisnis-manajemen-tutorguru)
8. [Proses Bisnis: Manajemen Program & Kelas](#8-proses-bisnis-manajemen-program--kelas)
9. [Proses Bisnis: Kegiatan Belajar Mengajar (KBM)](#9-proses-bisnis-kegiatan-belajar-mengajar-kbm)
10. [Proses Bisnis: Pencatatan Perkembangan & Asesmen](#10-proses-bisnis-pencatatan-perkembangan--asesmen)
11. [Proses Bisnis: Kenaikan Level & Kelulusan](#11-proses-bisnis-kenaikan-level--kelulusan)
12. [Proses Bisnis: Dashboard & Monitoring](#12-proses-bisnis-dashboard--monitoring)
13. [Proses Bisnis: Laporan & Dokumen](#13-proses-bisnis-laporan--dokumen)
14. [Proses Bisnis: Landing Page Publik](#14-proses-bisnis-landing-page-publik)
15. [Proses Bisnis: Manajemen Modul & Materi Ajar](#15-proses-bisnis-manajemen-modul--materi-ajar)
16. [Proses Bisnis: Waiting List & Pindah Kelas](#16-proses-bisnis-waiting-list--pindah-kelas)
17. [Proses Bisnis: Guru Pengganti](#17-proses-bisnis-guru-pengganti)
18. [Proses Bisnis: Notifikasi In-App](#18-proses-bisnis-notifikasi-in-app)
19. [Proses Bisnis: Kelola Akun & Reset Password](#19-proses-bisnis-kelola-akun--reset-password)
20. [Proses Bisnis: Upload Foto & Media](#20-proses-bisnis-upload-foto--media)
21. [Proses Bisnis: Video Pembelajaran](#21-proses-bisnis-video-pembelajaran)
22. [Proses Bisnis: Periode Akademik](#22-proses-bisnis-periode-akademik)
23. [Proses Bisnis: Retensi & Arsip Data](#23-proses-bisnis-retensi--arsip-data)
24. [Diagram Alur Utama](#24-diagram-alur-utama)
25. [Daftar Endpoint API](#25-daftar-endpoint-api)
26. [Skema Database](#26-skema-database)

---

## 1. Analisis Kondisi Saat Ini

### Apa yang sudah ada (frontend-only, tanpa backend)

| Halaman | Path | Status | Masalah |
|---------|------|--------|---------|
| Landing Page | `/` | Ada (lengkap) | Semua data hardcoded di `src/data/index.ts`. Tombol "Daftar Sekarang" cuma scroll ke section kontak. |
| Dashboard Orang Tua | `/dashboard` | Ada (UI lengkap) | Tidak ada autentikasi — siapapun bisa akses. Data anak hardcoded (selalu "Bintang Arya Putra"). Edit data cuma modal kosong, tidak menyimpan. Video YouTube dummy. PDF download `href="#"`. |
| Dashboard Admin | `/admin` | Ada (parsial) | Tidak ada autentikasi — akses langsung via URL. Cuma tab "Dashboard" dan "Siswa" yang ada konten. 6 tab lain ("Orang Tua", "Guru", "Program", "Monitoring", "Laporan", "Pengaturan") menampilkan placeholder "Sedang Dikembangkan". |

### Masalah Kritis yang Ditemukan

1. **Tidak ada autentikasi sama sekali** — Navbar landing langsung link ke `/dashboard` tanpa login. `/admin` bisa diakses siapapun.
2. **Tidak ada role-based access** — Dashboard orang tua dan admin tidak dibedakan lewat session/token.
3. **Semua data hardcoded** — Tidak ada database, tidak ada API. Data dummy di `src/data/index.ts` berjumlah ~420 baris.
4. **Tidak ada CRUD** — Tombol "Siswa Baru", "Export", "Filter Level", "Edit Data" semuanya tidak berfungsi.
5. **Routing salah** — Navbar punya link "Dashboard" yang langsung ke `/dashboard` (orang tua) tapi admin diakses via `/admin` tanpa link apapun dari landing.
6. **DashboardHeader hardcoded** — Di semua halaman menampilkan "Orang Tua Bintang" / "Parent Account" walaupun di halaman admin.
7. **Tidak ada alur pendaftaran** — "Daftar Sekarang" cuma scroll ke section kontak yang berisi alamat & nomor WA. Tidak ada form pendaftaran.
8. **Tidak ada alur kenaikan level** — Data milestone dan progress semua statis, tidak bisa diubah.
9. **Tidak ada notifikasi** — Ikon bell di header tidak berfungsi, log aktivitas hardcoded.

---

## 2. Arsitektur Sistem & Aktor

### Aktor Sistem

| Aktor | Deskripsi | Akses |
|-------|-----------|-------|
| **Pengunjung** (Guest) | Calon wali murid / masyarakat umum | Landing page saja. Bisa lihat info program, galeri, FAQ, testimoni, dan mengisi form pendaftaran. |
| **Admin** | Pemilik/pengelola AHE Karang Joang | Full access ke seluruh dashboard admin. CRUD semua data. Verifikasi pendaftaran. Generate laporan. |
| **Tutor/Guru** | Pengajar di AHE | Input nilai & catatan sesi belajar. Lihat jadwal & daftar siswa di kelasnya. Input absensi. |
| **Orang Tua** | Wali murid yang anaknya terdaftar aktif | Lihat dashboard perkembangan anaknya sendiri saja. Lihat jadwal, catatan guru, laporan. Edit data profil sendiri. |

### Arsitektur Teknis (Next.js Full-Stack)

```
[Browser]
    |
    v
[Next.js App Router]
    |-- /                    (Landing Page — publik)
    |-- /daftar               (Form Pendaftaran — publik)
    |-- /login                (Halaman Login — publik)
    |-- /admin/*              (Dashboard Admin — role: admin)
    |-- /tutor/*              (Dashboard Tutor — role: tutor)
    |-- /dashboard/*          (Dashboard Orang Tua — role: orangtua)
    |
    v
[Next.js API Routes / Server Actions]
    |-- /api/auth/*
    |-- /api/siswa/*
    |-- /api/orangtua/*
    |-- /api/tutor/*
    |-- /api/kelas/*
    |-- /api/kbm/*
    |-- /api/asesmen/*
    |-- /api/laporan/*
    |-- /api/dashboard/*
    |-- /api/pendaftaran/*
    |
    v
[Database — PostgreSQL / SQLite]
```

---

## 3. Proses Bisnis: Autentikasi & Otorisasi

### 3.1. Registrasi Akun (oleh Admin)

Tidak ada registrasi mandiri. Semua akun dibuat oleh Admin.

```
ALUR:
1. Admin login ke dashboard admin.
2. Admin buka menu "Pengaturan" > "Kelola Akun".
3. Admin klik "Tambah Akun Baru".
4. Admin isi form:
   - Nama lengkap
   - Email (sebagai username login)
   - Password awal (auto-generate atau manual)
   - Role: admin | tutor | orangtua
   - Jika role=tutor → pilih guru dari data guru
   - Jika role=orangtua → pilih orang tua dari data orang tua
5. Sistem validasi email unik.
6. Sistem simpan akun dengan password ter-hash (bcrypt).
7. Admin bisa kirim kredensial via WhatsApp (manual, di luar sistem).
```

### 3.2. Login

```
ALUR:
1. User buka /login.
2. User masukkan email + password.
3. Sistem cek kredensial di database.
4. Jika GAGAL:
   - Tampilkan pesan error "Email atau password salah".
   - Catat log gagal login (IP, timestamp, email).
   - Setelah 5x gagal berturut → kunci akun 15 menit.
5. Jika BERHASIL:
   - Buat session (cookie HttpOnly, Secure, SameSite=Lax).
   - Simpan di cookie: session_id.
   - Di server: simpan user_id, role, nama, timestamp login.
   - Redirect berdasarkan role:
     * admin    → /admin
     * tutor    → /tutor
     * orangtua → /dashboard
```

### 3.3. Proteksi Route (Middleware)

```
ATURAN:
- /admin/*      → hanya role=admin
- /tutor/*      → hanya role=tutor
- /dashboard/*  → hanya role=orangtua
- /api/admin/*  → hanya role=admin
- /api/tutor/*  → hanya role=admin ATAU tutor
- /api/dashboard/* → sesuai user_id (orang tua hanya lihat data anaknya sendiri)
- /login, /, /daftar → publik (kalau sudah login, redirect ke dashboard sesuai role)

IMPLEMENTASI:
- Next.js middleware.ts di root project.
- Cek cookie session di setiap request.
- Jika tidak valid / expired → redirect ke /login.
- Jika role tidak cocok → tampilkan 403 atau redirect ke dashboard role-nya.
```

### 3.4. Logout

```
ALUR:
1. User klik tombol "Keluar" di sidebar/header.
2. Sistem hapus session di server.
3. Sistem hapus cookie di browser.
4. Redirect ke /login.
```

### 3.5. Ganti Password

```
ALUR:
1. User buka menu profil > "Ganti Password".
2. User masukkan password lama + password baru + konfirmasi.
3. Sistem validasi:
   - Password lama cocok.
   - Password baru minimal 8 karakter.
   - Password baru ≠ password lama.
   - Konfirmasi cocok.
4. Simpan password baru (hash).
5. Hapus semua session lain milik user tersebut.
6. Tampilkan pesan sukses.
```

---

## 4. Proses Bisnis: Pendaftaran Peserta Didik (PPDB)

### 4.1. Pendaftaran Online (oleh Calon Wali Murid)

```
ALUR:
1. Pengunjung buka landing page.
2. Klik tombol "Daftar Sekarang" → navigasi ke /daftar.
3. Isi form pendaftaran multi-step (3 tahap):

   ── STEP 1: DATA ANAK ──
   - Nama lengkap anak
   - Tempat & tanggal lahir
   - Jenis kelamin
   - Usia (auto-hitung dari tanggal lahir, validasi 3-8 tahun)
   - Pengalaman belajar membaca sebelumnya
   
   ── STEP 2: DATA ORANG TUA/WALI ──
   - Nama lengkap orang tua
   - Nomor WhatsApp aktif (minimal 10 digit)
   - Email (opsional)
   - Alamat tempat tinggal
   - Hubungan dengan anak (Ibu/Ayah/Wali)
   
   ── STEP 3: TIPE PENDAFTARAN & PROGRAM ──
   - Tipe pendaftaran (wajib pilih salah satu):
     * Pendaftaran Reguler — langsung masuk program, dapat jadwal kelas rutin
     * Kelas Trial Gratis — coba 1x sesi bimbingan gratis tanpa komitmen
   - Program yang diminati (Pra Membaca / Level 1 / Level 2 / Level 3 / Lanjutan)
   - Preferensi jadwal (Pagi / Siang / Fleksibel)
   - Sumber informasi ("Dari mana tahu AHE?")
   
4. User klik "Kirim Pendaftaran Resmi".
5. Sistem validasi semua field wajib di setiap step.
6. Sistem simpan data dengan status = "menunggu".
7. Nomor registrasi di-generate otomatis:
   - Reguler: REG-YYYY-XXX (contoh: REG-2026-001)
   - Trial: TRL-YYYY-XXX (contoh: TRL-2026-001)
8. Tampilkan halaman konfirmasi:
   - Nomor registrasi untuk tracking
   - Pesan sukses sesuai tipe:
     * Reguler: "Pendaftaran berhasil! Simpan nomor registrasi untuk memantau status."
     * Trial: "Pendaftaran trial berhasil! Tim kami akan menghubungi untuk penjadwalan sesi trial."
   - Tombol "Konfirmasi via WhatsApp" (pre-filled sesuai tipe)
   - Info bahwa kredensial login akan dikirim via WA (untuk reguler)
9. Sistem kirim notifikasi ke dashboard admin:
   - Reguler: "Pendaftaran Reguler Baru — [Nama Anak] mendaftar program reguler."
   - Trial: "Kelas Trial Baru — [Nama Anak] mendaftar kelas trial."
10. Dicatat di log aktivitas sistem.
```

### 4.2. Verifikasi Pendaftaran (oleh Admin)

```
ALUR:
1. Admin buka dashboard > menu "Pendaftaran" (badge: jumlah pending).
2. Admin lihat daftar pendaftaran masuk:
   - Filter: Semua | Menunggu | Diproses | Diterima | Ditolak | Tipe (Reguler/Trial)
   - Search by nama anak / orang tua
   - Sort by tanggal pendaftaran
   - Tipe pendaftaran terlihat jelas (badge Reguler / Trial)
3. Admin klik salah satu pendaftaran → buka detail.
4. Admin review data dan pilih aksi:
   
   A. TERIMA (Reguler):
      - Pilih kelas yang tersedia (berdasarkan program & jadwal)
      - Pilih tutor yang mengajar kelas tersebut
      - Tentukan tanggal mulai belajar
      - Sistem otomatis:
        * Buat record siswa baru
        * Buat record orang tua (jika belum ada, cek by no WA)
        * Buat akun login orang tua (generate password ahe-XXXXXX)
        * Masukkan siswa ke kelas
        * Set level awal siswa
        * Status pendaftaran → "diterima"
      - Admin dapat info kredensial orang tua untuk dikirim via WA
   
   A2. TERIMA (Trial):
      - Admin jadwalkan 1 sesi trial (tanggal + jam)
      - Pilih guru untuk sesi trial
      - Status pendaftaran → "diterima"
      - Admin hubungi orang tua via WA: konfirmasi jadwal trial
      - Setelah trial selesai, orang tua bisa daftar ulang sebagai reguler
   
   B. TOLAK:
      - Admin isi alasan penolakan
      - Status → "ditolak"
      - (Admin hubungi orang tua via WA secara manual)
   
   C. TUNDA:
      - Admin isi catatan ("tunggu kuota kelas buka")
      - Status → "ditunda"
```

### 4.3. Pendaftaran Manual (oleh Admin)

```
ALUR:
1. Admin buka menu "Siswa" > klik "Tambah Siswa Baru".
2. Admin isi form yang sama seperti form online.
3. Admin langsung pilih kelas & tutor.
4. Sistem langsung buat semua record (siswa, orang tua, akun).
5. Tidak perlu verifikasi (langsung status aktif).
```

### 4.4. Cek Status Pendaftaran (oleh Calon Wali Murid)

```
ALUR:
1. Pengunjung buka /daftar > tab "Cek Status Pendaftaran".
2. Masukkan nomor registrasi (REG-2026-001 atau TRL-2026-001).
3. Sistem lookup di database.
4. Tampilkan:
   - Nomor registrasi
   - Tipe pendaftaran (Reguler / Trial)
   - Nama calon siswa
   - Program yang diminati
   - Status: Menunggu / Diproses / Diterima / Ditunda / Ditolak
   - Keterangan status
5. Tidak perlu login — cukup nomor registrasi saja.
6. Tidak menampilkan data sensitif (hanya status + tipe + tanggal update).
```

---

## 5. Proses Bisnis: Manajemen Data Siswa

### 5.1. Daftar Siswa

```
TAMPILAN TABEL:
- Kolom: Nama | Usia | Level | Kelas | Tutor | Orang Tua | Progress | Kehadiran | Status | Aksi
- Filter: Level (semua/per level), Status (aktif/nonaktif/lulus), Kelas, Tutor
- Search: by nama siswa atau nama orang tua
- Sort: by nama / usia / progress / kehadiran / tanggal daftar
- Pagination: 20 per halaman
- Bulk action: Export CSV, Export PDF
```

### 5.2. Detail Siswa

```
HALAMAN DETAIL (klik nama siswa di tabel):
- Profil: foto, nama, TTL, usia, jenis kelamin
- Status akademik: level saat ini, kelas, tutor, tanggal masuk
- Orang tua: nama, WA, email, alamat
- Progress: bar per indikator (5 area kemampuan AHE)
- Riwayat sesi belajar: tabel dengan tanggal, materi, nilai, status, catatan
- Catatan guru: list catatan dari tutor
- Riwayat absensi: kalender atau tabel
- Riwayat level: timeline dari level awal sampai sekarang
- Prestasi/badge yang diraih
```

### 5.3. Edit Data Siswa

```
ALUR:
1. Admin/Tutor buka detail siswa.
2. Klik "Edit".
3. Form terisi data saat ini.
4. Edit field yang perlu diubah.
5. Klik "Simpan".
6. Sistem validasi → simpan → tampilkan notifikasi sukses.
7. Catat log perubahan (siapa, kapan, field apa, dari apa ke apa).
```

### 5.4. Nonaktifkan Siswa

```
ALUR:
1. Admin buka detail siswa.
2. Klik "Nonaktifkan Siswa".
3. Konfirmasi dialog: "Yakin nonaktifkan [Nama]?"
4. Admin isi alasan (dropdown: Pindah / Berhenti / Lainnya) + catatan.
5. Sistem:
   - Status siswa → "nonaktif"
   - Tanggal nonaktif = hari ini
   - Keluarkan dari kelas
   - Akun orang tua tetap ada tapi tidak bisa akses dashboard lagi
   - Data tidak dihapus (soft delete)
```

### 5.5. Reaktivasi Siswa

```
ALUR:
1. Admin filter siswa nonaktif.
2. Klik "Aktifkan Kembali".
3. Pilih kelas baru.
4. Status → "aktif". Masuk ke kelas. Akun orang tua aktif lagi.
```

---

## 6. Proses Bisnis: Manajemen Orang Tua

### 6.1. Data Orang Tua

```
TAMPILAN TABEL:
- Kolom: Nama | No. WhatsApp | Email | Anak (bisa >1) | Status Anak | Aksi
- Search & filter
- 1 orang tua bisa punya banyak anak di AHE
```

### 6.2. Relasi Orang Tua - Anak

```
ATURAN:
- Saat pendaftaran, sistem cek apakah nomor WA sudah terdaftar.
- Jika sudah ada → anak baru ditambahkan ke orang tua yang sama.
- Jika belum → buat record orang tua baru + akun baru.
- 1 akun orang tua bisa lihat dashboard semua anaknya (dropdown pilih anak di dashboard).
```

### 6.3. Edit Data Orang Tua

```
SIAPA BISA EDIT:
- Admin: edit semua field orang tua manapun
- Orang tua sendiri: edit nama, WA, email, alamat via dashboard orang tua
  (field yang bisa diedit dibatasi, tidak bisa ubah relasi anak)
```

---

## 7. Proses Bisnis: Manajemen Tutor/Guru

### 7.1. Data Guru

```
TAMPILAN TABEL:
- Kolom: Nama | No. WA | Spesialisasi Level | Jumlah Kelas | Jumlah Siswa | Status | Aksi
- Hanya admin yang bisa CRUD data guru
```

### 7.2. Tambah Guru

```
FORM:
- Nama lengkap
- Nomor WhatsApp
- Email
- Spesialisasi level (multi-select: Pra Membaca, Level 1, dst)
- Tanggal bergabung
- Foto (opsional)

SETELAH SIMPAN:
- Otomatis buat akun login dengan role=tutor
- Generate password awal
```

### 7.3. Assign Guru ke Kelas

```
ALUR:
1. Admin buka menu "Program" > pilih kelas.
2. Pilih guru dari dropdown (filter by spesialisasi level).
3. Simpan assignment.
4. 1 guru bisa pegang banyak kelas.
5. 1 kelas hanya 1 guru utama.
```

### 7.4. Nonaktifkan / Hapus Guru

```
ATURAN CASCADE:
- Guru TIDAK bisa dihapus jika masih memegang kelas aktif.
- Admin harus pindahkan semua kelasnya ke guru lain dulu.
- Baru kemudian guru bisa dinonaktifkan.
- Nonaktif guru = akun tutor juga dinonaktifkan (tidak bisa login).
- Data guru tetap tersimpan (soft delete) untuk histori catatan guru & sesi.

ALUR:
1. Admin buka detail guru > klik "Nonaktifkan Guru".
2. Jika guru masih pegang kelas:
   - Sistem tampilkan daftar kelas yang masih aktif.
   - Admin harus reassign kelas dulu.
3. Jika sudah tidak pegang kelas:
   - Status guru → nonaktif.
   - Akun tutor → nonaktif.
   - Guru hilang dari dropdown assignment.
```

---

## 8. Proses Bisnis: Manajemen Program & Kelas

### 8.1. Program Belajar

```
PROGRAM TETAP (sesuai metode AHE):
- Pra Membaca (Level 0): usia 3-4 tahun, durasi 1-2 bulan
- Membaca Level 1: usia 4-5 tahun, durasi 2-3 bulan
- Membaca Level 2: usia 4-6 tahun, durasi 2-3 bulan
- Membaca Level 3: usia 5-6 tahun, durasi 2-3 bulan
- Membaca Lanjutan (Level 4): usia 5-7 tahun, durasi 3-4 bulan

Admin bisa edit: deskripsi, target capaian, durasi estimasi.
Admin TIDAK bisa tambah/hapus program (struktur tetap).
```

### 8.2. Manajemen Kelas

```
FORM BUAT KELAS:
- Nama kelas (contoh: "Pagi A - Level 1")
- Program/Level
- Jadwal: hari (multi-select Senin-Sabtu) + jam mulai + jam selesai
- Guru pengajar (dropdown)
- Kapasitas maksimal (default: 6 siswa)
- Status: aktif / penuh / nonaktif

ATURAN:
- 1 kelas = 1 level program
- Kapasitas maks 6 siswa per kelas (sesuai metode AHE)
- Kelas otomatis status "penuh" kalau siswa = kapasitas
- Jika penuh, pendaftaran baru ke level itu masuk waiting list
```

### 8.3. Nonaktifkan Kelas

```
ATURAN:
- Kelas TIDAK bisa dinonaktifkan jika masih ada siswa aktif di dalamnya.
- Admin harus pindahkan semua siswa ke kelas lain dulu.

ALUR:
1. Admin buka detail kelas > klik "Nonaktifkan Kelas".
2. Jika masih ada siswa:
   - Sistem tampilkan daftar siswa yang harus dipindahkan.
   - Admin pindahkan satu per satu atau batch ke kelas lain di level sama.
3. Jika sudah kosong:
   - Status kelas → nonaktif.
   - Kelas hilang dari dropdown assignment pendaftaran.
   - Data kelas tetap tersimpan untuk histori sesi & absensi.
```

### 8.4. Jadwal Kelas

```
TAMPILAN KALENDER ADMIN:
- View: minggu ini / bulan ini
- Setiap slot menunjukkan: nama kelas, guru, jumlah siswa hadir
- Klik slot → lihat detail sesi hari itu

TAMPILAN JADWAL TUTOR:
- Hanya kelas miliknya
- Hari ini di-highlight
- Bisa lihat daftar siswa per sesi

TAMPILAN JADWAL ORANG TUA:
- Hanya jadwal anaknya
- Sesi mendatang + sesi selesai
```

---

## 9. Proses Bisnis: Kegiatan Belajar Mengajar (KBM)

### 9.1. Alur Sesi Belajar Harian

```
SEBELUM SESI:
1. Tutor login ke dashboard tutor.
2. Lihat jadwal hari ini: kelas apa, jam berapa, siswa siapa saja.
3. Lihat catatan sesi sebelumnya untuk setiap siswa.

SELAMA SESI (sesuai metode AHE 6 langkah):
1. Senam Otak
2. Remidi/Evaluasi materi sebelumnya
3. Membaca Modul
4. Pengayaan
5. Menulis
6. Permainan

SETELAH SESI:
1. Tutor buka menu "Input Sesi" atau klik jadwal yang baru selesai.
2. Untuk SETIAP siswa di kelas itu, tutor isi:
   
   ── ABSENSI ──
   - Status: Hadir / Izin / Sakit / Alpha
   
   ── PENILAIAN (jika hadir) ──
   - Materi yang diajarkan hari ini (text)
   - Nilai/skor sesi (0-100)
   - Langkah metode yang dikerjakan (checklist 6 langkah)
   - Mood/semangat anak (1-5 bintang)
   
   ── CATATAN GURU ──
   - Catatan observasi (textarea)
   - Kategori catatan: progress / saran / pencapaian
   
3. Tutor klik "Simpan Sesi".
4. Sistem simpan semua data.
5. Data langsung muncul di dashboard orang tua anak terkait.
```

### 9.2. Absensi

```
REKAP ABSENSI:
- Per siswa: kalender warna (hijau=hadir, kuning=izin, merah=alpha, biru=sakit)
- Per kelas: tabel tanggal vs siswa
- Per bulan: persentase kehadiran per siswa

ALERT OTOMATIS:
- Jika siswa alpha ≥ 3x dalam 1 bulan → muncul alert di dashboard admin + orang tua
- "Perhatian: [Nama] absen [X]x bulan ini. Silakan hubungi guru."
```

---

## 10. Proses Bisnis: Pencatatan Perkembangan & Asesmen

### 10.1. Progress per Indikator

```
5 INDIKATOR KEMAMPUAN AHE:
1. Mengenal Huruf (0-100%)
2. Membaca Suku Kata (0-100%)
3. Membaca Kata (0-100%)
4. Membaca Kalimat (0-100%)
5. Membaca Cerita (0-100%)

CARA UPDATE:
- Tutor buka detail siswa > tab "Progress".
- Update persentase per indikator secara manual berdasarkan observasi.
- Atau: sistem auto-hitung dari rata-rata nilai sesi pada materi terkait.
- Progress tersimpan per bulan (historis), bukan hanya angka terakhir.
```

### 10.2. Asesmen Kenaikan Level

```
ALUR:
1. Tutor menilai siswa sudah siap naik level.
2. Tutor buka detail siswa > klik "Ajukan Asesmen Kenaikan Level".
3. Tutor isi form asesmen:
   - Checklist indikator yang sudah dikuasai (min 80% per indikator wajib)
   - Nilai asesmen tertulis (0-100, min 75 untuk lulus)
   - Nilai asesmen praktik (0-100, min 75 untuk lulus)
   - Catatan asesmen
   - Rekomendasi: Lulus / Belum Siap
4. Submit asesmen.
5. Admin review asesmen di menu "Kenaikan Level".
```

### 10.3. Kosakata Pribadi

```
ALUR:
- Tutor bisa menandai kata/suku kata yang sudah dikuasai siswa.
- Kumpulan kata ini muncul di dashboard orang tua sebagai "Kamus Kosakata Pribadi".
- Menambah kosakata: tutor pilih siswa > tab "Kosakata" > tambah kata baru.
- Kategori kata: huruf | suku-kata | kata | kalimat.
- Status: sudah dikuasai / belum dikuasai.
```

---

## 11. Proses Bisnis: Kenaikan Level & Kelulusan

### 11.1. Kenaikan Level

```
ALUR LENGKAP:
1. Tutor ajukan asesmen (lihat 10.2).
2. Admin buka menu "Kenaikan Level" > tab "Menunggu Persetujuan".
3. Admin lihat detail asesmen + data progress siswa.
4. Admin pilih keputusan:

   A. SETUJUI NAIK LEVEL:
      - Pilih kelas baru di level berikutnya
      - Pilih guru kelas baru
      - Tentukan tanggal efektif naik level
      - Sistem otomatis:
        * Update level siswa
        * Pindahkan siswa ke kelas baru
        * Catat milestone di riwayat level
        * Reset progress indikator ke 0% (level baru)
        * Buat badge/pencapaian otomatis ("Lulus Level X")
        * Notifikasi muncul di dashboard orang tua
      
   B. TOLAK / BELUM SIAP:
      - Admin isi catatan ("perlu latihan membaca kalimat lagi")
      - Status asesmen → "belum siap"
      - Siswa tetap di level & kelas sekarang
      - Tutor bisa ajukan ulang nanti
```

### 11.2. Kelulusan (Selesai Semua Level)

```
ALUR:
1. Siswa lulus asesmen Level 4 (Lanjutan).
2. Admin setujui → status siswa berubah menjadi "lulus".
3. Sistem otomatis:
   - Generate sertifikat kelulusan (PDF)
   - Catat tanggal kelulusan
   - Siswa dikeluarkan dari kelas aktif
   - Dashboard orang tua tetap bisa diakses (mode read-only, lihat riwayat)
   - Data siswa tetap tersimpan (tidak dihapus)
```

---

## 12. Proses Bisnis: Dashboard & Monitoring

### 12.1. Dashboard Admin

```
OVERVIEW (halaman utama setelah login):
┌─────────────────────────────────────────────────────────┐
│ KPI Cards:                                               │
│ [Total Siswa Aktif] [Total Guru] [Kehadiran Rata²] [Progress Rata²] │
│ [Pendaftaran Baru ↑] [Siswa Lulus Bulan Ini]             │
├─────────────────────────────────────────────────────────┤
│ Chart: Tingkat Kelulusan per Level (bar horizontal)      │
│ Chart: Tren Jumlah Siswa 6 Bulan Terakhir (line)        │
├─────────────────────────────────────────────────────────┤
│ Aktivitas Terkini (real-time log):                       │
│ - 08:15 Bintang lulus Level 1                            │
│ - 09:30 Pendaftaran baru: Zahra                          │
│ - 11:00 Bu Sari kirim catatan mingguan                   │
├─────────────────────────────────────────────────────────┤
│ Alert:                                                   │
│ - 3 pendaftaran menunggu verifikasi                      │
│ - 2 siswa absen >3x bulan ini                            │
│ - 1 kelas penuh, ada waiting list                        │
└─────────────────────────────────────────────────────────┘

MENU SIDEBAR:
- Dashboard (overview di atas)
- Pendaftaran (CRUD + verifikasi)
- Siswa (CRUD + detail + progress)
- Orang Tua (CRUD + relasi anak)
- Guru (CRUD + assignment kelas)
- Program & Kelas (setting program, CRUD kelas, jadwal)
- Monitoring (lihat sesi harian, rekap absensi)
- Kenaikan Level (review asesmen, approve/reject)
- Laporan (generate report, download)
- Pengaturan (kelola akun, profil AHE, pengaturan sistem)
```

### 12.2. Dashboard Tutor

```
OVERVIEW:
┌─────────────────────────────────────────────────────────┐
│ Selamat Datang, Bu Sari!                                 │
│ Jadwal Hari Ini:                                         │
│ [08:00 Pagi A - Level 1 (5 siswa)] [09:30 Pagi B - Level 2 (4 siswa)] │
├─────────────────────────────────────────────────────────┤
│ Quick Action:                                            │
│ [Input Sesi Hari Ini] [Lihat Jadwal Minggu Ini]          │
├─────────────────────────────────────────────────────────┤
│ Siswa yang Perlu Perhatian:                              │
│ - Dika: kehadiran 60%, progress rendah                   │
│ - Luna: mood rendah 3 sesi terakhir                      │
├─────────────────────────────────────────────────────────┤
│ Ringkasan Kelas Saya:                                    │
│ [Kelas Pagi A: 5/6 siswa, avg progress 65%]              │
│ [Kelas Pagi B: 4/6 siswa, avg progress 72%]              │
└─────────────────────────────────────────────────────────┘

MENU:
- Dashboard (overview)
- Jadwal Saya
- Siswa Saya (daftar siswa di kelas yang diajar)
- Input Sesi (input absensi, nilai, catatan per sesi)
- Progress Siswa (update indikator, kosakata)
- Asesmen (ajukan asesmen kenaikan level)
```

### 12.3. Dashboard Orang Tua

```
OVERVIEW (per anak, kalau >1 anak ada dropdown pilih anak):
┌─────────────────────────────────────────────────────────┐
│ PROFIL ANAK (hero card gradient):                        │
│ [Foto] Bintang Arya Putra | 5 Tahun | Level 2           │
│        Bu Sari Rahayu | Kelas Pagi (08:00-09:00)         │
│ KPI: [Kehadiran 95%] [Progress 62%] [Kata Dikuasai 10]  │
│      [Rata² Nilai 87]                                    │
├─────────────────────────────────────────────────────────┤
│ Alert (jika ada):                                        │
│ ⚠ Bintang absen 2x dalam riwayat terakhir               │
├─────────────────────────────────────────────────────────┤
│ TAB 1: Overview & Kemampuan                              │
│ - Tren Nilai (line chart)                                │
│ - Radar Kompetensi (5 area)                              │
│ - Milestone Level (timeline)                             │
│ - Detail Kemampuan (progress bar per indikator)          │
│ - Semangat Belajar (mood per sesi)                       │
│ - Kosakata Pribadi (word tags)                           │
│ - Koleksi Pencapaian (badge wall)                        │
│                                                          │
│ TAB 2: Riwayat & Catatan Guru                            │
│ - Riwayat sesi (tabel)                                   │
│ - Catatan guru (cards)                                   │
│ - Ringkasan mingguan                                     │
│                                                          │
│ TAB 3: Jadwal & Laporan                                  │
│ - Kalender jadwal                                        │
│ - Jadwal mendatang                                       │
│ - Video pembelajaran (link YouTube dari guru)            │
│ - Download rapor/sertifikat (PDF)                        │
└─────────────────────────────────────────────────────────┘

FITUR ORANG TUA:
- Lihat semua data di atas (read-only kecuali profil sendiri)
- Edit data diri orang tua (nama, WA, email, alamat)
- Download rapor bulanan (PDF)
- Download sertifikat kelulusan (PDF)
- Lihat video pembelajaran yang di-share guru
```

---

## 13. Proses Bisnis: Laporan & Dokumen

### 13.1. Rapor Bulanan

```
ALUR:
1. Setiap akhir bulan, admin klik "Generate Rapor Bulanan".
2. Sistem mengumpulkan data bulan itu per siswa:
   - Daftar sesi yang diikuti
   - Nilai per sesi
   - Kehadiran (hadir/izin/sakit/alpha)
   - Progress per indikator
   - Catatan guru
   - Kosakata baru yang dikuasai
   - Mood/semangat rata-rata
3. Generate PDF rapor per siswa.
4. PDF tersedia di dashboard orang tua untuk download.
5. Admin bisa download batch (semua siswa 1 kelas).
```

### 13.2. Sertifikat Kelulusan Level

```
ALUR:
1. Saat admin approve kenaikan level, sistem otomatis generate sertifikat.
2. Isi sertifikat:
   - Nama siswa
   - Level yang diselesaikan
   - Tanggal mulai & selesai
   - Nilai asesmen
   - Nama guru
   - Tanda tangan digital admin/pemilik AHE
3. PDF tersedia di dashboard orang tua.
```

### 13.3. Laporan Statistik Admin

```
JENIS LAPORAN:
A. Laporan Siswa:
   - Jumlah siswa per level per bulan
   - Siswa masuk vs keluar per bulan
   - Distribusi usia siswa
   - Rasio gender

B. Laporan Kehadiran:
   - Persentase kehadiran per kelas per bulan
   - Siswa dengan kehadiran rendah (<75%)
   - Tren kehadiran 6 bulan

C. Laporan Akademik:
   - Rata-rata nilai per level
   - Tren progress per level
   - Jumlah kenaikan level per bulan
   - Jumlah kelulusan per bulan
   - Waktu rata-rata penyelesaian per level

D. Laporan Guru:
   - Jumlah sesi per guru per bulan
   - Rata-rata nilai siswa per guru
   - Kelas yang dipegang

FORMAT: Tampil di dashboard (chart) + downloadable PDF/Excel
```

---

## 14. Proses Bisnis: Landing Page Publik

### 14.1. Konten Landing Page

```
SECTION (sudah ada, terintegrasi dengan backend):
1. Hero — tagline + CTA "Daftar Sekarang" → /daftar
2. Tentang Kami — deskripsi statis (bisa di-edit admin dari Pengaturan)
3. Program — ambil dari database (nama, deskripsi, target, durasi, usia)
4. Metode — 6 langkah AHE (statis, hardcoded OK)
5. Galeri — ambil dari database, admin bisa upload/hapus foto
6. Testimoni — ambil dari database, admin bisa CRUD
7. FAQ — ambil dari database, admin bisa CRUD
8. Kontak — form inquiry via WhatsApp (bukan pendaftaran):
   - Form mengumpulkan nama, no WA, dan pertanyaan
   - Satu-satunya aksi: redirect ke WhatsApp dengan pesan pre-filled
   - TIDAK menyimpan data ke database (murni redirect WA)
   - Ada notice yang mengarahkan ke /daftar untuk pendaftaran resmi
   - Banner PPDB mengarahkan ke /daftar untuk pendaftaran reguler & trial
   - Info kontak (alamat, telepon, email, jam operasional) dari database/Pengaturan
   - Embed Google Maps
```

### 14.2. Navigasi Publik ke Dashboard

```
ALUR SEKARANG (SALAH):
- Navbar > "Dashboard" → langsung ke /dashboard tanpa login

ALUR SEHARUSNYA:
- Navbar > "Login" → /login
- Di /login, user masukkan email + password
- Redirect ke dashboard sesuai role
- Navbar TIDAK boleh ada link langsung ke /dashboard atau /admin
- Tombol "Daftar Sekarang" → /daftar (form pendaftaran, bukan login)
```

---

## 15. Proses Bisnis: Manajemen Modul & Materi Ajar

### 15.1. Bank Modul per Level

```
KONSEP:
- Setiap level punya daftar modul/materi yang terstruktur.
- Modul berurutan sesuai kurikulum AHE (bukan free-text random).
- Contoh modul Level 1:
  M1.01 - Pengenalan Huruf Vokal A-I-U-E-O
  M1.02 - Pengenalan Huruf Konsonan B-D-G-H
  M1.03 - Suku Kata Ba-Bi-Bu-Be-Bo
  M1.04 - Suku Kata Ca-Ci-Cu-Ce-Co
  ... dst

FITUR ADMIN:
- CRUD modul per level (tambah, edit, hapus, atur urutan)
- Setiap modul punya: kode, judul, deskripsi singkat, level, urutan
- Modul bersifat template — berlaku untuk semua siswa di level itu
```

### 15.2. Tracking Modul per Siswa

```
ALUR:
1. Saat tutor input sesi harian, field "materi" bukan free-text lagi
   tapi pilih dari dropdown modul yang sesuai level kelas tersebut.
2. Sistem otomatis track: modul mana yang sudah diajarkan ke siswa mana.
3. Di detail siswa ada tab "Modul" yang menunjukkan:
   - Daftar semua modul di level saat ini
   - Status per modul: ✅ Selesai (tanggal + nilai) | 🔄 Sedang | ⬜ Belum
   - Persentase modul selesai dari total modul di level itu
4. Ini membantu tutor tahu modul mana yang belum diajarkan.
5. Admin bisa lihat rekap: rata-rata progres modul per kelas.
```

### 15.3. Materi Pendukung

```
KONSEP:
- Setiap modul bisa punya file pendukung (opsional):
  * PDF lembar kerja
  * Link video YouTube
  * Gambar/poster
- Tutor upload via dashboard tutor saat input modul.
- File pendukung yang di-share ke orang tua muncul di dashboard orang tua
  (tab "Jadwal & Laporan" > section materi).
```

---

## 16. Proses Bisnis: Waiting List & Pindah Kelas

### 16.1. Waiting List (Kelas Penuh)

```
ALUR:
1. Saat admin terima pendaftaran tapi semua kelas di level itu penuh (6/6 siswa):
   - Sistem tampilkan peringatan: "Semua kelas Level X penuh."
   - Admin pilih aksi: "Masukkan Waiting List"
2. Siswa masuk tabel waiting list:
   - Urutan antrian (FIFO berdasarkan tanggal pendaftaran)
   - Level yang diinginkan
   - Preferensi jadwal (pagi/siang)
   - Status: menunggu
3. Saat ada slot kosong di kelas (siswa keluar/naik level/nonaktif):
   - Sistem otomatis cek waiting list untuk level itu.
   - Tampilkan alert di dashboard admin:
     "Slot tersedia di [Kelas]. Ada [N] orang di waiting list."
   - Admin bisa assign siswa dari waiting list ke slot kosong.
4. Setelah di-assign:
   - Hapus dari waiting list.
   - Buat record siswa + akun orang tua (seperti alur pendaftaran normal).
   - Admin hubungi orang tua via WA.
```

### 16.2. Pindah Kelas (Tanpa Naik Level)

```
ALUR:
Kasus: siswa pindah jadwal, misalnya dari "Pagi A Level 1" ke "Siang B Level 1".

1. Admin buka detail siswa.
2. Klik "Pindah Kelas".
3. Sistem tampilkan kelas lain di level yang sama yang masih ada slot.
4. Admin pilih kelas tujuan.
5. Sistem:
   - Keluarkan siswa dari kelas lama (slot kelas lama +1).
   - Masukkan siswa ke kelas baru.
   - Cek waiting list kelas lama — jika ada antrian, tampilkan alert.
   - Catat log perpindahan (dari kelas apa ke kelas apa, tanggal, alasan).
6. Guru di kelas baru otomatis bisa lihat siswa ini di daftar kelasnya.

ATURAN:
- Pindah kelas hanya antar kelas di level yang SAMA.
- Pindah level harus lewat alur asesmen kenaikan level (section 11).
- Admin isi alasan pindah (dropdown: Ganti Jadwal / Pindah Guru / Lainnya).
```

---

## 17. Proses Bisnis: Guru Pengganti

### 17.1. Guru Berhalangan

```
ALUR:
1. Guru berhalangan mengajar (sakit, izin, cuti).
2. Admin buka jadwal > klik sesi yang berhalangan.
3. Admin pilih aksi: "Assign Guru Pengganti" atau "Batalkan Sesi".

   A. ASSIGN GURU PENGGANTI:
      - Sistem tampilkan daftar guru lain yang tersedia di jam itu
        (tidak bentrok jadwal + spesialisasi level cocok).
      - Admin pilih guru pengganti.
      - Sistem update sesi: guru_id tetap guru asli, tapi ada field guru_pengganti_id.
      - Guru pengganti bisa lihat sesi ini di jadwalnya.
      - Guru pengganti bisa input absensi & nilai seperti biasa.

   B. BATALKAN SESI:
      - Status sesi → "dibatalkan".
      - Alasan pembatalan dicatat.
      - Sesi tidak dihitung dalam rekap kehadiran.
      - Muncul di jadwal orang tua sebagai "Dibatalkan".
```

---

## 18. Proses Bisnis: Notifikasi In-App

### 18.1. Sistem Notifikasi

```
KONSEP:
- Setiap aksi penting di sistem menghasilkan notifikasi.
- Notifikasi tersimpan di database, muncul di bell icon di header.
- Badge angka di bell icon = jumlah notifikasi belum dibaca.
- Klik bell → dropdown daftar notifikasi terbaru.
- Klik "Lihat Semua" → halaman penuh daftar notifikasi.

NOTIFIKASI PER ROLE:

Admin menerima notifikasi saat:
- Pendaftaran baru masuk
- Tutor mengajukan asesmen kenaikan level
- Siswa absen ≥3x dalam 1 bulan (alert)
- Kelas penuh + ada waiting list
- Guru mengajukan izin/input sesi

Tutor menerima notifikasi saat:
- Siswa baru masuk ke kelasnya
- Siswa pindah keluar/masuk kelasnya
- Admin meng-assign dia sebagai guru pengganti
- Asesmen yang diajukan sudah di-review admin

Orang Tua menerima notifikasi saat:
- Tutor input catatan guru baru
- Sesi belajar hari ini selesai (nilai + catatan tersedia)
- Rapor bulanan tersedia untuk download
- Anak naik level (+ badge + sertifikat)
- Anak absen ≥3x (alert kehadiran)
- Jadwal sesi dibatalkan

STATUS NOTIFIKASI:
- unread (baru) → ditandai bold + dot
- read (sudah dibaca) → normal
- User bisa "Tandai Semua Sudah Dibaca"
```

---

## 19. Proses Bisnis: Kelola Akun & Reset Password

### 19.1. Halaman Kelola Akun (Admin Only)

```
LOKASI: Dashboard Admin > Pengaturan > Kelola Akun

TAMPILAN TABEL:
- Kolom: Nama | Email | Role | Status | Terakhir Login | Aksi
- Filter: by role (admin/tutor/orangtua), by status (aktif/nonaktif/terkunci)
- Search: by nama atau email

AKSI PER AKUN:
- Edit (nama, email, role)
- Reset Password → generate password baru, tampilkan ke admin untuk dikirim via WA
- Nonaktifkan Akun → user tidak bisa login lagi, data tetap ada
- Aktifkan Kembali
- Unlock (jika akun terkunci karena 5x gagal login)
```

### 19.2. Reset Password oleh Admin

```
ALUR:
1. Orang tua/tutor lupa password → hubungi admin via WA.
2. Admin buka Kelola Akun > cari akun user.
3. Admin klik "Reset Password".
4. Sistem generate password baru secara random (8 karakter, alfanumerik).
5. Password baru di-hash dan disimpan.
6. Semua session aktif user tersebut dihapus (force logout).
7. Sistem tampilkan password baru ke admin (sekali lihat, tidak disimpan plaintext).
8. Admin kirim password baru ke user via WhatsApp (manual).
9. User login dengan password baru → disarankan langsung ganti password.
```

### 19.3. Profil Diri (Semua Role)

```
LOKASI: Klik avatar di header > "Profil Saya"

BISA EDIT:
- Nama tampilan
- Email (dengan validasi unik)
- Ganti password (harus masukkan password lama)
- Foto profil (upload, crop, max 2MB)

TIDAK BISA EDIT:
- Role (hanya admin yang bisa ubah)
- Relasi (orang tua tidak bisa ubah relasi anaknya)
```

---

## 20. Proses Bisnis: Upload Foto & Media

### 20.1. Upload Foto Siswa

```
ALUR:
1. Admin/Tutor buka detail siswa > klik area foto atau tombol "Upload Foto".
2. Pilih file gambar (JPG/PNG, max 2MB).
3. Preview + crop (rasio 1:1 untuk avatar).
4. Klik "Simpan".
5. Sistem:
   - Resize ke 400x400px
   - Simpan ke storage (folder /uploads/siswa/ atau cloud storage)
   - Update foto_url di database
   - Foto lama dihapus dari storage
6. Foto muncul di:
   - Tabel daftar siswa (thumbnail kecil)
   - Detail siswa
   - Dashboard orang tua (hero card)
```

### 20.2. Upload Foto Galeri (Landing Page)

```
ALUR:
1. Admin buka Pengaturan > Galeri.
2. Klik "Tambah Foto".
3. Pilih file (JPG/PNG, max 5MB, bisa multi-upload).
4. Isi: caption, kategori (Belajar/Prestasi/Aktivitas/Outing/Event).
5. Atur urutan tampil (drag & drop).
6. Simpan → foto muncul di section galeri landing page.
```

### 20.3. Upload Foto Profil User

```
- Sama seperti upload foto siswa tapi untuk user sendiri.
- Akses via "Profil Saya".
- Foto muncul di avatar header dashboard.
```

---

## 21. Proses Bisnis: Video Pembelajaran

### 21.1. Share Video oleh Tutor

```
ALUR:
1. Tutor buka menu "Siswa Saya" atau detail kelas.
2. Klik "Share Video Pembelajaran".
3. Isi form:
   - Judul video
   - Deskripsi singkat
   - Link YouTube (embed-safe, validasi format URL YouTube)
   - Level terkait
   - Target: seluruh kelas ATAU siswa tertentu (multi-select)
4. Simpan.
5. Video muncul di dashboard orang tua (tab "Jadwal & Laporan" > section video).
6. Orang tua mendapat notifikasi: "Video pembelajaran baru tersedia."
```

### 21.2. Kelola Video (Admin/Tutor)

```
TAMPILAN:
- List video yang sudah di-share
- Filter: by guru, by level, by tanggal
- Aksi: edit, hapus
- Video lama tetap tersimpan (tidak auto-delete)
```

---

## 22. Proses Bisnis: Periode Akademik

### 22.1. Konsep Periode

```
ATURAN:
- AHE tidak mengikuti tahun ajaran sekolah formal.
- Tapi sistem perlu mengelompokkan data per periode untuk:
  * Scope laporan (rapor bulan apa, statistik semester mana)
  * Membedakan batch siswa
  * Memudahkan admin generate laporan berkala

IMPLEMENTASI:
- Admin buat "Periode" di Pengaturan:
  Contoh: "Semester 1 - 2026" (Jan-Jun 2026), "Semester 2 - 2026" (Jul-Des 2026)
- Setiap periode punya: nama, tanggal mulai, tanggal selesai, status (aktif/selesai)
- Hanya 1 periode aktif pada satu waktu.
- Sesi belajar otomatis tercatat di periode yang aktif saat itu.
- Laporan bisa di-filter per periode.
- Saat ganti periode: admin klik "Tutup Periode" → generate laporan akhir periode.
```

---

## 23. Proses Bisnis: Retensi & Arsip Data

### 23.1. Kebijakan Retensi

```
ATURAN:
- Data siswa AKTIF: tersimpan selamanya selama masih belajar.
- Data siswa LULUS: dashboard orang tua tetap bisa diakses (read-only).
  Setelah 12 bulan sejak kelulusan → data di-arsipkan.
- Data siswa NONAKTIF: setelah 6 bulan sejak nonaktif → data di-arsipkan.
- Data pendaftaran DITOLAK: disimpan 3 bulan lalu otomatis dihapus.

ARSIP vs HAPUS:
- Arsip = data dipindahkan ke tabel arsip terpisah, tidak muncul di dashboard,
  tapi masih bisa diakses admin lewat menu "Arsip" jika perlu.
- Hapus permanen = hanya untuk data pendaftaran ditolak yang sudah >3 bulan.
```

### 23.2. Menu Arsip (Admin)

```
LOKASI: Dashboard Admin > Pengaturan > Arsip Data

FITUR:
- Lihat daftar siswa yang sudah di-arsipkan
- Search & filter arsip
- Restore dari arsip (kembalikan ke data aktif) jika siswa mendaftar ulang
- Hapus permanen (dengan konfirmasi 2 langkah + input alasan)
- Export data arsip ke CSV sebelum hapus
```

### 23.3. Proses Arsip Otomatis

```
ALUR:
- Sistem cek setiap hari (background job / cron):
  * Siswa lulus >12 bulan lalu → flag "siap arsip"
  * Siswa nonaktif >6 bulan → flag "siap arsip"
  * Pendaftaran ditolak >3 bulan → flag "siap hapus"
- Admin mendapat notifikasi bulanan: "[N] data siap di-arsipkan."
- Admin review daftar dan konfirmasi arsip secara batch.
- Arsip TIDAK otomatis — selalu butuh konfirmasi admin.
```

---

## 24. Diagram Alur Utama

### 15.1. Alur Pendaftaran s/d Aktif Belajar

```
Pengunjung             Admin                  Sistem
    |                    |                      |
    |-- Buka /daftar --->|                      |
    |-- Isi form 3 step->|                      |
    |   (pilih tipe:     |                      |
    |    reguler/trial)  |                      |
    |-- Submit --------->|                      |
    |                    |<-- Notifikasi baru ---|
    |                    |   (sesuai tipe)       |
    |                    |                      |
    |                    |-- Review data ------->|
    |                    |                      |
    |        [JIKA REGULER]                     |
    |                    |-- Terima + pilih ---->|
    |                    |   kelas & guru        |
    |                    |              Buat record siswa
    |                    |              Buat record ortu
    |                    |              Buat akun ortu
    |                    |              Masukkan ke kelas
    |                    |<-- Kredensial ortu ---|
    |<-- WA: info login -|                      |
    |-- Login /login --->|                      |
    |-- Masuk dashboard->|                      |
    |                    |                      |
    |        [JIKA TRIAL]                       |
    |                    |-- Jadwalkan 1 sesi -->|
    |                    |   trial gratis        |
    |<-- WA: jadwal trial|                      |
    |-- Datang trial --->|                      |
    |   (jika cocok,     |                      |
    |    daftar reguler) |                      |
```

### 15.2. Alur Sesi Belajar Harian

```
Tutor                            Sistem                    Orang Tua
  |                                |                          |
  |-- Login ---------------------->|                          |
  |-- Lihat jadwal hari ini ------>|                          |
  |                                |                          |
  |   [SESI BELAJAR BERLANGSUNG]   |                          |
  |                                |                          |
  |-- Input absensi per siswa ---->|                          |
  |-- Input nilai sesi ----------->|                          |
  |-- Input catatan guru -------->|                          |
  |-- Input mood anak ----------->|                          |
  |-- Simpan -------------------->|                          |
  |                                |                          |
  |                                |-- Update dashboard ----->|
  |                                |   (data real-time)       |
  |                                |                          |
  |                                |   Jika alpha ≥3x:       |
  |                                |-- Tampilkan alert ------>|
```

### 15.3. Alur Kenaikan Level

```
Tutor                    Admin                   Sistem               Orang Tua
  |                        |                       |                      |
  |-- Ajukan asesmen ----->|                       |                      |
  |   (nilai + catatan)    |                       |                      |
  |                        |                       |                      |
  |                        |<-- Notifikasi --------|                      |
  |                        |-- Review asesmen ----->|                      |
  |                        |-- Approve ----------->|                      |
  |                        |                       |                      |
  |                        |               Update level siswa             |
  |                        |               Pindah kelas                   |
  |                        |               Catat milestone                |
  |                        |               Buat badge                     |
  |                        |               Generate sertifikat            |
  |                        |                       |                      |
  |                        |                       |-- Notif + badge ---->|
  |                        |                       |-- Sertifikat PDF --->|
```

---

## 25. Daftar Endpoint API

### Auth
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login, return session | publik |
| POST | `/api/auth/logout` | Hapus session | semua |
| GET | `/api/auth/me` | Data user saat ini | semua |
| PUT | `/api/auth/password` | Ganti password | semua |

### Pendaftaran
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| POST | `/api/pendaftaran` | Submit form pendaftaran | publik |
| GET | `/api/pendaftaran` | List semua pendaftaran | admin |
| GET | `/api/pendaftaran/:id` | Detail pendaftaran | admin |
| PUT | `/api/pendaftaran/:id/terima` | Terima pendaftaran | admin |
| PUT | `/api/pendaftaran/:id/tolak` | Tolak pendaftaran | admin |

### Siswa
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/siswa` | List siswa (filter, search, sort) | admin, tutor |
| GET | `/api/siswa/:id` | Detail siswa | admin, tutor, orangtua* |
| POST | `/api/siswa` | Tambah siswa manual | admin |
| PUT | `/api/siswa/:id` | Edit data siswa | admin |
| PUT | `/api/siswa/:id/status` | Nonaktifkan/reaktivasi | admin |

### Orang Tua
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/orangtua` | List orang tua | admin |
| GET | `/api/orangtua/:id` | Detail orang tua | admin, orangtua* |
| PUT | `/api/orangtua/:id` | Edit data orang tua | admin, orangtua* |

### Guru
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/guru` | List guru | admin |
| POST | `/api/guru` | Tambah guru | admin |
| PUT | `/api/guru/:id` | Edit guru | admin |
| DELETE | `/api/guru/:id` | Hapus guru | admin |

### Kelas
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/kelas` | List kelas (filter by level, guru) | admin, tutor |
| POST | `/api/kelas` | Buat kelas baru | admin |
| PUT | `/api/kelas/:id` | Edit kelas | admin |
| GET | `/api/kelas/:id/siswa` | Siswa di kelas ini | admin, tutor |

### KBM (Kegiatan Belajar Mengajar)
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/sesi` | List sesi (filter by kelas, tanggal) | admin, tutor |
| POST | `/api/sesi` | Input sesi baru (absensi + nilai batch) | tutor |
| GET | `/api/sesi/:id` | Detail sesi | admin, tutor |
| PUT | `/api/sesi/:id` | Edit sesi | tutor |

### Absensi
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/absensi/siswa/:id` | Rekap absensi per siswa | admin, tutor, orangtua* |
| GET | `/api/absensi/kelas/:id` | Rekap absensi per kelas per bulan | admin, tutor |

### Progress & Asesmen
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/progress/:siswaId` | Progress indikator siswa | admin, tutor, orangtua* |
| PUT | `/api/progress/:siswaId` | Update progress indikator | tutor |
| GET | `/api/kosakata/:siswaId` | Kosakata pribadi siswa | admin, tutor, orangtua* |
| POST | `/api/kosakata/:siswaId` | Tambah kosakata | tutor |
| PUT | `/api/kosakata/:id` | Update status kosakata | tutor |
| POST | `/api/asesmen` | Ajukan asesmen kenaikan level | tutor |
| GET | `/api/asesmen` | List asesmen (filter status) | admin |
| PUT | `/api/asesmen/:id/approve` | Approve kenaikan level | admin |
| PUT | `/api/asesmen/:id/reject` | Reject kenaikan level | admin |

### Dashboard
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/dashboard/admin` | Statistik admin overview | admin |
| GET | `/api/dashboard/tutor` | Data dashboard tutor | tutor |
| GET | `/api/dashboard/orangtua` | Data dashboard orang tua | orangtua |
| GET | `/api/dashboard/orangtua/anak` | List anak orang tua ini | orangtua |

### Laporan
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/laporan/rapor/:siswaId/:bulan` | Generate rapor bulanan (PDF) | admin, orangtua* |
| GET | `/api/laporan/sertifikat/:siswaId/:level` | Sertifikat kelulusan (PDF) | admin, orangtua* |
| GET | `/api/laporan/statistik` | Statistik admin (chart data) | admin |

### Konten Landing (CMS sederhana)
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/konten/galeri` | List foto galeri | publik |
| POST | `/api/konten/galeri` | Upload foto galeri | admin |
| DELETE | `/api/konten/galeri/:id` | Hapus foto galeri | admin |
| GET | `/api/konten/testimoni` | List testimoni | publik |
| POST | `/api/konten/testimoni` | Tambah testimoni | admin |
| GET | `/api/konten/faq` | List FAQ | publik |
| POST | `/api/konten/faq` | Tambah FAQ | admin |
| PUT | `/api/konten/pengaturan` | Edit info kontak/tentang | admin |
| GET | `/api/konten/pengaturan` | Baca info kontak/tentang (untuk landing) | publik |
| PUT | `/api/konten/testimoni/:id` | Edit testimoni | admin |
| DELETE | `/api/konten/testimoni/:id` | Hapus testimoni | admin |
| PUT | `/api/konten/faq/:id` | Edit FAQ | admin |
| DELETE | `/api/konten/faq/:id` | Hapus FAQ | admin |

### Catatan Guru
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/catatan-guru/siswa/:siswaId` | List catatan guru untuk siswa | admin, tutor, orangtua* |
| POST | `/api/catatan-guru` | Tambah catatan guru baru | tutor |
| PUT | `/api/catatan-guru/:id` | Edit catatan guru | tutor |
| DELETE | `/api/catatan-guru/:id` | Hapus catatan guru | admin, tutor |

### Pencapaian / Badge
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/pencapaian/siswa/:siswaId` | List badge siswa | admin, tutor, orangtua* |
| POST | `/api/pencapaian` | Buat badge manual (admin/tutor) | admin, tutor |

### Jadwal
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/jadwal/admin` | Kalender semua kelas (minggu/bulan) | admin |
| GET | `/api/jadwal/tutor` | Jadwal kelas guru ini saja | tutor |
| GET | `/api/jadwal/orangtua/:siswaId` | Jadwal anak (mendatang + selesai) | orangtua* |

### Ringkasan Mingguan
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/ringkasan-mingguan/:siswaId` | Summary mingguan per siswa | admin, tutor, orangtua* |

### Log Aktivitas
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/log-aktivitas` | List log (filter by user, aksi, tanggal) | admin |

### Pendaftaran (tambahan)
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| PUT | `/api/pendaftaran/:id/tunda` | Tunda pendaftaran | admin |
| GET | `/api/pendaftaran/cek/:noRegistrasi` | Cek status pendaftaran by nomor registrasi | publik |

### Modul & Materi Ajar
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/modul` | List modul (filter by level) | admin, tutor |
| POST | `/api/modul` | Tambah modul baru | admin |
| PUT | `/api/modul/:id` | Edit modul | admin |
| DELETE | `/api/modul/:id` | Hapus modul | admin |
| PUT | `/api/modul/reorder` | Atur ulang urutan modul | admin |
| GET | `/api/modul/siswa/:siswaId` | Tracking modul per siswa | admin, tutor, orangtua* |
| POST | `/api/modul/:modulId/materi` | Upload materi pendukung | admin, tutor |
| DELETE | `/api/modul/:modulId/materi/:id` | Hapus materi pendukung | admin, tutor |

### Waiting List
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/waiting-list` | List waiting list (filter by level) | admin |
| POST | `/api/waiting-list` | Tambah ke waiting list | admin |
| PUT | `/api/waiting-list/:id/assign` | Assign dari waiting list ke kelas | admin |
| DELETE | `/api/waiting-list/:id` | Hapus dari waiting list | admin |

### Pindah Kelas
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| POST | `/api/siswa/:id/pindah-kelas` | Pindah kelas (level sama) | admin |
| GET | `/api/siswa/:id/riwayat-kelas` | Riwayat perpindahan kelas | admin |

### Guru Pengganti
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/guru/tersedia` | List guru tersedia di waktu tertentu | admin |
| PUT | `/api/sesi/:id/pengganti` | Assign guru pengganti ke sesi | admin |
| PUT | `/api/sesi/:id/batalkan` | Batalkan sesi | admin |

### Notifikasi
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/notifikasi` | List notifikasi user saat ini | semua |
| GET | `/api/notifikasi/unread-count` | Jumlah notifikasi belum dibaca | semua |
| PUT | `/api/notifikasi/:id/read` | Tandai 1 notifikasi sudah dibaca | semua |
| PUT | `/api/notifikasi/read-all` | Tandai semua sudah dibaca | semua |

### Kelola Akun
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/akun` | List semua akun | admin |
| POST | `/api/akun` | Buat akun baru | admin |
| PUT | `/api/akun/:id` | Edit akun | admin |
| PUT | `/api/akun/:id/reset-password` | Reset password (generate baru) | admin |
| PUT | `/api/akun/:id/toggle-active` | Aktifkan/nonaktifkan akun | admin |
| PUT | `/api/akun/:id/unlock` | Unlock akun terkunci | admin |
| GET | `/api/profil` | Profil user sendiri | semua |
| PUT | `/api/profil` | Edit profil sendiri | semua |
| POST | `/api/profil/foto` | Upload foto profil | semua |

### Upload Media
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| POST | `/api/upload/foto-siswa/:siswaId` | Upload foto siswa | admin, tutor |
| POST | `/api/upload/foto-galeri` | Upload foto galeri (multi) | admin |

### Video Pembelajaran
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/video` | List video (filter by guru, level) | admin, tutor |
| POST | `/api/video` | Share video baru | tutor |
| PUT | `/api/video/:id` | Edit video | tutor |
| DELETE | `/api/video/:id` | Hapus video | admin, tutor |
| GET | `/api/video/siswa/:siswaId` | Video untuk siswa tertentu | orangtua* |

### Periode Akademik
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/periode` | List semua periode | admin |
| POST | `/api/periode` | Buat periode baru | admin |
| PUT | `/api/periode/:id` | Edit periode | admin |
| PUT | `/api/periode/:id/tutup` | Tutup periode + generate laporan | admin |

### Arsip Data
| Method | Path | Deskripsi | Role |
|--------|------|-----------|------|
| GET | `/api/arsip` | List data arsip | admin |
| GET | `/api/arsip/siap-arsip` | Data yang siap di-arsipkan | admin |
| POST | `/api/arsip/proses` | Arsipkan data (batch) | admin |
| POST | `/api/arsip/:id/restore` | Restore dari arsip | admin |
| DELETE | `/api/arsip/:id` | Hapus permanen | admin |
| GET | `/api/arsip/export` | Export arsip ke CSV | admin |

> *orangtua = hanya bisa akses data anaknya sendiri, dicek lewat relasi user → orangtua → siswa

---

## 26. Skema Database

### Tabel: users
```
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
role            ENUM('admin','tutor','orangtua') NOT NULL
nama            VARCHAR(255) NOT NULL
is_active       BOOLEAN DEFAULT true
failed_logins   INT DEFAULT 0
locked_until    TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: sessions
```
id              UUID PRIMARY KEY
user_id         UUID FK → users.id
token           VARCHAR(255) UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
created_at      TIMESTAMP
```

### Tabel: guru
```
id              UUID PRIMARY KEY
user_id         UUID FK → users.id (nullable, dibuat saat create akun)
nama            VARCHAR(255) NOT NULL
no_wa           VARCHAR(20)
email           VARCHAR(255)
spesialisasi    TEXT (JSON array of level strings)
tanggal_gabung  DATE
foto_url        VARCHAR(500)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: orangtua
```
id              UUID PRIMARY KEY
user_id         UUID FK → users.id (nullable, dibuat saat pendaftaran diterima)
nama            VARCHAR(255) NOT NULL
no_wa           VARCHAR(20) NOT NULL
email           VARCHAR(255)
alamat          TEXT
hubungan        ENUM('ayah','ibu','wali')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: siswa
```
id              UUID PRIMARY KEY
orangtua_id     UUID FK → orangtua.id
nama            VARCHAR(255) NOT NULL
tempat_lahir    VARCHAR(255)
tanggal_lahir   DATE NOT NULL
jenis_kelamin   ENUM('L','P')
level_saat_ini  ENUM('pra-membaca','level-1','level-2','level-3','lanjutan')
kelas_id        UUID FK → kelas.id (nullable)
foto_url        VARCHAR(500)
tanggal_masuk   DATE NOT NULL
tanggal_keluar  DATE
status          ENUM('aktif','nonaktif','lulus') DEFAULT 'aktif'
alasan_keluar   TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: program
```
id              UUID PRIMARY KEY
kode            VARCHAR(20) UNIQUE (pra-membaca, level-1, dst)
nama            VARCHAR(255) NOT NULL
deskripsi       TEXT
target_capaian  TEXT (JSON array)
durasi_estimasi VARCHAR(50)
rentang_usia    VARCHAR(50)
urutan          INT (0,1,2,3,4)
icon            VARCHAR(10)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: kelas
```
id              UUID PRIMARY KEY
nama            VARCHAR(255) NOT NULL (contoh: "Pagi A - Level 1")
program_id      UUID FK → program.id
guru_id         UUID FK → guru.id
jadwal_hari     TEXT (JSON array: ["senin","rabu","jumat"])
jam_mulai       TIME
jam_selesai     TIME
kapasitas       INT DEFAULT 6
status          ENUM('aktif','penuh','nonaktif') DEFAULT 'aktif'
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: sesi_belajar
```
id              UUID PRIMARY KEY
kelas_id        UUID FK → kelas.id
guru_id         UUID FK → guru.id
tanggal         DATE NOT NULL
jam_mulai       TIME
jam_selesai     TIME
materi          VARCHAR(500)
catatan_umum    TEXT
created_at      TIMESTAMP
```

### Tabel: absensi
```
id              UUID PRIMARY KEY
sesi_id         UUID FK → sesi_belajar.id
siswa_id        UUID FK → siswa.id
status          ENUM('hadir','izin','sakit','alpha') NOT NULL
created_at      TIMESTAMP
UNIQUE(sesi_id, siswa_id)
```

### Tabel: nilai_sesi
```
id              UUID PRIMARY KEY
sesi_id         UUID FK → sesi_belajar.id
siswa_id        UUID FK → siswa.id
nilai           INT (0-100)
mood            INT (1-5)
langkah_selesai TEXT (JSON array: [1,2,3,4,5,6])
catatan         TEXT
created_at      TIMESTAMP
UNIQUE(sesi_id, siswa_id)
```

### Tabel: catatan_guru
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
guru_id         UUID FK → guru.id
tanggal         DATE NOT NULL
catatan         TEXT NOT NULL
tipe            ENUM('progress','saran','pencapaian')
created_at      TIMESTAMP
```

### Tabel: progress_indikator
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
bulan           DATE (first of month, untuk histori per bulan)
mengenal_huruf  INT DEFAULT 0 (0-100)
membaca_suku_kata INT DEFAULT 0
membaca_kata    INT DEFAULT 0
membaca_kalimat INT DEFAULT 0
membaca_cerita  INT DEFAULT 0
updated_by      UUID FK → users.id
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(siswa_id, bulan)
```

### Tabel: kosakata
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
kata            VARCHAR(100) NOT NULL
kategori        ENUM('huruf','suku-kata','kata','kalimat')
dikuasai        BOOLEAN DEFAULT false
tanggal_dikuasai DATE
created_at      TIMESTAMP
```

### Tabel: riwayat_level
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
level           ENUM('pra-membaca','level-1','level-2','level-3','lanjutan')
tanggal_mulai   DATE NOT NULL
tanggal_selesai DATE
status          ENUM('selesai','sedang','belum') DEFAULT 'sedang'
progress_persen INT DEFAULT 0
created_at      TIMESTAMP
```

### Tabel: asesmen
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
guru_id         UUID FK → guru.id
dari_level      VARCHAR(20) NOT NULL
ke_level        VARCHAR(20) NOT NULL
nilai_tertulis  INT (0-100)
nilai_praktik   INT (0-100)
checklist_indikator TEXT (JSON: {"mengenal_huruf": true, ...})
catatan         TEXT
rekomendasi     ENUM('lulus','belum-siap')
status          ENUM('menunggu','disetujui','ditolak') DEFAULT 'menunggu'
disetujui_oleh  UUID FK → users.id (nullable)
tanggal_disetujui DATE
catatan_admin   TEXT
created_at      TIMESTAMP
```

### Tabel: pencapaian
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
nama_badge      VARCHAR(255) NOT NULL
ikon            VARCHAR(50)
kategori        ENUM('kehadiran','nilai','milestone','kosakata','semangat')
deskripsi       TEXT
tanggal_raih    DATE NOT NULL
created_at      TIMESTAMP
```

### Tabel: pendaftaran
```
id                  UUID PRIMARY KEY
no_registrasi       VARCHAR(20) UNIQUE (REG-2026-001 atau TRL-2026-001)
tipe_pendaftaran    ENUM('reguler','trial') DEFAULT 'reguler'
nama_anak           VARCHAR(255) NOT NULL
tempat_lahir        VARCHAR(255)
tanggal_lahir       DATE NOT NULL
jenis_kelamin       ENUM('L','P')
nama_ortu           VARCHAR(255) NOT NULL
no_wa_ortu          VARCHAR(20) NOT NULL
email_ortu          VARCHAR(255)
alamat              TEXT
hubungan            ENUM('ayah','ibu','wali')
program_diminati    UUID FK → program.id
preferensi_jadwal   ENUM('pagi','siang','fleksibel')
pengalaman          TEXT
sumber_info         VARCHAR(255)
status              ENUM('menunggu','diproses','diterima','ditolak','ditunda') DEFAULT 'menunggu'
catatan_admin       TEXT
alasan_tolak        TEXT
siswa_id            UUID FK → siswa.id (nullable, diisi saat diterima)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Tabel: galeri
```
id              UUID PRIMARY KEY
image_url       VARCHAR(500) NOT NULL
caption         VARCHAR(255)
kategori        VARCHAR(50)
urutan          INT
created_at      TIMESTAMP
```

### Tabel: testimoni
```
id              UUID PRIMARY KEY
nama_ortu       VARCHAR(255) NOT NULL
nama_anak       VARCHAR(255)
usia_anak       VARCHAR(50)
ulasan          TEXT NOT NULL
rating          INT (1-5)
program         VARCHAR(255)
is_tampil       BOOLEAN DEFAULT true
created_at      TIMESTAMP
```

### Tabel: faq
```
id              UUID PRIMARY KEY
pertanyaan      TEXT NOT NULL
jawaban         TEXT NOT NULL
urutan          INT
is_aktif        BOOLEAN DEFAULT true
created_at      TIMESTAMP
```

### Tabel: pengaturan
```
key             VARCHAR(100) PRIMARY KEY
value           TEXT NOT NULL
updated_at      TIMESTAMP
-- contoh rows: site_name, site_description, contact_phone, contact_email,
--              contact_address, contact_whatsapp, contact_hours
```

### Tabel: log_aktivitas
```
id              UUID PRIMARY KEY
user_id         UUID FK → users.id
aksi            VARCHAR(100) NOT NULL
detail          TEXT
ip_address      VARCHAR(45)
created_at      TIMESTAMP
```

### Tabel: modul
```
id              UUID PRIMARY KEY
program_id      UUID FK → program.id
kode            VARCHAR(20) NOT NULL (contoh: "M1.01")
judul           VARCHAR(255) NOT NULL
deskripsi       TEXT
urutan          INT NOT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(program_id, kode)
```

### Tabel: modul_siswa (tracking modul per siswa)
```
id              UUID PRIMARY KEY
modul_id        UUID FK → modul.id
siswa_id        UUID FK → siswa.id
sesi_id         UUID FK → sesi_belajar.id (nullable, sesi saat modul diajarkan)
status          ENUM('belum','sedang','selesai') DEFAULT 'belum'
nilai           INT (0-100, nullable)
tanggal_selesai DATE
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(modul_id, siswa_id)
```

### Tabel: materi_pendukung
```
id              UUID PRIMARY KEY
modul_id        UUID FK → modul.id
tipe            ENUM('pdf','video','gambar') NOT NULL
judul           VARCHAR(255) NOT NULL
url             VARCHAR(500) NOT NULL (file path atau YouTube URL)
uploaded_by     UUID FK → users.id
share_ke_ortu   BOOLEAN DEFAULT false
created_at      TIMESTAMP
```

### Tabel: waiting_list
```
id              UUID PRIMARY KEY
pendaftaran_id  UUID FK → pendaftaran.id
program_id      UUID FK → program.id
preferensi_jadwal ENUM('pagi','siang','fleksibel')
urutan_antrian  INT NOT NULL
status          ENUM('menunggu','ditempatkan','dibatalkan') DEFAULT 'menunggu'
catatan         TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: riwayat_pindah_kelas
```
id              UUID PRIMARY KEY
siswa_id        UUID FK → siswa.id
dari_kelas_id   UUID FK → kelas.id
ke_kelas_id     UUID FK FK → kelas.id
alasan          ENUM('ganti-jadwal','pindah-guru','lainnya')
catatan         TEXT
dipindah_oleh   UUID FK → users.id
tanggal_pindah  DATE NOT NULL
created_at      TIMESTAMP
```

### Tabel: notifikasi
```
id              UUID PRIMARY KEY
user_id         UUID FK → users.id (penerima)
judul           VARCHAR(255) NOT NULL
pesan           TEXT NOT NULL
tipe            VARCHAR(50) NOT NULL (pendaftaran/asesmen/absensi/sesi/level/umum)
link            VARCHAR(500) (URL halaman terkait, opsional)
is_read         BOOLEAN DEFAULT false
created_at      TIMESTAMP
```

### Tabel: video_pembelajaran
```
id              UUID PRIMARY KEY
guru_id         UUID FK → guru.id
judul           VARCHAR(255) NOT NULL
deskripsi       TEXT
youtube_url     VARCHAR(500) NOT NULL
level           VARCHAR(20)
target_tipe     ENUM('kelas','siswa') DEFAULT 'kelas'
target_id       UUID (kelas_id atau siswa_id tergantung target_tipe)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: video_siswa (relasi many-to-many jika target=siswa tertentu)
```
id              UUID PRIMARY KEY
video_id        UUID FK → video_pembelajaran.id
siswa_id        UUID FK → siswa.id
created_at      TIMESTAMP
UNIQUE(video_id, siswa_id)
```

### Tabel: periode_akademik
```
id              UUID PRIMARY KEY
nama            VARCHAR(255) NOT NULL (contoh: "Semester 1 - 2026")
tanggal_mulai   DATE NOT NULL
tanggal_selesai DATE NOT NULL
status          ENUM('aktif','selesai') DEFAULT 'aktif'
catatan         TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: sesi_belajar (kolom tambahan)
```
-- Tambahan kolom pada tabel sesi_belajar yang sudah ada:
modul_id            UUID FK → modul.id (nullable, menggantikan free-text materi)
guru_pengganti_id   UUID FK → guru.id (nullable, jika ada guru pengganti)
periode_id          UUID FK → periode_akademik.id (nullable)
status_sesi         ENUM('terjadwal','selesai','dibatalkan') DEFAULT 'terjadwal'
alasan_batal        TEXT (nullable, jika dibatalkan)
```

### Tabel: users (kolom tambahan)
```
-- Tambahan kolom pada tabel users yang sudah ada:
foto_url        VARCHAR(500)
last_login_at   TIMESTAMP
password_reset_required  BOOLEAN DEFAULT false (true jika di-reset admin)
```

---

## Ringkasan: Apa yang Harus Dibangun

### Prioritas 1 — Fondasi (Wajib ada sebelum fitur lain)
- [ ] Setup database + migrasi schema (semua tabel)
- [ ] Autentikasi (login/logout/session/middleware)
- [ ] Proteksi route per role (admin/tutor/orangtua)
- [ ] Halaman login + redirect per role
- [ ] Kelola akun + reset password oleh admin
- [ ] Profil diri (edit nama, email, ganti password, foto)
- [ ] Seed data dummy (admin default, beberapa guru, siswa, kelas)
- [ ] Fix navbar: "Dashboard" → "Login", "Daftar Sekarang" → /daftar

### Prioritas 2 — CRUD Core
- [ ] CRUD Siswa + detail lengkap + upload foto
- [ ] CRUD Orang Tua + relasi multi-anak
- [ ] CRUD Guru + assignment kelas
- [ ] CRUD Kelas + jadwal
- [ ] CRUD Program (edit deskripsi/target saja)
- [ ] Form pendaftaran publik (/daftar) + verifikasi admin
- [ ] Pendaftaran manual oleh admin
- [ ] Waiting list (kelas penuh)
- [ ] Pindah kelas (tanpa naik level)

### Prioritas 3 — KBM & Monitoring
- [ ] Bank modul per level + CRUD modul
- [ ] Input sesi belajar (absensi + nilai + catatan + pilih modul)
- [ ] Tracking modul per siswa
- [ ] Progress indikator per siswa (5 area)
- [ ] Kosakata pribadi
- [ ] Guru pengganti + batalkan sesi
- [ ] Dashboard admin (data real dari DB)
- [ ] Dashboard tutor
- [ ] Dashboard orang tua (data real, dropdown pilih anak)
- [ ] Notifikasi in-app (bell icon, trigger per aksi)

### Prioritas 4 — Fitur Lanjutan
- [ ] Asesmen kenaikan level + approval flow
- [ ] Kelulusan + generate sertifikat PDF
- [ ] Generate rapor bulanan (PDF)
- [ ] Laporan statistik + chart (siswa/kehadiran/akademik/guru)
- [ ] Periode akademik (semester)
- [ ] Video pembelajaran (share YouTube dari tutor)
- [ ] Materi pendukung per modul (PDF/video/gambar)
- [ ] CMS landing: galeri, testimoni, FAQ (CRUD dari admin)
- [ ] Upload foto galeri (multi-upload, drag-sort)
- [ ] Nonaktifkan/reaktivasi siswa
- [ ] Badge/pencapaian otomatis
- [ ] Log aktivitas
- [ ] Retensi & arsip data (arsip siswa lulus/nonaktif)
- [ ] Export CSV/PDF (siswa, absensi, laporan, arsip)

---

> Dokumen ini menjadi acuan untuk redesign dan pengembangan backend AHE Karang Joang.
> Setiap proses bisnis di atas sudah mempertimbangkan alur kerja nyata bimbingan belajar AHE
> dengan metode 6 langkah, struktur level Pra Membaca sampai Lanjutan, dan rasio 6 siswa per kelas.
