# PRD — Website AHE Karang Joang
# Product Requirements Document (Implementation Guide)

> Dokumen ini adalah panduan implementasi teknis untuk AI coding agent.
> Baca dokumen ini saja — tidak perlu baca PROSES-BISNIS.md.
> Setiap phase bisa diimplementasi dan ditest secara independen.

---

## 1. Overview

### 1.1. Project Summary

Website administrasi & monitoring Bimbingan Belajar Anak Hebat (AHE) Karang Joang, Balikpapan.
Mengelola: pendaftaran siswa, manajemen kelas/guru, input sesi belajar harian, tracking progress membaca, dashboard monitoring untuk admin/tutor/orang tua.

### 1.2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router) |
| Runtime | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui v4 |
| Database | JSON file (`db_store.json` di root project) |
| Auth | Cookie-based session (ahe_session + ahe_role) |
| Password | bcrypt (via `bcryptjs`) |
| Font | Poppins (sudah configured) |
| Brand | Purple #7c3aed, Magenta #c026d3, Orange #f97316 |

### 1.3. Arsitektur

```
Browser
  │
  ├── / (Landing Page — publik)
  ├── /daftar (Form Pendaftaran — publik)
  ├── /login (Login — publik)
  ├── /admin/* (Dashboard Admin — role: admin)
  ├── /tutor/* (Dashboard Tutor — role: tutor)
  └── /dashboard/* (Dashboard Orang Tua — role: orangtua)
        │
        ▼
  Next.js API Routes (src/app/api/*)
        │
        ▼
  JSON DB (db_store.json) — read/write via src/lib/db.ts
```

### 1.4. Aktor & Role

| Role | Akses | Route |
|------|-------|-------|
| Guest | Landing, form daftar, cek status pendaftaran | `/`, `/daftar`, `/login` |
| Admin | Full CRUD, approve pendaftaran, approve kenaikan level, kelola akun, laporan | `/admin/*` |
| Tutor | Input sesi (absensi+nilai+catatan), update progress, ajukan asesmen | `/tutor/*` |
| Orang Tua | Read-only dashboard anak, edit profil diri, download rapor | `/dashboard/*` |

### 1.5. Respons API Standard

Semua endpoint return JSON dengan format:

```typescript
// Sukses
{ success: true, data: T }

// Error
{ success: false, error: "Pesan error" }
```

HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error).

---

## 2. Coding Conventions

### 2.1. File Naming

```
src/app/api/[resource]/route.ts          — API route
src/app/api/[resource]/[id]/route.ts     — API route dengan parameter
src/app/[page]/page.tsx                  — Page component
src/components/[domain]/[Component].tsx  — Domain-specific component
src/components/ui/[component].tsx        — shadcn UI components (sudah ada)
src/lib/db.ts                            — Database helpers
src/lib/auth.ts                          — Auth helpers
src/lib/validation.ts                    — Validation helpers
src/types/index.ts                       — TypeScript interfaces
```

### 2.2. JSON Database Pattern

File: `src/lib/db.ts`

```typescript
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";

const DB_PATH = join(process.cwd(), "db_store.json");

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

export function readDB(): DB {
  if (!existsSync(DB_PATH)) {
    const empty = createEmptyDB();
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

export function writeDB(db: DB): void {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}
```

**Penting:** Setiap API route yang menulis data harus:
1. `readDB()` di awal
2. Mutasi data in-memory
3. `writeDB(db)` di akhir
4. Tidak ada concurrent write protection (ini prototype)

### 2.3. Auth Pattern

File: `src/lib/auth.ts`

```typescript
import { cookies } from "next/headers";
import { readDB } from "./db";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ahe_session")?.value;
  if (!token) return null;

  const db = readDB();
  const session = db.sessions.find(
    (s) => s.token === token && new Date(s.expires_at) > new Date()
  );
  if (!session) return null;

  const user = db.users.find((u) => u.id === session.user_id && u.is_active);
  if (!user) return null;

  return { user, session };
}

export async function requireAuth(allowedRoles?: string[]) {
  const result = await getSession();
  if (!result) return null;
  if (allowedRoles && !allowedRoles.includes(result.user.role)) return null;
  return result;
}
```

### 2.4. Middleware Pattern

File: `src/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/daftar", "/api/auth/login",
  "/api/pendaftaran", "/api/konten/"];
const ADMIN_PATHS = ["/admin"];
const TUTOR_PATHS = ["/tutor"];
const PARENT_PATHS = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — skip auth check
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    // Exception: POST /api/pendaftaran is public, GET is admin-only
    // Handle in API route level, not middleware
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("ahe_session")?.value;
  const role = request.cookies.get("ahe_role")?.value;

  if (!sessionToken || !role) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based route protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/tutor") && role !== "tutor") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/dashboard") && role !== "orangtua") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

**Note:** Middleware hanya cek keberadaan cookie + role. Validasi session token yang sebenarnya dilakukan di API route level via `getSession()`.

### 2.5. Error Handling

```typescript
// Di setiap API route, wrap dengan try-catch:
export async function GET(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 3. File Structure Target (Setelah Semua Phase Selesai)

```
ahe-app/
├── db_store.json                          ← JSON database
├── public/
│   ├── uploads/                           ← uploaded files
│   │   ├── siswa/
│   │   ├── galeri/
│   │   └── profil/
│   ├── logo.png
│   └── child.webp
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                       ← Landing page (publik)
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── daftar/
│   │   │   └── page.tsx                   ← Form pendaftaran publik
│   │   ├── admin/
│   │   │   ├── layout.tsx                 ← Admin layout (sidebar + header)
│   │   │   ├── page.tsx                   ← Admin dashboard overview
│   │   │   ├── siswa/
│   │   │   │   ├── page.tsx               ← List siswa
│   │   │   │   └── [id]/page.tsx          ← Detail siswa
│   │   │   ├── orangtua/page.tsx
│   │   │   ├── guru/page.tsx
│   │   │   ├── kelas/page.tsx
│   │   │   ├── pendaftaran/page.tsx
│   │   │   ├── monitoring/page.tsx
│   │   │   ├── kenaikan-level/page.tsx
│   │   │   ├── laporan/page.tsx
│   │   │   └── pengaturan/
│   │   │       ├── page.tsx               ← Pengaturan umum
│   │   │       ├── akun/page.tsx          ← Kelola akun
│   │   │       ├── galeri/page.tsx
│   │   │       ├── testimoni/page.tsx
│   │   │       ├── faq/page.tsx
│   │   │       └── arsip/page.tsx
│   │   ├── tutor/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                   ← Tutor dashboard
│   │   │   ├── jadwal/page.tsx
│   │   │   ├── siswa/page.tsx
│   │   │   ├── input-sesi/page.tsx
│   │   │   ├── progress/page.tsx
│   │   │   └── asesmen/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                   ← Parent dashboard
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   ├── me/route.ts
│   │       │   └── password/route.ts
│   │       ├── pendaftaran/
│   │       │   ├── route.ts               ← GET (admin), POST (publik)
│   │       │   ├── [id]/route.ts          ← GET detail
│   │       │   ├── [id]/terima/route.ts
│   │       │   ├── [id]/tolak/route.ts
│   │       │   ├── [id]/tunda/route.ts
│   │       │   └── cek/[noRegistrasi]/route.ts
│   │       ├── siswa/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   ├── [id]/status/route.ts
│   │       │   ├── [id]/pindah-kelas/route.ts
│   │       │   └── [id]/riwayat-kelas/route.ts
│   │       ├── orangtua/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── guru/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── tersedia/route.ts
│   │       ├── kelas/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── [id]/siswa/route.ts
│   │       ├── sesi/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   ├── [id]/pengganti/route.ts
│   │       │   └── [id]/batalkan/route.ts
│   │       ├── absensi/
│   │       │   ├── siswa/[id]/route.ts
│   │       │   └── kelas/[id]/route.ts
│   │       ├── progress/
│   │       │   └── [siswaId]/route.ts
│   │       ├── kosakata/
│   │       │   ├── [siswaId]/route.ts
│   │       │   └── [id]/route.ts          ← PUT update status
│   │       ├── asesmen/
│   │       │   ├── route.ts
│   │       │   ├── [id]/approve/route.ts
│   │       │   └── [id]/reject/route.ts
│   │       ├── dashboard/
│   │       │   ├── admin/route.ts
│   │       │   ├── tutor/route.ts
│   │       │   ├── orangtua/route.ts
│   │       │   └── orangtua/anak/route.ts
│   │       ├── laporan/
│   │       │   ├── rapor/[siswaId]/[bulan]/route.ts
│   │       │   ├── sertifikat/[siswaId]/[level]/route.ts
│   │       │   └── statistik/route.ts
│   │       ├── catatan-guru/
│   │       │   ├── route.ts               ← POST
│   │       │   ├── [id]/route.ts          ← PUT, DELETE
│   │       │   └── siswa/[siswaId]/route.ts ← GET
│   │       ├── pencapaian/
│   │       │   ├── route.ts               ← POST
│   │       │   └── siswa/[siswaId]/route.ts
│   │       ├── jadwal/
│   │       │   ├── admin/route.ts
│   │       │   ├── tutor/route.ts
│   │       │   └── orangtua/[siswaId]/route.ts
│   │       ├── ringkasan-mingguan/
│   │       │   └── [siswaId]/route.ts
│   │       ├── log-aktivitas/route.ts
│   │       ├── modul/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   ├── reorder/route.ts
│   │       │   ├── siswa/[siswaId]/route.ts
│   │       │   └── [modulId]/materi/
│   │       │       ├── route.ts
│   │       │       └── [id]/route.ts
│   │       ├── waiting-list/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── assign/route.ts
│   │       ├── notifikasi/
│   │       │   ├── route.ts
│   │       │   ├── unread-count/route.ts
│   │       │   ├── read-all/route.ts
│   │       │   └── [id]/read/route.ts
│   │       ├── akun/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── reset-password/route.ts
│   │       │       ├── toggle-active/route.ts
│   │       │       └── unlock/route.ts
│   │       ├── profil/
│   │       │   ├── route.ts
│   │       │   └── foto/route.ts
│   │       ├── upload/
│   │       │   ├── foto-siswa/[siswaId]/route.ts
│   │       │   └── foto-galeri/route.ts
│   │       ├── video/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── siswa/[siswaId]/route.ts
│   │       ├── periode/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── [id]/tutup/route.ts
│   │       ├── arsip/
│   │       │   ├── route.ts
│   │       │   ├── siap-arsip/route.ts
│   │       │   ├── proses/route.ts
│   │       │   ├── export/route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── restore/route.ts
│   │       └── konten/
│   │           ├── galeri/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── testimoni/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── faq/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           └── pengaturan/route.ts
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── TutorSidebar.tsx           ← baru
│   │   │   └── DashboardHeader.tsx        ← refactor: dynamic user
│   │   ├── landing/ (sudah ada, tetap)
│   │   ├── shared/ (sudah ada + tambahan)
│   │   └── ui/ (shadcn, sudah ada)
│   ├── constants/index.ts
│   ├── data/index.ts                      ← akan dihapus bertahap
│   ├── lib/
│   │   ├── utils.ts (sudah ada)
│   │   ├── db.ts                          ← baru
│   │   ├── auth.ts                        ← baru
│   │   └── validation.ts                  ← baru
│   └── types/index.ts                     ← extend
├── middleware.ts                           ← redirect dari src/middleware.ts
├── package.json
└── tsconfig.json
```

---

## 4. Implementation Phases

---

### PHASE 1: Foundation (DB + Auth + Seed)

**Goal:** Bisa login sebagai admin/tutor/orangtua, redirect ke dashboard masing-masing, dan logout.

#### 4.1.1. Install Dependencies

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

#### 4.1.2. Files to Create

| File | Isi |
|------|-----|
| `src/lib/db.ts` | readDB, writeDB, generateId, now, today (lihat section 2.2) |
| `src/lib/auth.ts` | getSession, requireAuth (lihat section 2.3) |
| `src/middleware.ts` | Route protection (lihat section 2.4) |
| `db_store.json` | Seed data (lihat section 5) |
| `src/app/login/page.tsx` | Login form |
| `src/app/api/auth/login/route.ts` | POST login |
| `src/app/api/auth/logout/route.ts` | POST logout |
| `src/app/api/auth/me/route.ts` | GET current user |
| `src/app/api/auth/password/route.ts` | PUT ganti password |

#### 4.1.3. API: POST /api/auth/login

```
Request body:
{
  "email": "admin@ahe.id",
  "password": "admin123"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@ahe.id",
    "role": "admin",
    "nama": "Admin AHE"
  }
}

Side effects:
- Buat session record di db.sessions
- Set cookie "ahe_session" = token (HttpOnly, path="/", maxAge=86400)
- Set cookie "ahe_role" = role (path="/", maxAge=86400)
- Update user.last_login_at
- Reset user.failed_logins = 0

Error 401:
{ "success": false, "error": "Email atau password salah" }

Error 423 (locked):
{ "success": false, "error": "Akun terkunci. Coba lagi dalam X menit" }
```

Validasi:
- email: required, valid email format
- password: required, min 1 char
- Cek user.is_active === true
- Cek user.locked_until — jika masih locked, return 423
- Jika password salah: increment failed_logins, jika >= 5 set locked_until = now + 15 menit

#### 4.1.4. API: POST /api/auth/logout

```
Request: (no body, uses cookie)

Response 200:
{ "success": true, "data": null }

Side effects:
- Hapus session record dari db.sessions
- Clear cookie "ahe_session"
- Clear cookie "ahe_role"
```

#### 4.1.5. API: GET /api/auth/me

```
Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@ahe.id",
    "role": "admin",
    "nama": "Admin AHE",
    "foto_url": null
  }
}

Response 401:
{ "success": false, "error": "Unauthorized" }
```

#### 4.1.6. API: PUT /api/auth/password

```
Request body:
{
  "password_lama": "admin123",
  "password_baru": "newpass456",
  "konfirmasi": "newpass456"
}

Validasi:
- password_lama: required, harus cocok dengan hash di DB
- password_baru: required, min 8 karakter, tidak sama dengan password_lama
- konfirmasi: required, harus === password_baru

Side effects:
- Update user.password_hash dengan bcrypt hash baru
- Hapus semua session lain milik user ini (kecuali session saat ini)
- Set user.password_reset_required = false
```

#### 4.1.7. Login Page UI

File: `src/app/login/page.tsx`

- Form sederhana: email input + password input + tombol "Masuk"
- Error message jika gagal login
- Branding AHE (logo + tagline)
- Setelah berhasil login, redirect berdasarkan role:
  - admin → /admin
  - tutor → /tutor
  - orangtua → /dashboard
- Jika sudah login (cek /api/auth/me), auto-redirect ke dashboard sesuai role

#### 4.1.8. Modifikasi Navbar

File: `src/components/shared/Navbar.tsx`

- Ganti link "Dashboard" → "Login" (href="/login")
- Ganti tombol "Dashboard Orang Tua" di mobile menu → "Login"
- Tombol "Daftar Sekarang" tetap (akan dibikin di Phase 3)

#### 4.1.9. Modifikasi DashboardHeader

File: `src/components/dashboard/DashboardHeader.tsx`

- Tambah prop `userName` dan `userRole` (bukan hardcoded "Orang Tua Bintang")
- Tampilkan nama user dan role sesuai session
- Tombol bell notification (placeholder, fungsi di Phase 8)
- Dropdown profil: "Profil Saya" + "Ganti Password" + "Keluar"

#### 4.1.10. Test Criteria (Phase 1 Selesai Jika)

- [ ] Buka /login → tampil form login
- [ ] Login admin@ahe.id / admin123 → redirect ke /admin
- [ ] Login tutor@ahe.id / tutor123 → redirect ke /tutor
- [ ] Login ortu@ahe.id / ortu123 → redirect ke /dashboard
- [ ] Buka /admin tanpa login → redirect ke /login
- [ ] Login sebagai tutor, buka /admin → redirect ke /login
- [ ] GET /api/auth/me saat login → return user data
- [ ] Klik "Keluar" → redirect ke /login, cookie dihapus
- [ ] Ganti password berhasil, login dengan password baru
- [ ] Salah password 5x → akun terkunci 15 menit

---

### PHASE 2: Core CRUD (Siswa, Orang Tua, Guru, Kelas, Program)

**Goal:** Admin bisa CRUD semua data master. Tabel dengan search, filter, sort, pagination.

#### 4.2.1. Files to Create

**API Routes:**
| File | Methods |
|------|---------|
| `src/app/api/siswa/route.ts` | GET (list), POST (create) |
| `src/app/api/siswa/[id]/route.ts` | GET (detail), PUT (edit) |
| `src/app/api/siswa/[id]/status/route.ts` | PUT (nonaktif/reaktivasi) |
| `src/app/api/orangtua/route.ts` | GET (list) |
| `src/app/api/orangtua/[id]/route.ts` | GET (detail), PUT (edit) |
| `src/app/api/guru/route.ts` | GET (list), POST (create) |
| `src/app/api/guru/[id]/route.ts` | GET (detail), PUT (edit), DELETE |
| `src/app/api/kelas/route.ts` | GET (list), POST (create) |
| `src/app/api/kelas/[id]/route.ts` | GET, PUT |
| `src/app/api/kelas/[id]/siswa/route.ts` | GET (siswa di kelas ini) |

**Pages:**
| File | Deskripsi |
|------|-----------|
| `src/app/admin/layout.tsx` | Admin layout (sidebar + header + auth check) |
| `src/app/admin/page.tsx` | Refactor: hapus hardcoded data, placeholder KPI |
| `src/app/admin/siswa/page.tsx` | Tabel siswa dengan CRUD |
| `src/app/admin/siswa/[id]/page.tsx` | Detail siswa (tabs: profil, progress, riwayat, catatan) |
| `src/app/admin/orangtua/page.tsx` | Tabel orang tua |
| `src/app/admin/guru/page.tsx` | Tabel guru |
| `src/app/admin/kelas/page.tsx` | Tabel kelas + program |

#### 4.2.2. API: GET /api/siswa

```
Query params:
?search=bintang          — cari by nama siswa / nama ortu
&level=level-2           — filter by level
&status=aktif            — filter by status (aktif|nonaktif|lulus)
&kelas_id=uuid           — filter by kelas
&page=1&limit=20         — pagination

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "nama": "Bintang Arya Putra",
        "tanggal_lahir": "2019-05-15",
        "jenis_kelamin": "L",
        "level_saat_ini": "level-2",
        "status": "aktif",
        "foto_url": null,
        "tanggal_masuk": "2024-01-15",
        "orangtua": { "id": "uuid", "nama": "Sari Dewi", "no_wa": "08123456789" },
        "kelas": { "id": "uuid", "nama": "Pagi A - Level 2" },
        "guru": { "id": "uuid", "nama": "Bu Sari Rahayu" },
        "progress_persen": 62,
        "kehadiran_persen": 95
      }
    ],
    "total": 156,
    "page": 1,
    "limit": 20,
    "total_pages": 8
  }
}
```

Computed fields:
- `progress_persen`: rata-rata dari 5 indikator di progress_indikator (bulan terbaru)
- `kehadiran_persen`: (jumlah hadir / total sesi yang ada absensinya) * 100

#### 4.2.3. API: POST /api/siswa

```
Request body:
{
  "nama": "Anak Baru",
  "tempat_lahir": "Balikpapan",
  "tanggal_lahir": "2020-03-10",
  "jenis_kelamin": "L",
  "kelas_id": "uuid-kelas",
  "orangtua": {
    "nama": "Nama Ortu",
    "no_wa": "08123456789",
    "email": "ortu@email.com",
    "alamat": "Jl. Contoh No. 1",
    "hubungan": "ibu"
  }
}

Validasi:
- nama: required, min 2 chars
- tanggal_lahir: required, valid date, usia 3-8 tahun
- jenis_kelamin: required, "L" atau "P"
- kelas_id: required, kelas harus ada & status aktif & belum penuh
- orangtua.nama: required
- orangtua.no_wa: required, format 08xxx (10-13 digit)

Side effects:
1. Cek orangtua.no_wa sudah terdaftar di db.orangtua?
   - Jika ya: gunakan orangtua yang sudah ada
   - Jika tidak: buat record orangtua baru + buat akun user (role=orangtua, generate password)
2. Buat record siswa (level_saat_ini dari program kelas, status=aktif)
3. Buat record riwayat_level (level awal, status=sedang)
4. Buat record progress_indikator (bulan ini, semua 0)
5. Update jumlah siswa di kelas — jika sudah = kapasitas, set kelas.status = "penuh"
6. Catat log_aktivitas

Response 201:
{
  "success": true,
  "data": {
    "siswa": { ... },
    "orangtua": { ... },
    "akun_baru": {
      "email": "08123456789@ahe.id",
      "password": "ahe-Xx7k9m"   ← tampilkan sekali saja
    }
  }
}
```

#### 4.2.4. API: PUT /api/siswa/[id]/status

```
Request body:
{
  "status": "nonaktif",
  "alasan": "Pindah kota"
}

Atau untuk reaktivasi:
{
  "status": "aktif",
  "kelas_id": "uuid-kelas-baru"
}

Side effects (nonaktif):
- Set siswa.status = "nonaktif"
- Set siswa.tanggal_keluar = today
- Set siswa.kelas_id = null
- Update kelas lama (jumlah siswa berkurang)
- Set akun orangtua.is_active = false (jika tidak punya anak aktif lain)

Side effects (reaktivasi):
- Set siswa.status = "aktif"
- Set siswa.kelas_id = kelas baru
- Set siswa.tanggal_keluar = null
- Update kelas baru (jumlah siswa bertambah)
- Set akun orangtua.is_active = true
```

#### 4.2.5. API: POST /api/guru

```
Request body:
{
  "nama": "Bu Sari Rahayu",
  "no_wa": "08198765432",
  "email": "sari@ahe.id",
  "spesialisasi": ["pra-membaca", "level-1", "level-2"],
  "tanggal_gabung": "2024-01-01"
}

Side effects:
1. Buat record guru
2. Buat akun user (role=tutor, email dari input, generate password)
3. Catat log_aktivitas

Response 201 — termasuk info akun (email + password generated)
```

#### 4.2.6. API: DELETE /api/guru/[id]

```
Validasi:
- Guru tidak boleh masih punya kelas aktif
- Jika masih ada kelas: return 400 "Guru masih memegang X kelas aktif"

Side effects:
- Set guru.is_active = false (soft delete)
- Set user account is_active = false
- Catat log_aktivitas
```

#### 4.2.7. API: POST /api/kelas

```
Request body:
{
  "nama": "Pagi A - Level 1",
  "program_id": "uuid-program",
  "guru_id": "uuid-guru",
  "jadwal_hari": ["senin", "rabu", "jumat"],
  "jam_mulai": "08:00",
  "jam_selesai": "09:00",
  "kapasitas": 6
}

Validasi:
- nama: required, unique
- program_id: required, harus ada
- guru_id: required, harus ada & aktif
- jadwal_hari: required, array of valid days
- jam_mulai, jam_selesai: required, valid time format HH:mm
- kapasitas: 1-10, default 6
```

#### 4.2.8. Admin Layout

File: `src/app/admin/layout.tsx`

```typescript
// Server component yang cek auth
// Jika tidak login atau bukan admin → redirect
// Render: <AdminSidebar /> + <DashboardHeader /> + {children}
```

Sidebar menu items (update dari yang sudah ada):
1. Dashboard — /admin
2. Pendaftaran — /admin/pendaftaran (Phase 3)
3. Siswa — /admin/siswa
4. Orang Tua — /admin/orangtua
5. Guru — /admin/guru
6. Program & Kelas — /admin/kelas
7. Monitoring — /admin/monitoring (Phase 4)
8. Kenaikan Level — /admin/kenaikan-level (Phase 5)
9. Laporan — /admin/laporan (Phase 7)
10. Pengaturan — /admin/pengaturan (Phase 8)

#### 4.2.9. Tabel UI Pattern

Semua tabel CRUD admin mengikuti pattern yang sama:

```
┌──────────────────────────────────────────────┐
│ [Judul]                        [+ Tambah] [⬇ Export] │
│ [🔍 Search...] [Filter: Level ▼] [Filter: Status ▼] │
├──────────────────────────────────────────────┤
│ Nama | Kolom2 | Kolom3 | Status | Aksi(⋮)  │
│ ...  | ...    | ...    | badge  | edit/hapus│
├──────────────────────────────────────────────┤
│ Showing 1-20 of 156     [← 1 2 3 ... 8 →]  │
└──────────────────────────────────────────────┘
```

- Search debounced 300ms
- Filter pakai custom popover (bukan native select)
- Pagination server-side (query param page/limit)
- Klik row → buka detail
- Tombol "Tambah" → dialog/modal form
- Tombol "⋮" (MoreVertical) → dropdown: Edit, Nonaktifkan/Hapus

#### 4.2.10. Test Criteria (Phase 2)

- [ ] Admin bisa lihat tabel siswa, search, filter by level/status
- [ ] Admin bisa tambah siswa baru (otomatis buat akun orangtua)
- [ ] Admin bisa edit data siswa
- [ ] Admin bisa nonaktifkan siswa (soft delete)
- [ ] Admin bisa lihat tabel orangtua + detail (list anak)
- [ ] Admin bisa CRUD guru (tambah → otomatis buat akun tutor)
- [ ] Admin tidak bisa hapus guru yang masih pegang kelas
- [ ] Admin bisa CRUD kelas (buat, edit, nonaktifkan)
- [ ] Kelas otomatis status "penuh" saat siswa = kapasitas
- [ ] Pagination benar (20 per page)

---

### PHASE 3: Pendaftaran

**Goal:** Pengunjung bisa daftar via form publik. Admin bisa verifikasi, terima/tolak/tunda. Waiting list untuk kelas penuh.

#### 4.3.1. Files to Create

| File | Deskripsi |
|------|-----------|
| `src/app/daftar/page.tsx` | Form pendaftaran publik |
| `src/app/api/pendaftaran/route.ts` | POST (publik), GET (admin) |
| `src/app/api/pendaftaran/[id]/route.ts` | GET detail |
| `src/app/api/pendaftaran/[id]/terima/route.ts` | PUT |
| `src/app/api/pendaftaran/[id]/tolak/route.ts` | PUT |
| `src/app/api/pendaftaran/[id]/tunda/route.ts` | PUT |
| `src/app/api/pendaftaran/cek/[noRegistrasi]/route.ts` | GET |
| `src/app/api/waiting-list/route.ts` | GET, POST |
| `src/app/api/waiting-list/[id]/route.ts` | DELETE |
| `src/app/api/waiting-list/[id]/assign/route.ts` | PUT |
| `src/app/admin/pendaftaran/page.tsx` | Admin: list + verifikasi |

#### 4.3.2. API: POST /api/pendaftaran (publik)

```
Request body:
{
  "nama_anak": "Zahra",
  "tempat_lahir": "Balikpapan",
  "tanggal_lahir": "2021-06-15",
  "jenis_kelamin": "P",
  "nama_ortu": "Ahmad Fauzi",
  "no_wa_ortu": "08123456789",
  "email_ortu": "",
  "alamat": "Jl. Karang Joang No. 5",
  "hubungan": "ayah",
  "program_diminati": "uuid-program-level1",
  "preferensi_jadwal": "pagi",
  "pengalaman": "Belum pernah belajar membaca",
  "sumber_info": "Instagram"
}

Validasi:
- nama_anak: required, min 2 chars
- tanggal_lahir: required, usia 3-8 tahun
- jenis_kelamin: required, L/P
- nama_ortu: required
- no_wa_ortu: required, format 08/62, 10-15 digit
- hubungan: required, ayah/ibu/wali
- program_diminati: required, harus valid program_id

Side effects:
- Generate no_registrasi: "REG-{YYYY}-{3 digit auto increment}"
- Status = "menunggu"
- Buat notifikasi ke semua admin: "Pendaftaran baru: {nama_anak}"

Response 201:
{
  "success": true,
  "data": {
    "no_registrasi": "REG-2026-001",
    "status": "menunggu",
    "pesan": "Pendaftaran berhasil! Tim AHE akan menghubungi via WhatsApp."
  }
}
```

#### 4.3.3. API: PUT /api/pendaftaran/[id]/terima

```
Request body:
{
  "kelas_id": "uuid-kelas",
  "tanggal_mulai": "2026-10-01"
}

Validasi:
- kelas_id: required, kelas harus aktif & belum penuh
- tanggal_mulai: required, >= today

Side effects (sama seperti POST /api/siswa):
1. Buat record siswa
2. Cek/buat orangtua + akun
3. Masukkan ke kelas
4. Set pendaftaran.status = "diterima"
5. Set pendaftaran.siswa_id = siswa baru
6. Notifikasi ke admin lain

Response: termasuk info akun orangtua baru (email + password)
```

#### 4.3.4. API: GET /api/pendaftaran/cek/[noRegistrasi]

```
Response 200:
{
  "success": true,
  "data": {
    "no_registrasi": "REG-2026-001",
    "nama_anak": "Zahra",
    "status": "menunggu",
    "tanggal_daftar": "2026-09-27",
    "pesan_status": "Pendaftaran sedang direview tim AHE"
  }
}

Tidak menampilkan: data orangtua, alamat, atau info sensitif lainnya.
```

#### 4.3.5. Form Pendaftaran UI

File: `src/app/daftar/page.tsx`

- Multi-step form (3 step): Data Anak → Data Orang Tua → Pilihan Program
- Validasi real-time per step
- Usia auto-calculate dari tanggal lahir
- Setelah submit sukses: tampilkan nomor registrasi + instruksi
- Ada section "Cek Status Pendaftaran" di bawah (input no_registrasi, tombol "Cek")
- Halaman publik, tidak perlu login

#### 4.3.6. Test Criteria (Phase 3)

- [ ] Pengunjung bisa isi form pendaftaran di /daftar
- [ ] Setelah submit, dapat nomor registrasi
- [ ] Bisa cek status dengan nomor registrasi
- [ ] Admin lihat list pendaftaran (filter: menunggu/diterima/ditolak/ditunda)
- [ ] Admin bisa terima pendaftaran → otomatis buat siswa + akun
- [ ] Admin bisa tolak (isi alasan) dan tunda (isi catatan)
- [ ] Jika kelas penuh → admin bisa masukkan ke waiting list
- [ ] Admin bisa assign dari waiting list saat ada slot

---

### PHASE 4: KBM (Kegiatan Belajar Mengajar)

**Goal:** Tutor bisa input sesi belajar harian (absensi, nilai, catatan, mood). Data muncul di dashboard.

#### 4.4.1. Files to Create

| File | Deskripsi |
|------|-----------|
| `src/app/tutor/layout.tsx` | Tutor layout (sidebar + header) |
| `src/app/tutor/page.tsx` | Tutor dashboard overview |
| `src/app/tutor/jadwal/page.tsx` | Jadwal kelas tutor |
| `src/app/tutor/input-sesi/page.tsx` | Form input sesi harian |
| `src/app/tutor/siswa/page.tsx` | Daftar siswa di kelas tutor |
| `src/components/dashboard/TutorSidebar.tsx` | Sidebar tutor |
| `src/app/api/sesi/route.ts` | GET, POST |
| `src/app/api/sesi/[id]/route.ts` | GET, PUT |
| `src/app/api/absensi/siswa/[id]/route.ts` | GET |
| `src/app/api/absensi/kelas/[id]/route.ts` | GET |
| `src/app/api/catatan-guru/route.ts` | POST |
| `src/app/api/catatan-guru/[id]/route.ts` | PUT, DELETE |
| `src/app/api/catatan-guru/siswa/[siswaId]/route.ts` | GET |
| `src/app/api/jadwal/tutor/route.ts` | GET |
| `src/app/api/modul/route.ts` | GET, POST |
| `src/app/api/modul/[id]/route.ts` | PUT, DELETE |
| `src/app/api/modul/siswa/[siswaId]/route.ts` | GET |

#### 4.4.2. API: POST /api/sesi (Input Sesi Belajar)

Ini endpoint paling penting — tutor submit data sesi untuk SEMUA siswa di kelas sekaligus.

```
Request body:
{
  "kelas_id": "uuid",
  "tanggal": "2026-09-27",
  "jam_mulai": "08:00",
  "jam_selesai": "09:00",
  "modul_id": "uuid-modul",
  "materi": "Suku Kata Ba-Bi-Bu-Be-Bo",
  "catatan_umum": "Semua siswa antusias hari ini",
  "siswa_data": [
    {
      "siswa_id": "uuid-1",
      "absensi": "hadir",
      "nilai": 90,
      "mood": 5,
      "langkah_selesai": [1, 2, 3, 4, 5, 6],
      "catatan": "Sangat baik, sudah lancar"
    },
    {
      "siswa_id": "uuid-2",
      "absensi": "hadir",
      "nilai": 75,
      "mood": 3,
      "langkah_selesai": [1, 2, 3, 4],
      "catatan": "Perlu latihan lebih"
    },
    {
      "siswa_id": "uuid-3",
      "absensi": "alpha",
      "nilai": null,
      "mood": null,
      "langkah_selesai": [],
      "catatan": null
    }
  ]
}

Side effects:
1. Buat 1 record sesi_belajar
2. Untuk setiap siswa: buat record absensi
3. Untuk siswa yang hadir: buat record nilai_sesi
4. Jika modul_id: update modul_siswa tracking
5. Cek alert: jika siswa alpha >= 3x bulan ini → buat notifikasi ke admin + orangtua
6. Catat log_aktivitas
```

#### 4.4.3. Tutor Input Sesi UI

File: `src/app/tutor/input-sesi/page.tsx`

```
Flow:
1. Tutor pilih kelas dari dropdown (kelas yang dia ajar)
2. Sistem load daftar siswa di kelas itu
3. Pilih modul dari dropdown (filter by level kelas)
4. Isi materi hari ini (auto-fill dari judul modul jika dipilih)
5. Untuk SETIAP siswa, tampilkan card:
   ┌─────────────────────────────────────┐
   │ [Avatar] Bintang Arya Putra         │
   │ Absensi: ○ Hadir ○ Izin ○ Sakit ○ Alpha │
   │ [Jika hadir:]                       │
   │ Nilai: [slider 0-100]              │
   │ Mood: ⭐⭐⭐⭐⭐ (1-5)           │
   │ Langkah: ☑1 ☑2 ☑3 ☑4 ☑5 ☑6      │
   │ Catatan: [textarea]                 │
   └─────────────────────────────────────┘
6. Tombol "Simpan Sesi" di bawah
7. Jika siswa absen → field nilai/mood/langkah disabled
```

#### 4.4.4. Test Criteria (Phase 4)

- [ ] Tutor login → lihat dashboard tutor
- [ ] Tutor lihat jadwal kelasnya hari ini
- [ ] Tutor input sesi: pilih kelas, isi absensi + nilai per siswa
- [ ] Data sesi tersimpan di DB (sesi_belajar + absensi + nilai_sesi)
- [ ] Tutor bisa lihat daftar siswa di kelasnya
- [ ] Tutor bisa tambah catatan guru untuk siswa tertentu
- [ ] Admin bisa lihat rekap absensi per siswa & per kelas di /admin/monitoring
- [ ] Siswa alpha >= 3x → alert muncul

---

### PHASE 5: Progress & Asesmen

**Goal:** Tutor bisa update progress indikator, kelola kosakata, ajukan asesmen kenaikan level. Admin approve/reject.

#### 4.5.1. Files to Create

| File | Deskripsi |
|------|-----------|
| `src/app/tutor/progress/page.tsx` | Update progress per siswa |
| `src/app/tutor/asesmen/page.tsx` | Ajukan asesmen kenaikan level |
| `src/app/admin/kenaikan-level/page.tsx` | Review & approve/reject asesmen |
| `src/app/api/progress/[siswaId]/route.ts` | GET, PUT |
| `src/app/api/kosakata/[siswaId]/route.ts` | GET, POST |
| `src/app/api/kosakata/[id]/route.ts` | PUT |
| `src/app/api/asesmen/route.ts` | GET, POST |
| `src/app/api/asesmen/[id]/approve/route.ts` | PUT |
| `src/app/api/asesmen/[id]/reject/route.ts` | PUT |
| `src/app/api/pencapaian/route.ts` | POST |
| `src/app/api/pencapaian/siswa/[siswaId]/route.ts` | GET |

#### 4.5.2. API: PUT /api/asesmen/[id]/approve

```
Request body:
{
  "kelas_id": "uuid-kelas-level-baru",
  "tanggal_efektif": "2026-10-01"
}

Side effects:
1. Set asesmen.status = "disetujui"
2. Set asesmen.disetujui_oleh = admin user_id
3. Update siswa.level_saat_ini = asesmen.ke_level
4. Pindah siswa ke kelas baru (update siswa.kelas_id)
5. Update kelas lama (slot berkurang) dan kelas baru (slot bertambah)
6. Update riwayat_level: yang lama → status "selesai", buat baru → status "sedang"
7. Reset progress_indikator (buat record baru bulan ini, semua 0)
8. Buat pencapaian/badge "Lulus Level X"
9. Notifikasi ke orangtua: "Selamat! {nama} naik ke {level baru}"
10. Notifikasi ke tutor pengaju
11. Jika ke_level === "lanjutan" sudah lulus → cek apakah ini level terakhir

Jika siswa lulus Level 4 (Lanjutan):
- Set siswa.status = "lulus"
- Keluarkan dari kelas
- Buat pencapaian "Lulus AHE"
- Akun orangtua tetap aktif (read-only)
```

#### 4.5.3. Test Criteria (Phase 5)

- [ ] Tutor bisa update 5 indikator progress per siswa
- [ ] Progress tersimpan per bulan (histori)
- [ ] Tutor bisa tambah/update kosakata siswa
- [ ] Tutor bisa ajukan asesmen kenaikan level
- [ ] Admin lihat list asesmen pending di /admin/kenaikan-level
- [ ] Admin approve → siswa pindah level & kelas, badge otomatis dibuat
- [ ] Admin reject → siswa tetap di level sekarang
- [ ] Siswa lulus Level 4 → status "lulus"

---

### PHASE 6: Dashboards (Data Real)

**Goal:** Semua dashboard menampilkan data real dari database, bukan hardcoded.

#### 4.6.1. Files to Create/Modify

| File | Deskripsi |
|------|-----------|
| `src/app/api/dashboard/admin/route.ts` | GET statistik admin |
| `src/app/api/dashboard/tutor/route.ts` | GET data tutor |
| `src/app/api/dashboard/orangtua/route.ts` | GET data orangtua |
| `src/app/api/dashboard/orangtua/anak/route.ts` | GET list anak |
| `src/app/api/jadwal/admin/route.ts` | GET kalender admin |
| `src/app/api/jadwal/orangtua/[siswaId]/route.ts` | GET jadwal anak |
| `src/app/api/ringkasan-mingguan/[siswaId]/route.ts` | GET weekly summary |
| `src/app/admin/page.tsx` | REFACTOR: data real dari API |
| `src/app/dashboard/layout.tsx` | Parent layout + auth check |
| `src/app/dashboard/page.tsx` | REFACTOR: data real dari API |

#### 4.6.2. API: GET /api/dashboard/admin

```
Response:
{
  "success": true,
  "data": {
    "kpi": {
      "total_siswa_aktif": 156,
      "total_guru": 8,
      "kehadiran_rata2": 92,
      "progress_rata2": 74,
      "pendaftaran_baru": 3,
      "lulus_bulan_ini": 2
    },
    "kelulusan_per_level": [
      { "level": "Pra Membaca", "jumlah_siswa": 32, "persen_lulus": 15 },
      ...
    ],
    "aktivitas_terkini": [
      { "waktu": "08:15", "judul": "Bintang lulus Level 1", "deskripsi": "...", "tipe": "success" },
      ...
    ],
    "alerts": [
      { "tipe": "pendaftaran", "pesan": "3 pendaftaran menunggu verifikasi" },
      { "tipe": "absensi", "pesan": "2 siswa absen >3x bulan ini" },
      ...
    ]
  }
}
```

Semua data dihitung dari database real:
- total_siswa_aktif: `db.siswa.filter(s => s.status === "aktif").length`
- kehadiran_rata2: hitung dari absensi bulan ini
- dst.

#### 4.6.3. API: GET /api/dashboard/orangtua

```
Query: ?siswa_id=uuid (jika ortu punya >1 anak)

Response — data lengkap untuk 1 anak:
{
  "success": true,
  "data": {
    "anak": { profil siswa lengkap },
    "kpi": { kehadiran, progress, kata_dikuasai, rata2_nilai },
    "progress_indikator": { 5 area kemampuan bulan ini },
    "tren_nilai": [ { date, score, material } ... ],
    "milestone_level": [ { level, status, progress_persen, tanggal } ... ],
    "mood_history": [ { date, score, material } ... ],
    "kosakata": [ { kata, kategori, dikuasai } ... ],
    "pencapaian": [ { nama_badge, ikon, deskripsi, tanggal } ... ],
    "riwayat_sesi": [ { tanggal, materi, nilai, status, catatan } ... ],
    "catatan_guru": [ { tanggal, guru, catatan, tipe } ... ],
    "jadwal_mendatang": [ { tanggal, waktu, materi, guru } ... ]
  }
}
```

#### 4.6.4. Dashboard Orangtua UI Refactor

File: `src/app/dashboard/page.tsx`

Refactor dari 946 baris hardcoded → client component yang fetch `/api/dashboard/orangtua`:

- Jika ortu punya >1 anak: tampilkan dropdown pilih anak di atas
- Hero card: data dari API (bukan hardcoded "Bintang Arya Putra")
- Charts: data real (tren nilai, radar kompetensi)
- Semua data dari API, bukan dari `src/data/index.ts`

#### 4.6.5. Test Criteria (Phase 6)

- [ ] Admin dashboard menampilkan KPI real (jumlah siswa, guru, kehadiran, progress)
- [ ] Aktivitas terkini di admin = log aktivitas real
- [ ] Alert admin: pendaftaran pending, siswa absen banyak
- [ ] Tutor dashboard: jadwal hari ini, siswa yang perlu perhatian
- [ ] Orang tua login → lihat dashboard anaknya (data real)
- [ ] Jika ortu punya 2 anak → bisa switch via dropdown
- [ ] Chart tren nilai menampilkan data real
- [ ] Milestone level menunjukkan progress real
- [ ] Hapus semua import dari `src/data/index.ts` di halaman dashboard

---

### PHASE 7: Laporan & CMS

**Goal:** Generate rapor PDF, sertifikat, laporan statistik. Admin kelola konten landing (galeri, testimoni, FAQ).

#### 4.7.1. Files to Create

| File | Deskripsi |
|------|-----------|
| `src/app/api/laporan/rapor/[siswaId]/[bulan]/route.ts` | GET generate PDF |
| `src/app/api/laporan/sertifikat/[siswaId]/[level]/route.ts` | GET generate PDF |
| `src/app/api/laporan/statistik/route.ts` | GET chart data |
| `src/app/admin/laporan/page.tsx` | Halaman laporan |
| `src/app/api/konten/galeri/route.ts` | GET, POST |
| `src/app/api/konten/galeri/[id]/route.ts` | DELETE |
| `src/app/api/konten/testimoni/route.ts` | GET, POST |
| `src/app/api/konten/testimoni/[id]/route.ts` | PUT, DELETE |
| `src/app/api/konten/faq/route.ts` | GET, POST |
| `src/app/api/konten/faq/[id]/route.ts` | PUT, DELETE |
| `src/app/api/konten/pengaturan/route.ts` | GET, PUT |
| `src/app/api/video/route.ts` | GET, POST |
| `src/app/api/video/[id]/route.ts` | PUT, DELETE |
| `src/app/api/video/siswa/[siswaId]/route.ts` | GET |
| `src/app/admin/pengaturan/page.tsx` | Setting umum |
| `src/app/admin/pengaturan/galeri/page.tsx` | CMS galeri |
| `src/app/admin/pengaturan/testimoni/page.tsx` | CMS testimoni |
| `src/app/admin/pengaturan/faq/page.tsx` | CMS FAQ |

#### 4.7.2. PDF Generation

Untuk rapor & sertifikat, gunakan approach simple: generate HTML → return sebagai response `text/html` yang user bisa print/save as PDF via browser.

```typescript
// src/app/api/laporan/rapor/[siswaId]/[bulan]/route.ts
export async function GET(request, { params }) {
  // Kumpulkan data siswa, sesi, absensi, progress, catatan bulan itu
  // Return HTML response yang styled untuk print
  const html = generateRaporHTML(data);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
```

Rapor berisi: identitas siswa, daftar sesi bulan itu, nilai per sesi, kehadiran, progress 5 indikator, catatan guru, kosakata baru, mood rata-rata.

#### 4.7.3. Landing Page Integration

Refactor landing page sections agar fetch data dari API:
- Section Program → GET /api/konten/pengaturan (atau tetap dari constants, program jarang berubah)
- Section Galeri → GET /api/konten/galeri
- Section Testimoni → GET /api/konten/testimoni
- Section FAQ → GET /api/konten/faq
- Section Kontak → GET /api/konten/pengaturan

#### 4.7.4. Test Criteria (Phase 7)

- [ ] Admin bisa generate rapor bulanan per siswa (HTML yang bisa di-print)
- [ ] Admin bisa generate sertifikat kelulusan level
- [ ] Admin bisa lihat statistik (chart: siswa per level, tren kehadiran)
- [ ] Admin bisa CRUD galeri (upload foto, edit caption, hapus)
- [ ] Admin bisa CRUD testimoni
- [ ] Admin bisa CRUD FAQ
- [ ] Admin bisa edit info kontak/tentang di pengaturan
- [ ] Landing page menampilkan data dari DB (bukan hardcoded)
- [ ] Tutor bisa share video YouTube ke kelas/siswa
- [ ] Video muncul di dashboard orangtua

---

### PHASE 8: Advanced Features

**Goal:** Notifikasi in-app, kelola akun, guru pengganti, pindah kelas, periode akademik, arsip data, log aktivitas.

#### 4.8.1. Files to Create

| File | Deskripsi |
|------|-----------|
| `src/app/api/notifikasi/route.ts` | GET list |
| `src/app/api/notifikasi/unread-count/route.ts` | GET count |
| `src/app/api/notifikasi/[id]/read/route.ts` | PUT |
| `src/app/api/notifikasi/read-all/route.ts` | PUT |
| `src/app/api/akun/route.ts` | GET, POST |
| `src/app/api/akun/[id]/route.ts` | PUT |
| `src/app/api/akun/[id]/reset-password/route.ts` | PUT |
| `src/app/api/akun/[id]/toggle-active/route.ts` | PUT |
| `src/app/api/akun/[id]/unlock/route.ts` | PUT |
| `src/app/api/profil/route.ts` | GET, PUT |
| `src/app/api/profil/foto/route.ts` | POST |
| `src/app/api/sesi/[id]/pengganti/route.ts` | PUT |
| `src/app/api/sesi/[id]/batalkan/route.ts` | PUT |
| `src/app/api/siswa/[id]/pindah-kelas/route.ts` | POST |
| `src/app/api/siswa/[id]/riwayat-kelas/route.ts` | GET |
| `src/app/api/guru/tersedia/route.ts` | GET |
| `src/app/api/periode/route.ts` | GET, POST |
| `src/app/api/periode/[id]/route.ts` | PUT |
| `src/app/api/periode/[id]/tutup/route.ts` | PUT |
| `src/app/api/arsip/route.ts` | GET |
| `src/app/api/arsip/siap-arsip/route.ts` | GET |
| `src/app/api/arsip/proses/route.ts` | POST |
| `src/app/api/arsip/[id]/restore/route.ts` | POST |
| `src/app/api/arsip/[id]/route.ts` | DELETE |
| `src/app/api/arsip/export/route.ts` | GET |
| `src/app/api/log-aktivitas/route.ts` | GET |
| `src/app/api/upload/foto-siswa/[siswaId]/route.ts` | POST |
| `src/app/api/upload/foto-galeri/route.ts` | POST |
| `src/app/admin/pengaturan/akun/page.tsx` | Kelola akun |
| `src/app/admin/pengaturan/arsip/page.tsx` | Arsip data |

#### 4.8.2. Notifikasi — Bell Icon

Update `DashboardHeader.tsx`:
1. Fetch GET /api/notifikasi/unread-count on mount
2. Tampilkan badge angka di bell icon
3. Klik bell → dropdown notifikasi terbaru (5 item)
4. Klik "Lihat Semua" → halaman penuh
5. Klik notifikasi → tandai read + navigate ke link terkait

#### 4.8.3. Upload Foto

```typescript
// src/app/api/upload/foto-siswa/[siswaId]/route.ts
export async function POST(request, { params }) {
  const formData = await request.formData();
  const file = formData.get("foto") as File;

  // Validasi: JPG/PNG, max 2MB
  // Simpan ke public/uploads/siswa/{siswaId}.{ext}
  // Update siswa.foto_url di DB

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${params.siswaId}.${ext}`;
  const path = join(process.cwd(), "public/uploads/siswa", filename);
  writeFileSync(path, buffer);

  // Update DB
  db.siswa.find(s => s.id === params.siswaId).foto_url = `/uploads/siswa/${filename}`;
  writeDB(db);
}
```

#### 4.8.4. Pindah Kelas

```
POST /api/siswa/[id]/pindah-kelas

Request body:
{
  "kelas_id_baru": "uuid",
  "alasan": "ganti-jadwal",
  "catatan": "Orang tua minta pindah ke jadwal siang"
}

Validasi:
- Kelas baru harus level SAMA dengan kelas sekarang
- Kelas baru harus belum penuh

Side effects:
1. Catat riwayat_pindah_kelas
2. Update siswa.kelas_id
3. Update slot kelas lama (+1) dan kelas baru (-1)
4. Cek waiting list kelas lama
5. Notifikasi ke guru kelas baru
```

#### 4.8.5. Test Criteria (Phase 8)

- [ ] Bell icon menampilkan jumlah notifikasi unread
- [ ] Klik notifikasi → tandai read
- [ ] Admin bisa kelola akun (list, buat, reset password, lock/unlock)
- [ ] Admin bisa assign guru pengganti ke sesi
- [ ] Admin bisa batalkan sesi
- [ ] Admin bisa pindahkan siswa antar kelas (level sama)
- [ ] Riwayat perpindahan kelas tercatat
- [ ] Admin bisa buat/tutup periode akademik
- [ ] Admin bisa arsipkan data lama, restore dari arsip
- [ ] Upload foto siswa & galeri berfungsi
- [ ] Log aktivitas tercatat dan bisa dilihat admin

---

## 5. Seed Data (db_store.json awal)

File: `db_store.json` di root project.

Buat saat Phase 1. Isi minimal:

```json
{
  "users": [
    {
      "id": "usr-admin-001",
      "email": "admin@ahe.id",
      "password_hash": "$2a$10$...",
      "role": "admin",
      "nama": "Admin AHE",
      "is_active": true,
      "foto_url": null,
      "failed_logins": 0,
      "locked_until": null,
      "last_login_at": null,
      "password_reset_required": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "usr-tutor-001",
      "email": "sari@ahe.id",
      "password_hash": "$2a$10$...",
      "role": "tutor",
      "nama": "Bu Sari Rahayu",
      "is_active": true,
      "foto_url": null,
      "failed_logins": 0,
      "locked_until": null,
      "last_login_at": null,
      "password_reset_required": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "usr-ortu-001",
      "email": "sari.dewi@ahe.id",
      "password_hash": "$2a$10$...",
      "role": "orangtua",
      "nama": "Sari Dewi",
      "is_active": true,
      "foto_url": null,
      "failed_logins": 0,
      "locked_until": null,
      "last_login_at": null,
      "password_reset_required": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "sessions": [],
  "program": [
    {
      "id": "prg-001",
      "kode": "pra-membaca",
      "nama": "Pra Membaca",
      "deskripsi": "Fondasi awal sebelum membaca. Anak dikenalkan huruf, angka, dan motorik halus.",
      "target_capaian": ["Mengenal 26 huruf alfabet", "Koordinasi tangan dan mata", "Motorik halus dasar", "Persiapan menulis"],
      "durasi_estimasi": "1-2 bulan",
      "rentang_usia": "3-4 tahun",
      "urutan": 0,
      "icon": "🌱",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "prg-002",
      "kode": "level-1",
      "nama": "Membaca Level 1",
      "deskripsi": "Pengenalan suku kata. Belajar menggabungkan huruf menjadi suku kata dengan metode fonik.",
      "target_capaian": ["Membaca suku kata KV", "Mengenal bunyi huruf", "Menggabungkan huruf vokal", "Membaca 50+ suku kata"],
      "durasi_estimasi": "2-3 bulan",
      "rentang_usia": "4-5 tahun",
      "urutan": 1,
      "icon": "📚",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "prg-003",
      "kode": "level-2",
      "nama": "Membaca Level 2",
      "deskripsi": "Membaca kata utuh. Merangkai suku kata menjadi kata sederhana yang bermakna.",
      "target_capaian": ["Membaca kata 2 suku kata", "Mengenal 100+ kosakata", "Memahami arti kata", "Membaca dengan lancar"],
      "durasi_estimasi": "2-3 bulan",
      "rentang_usia": "4-6 tahun",
      "urutan": 2,
      "icon": "🔤",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "prg-004",
      "kode": "level-3",
      "nama": "Membaca Level 3",
      "deskripsi": "Membaca kalimat sederhana. Mampu membaca dan memahami kalimat pendek dengan intonasi tepat.",
      "target_capaian": ["Membaca kalimat 3-5 kata", "Memahami makna kalimat", "Membaca dengan intonasi", "Menjawab pertanyaan"],
      "durasi_estimasi": "2-3 bulan",
      "rentang_usia": "5-6 tahun",
      "urutan": 3,
      "icon": "📖",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "prg-005",
      "kode": "lanjutan",
      "nama": "Membaca Lanjutan",
      "deskripsi": "Membaca cerita lengkap. Dapat membaca paragraf dan cerita pendek dengan pemahaman yang baik.",
      "target_capaian": ["Membaca cerita pendek", "Memahami isi bacaan", "Menceritakan kembali", "Membaca mandiri"],
      "durasi_estimasi": "3-4 bulan",
      "rentang_usia": "5-7 tahun",
      "urutan": 4,
      "icon": "🦋",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "guru": [
    {
      "id": "guru-001",
      "user_id": "usr-tutor-001",
      "nama": "Bu Sari Rahayu",
      "no_wa": "08198765432",
      "email": "sari@ahe.id",
      "spesialisasi": ["pra-membaca", "level-1", "level-2"],
      "tanggal_gabung": "2024-01-01",
      "foto_url": null,
      "is_active": true,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "orangtua": [
    {
      "id": "ortu-001",
      "user_id": "usr-ortu-001",
      "nama": "Sari Dewi",
      "no_wa": "08123456789",
      "email": "sari.dewi@email.com",
      "alamat": "Karang Joang, Balikpapan Utara",
      "hubungan": "ibu",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "kelas": [
    {
      "id": "kls-001",
      "nama": "Pagi A - Level 2",
      "program_id": "prg-003",
      "guru_id": "guru-001",
      "jadwal_hari": ["senin", "rabu", "jumat"],
      "jam_mulai": "08:00",
      "jam_selesai": "09:00",
      "kapasitas": 6,
      "status": "aktif",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "siswa": [
    {
      "id": "siswa-001",
      "orangtua_id": "ortu-001",
      "nama": "Bintang Arya Putra",
      "tempat_lahir": "Balikpapan",
      "tanggal_lahir": "2021-05-15",
      "jenis_kelamin": "L",
      "level_saat_ini": "level-2",
      "kelas_id": "kls-001",
      "foto_url": null,
      "tanggal_masuk": "2026-01-15",
      "tanggal_keluar": null,
      "status": "aktif",
      "alasan_keluar": null,
      "created_at": "2026-01-15T00:00:00.000Z",
      "updated_at": "2026-01-15T00:00:00.000Z"
    }
  ],
  "sesi_belajar": [],
  "absensi": [],
  "nilai_sesi": [],
  "catatan_guru": [],
  "progress_indikator": [],
  "kosakata": [],
  "riwayat_level": [
    {
      "id": "rl-001",
      "siswa_id": "siswa-001",
      "level": "level-2",
      "tanggal_mulai": "2026-04-01",
      "tanggal_selesai": null,
      "status": "sedang",
      "progress_persen": 62,
      "created_at": "2026-04-01T00:00:00.000Z"
    }
  ],
  "asesmen": [],
  "pencapaian": [],
  "pendaftaran": [],
  "galeri": [],
  "testimoni": [],
  "faq": [],
  "pengaturan": [
    { "key": "site_name", "value": "AHE Karangjoang", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "site_description", "value": "Lembaga Belajar Membaca Anak Usia Dini", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "contact_phone", "value": "+62 812-3456-7890", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "contact_email", "value": "info@ahe-karangjoang.id", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "contact_address", "value": "Karang Joang, Balikpapan Utara, Kota Balikpapan, Kalimantan Timur", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "contact_whatsapp", "value": "6281234567890", "updated_at": "2026-01-01T00:00:00.000Z" },
    { "key": "contact_hours", "value": "Senin – Sabtu, 07:00 – 16:00 WITA", "updated_at": "2026-01-01T00:00:00.000Z" }
  ],
  "log_aktivitas": [],
  "modul": [],
  "modul_siswa": [],
  "materi_pendukung": [],
  "waiting_list": [],
  "riwayat_pindah_kelas": [],
  "notifikasi": [],
  "video_pembelajaran": [],
  "video_siswa": [],
  "periode_akademik": []
}
```

**PENTING:** password_hash harus di-generate saat seed. Buat script `scripts/seed.ts`:

```typescript
import bcrypt from "bcryptjs";
// Hash passwords:
// admin123 → bcrypt hash
// tutor123 → bcrypt hash
// ortu123 → bcrypt hash
// Tulis ke db_store.json
```

Default login credentials:
- Admin: admin@ahe.id / admin123
- Tutor: sari@ahe.id / tutor123
- Orang Tua: sari.dewi@ahe.id / ortu123

---

## 6. Ringkasan Urutan Implementasi

```
Phase 1: Foundation ──────────── Bisa login/logout
    │
Phase 2: Core CRUD ───────────── Bisa kelola data master
    │
Phase 3: Pendaftaran ─────────── Pengunjung bisa daftar online
    │
Phase 4: KBM ─────────────────── Tutor bisa input sesi harian
    │
Phase 5: Progress & Asesmen ──── Tracking progress, kenaikan level
    │
Phase 6: Dashboards ──────────── Semua dashboard pakai data real
    │
Phase 7: Laporan & CMS ──────── PDF rapor, CMS landing
    │
Phase 8: Advanced ────────────── Notifikasi, arsip, fitur lanjutan
```

Setiap phase berdiri sendiri — setelah selesai 1 phase, test, lalu lanjut ke phase berikutnya. JANGAN loncat phase.

---

> Dokumen ini adalah satu-satunya acuan implementasi.
> Total: 120 API endpoints, 33 tabel database, 8 phase.
> Scope: administrasi + monitoring — TANPA fitur pembayaran/keuangan.
