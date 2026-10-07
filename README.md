# AHE-BOS (Anak Hebat - Bimbingan Belajar Administrasi & Monitoring)

Sistem Informasi Administrasi, KBM, dan Monitoring Perkembangan Belajar Anak Hebat (AHE) Karang Joang, Balikpapan.

Arsitektur aplikasi menggunakan **Decoupled Architecture**:
- **Backend API:** Laravel 12 + PHP 8.2+ + PostgreSQL + Laravel Sanctum + Spatie Permission
- **Frontend App:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + shadcn/ui + Axios + Recharts + jsPDF + QR Code + TanStack Table

---

## 📁 Struktur Folder

```
C:\xampp\htdocs\ahe-bos\
├── backend\                    # Backend API (Laravel 12)
│   ├── app\
│   │   ├── Http\Controllers\Api\ # 22 API Controllers
│   │   └── Models\             # 29 Eloquent Models
│   ├── config\                 # Konfigurasi (cors, sanctum, permission)
│   ├── database\
│   │   ├── migrations\         # Migrations PostgreSQL
│   │   └── seeders\            # Seeder dari db_store.json
│   ├── routes\
│   │   └── api.php             # 96 Endpoint REST API
│   ├── .env                    # Konfigurasi database PostgreSQL
│   └── composer.json
│
├── frontend\                   # Frontend Web App (Next.js 16)
│   ├── src\
│   │   ├── app\                # App Router pages (admin, tutor, dashboard, daftar, login)
│   │   ├── components\
│   │   │   ├── admin\          # Admin tab components
│   │   │   ├── dashboard\      # Sidebar, Header
│   │   │   ├── landing\        # Landing page sections
│   │   │   ├── shared\         # Shared UI, DataTable (TanStack Table)
│   │   │   └── ui\             # shadcn/ui primitives
│   │   ├── lib\
│   │   │   ├── axios.ts        # Axios client + Sanctum interceptor
│   │   │   ├── pdf.ts          # jsPDF + QR Code generator
│   │   │   └── utils.ts
│   │   └── middleware.ts       # Route protection middleware
│   ├── next.config.ts          # Proxy rewrite /api -> http://127.0.0.1:8000/api
│   └── package.json
│
├── db_store.json               # Data sumber awal
├── PRD.md                      # Product Requirements Document
├── PROSES-BISNIS.md            # Proses Bisnis Lengkap
└── README.md
```

---

## 🛠️ Tools & Teknologi Sesuai Kebutuhan Mitra

### Frontend
- **Framework:** Next.js 16.2.9 (App Router)
- **Library:** React 19.2.4
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4, Radix UI / shadcn/ui
- **API Client:** Axios (dengan Bearer token interceptor)
- **Charts:** Recharts
- **Digital Output & Dokumen:** jsPDF + QR Code (`qrcode`)
- **Tabel Data:** TanStack Table (`@tanstack/react-table`)

### Backend
- **Framework:** Laravel 12.69.3
- **Language:** PHP 8.2.12 (ZTS x64)
- **Database:** PostgreSQL 17 (Database: `ahe_bos`)
- **Autentikasi:** Laravel Sanctum (Token-based API)
- **Role & Hak Akses:** Spatie Permission (`spatie/laravel-permission`)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (Laravel API)
```bash
cd backend
php artisan serve --port=8000
```
Backend berjalan di: `http://127.0.0.1:8000`

### 2. Menjalankan Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Frontend berjalan di: `http://localhost:3000`

### 3. Build Production Frontend
```bash
cd frontend
npm run build
```

---

## 🔐 Akun & Kredensial Demo

| Peran / Role | Email | Password | Portal Halaman |
|---|---|---|---|
| **Administrator** | `admin@ahe.id` | `admin123` | `/admin` |
| **Tutor Pengajar** | `sari@ahe.id` | `tutor123` | `/tutor` |
| **Wali Murid / Orang Tua** | `sari.dewi@ahe.id` | `ortu123` | `/dashboard` |

---

## 🗄️ Database PostgreSQL

- **Host:** `127.0.0.1`
- **Port:** `5432`
- **Database:** `ahe_bos`
- **Username:** `postgres`
- **Password:** `setiawan`

Untuk melakukan migrasi & seed ulang data:
```bash
cd backend
php artisan migrate:fresh --seed
```
