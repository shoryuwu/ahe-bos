export const SITE_NAME = "AHE Karangjoang";
export const SITE_TAGLINE = "Lembaga Belajar Membaca Anak Usia Dini";
export const SITE_DESCRIPTION = "AHE (Anak Hebat) Karangjoang adalah lembaga belajar membaca untuk anak usia Pra-TK dan TK dengan metode menyenangkan dan terbukti efektif.";
export const SITE_URL = "https://ahe-karangjoang.id";

export const CONTACT_INFO = {
  address: "Karang Joang, Balikpapan Utara, Kota Balikpapan, Kalimantan Timur",
  phone: "+62 812-3456-7890",
  email: "info@ahe-karangjoang.id",
  whatsapp: "6281234567890",
  hours: "Senin – Sabtu, 07:00 – 16:00 WITA",
  instagram: "@ahe.karangjoang",
  facebook: "AHE Karangjoang",
};

export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/#tentang" },
  { label: "Program", href: "/#program" },
  { label: "Metode", href: "/#metode" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Testimoni", href: "/#testimoni" },
  { label: "Kontak", href: "/#kontak" },
];

export const LEVEL_COLORS: Record<string, string> = {
  "Pra Membaca": "bg-violet-100 text-violet-700",
  "Level 1": "bg-fuchsia-100 text-fuchsia-700",
  "Level 2": "bg-purple-100 text-purple-700",
  "Level 3": "bg-orange-100 text-orange-700",
  "Lanjutan": "bg-rose-100 text-rose-700",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-violet-100 text-violet-700",
  inactive: "bg-gray-100 text-gray-600",
  graduated: "bg-fuchsia-100 text-fuchsia-700",
  selesai: "bg-violet-100 text-violet-700",
  berlanjut: "bg-yellow-100 text-yellow-700",
  absen: "bg-red-100 text-red-700",
  upcoming: "bg-purple-100 text-purple-700",
  completed: "bg-violet-100 text-violet-700",
  cancelled: "bg-red-100 text-red-700",
};

export const NOTE_ICONS: Record<string, string> = {
  progress: "📊",
  suggestion: "💡",
  achievement: "🏆",
};

export const GALLERY_CATEGORIES = ["Semua", "Belajar", "Prestasi", "Aktivitas", "Outing", "Event"];
