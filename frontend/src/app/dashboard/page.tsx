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
      const url = childId
        ? `/api/dashboard/parent/me?siswa_id=${childId}`
        : "/api/dashboard/parent/me";
      const res = await fetch(url);
      const json = await res.json();

      if (json.success && json.data) {
        setDashboardData(json.data);
        if (json.data.childDetail) {
          setSelectedChildId(json.data.childDetail.id);
        }
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

  const { kehadiran, indikator, kosakata, pencapaian, catatan, video, modul } = child;

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
        <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-700/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Kehadiran
              </span>
              <span className="text-xl font-black">{kehadiran.persentase}%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Kosakata Dikuasai
              </span>
              <span className="text-xl font-black">{kosakata.dikuasai} Kata</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center flex-1 md:flex-initial min-w-[100px]">
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

            {/* Video Pembelajaran untuk Latihan di Rumah */}
            {video && video.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-orange-500" />
                  Video Panduan Belajar di Rumah
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {video.map((v: any) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2 hover:bg-slate-100/80 transition-colors"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase">
                          {v.level}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {v.judul}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {v.deskripsi}
                        </p>
                      </div>
                      <a
                        href={v.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 pt-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-purple-600" />
                        Tonton Video
                      </a>
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
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-3xl p-6 text-white shadow-md space-y-4">
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
      </main>
    </div>
  );
}
