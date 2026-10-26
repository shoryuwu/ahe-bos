# BUKU PANDUAN PENGGUNAAN SISTEM AHE-BOS
## Bimbingan Belajar Anak Hebat (AHE) Karang Joang

> **Versi Dokumen:** 1.0 (Oktober 2026)  
> **Aplikasi:** AHE-BOS (Bimbel Operating System)  
> **Teknologi:** Laravel 12 Backend API + Next.js 16 Web Application + PostgreSQL

---

## DAFTAR ISI
1. [Aturan Bisnis Utama Bimbel AHE](#1-aturan-bisnis-utama-bimbel-ahe)
2. [Akses Sistem & Akun Pengguna](#2-akses-sistem--akun-pengguna)
3. [Panduan Operasional Administrator](#3-panduan-operasional-administrator)
4. [Panduan Operasional Tutor (Guru Pengajar)](#4-panduan-operasional-tutor-guru-pengajar)
5. [Panduan Penggunaan Orang Tua (Wali Murid)](#5-panduan-penggunaan-orang-tua-wali-murid)
6. [Troubleshooting & Pemeliharaan](#6-troubleshooting--pemeliharaan)

---

## 1. Aturan Bisnis Utama Bimbel AHE

Sistem AHE-BOS dirancang secara khusus untuk mematuhi prinsip belajar membaca semi-private:

1. **Rasio Guru : Murid (Maksimal 1 : 2 per Sesi 1 Jam):**
   * Satu kelas rombel tatap muka hanya boleh diisi maksimal 2 siswa.
   * Jadwal mengajar guru tidak boleh bentrok (*overlap*) di hari dan jam yang sama.
2. **Keterikatan Emosional & Rasa Percaya (*Trust & Bonding*):**
   * Nama tutor pembimbing wajib selalu ditampilkan berdampingan dengan data anak.
   * Saat anak naik level, guru **tidak diwajibkan berganti**. Anak dipertahankan bersama tutor yang sama demi rasa nyaman anak.
3. **Metode Fonik 6 Langkah Konsisten:**
   * Setiap pertemuan tatap muka 1 jam mengeksekusi 6 langkah: *Senam Otak, Tunjuk Bunyi, Remas Kata, Baca Kartu, Tulis Fonik, Dongeng Penutup*.
4. **Penilaian Individu Non-Ranking:**
   * Perkembangan anak dipantau secara personal melalui skor harian, mood belajar (1–5 bintang), penguasaan kosakata, dan grafik 5 dimensi kemampuan membaca.

---

## 2. Akses Sistem & Akun Pengguna

Aplikasi dapat diakses melalui peramban (*web browser*) di:
* **URL Sistem:** `http://localhost:3000` (atau domain produksi bimbel)
* **Halaman Masuk (*Login*):** `http://localhost:3000/login`

### Akun Uji Coba Default:

| Peran (*Role*) | Alamat Email | Kata Sandi (*Password*) | Halaman Utama |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ahe.id` | `admin123` | `/admin` |
| **Tutor (Guru)** | `sari@ahe.id` | `tutor123` | `/tutor` |
| **Orang Tua** | `budi.santoso@ahe.id` | `ortu123` | `/dashboard` |

---

## 3. Panduan Operasional Administrator

Admin memegang kendali penuh atas tata kelola rombel, pendaftaran, dan verifikasi kelulusan jenjang.

### 3.1 Mengelola Rombel & Jadwal Mengajar (Tab "Kelas")
1. Buka menu **Manajemen Kelas**.
2. Klik tombol **"+ Tambah Kelas Baru"**.
3. Masukkan nama rombel, pilih program, tentukan guru pembimbing, hari, dan rentang jam (misal `08:30 - 09:30`).
4. **Perhatian Kapasitas:** Kapasitas terkunci otomatis pada angka **2 siswa**.
5. **Anti-Bentrok Jadwal:** Jika guru yang dipilih telah memiliki kelas lain di hari dan jam yang bersinggungan, sistem akan menolak dengan pesan peringatan:  
   *"Guru [Nama Guru] sudah memiliki jadwal mengajar yang bertabrakan pada rentang jam tersebut."*

### 3.2 Menerima Calon Siswa (Tab "Pendaftaran")
1. Calon murid yang mendaftar via formulir `/daftar` akan masuk ke daftar **Pendaftaran Baru**.
2. Klik tombol **"Terima"** pada baris pendaftar:
   * Pilih kelas rombel yang dituju.
   * Jika kelas tujuan sudah terisi 2 anak, sistem **menolak penerimaan** dengan notifikasi kuota penuh.
   * Jika kelas penuh, arahkan calon siswa ke antrean **Waiting List**.
3. Sistem otomatis membuat akun siswa dan akun login wali murid.

### 3.3 Pemindahan Jadwal & Fleksibilitas Tutor (Tab "Siswa")
1. Pada tabel data siswa, perhatikan kolom rombel. Nama tutor pembimbing tertera jelas dengan warna ungu.
2. Jika orang tua meminta ubah jadwal, klik tombol **"Pindah Kelas"**.
3. Sistem akan menandai opsi kelas tujuan:
   * `[Nama Kelas] • Tutor: Bu Sari (★ Tutor Sama)` $\rightarrow$ *Direkomendasikan agar anak tetap nyaman.*
   * `[Nama Kelas] • Tutor: Bu Dewi (Tutor Baru)`
4. Pilih alasan pemindahan (misal: *"Mempertahankan tutor yang sama di jadwal baru"*).

### 3.4 Persetujuan Kenaikan Level (Tab "Kenaikan Level")
1. Tutor yang telah menuntaskan asesmen membaca akan mengirimkan pengajuan.
2. Admin memeriksa nilai ujian tertulis dan nilai praktik membaca siswa.
3. Klik tombol **"Setujui"**.
4. Level anak akan naik otomatis (misal: Pra-Membaca $\rightarrow$ Level 1). Siswa tetap berada di rombel dan bersama tutor yang sama tanpa hambatan adaptasi.

---

## 4. Panduan Operasional Tutor (Guru Pengajar)

Tutor berfokus pada pendampingan tatap muka dan pencatatan hasil belajar harian.

### 4.1 Memeriksa Jadwal Mengajar Harian
1. Masuk ke akun tutor (`/login` $\rightarrow$ dialihkan ke `/tutor`).
2. Buka menu **"Jadwal Sesi"** (`/tutor/jadwal`).
3. Lihat daftar sesi hari ini. Pastikan hanya ada maksimal 2 anak di rombel Anda untuk sesi jam tersebut.

### 4.2 Menginput Hasil KBM Sesi Belajar (`/tutor/input-sesi`)
Setelah jam bimbingan selesai, tutor wajib menginput evaluasi:
1. Pilih **Kelas** dan **Tanggal Sesi**.
2. Tulis materi bimbingan (misal: *"Langkah 2: Tunjuk Bunyi Suku Kata Ba-Bi-Bu"*).
3. Untuk setiap anak yang hadir:
   * **Absensi:** Pilih Hadir / Izin / Sakit / Alpha.
   * **Nilai Pemahaman:** Berikan nilai angka 0–100 berdasarkan kelancaran membaca hari itu.
   * **Antusiasme Belajar (Mood):** Pilih rating 1 s.d. 5 bintang (dari *Kurang Fit* hingga *Sangat Bersemangat*).
   * **Langkah Fonik AHE Selesai:** Centang langkah-langkah yang tuntas diselesaikan anak:
     * `[✓] 1. Senam Otak`
     * `[✓] 2. Tunjuk Bunyi`
     * `[✓] 3. Remas Kata`
     * `[✓] 4. Baca Kartu`
     * `[✓] 5. Tulis Fonik`
     * `[✓] 6. Dongeng Penutup`
   * **Catatan Khusus untuk Orang Tua:** Tulis masukan hangat (contoh: *"Ananda sangat fokus hari ini. Huruf b dan d sudah tidak tertukar. Mohon diulang 5 menit sebelum tidur."*).
4. Klik **"Simpan Sesi Belajar"**. Data akan langsung terkirim detik itu juga ke dashboard orang tua.

### 4.3 Mengajukan Asesmen Kenaikan Level (`/tutor/asesmen`)
1. Jika seluruh target modul anak telah selesai, buka menu **Asesmen**.
2. Klik **"Ajukan Asesmen Kenaikan Level"**.
3. Input nilai ujian praktik membaca, nilai tes tertulis, checklist indikator, dan catatan kelulusan.
4. Klik simpan. Pengajuan akan diteruskan ke admin untuk diterbitkan rapor dan sertifikatnya.

---

## 5. Panduan Penggunaan Orang Tua (Wali Murid)

Orang tua dapat memantau proses belajar anak kapan saja secara transparan lewat ponsel atau komputer.

### 5.1 Masuk ke Dashboard Orang Tua
1. Buka alamat `/login`.
2. Masukkan email yang didaftarkan saat registrasi awal dan kata sandi.
3. Setelah login, Anda akan diarahkan ke `/dashboard`.
4. Di bagian banner atas, Anda dapat langsung melihat:
   * **Level Saat Ini & Status Anak**
   * **Nama Tutor Pembimbing:** (Contoh: *Tutor: Bu Sari Rahayu, S.Pd.*)
   * **Persentase Kehadiran & Rata-rata Nilai Belajar**

### 5.2 Membaca Penilaian Individu Sesi Belajar
Pada kartu **"Penilaian Individu Sesi Belajar & Asesmen"**, orang tua dapat memantau:
* **Skor Pemahaman:** Nilai capaian harian anak di setiap tatap muka.
* **Mood Belajar:** Mengetahui apakah ananda sedang ceria, bersemangat, atau butuh dorongan semangat.
* **6 Langkah Metode Fonik:** Langkah-langkah metode AHE yang berhasil dituntaskan hari itu.
* **Catatan Langsung dari Tutor:** Pesan pribadi tutor mengenai saran pendampingan di rumah.

### 5.3 Memantau 5 Dimensi Kemampuan Membaca & Kosakata
* **Grafik 5 Dimensi:** Mengamati grafik bar (0–100%) untuk pengenalan huruf, membaca suku kata, merangkai kata, membaca kalimat, dan pemahaman cerita.
* **Kosakata yang Dikuasai:** Daftar kata-kata baru yang sudah berhasil dibaca secara mandiri oleh anak.

### 5.4 Mengunduh Rapor & Sertifikat Resmi
1. Cari kartu berwarna ungu **"Dokumen Belajar Resmi"**.
2. Klik **"Cetak Rapor A4"** untuk membuka laporan berkala lengkap siap cetak atau disimpan sebagai PDF.
3. Klik **"Cetak Sertifikat Level"** untuk mengunduh piagam kelulusan jenjang membaca anak.

---

## 6. Troubleshooting & Pemeliharaan

### Q: Apa yang harus dilakukan jika tombol simpan kelas error "Jadwal bertabrakan"?
> **Jawab:** Periksa jam mulai dan selesai kelas guru tersebut pada tab "Kelas". Pastikan ada jeda waktu atau pilih guru lain yang sedang tidak mengajar di jam tersebut.

### Q: Mengapa saat menerima pendaftaran muncul pesan "Kelas tujuan sudah penuh"?
> **Jawab:** Karena sistem mengunci maksimal 2 siswa per rombel. Silakan buat rombel baru di jam lain atau alokasikan siswa ke antrean Waiting List.

### Q: Bagaimana jika tampilan web terasa lambat atau ada pembaruan kode?
> **Jawab:** 
> 1. Jalankan `npm run build` di folder `frontend` untuk memverifikasi tidak ada error tipe data.
> 2. Dev server frontend dapat di-restart dengan perintah `npm run dev` pada port 3000.
> 3. Backend Laravel berjalan pada port 8000 dengan perintah `php artisan serve`.

---
*Dokumen panduan ini disusun sebagai acuan resmi operasional Bimbingan Belajar Anak Hebat (AHE) Karang Joang.*
