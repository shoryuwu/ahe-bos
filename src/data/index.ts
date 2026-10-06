import type {
  Program,
  Testimonial,
  FAQItem,
  Student,
  ProgressSkill,
  LearningHistory,
  TeacherNote,
  Schedule,
  GalleryItem,
  Stat,
  MethodStep,
  DashboardCard,
} from "@/types";

// ─── Stats ───────────────────────────────────────────────────────────────────
export const stats: Stat[] = [
  { label: "Siswa Aktif", value: "150+", icon: "👦", description: "Anak belajar bersama kami" },
  { label: "Tahun Pengalaman", value: "10+", icon: "🏆", description: "Mendidik generasi membaca" },
  { label: "Tingkat Keberhasilan", value: "95%", icon: "✨", description: "Siswa berhasil membaca" },
  { label: "Tenaga Pengajar", value: "8", icon: "👩‍🏫", description: "Guru berpengalaman" },
];

// ─── Programs ────────────────────────────────────────────────────────────────
export const programs: Program[] = [
  {
    id: "pra-membaca",
    title: "Pra Membaca",
    level: "Level 0",
    description: "Fondasi awal sebelum membaca. Anak dikenalkan huruf, angka, dan motorik halus melalui aktivitas menyenangkan.",
    targets: ["Mengenal 26 huruf alfabet", "Koordinasi tangan dan mata", "Motorik halus dasar", "Persiapan menulis"],
    duration: "1–2 bulan",
    ageRange: "3–4 tahun",
    icon: "🌱",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    id: "level-1",
    title: "Membaca Level 1",
    level: "Level 1",
    description: "Tahap pengenalan suku kata. Anak belajar menggabungkan huruf menjadi suku kata dengan metode fonik.",
    targets: ["Membaca suku kata KV", "Mengenal bunyi huruf", "Menggabungkan huruf vokal", "Membaca 50+ suku kata"],
    duration: "2–3 bulan",
    ageRange: "4–5 tahun",
    icon: "📚",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
  },
  {
    id: "level-2",
    title: "Membaca Level 2",
    level: "Level 2",
    description: "Membaca kata utuh. Siswa mulai merangkai suku kata menjadi kata sederhana yang bermakna.",
    targets: ["Membaca kata 2 suku kata", "Mengenal 100+ kosakata", "Memahami arti kata", "Membaca dengan lancar"],
    duration: "2–3 bulan",
    ageRange: "4–6 tahun",
    icon: "🔤",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    id: "level-3",
    title: "Membaca Level 3",
    level: "Level 3",
    description: "Membaca kalimat sederhana. Anak mampu membaca dan memahami kalimat pendek dengan intonasi tepat.",
    targets: ["Membaca kalimat 3–5 kata", "Memahami makna kalimat", "Membaca dengan intonasi", "Menjawab pertanyaan"],
    duration: "2–3 bulan",
    ageRange: "5–6 tahun",
    icon: "📖",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "lanjutan",
    title: "Membaca Lanjutan",
    level: "Level 4",
    description: "Membaca cerita lengkap. Siswa dapat membaca paragraf dan cerita pendek dengan pemahaman yang baik.",
    targets: ["Membaca cerita pendek", "Memahami isi bacaan", "Menceritakan kembali", "Membaca mandiri"],
    duration: "3–4 bulan",
    ageRange: "5–7 tahun",
    icon: "🦋",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

// ─── Method Steps ─────────────────────────────────────────────────────────────
export const methodSteps: MethodStep[] = [
  {
    step: 1,
    title: "Senam Otak",
    description: "Aktivitas fisik ringan untuk merangsang konsentrasi dan kesiapan otak, seperti gerakan menyilang atau menggambar angka delapan tidur.",
    icon: "🧠",
    color: "bg-indigo-500",
  },
  {
    step: 2,
    title: "Remidi (Evaluasi / Mengulang)",
    description: "Mengevaluasi atau mengulang materi pelajaran yang diberikan pada pertemuan sebelumnya untuk memastikan pemahaman anak benar-benar kuat.",
    icon: "🔄",
    color: "bg-amber-500",
  },
  {
    step: 3,
    title: "Membaca Modul",
    description: "Sesi utama di mana anak membaca modul atau buku pelajaran AHE yang disesuaikan dengan tingkat kemampuan mereka.",
    icon: "📚",
    color: "bg-violet-500",
  },
  {
    step: 4,
    title: "Pengayaan",
    description: "Memberikan latihan tambahan atau materi baru untuk memperluas kosakata dan kemampuan membaca anak.",
    icon: "✨",
    color: "bg-fuchsia-500",
  },
  {
    step: 5,
    title: "Menulis",
    description: "Melatih motorik halus dan pengenalan kata dengan cara menuliskan kembali huruf atau kata yang telah dipelajari.",
    icon: "📝",
    color: "bg-sky-500",
  },
  {
    step: 6,
    title: "Permainan",
    description: "Ditutup dengan games edukatif interaktif agar proses belajar tetap menyenangkan, menghilangkan kebosanan, dan memotivasi anak untuk terus belajar.",
    icon: "🎮",
    color: "bg-emerald-500",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: "1",
    parentName: "Ibu Sari Dewi",
    childName: "Bintang (5 tahun)",
    childAge: "5 tahun",
    review: "Luar biasa! Dalam 3 bulan, Bintang sudah bisa membaca buku cerita sendiri. Metode AHE sangat menyenangkan, anak tidak merasa terpaksa belajar sama sekali.",
    rating: 5,
    avatar: "SD",
    program: "Membaca Level 2",
  },
  {
    id: "2",
    parentName: "Bapak Ahmad Fauzi",
    childName: "Zahra (4 tahun)",
    childAge: "4 tahun",
    review: "Zahra dulunya susah sekali diajak belajar, tapi sejak ikut AHE dia jadi semangat. Guru-gurunya sabar dan kreatif. Sangat recommended untuk orang tua!",
    rating: 5,
    avatar: "AF",
    program: "Membaca Level 1",
  },
  {
    id: "3",
    parentName: "Ibu Rina Pratiwi",
    childName: "Arjuna (6 tahun)",
    childAge: "6 tahun",
    review: "Arjuna masuk AHE belum bisa baca sama sekali. Sekarang sudah Level 3 dan bisa baca kalimat panjang! Progress reportnya juga membantu saya pantau perkembangan.",
    rating: 5,
    avatar: "RP",
    program: "Membaca Level 3",
  },
  {
    id: "4",
    parentName: "Ibu Marlina",
    childName: "Dika (5 tahun)",
    childAge: "5 tahun",
    review: "Biaya sangat terjangkau tapi kualitasnya tidak kalah dengan lembaga besar. Dika senang karena belajarnya sambil bermain. Terima kasih AHE Karangjoang!",
    rating: 5,
    avatar: "ML",
    program: "Membaca Level 1",
  },
  {
    id: "5",
    parentName: "Bapak Hendra Wijaya",
    childName: "Kirana (4 tahun)",
    childAge: "4 tahun",
    review: "Kirana baru masuk Pra Membaca tapi sudah hafal semua huruf hanya dalam 6 minggu. Metode visual dan lagu-lagunya sangat efektif untuk anak usia dini.",
    rating: 5,
    avatar: "HW",
    program: "Pra Membaca",
  },
  {
    id: "6",
    parentName: "Ibu Dewi Susanti",
    childName: "Raffa (6 tahun)",
    childAge: "6 tahun",
    review: "Raffa sekarang sudah bisa membaca cerita sendiri sebelum tidur! Ini mimpi saya sebagai orang tua. AHE benar-benar mengubah kehidupan kami.",
    rating: 5,
    avatar: "DS",
    program: "Membaca Lanjutan",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Berapa usia minimal untuk mendaftar di AHE Karangjoang?",
    answer: "Usia minimal adalah 3 tahun untuk program Pra Membaca. Untuk program Level 1 ke atas, usia minimal 4 tahun. Kami menyesuaikan kurikulum dengan tahap perkembangan setiap anak.",
  },
  {
    id: "2",
    question: "Berapa lama program belajar di AHE?",
    answer: "Setiap level membutuhkan waktu 1–4 bulan tergantung kemampuan anak. Rata-rata anak dapat menyelesaikan seluruh program (dari Pra Membaca hingga Lanjutan) dalam 12–18 bulan. Namun kami tidak terburu-buru — setiap anak punya kecepatan belajarnya sendiri.",
  },
  {
    id: "3",
    question: "Berapa biaya program di AHE Karangjoang?",
    answer: "Biaya bervariasi per program dan sangat terjangkau. Silakan hubungi kami via WhatsApp untuk informasi biaya terkini. Kami juga menyediakan opsi cicilan dan subsidi untuk keluarga yang membutuhkan.",
  },
  {
    id: "4",
    question: "Apakah tersedia kelas trial/percobaan?",
    answer: "Ya! Kami menyediakan 1 kelas trial GRATIS untuk setiap pendaftar baru. Kelas trial berlangsung 60 menit dan mencakup sesi pengenalan metode AHE, asesmen awal kemampuan anak, serta konsultasi dengan guru.",
  },
  {
    id: "5",
    question: "Berapa banyak siswa dalam satu kelas?",
    answer: "Maksimal 6 siswa per kelas untuk memastikan setiap anak mendapat perhatian penuh dari guru. Rasio guru-siswa yang kecil adalah kunci keberhasilan metode AHE.",
  },
  {
    id: "6",
    question: "Apakah ada laporan perkembangan untuk orang tua?",
    answer: "Ya! Kami menyediakan laporan perkembangan mingguan via WhatsApp, laporan bulanan tertulis, dan akses dashboard digital untuk memantau progress anak secara real-time.",
  },
];

// ─── Gallery ─────────────────────────────────────────────────────────────────
export const galleryItems: GalleryItem[] = [
  { id: "1", imageUrl: "/gallery/1.jpg", caption: "Sesi belajar suku kata yang menyenangkan", category: "Belajar", date: "2024-01-15" },
  { id: "2", imageUrl: "/gallery/2.jpg", caption: "Aktivitas membaca bersama", category: "Belajar", date: "2024-01-20" },
  { id: "3", imageUrl: "/gallery/3.jpg", caption: "Penyerahan sertifikat kelulusan", category: "Prestasi", date: "2024-02-01" },
  { id: "4", imageUrl: "/gallery/4.jpg", caption: "Permainan kartu huruf", category: "Belajar", date: "2024-02-10" },
  { id: "5", imageUrl: "/gallery/5.jpg", caption: "Kelas motorik halus", category: "Aktivitas", date: "2024-02-15" },
  { id: "6", imageUrl: "/gallery/6.jpg", caption: "Outing belajar di perpustakaan", category: "Outing", date: "2024-03-01" },
  { id: "7", imageUrl: "/gallery/7.jpg", caption: "Perayaan hari buku nasional", category: "Event", date: "2024-03-10" },
  { id: "8", imageUrl: "/gallery/8.jpg", caption: "Demo membaca untuk orang tua", category: "Event", date: "2024-03-20" },
];

// ─── Dashboard Parent ─────────────────────────────────────────────────────────
export const childInfo = {
  name: "Bintang Arya Putra",
  age: 5,
  level: "Membaca Level 2",
  class: "Kelas Pagi (08:00–09:00)",
  teacher: "Bu Sari Rahayu",
  enrollDate: "2024-01-15",
  avatar: "BA",
};

export const progressSkills: ProgressSkill[] = [
  { skill: "Mengenal Huruf", percentage: 100, color: "bg-violet-500" },
  { skill: "Membaca Suku Kata", percentage: 80, color: "bg-fuchsia-500" },
  { skill: "Membaca Kata", percentage: 70, color: "bg-purple-600" },
  { skill: "Membaca Kalimat", percentage: 40, color: "bg-orange-500" },
  { skill: "Membaca Cerita", percentage: 20, color: "bg-rose-500" },
];

export const learningHistory: LearningHistory[] = [
  { id: "1", date: "2024-06-10", material: "Suku Kata Ba, Bi, Bu, Be, Bo", status: "selesai", score: 90, notes: "Sangat baik, sudah lancar" },
  { id: "2", date: "2024-06-08", material: "Penggabungan Suku Kata Jadi Kata", status: "selesai", score: 85, notes: "Perlu latihan lebih" },
  { id: "3", date: "2024-06-06", material: "Latihan Menulis Huruf Kapital", status: "selesai", score: 88 },
  { id: "4", date: "2024-06-03", material: "Membaca Kata 2 Suku Kata", status: "berlanjut", notes: "Lanjut sesi berikutnya" },
  { id: "5", date: "2024-06-01", material: "Ulasan Huruf Vokal A-I-U-E-O", status: "selesai", score: 95 },
  { id: "6", date: "2024-05-30", material: "Pengenalan Huruf Konsonan", status: "absen" },
  { id: "7", date: "2024-05-28", material: "Suku Kata Ca, Ci, Cu, Ce, Co", status: "selesai", score: 82 },
  { id: "8", date: "2024-05-25", material: "Aktivitas Motorik Halus", status: "selesai", score: 92 },
];

export const teacherNotes: TeacherNote[] = [
  {
    id: "1",
    date: "2024-06-10",
    teacher: "Bu Sari",
    note: "Bintang menunjukkan perkembangan luar biasa minggu ini! Sudah bisa membaca 15 kata baru dengan lancar. Terus semangat!",
    type: "achievement",
  },
  {
    id: "2",
    date: "2024-06-05",
    teacher: "Bu Sari",
    note: "Mohon dibantu berlatih membaca suku kata 'nga, ngi, ngu' di rumah. Latih 10–15 menit setiap hari sebelum tidur.",
    type: "suggestion",
  },
  {
    id: "3",
    date: "2024-06-01",
    teacher: "Bu Sari",
    note: "Bintang sudah berhasil menyelesaikan modul Huruf A-Z dengan nilai rata-rata 90. Siap naik ke tahap suku kata!",
    type: "progress",
  },
];

export const schedules: Schedule[] = [
  { id: "1", date: "2024-06-14", time: "08:00–09:00", material: "Membaca Kata Baru (Set 3)", teacher: "Bu Sari", status: "upcoming" },
  { id: "2", date: "2024-06-12", time: "08:00–09:00", material: "Latihan Membaca Kalimat Pendek", teacher: "Bu Sari", status: "completed" },
  { id: "3", date: "2024-06-10", time: "08:00–09:00", material: "Suku Kata Ba-Bi-Bu-Be-Bo", teacher: "Bu Sari", status: "completed" },
  { id: "4", date: "2024-06-17", time: "08:00–09:00", material: "Evaluasi Tengah Level", teacher: "Bu Sari", status: "upcoming" },
  { id: "5", date: "2024-06-19", time: "08:00–09:00", material: "Membaca Cerita Mini", teacher: "Bu Sari", status: "upcoming" },
];

// ─── Dashboard Admin ──────────────────────────────────────────────────────────
export const adminStats: DashboardCard[] = [
  { title: "Total Siswa", value: "156", icon: "👦", change: "+12 bulan ini", changeType: "up", color: "bg-violet-500" },
  { title: "Total Guru", value: "8", icon: "👩‍🏫", change: "Stabil", changeType: "neutral", color: "bg-fuchsia-500" },
  { title: "Kehadiran Rata-rata", value: "92%", icon: "📅", change: "+3% dari bulan lalu", changeType: "up", color: "bg-purple-600" },
  { title: "Progress Rata-rata", value: "74%", icon: "📈", change: "+5% dari bulan lalu", changeType: "up", color: "bg-orange-500" },
];

export const students: Student[] = [
  { id: "1", name: "Bintang Arya Putra", age: 5, level: "Level 2", status: "active", parentName: "Sari Dewi", enrollDate: "2024-01-15", progress: 70, attendance: 95 },
  { id: "2", name: "Zahra Nur Aisyah", age: 4, level: "Level 1", status: "active", parentName: "Ahmad Fauzi", enrollDate: "2024-02-01", progress: 55, attendance: 88 },
  { id: "3", name: "Arjuna Prasetya", age: 6, level: "Level 3", status: "active", parentName: "Rina Pratiwi", enrollDate: "2023-10-01", progress: 85, attendance: 92 },
  { id: "4", name: "Dika Maulana", age: 5, level: "Level 1", status: "active", parentName: "Marlina", enrollDate: "2024-03-01", progress: 45, attendance: 78 },
  { id: "5", name: "Kirana Putri", age: 4, level: "Pra Membaca", status: "active", parentName: "Hendra Wijaya", enrollDate: "2024-04-15", progress: 30, attendance: 90 },
  { id: "6", name: "Raffa Aditya", age: 6, level: "Lanjutan", status: "graduated", parentName: "Dewi Susanti", enrollDate: "2023-06-01", progress: 100, attendance: 96 },
  { id: "7", name: "Nayla Sari", age: 5, level: "Level 2", status: "active", parentName: "Bambang S.", enrollDate: "2024-01-20", progress: 65, attendance: 85 },
  { id: "8", name: "Reza Firmansyah", age: 6, level: "Level 3", status: "active", parentName: "Fitri W.", enrollDate: "2023-11-01", progress: 80, attendance: 91 },
  { id: "9", name: "Luna Cantika", age: 4, level: "Pra Membaca", status: "active", parentName: "Yanti R.", enrollDate: "2024-05-01", progress: 20, attendance: 82 },
  { id: "10", name: "Dani Putra", age: 5, level: "Level 1", status: "inactive", parentName: "Agus M.", enrollDate: "2024-02-15", progress: 35, attendance: 60 },
];

// ─── Extended Dashboard Parent Data ──────────────────────────────────────────
import type {
  ScoreTrend,
  VocabWord,
  LevelMilestone,
  Achievement,
  MoodEntry,
  WeeklySummary,
} from "@/types";

export const scoreTrend: ScoreTrend[] = [
  { date: "2024-05-15", score: 72, material: "Huruf Vokal" },
  { date: "2024-05-18", score: 75, material: "Suku Kata Ba" },
  { date: "2024-05-22", score: 78, material: "Suku Kata Ca" },
  { date: "2024-05-25", score: 82, material: "Motorik Halus" },
  { date: "2024-05-28", score: 82, material: "Suku Kata Ca" },
  { date: "2024-06-01", score: 95, material: "Ulasan Vokal" },
  { date: "2024-06-06", score: 88, material: "Huruf Kapital" },
  { date: "2024-06-08", score: 85, material: "Gabung Suku Kata" },
  { date: "2024-06-10", score: 90, material: "Suku Kata Ba-Bi" },
];

export const vocabularyMastered: VocabWord[] = [
  { id: "v1",  word: "bata",   category: "kata",      mastered: true,  dateMastered: "2024-05-20" },
  { id: "v2",  word: "buku",   category: "kata",      mastered: true,  dateMastered: "2024-05-22" },
  { id: "v3",  word: "bola",   category: "kata",      mastered: true,  dateMastered: "2024-05-25" },
  { id: "v4",  word: "caci",   category: "kata",      mastered: true,  dateMastered: "2024-05-28" },
  { id: "v5",  word: "dada",   category: "kata",      mastered: true,  dateMastered: "2024-06-01" },
  { id: "v6",  word: "bisa",   category: "kata",      mastered: true,  dateMastered: "2024-06-05" },
  { id: "v7",  word: "kaki",   category: "kata",      mastered: true,  dateMastered: "2024-06-08" },
  { id: "v8",  word: "meja",   category: "kata",      mastered: false  },
  { id: "v9",  word: "naga",   category: "kata",      mastered: false  },
  { id: "v10", word: "bunga",  category: "kalimat",   mastered: false  },
  { id: "v11", word: "ba",     category: "suku-kata", mastered: true,  dateMastered: "2024-05-10" },
  { id: "v12", word: "bi",     category: "suku-kata", mastered: true,  dateMastered: "2024-05-10" },
  { id: "v13", word: "bu",     category: "suku-kata", mastered: true,  dateMastered: "2024-05-10" },
  { id: "v14", word: "ca",     category: "suku-kata", mastered: true,  dateMastered: "2024-05-20" },
  { id: "v15", word: "da",     category: "suku-kata", mastered: true,  dateMastered: "2024-05-20" },
];

export const levelMilestones: LevelMilestone[] = [
  { level: "L0", label: "Pra Membaca",      startDate: "2024-01-15", completionDate: "2024-02-28", status: "completed",  progressPercent: 100 },
  { level: "L1", label: "Membaca Level 1",  startDate: "2024-03-01", completionDate: "2024-03-28", status: "completed",  progressPercent: 100 },
  { level: "L2", label: "Membaca Level 2",  startDate: "2024-04-01", estimatedCompletion: "2024-07-31",  status: "active",     progressPercent: 62  },
  { level: "L3", label: "Membaca Level 3",  status: "upcoming",  progressPercent: 0 },
  { level: "L4", label: "Membaca Lanjutan", status: "upcoming",  progressPercent: 0 },
];

export const achievements: Achievement[] = [
  { id: "a1", badgeName: "Bintang Fonik",     badgeIcon: "star",          category: "milestone",  description: "Menyelesaikan Level 1 dengan nilai rata-rata 90+",   earnedAt: "2024-03-28", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "a2", badgeName: "Hadir Terus!",       badgeIcon: "calendar-check", category: "kehadiran",  description: "Hadir 10 sesi berturut-turut tanpa absen",           earnedAt: "2024-04-15", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "a3", badgeName: "Pembaca Cepat",      badgeIcon: "zap",           category: "nilai",      description: "Mendapat nilai 95 di ulangan Huruf Vokal",           earnedAt: "2024-06-01", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { id: "a4", badgeName: "Kolektor Kata",      badgeIcon: "library",       category: "kosakata",   description: "Menguasai 50+ kata dalam kamus pribadi",             earnedAt: "2024-05-30", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
  { id: "a5", badgeName: "Semangat Juara",     badgeIcon: "heart",         category: "semangat",   description: "Mood belajar 5 bintang selama 5 sesi berturut-turut", earnedAt: "2024-05-25", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

export const moodHistory: MoodEntry[] = [
  { date: "2024-06-10", score: 5, material: "Suku Kata Ba-Bi-Bu" },
  { date: "2024-06-08", score: 4, material: "Gabung Suku Kata" },
  { date: "2024-06-06", score: 5, material: "Huruf Kapital" },
  { date: "2024-06-03", score: 3, material: "Membaca Kata 2 Suku Kata" },
  { date: "2024-06-01", score: 5, material: "Ulasan Vokal" },
  { date: "2024-05-30", score: 2, material: "Pengenalan Huruf Konsonan" },
  { date: "2024-05-28", score: 4, material: "Suku Kata Ca, Ci" },
  { date: "2024-05-25", score: 5, material: "Motorik Halus" },
];

export const weeklySummaries: WeeklySummary[] = [
  {
    weekLabel: "Minggu Ini",
    weekStart: "2024-06-10",
    weekEnd: "2024-06-16",
    sessionsAttended: 2,
    sessionsTotal: 3,
    avgScore: 87.5,
    avgMood: 4.5,
    highlights: ["Suku kata Ba-Bi-Bu sudah lancar", "Nilai ulangan meningkat dari 85 → 90"],
    newWordsLearned: 3,
  },
  {
    weekLabel: "Minggu Lalu",
    weekStart: "2024-06-03",
    weekEnd: "2024-06-09",
    sessionsAttended: 3,
    sessionsTotal: 3,
    avgScore: 89.3,
    avgMood: 4.0,
    highlights: ["Semua sesi hadir!", "Menguasai huruf kapital penuh A-Z"],
    newWordsLearned: 5,
  },
];
