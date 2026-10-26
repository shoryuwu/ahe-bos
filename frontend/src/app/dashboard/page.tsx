"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  User,
  GraduationCap,
  Clock,
  Download,
  Play,
  X,
  BookOpen,
  Star,
  FileText,
  CheckCircle2,
  Zap,
  Heart,
  Library,
  CalendarCheck,
  Smile,
  Meh,
  Frown,
  BadgeCheck,
  AlertTriangle,
  Flame,
  MessageSquare,
  ChevronRight,
  Trophy,
  Loader2,
  Users,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";

const AHE_STEPS = [
  { num: 1, label: "Senam Otak" },
  { num: 2, label: "Tunjuk Bunyi" },
  { num: 3, label: "Remas Kata" },
  { num: 4, label: "Baca Kartu" },
  { num: 5, label: "Tulis Fonik" },
  { num: 6, label: "Dongeng Penutup" },
];

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
  } catch {
    // fallback
  }
  return null;
}

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [showAllVocab, setShowAllVocab] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Video modal
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

  // Load Parent & Child Data
  async function loadData(childId?: string) {
    try {
      const token = localStorage.getItem("ahe_token");
      const headers: HeadersInit = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const url = childId
        ? `/api/dashboard/parent/me?siswa_id=${childId}`
        : "/api/dashboard/parent/me";
      const res = await fetch(url, { headers });
      const json = await res.json();

      if (json.success && json.data) {
        setDashboardData(json.data);
        // Set first child as default if no selection yet
        if (!selectedChildId && json.data.children?.length > 0) {
          setSelectedChildId(json.data.children[0].id);
        }
        if (json.data.childDetail) {
          setSelectedChildId(json.data.childDetail.id);
        }
      } else {
        console.warn("Dashboard parent API:", json.message ?? "empty response");
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSelectChild(id: string) {
    setSelectedChildId(id);
    setLoading(true);
    loadData(id);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs font-semibold text-slate-600">
            Menyiapkan data perkembangan ananda...
          </p>
        </div>
      </div>
    );
  }

  const ortu = dashboardData?.ortu;
  const children = dashboardData?.children || [];
  const child = dashboardData?.childDetail;

  if (!child) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader
          title="Dashboard Orang Tua"
          subtitle="Monitoring perkembangan ananda"
          userName={ortu?.nama || "Orang Tua"}
          userRole="orangtua"
        />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Belum Ada Siswa Terdaftar
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Akun Anda belum terhubung dengan peserta didik aktif. Jika baru mendaftar, silakan
              tunggu konfirmasi verifikasi dari tim AHE.
            </p>
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Daftar Peserta Didik Baru
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // The API returns raw siswa fields — compute derived values safely here
  const absensiList: { id: string; status: string; sesi?: { tanggal?: string; materi?: string } }[] = child.absensi ?? [];
  const nilaiSesiList: {
    id?: string;
    nilai: number;
    mood?: number;
    langkah_selesai?: number[];
    catatan?: string | null;
    video_url?: string | null;
    sesi?: { tanggal?: string; materi?: string; video_url?: string | null };
  }[] = child.nilai_sesi ?? child.nilaiSesi ?? [];

  // Koleksi video rekaman belajar ananda di tiap sesi
  const sessionVideos: {
    id: string;
    materi: string;
    tanggal?: string;
    nilai: number;
    video_url: string;
  }[] = nilaiSesiList
    .filter((ns) => Boolean(ns.video_url || ns.sesi?.video_url))
    .map((ns, idx) => ({
      id: ns.id || `vid-${idx}`,
      materi: ns.sesi?.materi || "Dokumentasi Praktik Membaca",
      tanggal: ns.sesi?.tanggal,
      nilai: ns.nilai,
      video_url: (ns.video_url || ns.sesi?.video_url) as string,
    }));
  const asesmenList: {
    id: string;
    dari_level: string;
    ke_level: string;
    nilai_tertulis: number;
    nilai_praktik: number;
    status: string;
    rekomendasi?: string;
    catatan_evaluasi?: string | null;
    tanggal_persetujuan?: string;
    guru?: { nama: string };
  }[] = child.asesmen ?? [];

  const rataRataNilai =
    nilaiSesiList.length > 0
      ? Math.round(
          nilaiSesiList.reduce((acc, curr) => acc + (curr.nilai || 0), 0) /
            nilaiSesiList.length
        )
      : null;
  const progressIndikatorList: ({ bulan?: string; mengenal_huruf?: number; membaca_suku_kata?: number; membaca_kata?: number; membaca_kalimat?: number; membaca_cerita?: number })[] = child.progress_indikator ?? [];
  const pencapaian: { id: string; nama_badge: string; ikon: string; kategori: string; deskripsi: string; tanggal_raih: string }[] = child.pencapaian ?? [];
  const catatan: { id: string; tanggal: string; catatan: string; tipe: string; guru?: { nama: string } }[] = child.catatan ?? [];
  const kosakataRaw: { id: string; kata: string; kategori?: string; dikuasai: boolean }[] = child.kosakata ?? [];

  // --- Kehadiran ---
  const totalAbsensi = absensiList.length;
  const hadirCount = absensiList.filter((a) => a.status === "hadir").length;
  const izinCount  = absensiList.filter((a) => a.status === "izin").length;
  const sakitCount = absensiList.filter((a) => a.status === "sakit").length;
  const alphaCount = absensiList.filter((a) => a.status === "alpha").length;
  const kehadiran = {
    hadir: hadirCount,
    total: totalAbsensi,
    persentase: totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 0,
    izin:  izinCount,
    sakit: sakitCount,
    alpha: alphaCount,
    // Riwayat: combine absensi entries with their sesi info
    riwayat: absensiList.slice(0, 10).map((a) => ({
      id: a.id,
      status: a.status,
      tanggal: a.sesi?.tanggal
        ? new Date(a.sesi.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "-",
      materi: a.sesi?.materi ?? "-",
    })),
  };

  // --- Progress indikator (ambil bulan terbaru) ---
  const latestIndikator = progressIndikatorList[0] ?? {};
  const indikator = {
    bulan: latestIndikator.bulan ?? "-",
    mengenal_huruf:    latestIndikator.mengenal_huruf    ?? 0,
    membaca_suku_kata: latestIndikator.membaca_suku_kata ?? 0,
    membaca_kata:      latestIndikator.membaca_kata      ?? 0,
    membaca_kalimat:   latestIndikator.membaca_kalimat   ?? 0,
    membaca_cerita:    latestIndikator.membaca_cerita    ?? 0,
  };

  // --- Kosakata ---
  const kosakataDict = kosakataRaw.length > 0
    ? kosakataRaw
    : (child.kosakata ?? []);
  const dikuasaiCount = kosakataDict.filter((k: { dikuasai: boolean }) => k.dikuasai).length;
  const kosakata = {
    dikuasai: dikuasaiCount,
    total: kosakataDict.length,
    persen: kosakataDict.length > 0 ? Math.round((dikuasaiCount / kosakataDict.length) * 100) : 0,
    daftar: kosakataDict,
  };

  // --- Stub untuk video & modul (belum ada di API) ---
  const video: unknown[] = [];
  const modul: unknown[] = [];



  const indicatorList = [
    { label: "Mengenal Huruf", val: indikator.mengenal_huruf, color: "bg-purple-600" },
    { label: "Membaca Suku Kata", val: indikator.membaca_suku_kata, color: "bg-fuchsia-600" },
    { label: "Membaca Kata Utuh", val: indikator.membaca_kata, color: "bg-orange-500" },
    { label: "Membaca Kalimat", val: indikator.membaca_kalimat, color: "bg-emerald-600" },
    { label: "Membaca Cerita", val: indikator.membaca_cerita, color: "bg-blue-600" },
  ];


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardHeader
        title="Dashboard Perkembangan Belajar"
        subtitle={`Monitoring ananda ${child.nama} di AHE Karang Joang`}
        userName={ortu?.nama || "Orang Tua"}
        userRole="orangtua"
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* SIBLING SWITCHER (Anti-slop pattern from skill) */}
        {children.length > 1 && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 px-2 uppercase">
              Pilih Ananda:
            </span>
            <div className="flex flex-wrap gap-2">
              {children.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChild(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    c.id === selectedChildId
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {c.nama} ({c.level_saat_ini.toUpperCase()})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HERO CHILD PROFILE BANNER */}
        <div className="bg-linear-to-r from-purple-700 via-fuchsia-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-700/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center text-2xl font-black text-white shadow-inner">
              {child.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                  {child.level_saat_ini.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold bg-emerald-400/30 text-emerald-100 px-2 py-0.5 rounded-full">
                  Status: {child.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {child.nama}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                Kelas: {child.kelas?.nama || "Menunggu Kelas"} • Tutor:{" "}
                {child.tutor?.nama || "AHE Staff"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-25">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Kehadiran
              </span>
              <span className="text-xl font-black">{kehadiran.persentase}%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-25">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Kosakata Dikuasai
              </span>
              <span className="text-xl font-black">{kosakata.dikuasai} Kata</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-25">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Rata-rata Nilai
              </span>
              <span className="text-xl font-black">{rataRataNilai !== null ? `${rataRataNilai}` : "-"}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-25">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Badge Raih
              </span>
              <span className="text-xl font-black">{pencapaian.length} Badge</span>
            </div>
          </div>
        </div>

        {/* 4 MAIN STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Sesi Hadir
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {kehadiran.hadir}{" "}
                <span className="text-xs font-semibold text-slate-400">
                  / {kehadiran.total} Sesi
                </span>
              </h4>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                {kehadiran.izin} Izin • {kehadiran.sakit} Sakit • {kehadiran.alpha} Alpha
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Penguasaan Kosakata
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {kosakata.persen}%
              </h4>
              <span className="text-[11px] text-purple-600 font-semibold block mt-0.5">
                {kosakata.dikuasai} dari {kosakata.total} kata fonik
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pencapaian & Badge
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {pencapaian.length}
              </h4>
              <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                Apresiasi kemajuan anak
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Catatan Guru
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{catatan.length}</h4>
              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                Evaluasi & saran latihan
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: 5 Indikator Progress & Kosakata */}
          <div className="lg:col-span-7 space-y-6">
            {/* 5-Indikator Membaca */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Grafik 5 Dimensi Kemampuan Membaca
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluasi terkini ({indikator.bulan}) berdasarkan pengamatan tutor
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {indicatorList.map((ind) => (
                  <div key={ind.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{ind.label}</span>
                      <span className="text-purple-700 font-bold">{ind.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ind.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${ind.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Penilaian Individu & Hasil Belajar Sesi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Penilaian Individu Sesi Belajar &amp; Asesmen
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nilai pemahaman materi harian, antusiasme (mood), penguasaan 6 langkah AHE, dan ujian level
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  Metode 6 Langkah AHE
                </span>
              </div>

              {/* JIKA ADA HASIL ASESMEN KELULUSAN LEVEL */}
              {asesmenList.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ujian Kenaikan Jenjang (Asesmen)
                  </span>
                  {asesmenList.map((asm) => (
                    <div
                      key={asm.id}
                      className="p-4 rounded-2xl bg-linear-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/80 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900 capitalize">
                            Lulus Asesmen: {asm.dari_level} &rarr; {asm.ke_level}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          {asm.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-center">
                        <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                          <span className="text-[10px] text-slate-500 block">Praktik Membaca</span>
                          <span className="text-sm font-extrabold text-emerald-700">{asm.nilai_praktik} / 100</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                          <span className="text-[10px] text-slate-500 block">Tes Tertulis/Fonik</span>
                          <span className="text-sm font-extrabold text-teal-700">{asm.nilai_tertulis} / 100</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-emerald-100 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-500 block">Tutor Penguji</span>
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{asm.guru?.nama || "Tutor AHE"}</span>
                        </div>
                      </div>

                      {asm.catatan_evaluasi && (
                        <p className="text-[11px] text-slate-700 italic bg-white/60 p-2.5 rounded-xl border border-emerald-100/60">
                          &ldquo;{asm.catatan_evaluasi}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* DAFTAR EVALUASI SESI HARIAN */}
              <div className="space-y-3 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Evaluasi Sesi Tatap Muka Terbaru
                </span>

                {nilaiSesiList.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-700">Belum ada penilaian sesi</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                      Nilai harian, indikator mood, dan capaian langkah fonik ananda akan langsung tampil di sini setelah tutor menyelesaikan KBM.
                    </p>
                  </div>
                ) : (
                  nilaiSesiList.slice(0, 5).map((ns, idx) => {
                    const moodLevel = ns.mood || 3;
                    const moodLabel =
                      moodLevel >= 5
                        ? "Sangat Bersemangat"
                        : moodLevel === 4
                        ? "Fokus & Ceria"
                        : moodLevel === 3
                        ? "Cukup Baik"
                        : moodLevel === 2
                        ? "Perlu Dukungan"
                        : "Kurang Fit";

                    return (
                      <div
                        key={ns.id || idx}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-2.5 hover:bg-slate-50 transition-colors"
                      >
                        {/* Header Sesi: Tanggal & Nilai */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {ns.sesi?.materi || "Sesi Bimbingan Membaca"}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {ns.sesi?.tanggal
                                ? new Date(ns.sesi.tanggal).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Pertemuan Terakhir"}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-xs">
                              Nilai: {ns.nilai}
                            </span>
                          </div>
                        </div>

                        {/* Indikator Mood / Antusiasme */}
                        <div className="flex items-center gap-2 text-[11px] bg-white p-2 rounded-xl border border-slate-200/60">
                          <span className="text-slate-400 font-semibold">Mood Belajar:</span>
                          <span className="font-bold text-amber-600 flex items-center gap-0.5">
                            {"★".repeat(moodLevel)}{"☆".repeat(Math.max(0, 5 - moodLevel))}
                          </span>
                          <span className="text-slate-600 font-medium text-[10.5px]">
                            ({moodLabel})
                          </span>
                        </div>

                        {/* 6 Langkah Metode AHE */}
                        {ns.langkah_selesai && ns.langkah_selesai.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Langkah AHE Selesai:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {AHE_STEPS.map((step) => {
                                const isDone = ns.langkah_selesai?.includes(step.num);
                                return (
                                  <span
                                    key={step.num}
                                    className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border ${
                                      isDone
                                        ? "bg-purple-50 text-purple-800 border-purple-200"
                                        : "bg-white text-slate-300 border-slate-100 line-through"
                                    }`}
                                  >
                                    {isDone ? "✓" : "•"} {step.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Catatan Sesi dari Guru */}
                        {ns.catatan && (
                          <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-950 flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-blue-900 block text-[10px] uppercase">
                                Catatan Tutor:
                              </span>
                              <p className="mt-0.5 leading-relaxed">{ns.catatan}</p>
                            </div>
                          </div>
                        )}

                        {/* Link Video Rekaman Sesi dari Guru */}
                        {(ns.video_url || ns.sesi?.video_url) && (
                          <div className="pt-0.5">
                            <button
                              onClick={() =>
                                setPlayingVideo({
                                  judul: `Rekaman: ${ns.sesi?.materi || "Sesi Belajar"}`,
                                  tanggal: ns.sesi?.tanggal,
                                  url: ns.video_url || ns.sesi?.video_url,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                              <span>Tonton Video Rekaman Sesi Ini (YouTube)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kosakata Mastered Shelf */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-fuchsia-600" />
                    Kosakata yang Dikuasai ({kosakata.dikuasai} Kata)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kata-kata yang telah lancar dibaca ananda secara mandiri
                  </p>
                </div>
                {kosakata.daftar.length > 8 && (
                  <button
                    onClick={() => setShowAllVocab(!showAllVocab)}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    {showAllVocab ? "Ringkas" : "Lihat Semua"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(showAllVocab ? kosakata.daftar : kosakata.daftar.slice(0, 10)).map(
                  (voc: any) => (
                    <span
                      key={voc.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        voc.dikuasai
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {voc.dikuasai && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {voc.kata}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Galeri Rekaman Video Sesi Belajar Anak */}
            {sessionVideos.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
                      Video Rekaman Sesi Belajar Ananda ({sessionVideos.length} Video)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dokumentasi otentik saat ananda praktik membaca langsung bersama tutor
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    YouTube Dokumentasi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sessionVideos.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-linear-to-br from-rose-50/40 via-white to-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-rose-300 transition-all shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            Nilai: {v.nilai}
                          </span>
                          <span>
                            {v.tanggal
                              ? new Date(v.tanggal).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {v.materi}
                        </h4>
                      </div>

                      <button
                        onClick={() =>
                          setPlayingVideo({
                            judul: v.materi,
                            tanggal: v.tanggal,
                            url: v.video_url,
                          })
                        }
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Tonton Video Rekaman
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Badges, Catatan Guru, & Jadwal */}
          <div className="lg:col-span-5 space-y-6">
            {/* Achievement Badges Shelf */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Lemari Prestasi & Badge
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {pencapaian.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{b.nama_badge}</h4>
                      <p className="text-[11px] text-slate-600">{b.deskripsi}</p>
                      <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                        Diraih pada {b.tanggal_raih}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dokumen Rapor & Sertifikat Resmi */}
            <div className="bg-linear-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-3xl p-6 text-white shadow-md space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Dokumen Belajar Resmi
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Rapor & Sertifikat Ananda
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  Unduh atau cetak laporan hasil belajar fonik dan sertifikat kelulusan jenjang membaca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href={`/laporan/rapor/${child.id}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-slate-100 transition-colors"
                >
                  <Award className="w-4 h-4 text-purple-600" />
                  Cetak Rapor A4
                </Link>

                <Link
                  href={`/laporan/sertifikat/${child.id}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-300 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Cetak Sertifikat Level
                </Link>
              </div>
            </div>

            {/* Catatan Guru Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Pesan & Evaluasi dari Tutor
              </h3>

              <div className="space-y-3">
                {catatan.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">Belum ada catatan dari tutor.</p>
                ) : (
                  catatan.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{c.guru_nama}</span>
                        <span className="text-slate-400">{c.tanggal}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.catatan}</p>
                      <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                        {c.tipe}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Riwayat Absensi Terkini */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Riwayat Sesi Terkini
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {kehadiran.riwayat.map((att: any) => (
                  <div key={att.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{att.materi}</span>
                      <span className="text-[10px] text-slate-400">{att.tanggal}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        att.status === "hadir"
                          ? "bg-emerald-100 text-emerald-800"
                          : att.status === "izin"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL PEMUTAR VIDEO YOUTUBE DOKUMENTASI SESI */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {playingVideo.judul}
                    </h4>
                    {playingVideo.tanggal && (
                      <span className="text-[10px] text-white/60 block">
                        Sesi Tanggal:{" "}
                        {new Date(playingVideo.tanggal).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {getYouTubeEmbedUrl(playingVideo.url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(playingVideo.url) || ""}
                    title={playingVideo.judul}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Play className="w-10 h-10 text-rose-500 mb-2 opacity-80" />
                    <p className="text-xs text-white/80 mb-3">
                      Video dapat langsung ditonton melalui tautan berikut:
                    </p>
                    <a
                      href={playingVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-2"
                    >
                      Buka Video / Browser &rarr;
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <span>Dokumentasi Belajar AHE &bull; Privasi Peserta Didik</span>
                <a
                  href={playingVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Buka di YouTube &rarr;
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
