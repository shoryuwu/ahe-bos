"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  LogOut,
  CheckCircle2,
  Info,
  BookOpen,
  X,
  ShieldCheck,
  GraduationCap,
  Users,
  Sparkles,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  avatarInitials?: string;
  avatarUrl?: string;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  userName = "Pengguna",
  userRole = "Member",
  avatarInitials = "U",
  avatarUrl,
  onToggleSidebar,
  showSidebarToggle = false,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<"sop" | "admin" | "tutor" | "ortu">(
    userRole === "admin" ? "admin" : userRole === "tutor" ? "tutor" : userRole === "orangtua" ? "ortu" : "sop"
  );
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const token = localStorage.getItem("ahe_token");
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      });
    } catch {
      // Ignore network errors
    } finally {
      localStorage.removeItem("ahe_token");
      localStorage.removeItem("ahe_user");
      document.cookie = "ahe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "ahe_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.replace("/login");
    }
  }

  const roleLabel =
    userRole === "admin"
      ? "Administrator"
      : userRole === "tutor"
      ? "Tutor Pengajar"
      : userRole === "orangtua"
      ? "Wali Murid"
      : userRole;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden text-foreground"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-base md:text-lg font-bold text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Tombol Panduan Penggunaan Sistem */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGuideModal(true)}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50/90 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 rounded-xl cursor-pointer"
          title="Buku Panduan Operasional Sistem"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowGuideModal(true)}
          className="sm:hidden text-purple-700 hover:bg-purple-50"
          title="Panduan"
        >
          <BookOpen className="w-4 h-4" />
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="relative text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--ahe-orange)] ring-2 ring-white" />
          </Button>

          {showNotifModal && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Pemberitahuan Sistem
                </span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Terbaru
                </span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Sistem Aktif Berjalan
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Seluruh fitur administrasi AHE siap digunakan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors">
                  <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Metode AHE Terintegrasi
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pencatatan 6 langkah belajar aktif pada sesi bimbingan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs md:text-sm font-semibold text-foreground">
              {userName}
            </span>
            <span className="text-[11px] text-muted-foreground">{roleLabel}</span>
          </div>

          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border flex items-center justify-center text-white font-bold text-xs shadow-sm bg-purple-600">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span>{avatarInitials || userName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Keluar dari Akun"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* MODAL PANDUAN PENGGUNAAN SISTEM AHE-BOS */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-card rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-border overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-border bg-linear-to-r from-purple-50 via-white to-orange-50/50 dark:from-purple-950/20 dark:to-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-foreground">
                    Panduan Penggunaan Sistem AHE-BOS
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-muted-foreground">
                    Standar Operasional Prosedur &amp; Petunjuk Penggunaan Digital
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-muted hover:bg-slate-200 dark:hover:bg-muted/80 flex items-center justify-center text-slate-600 dark:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-border px-6 gap-2 bg-slate-50/70 dark:bg-muted/30 overflow-x-auto shrink-0">
              {[
                { id: "sop", label: "Aturan Bisnis", icon: ShieldCheck },
                { id: "admin", label: "Admin", icon: Users },
                { id: "tutor", label: "Tutor", icon: GraduationCap },
                { id: "ortu", label: "Orang Tua", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeGuideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGuideTab(tab.id as any)}
                    className={`py-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-card"
                        : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-muted-foreground leading-relaxed flex-1">
              {activeGuideTab === "sop" && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200">
                    <span className="font-bold block text-xs mb-1">Prinsip Belajar Semi-Private AHE:</span>
                    Sistem dirancang mengutamakan kedekatan tutor dan kenyamanan psikologis anak usia dini.
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-100 dark:border-border">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-black flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <div>
                        <strong className="text-slate-900 dark:text-foreground block">Rasio 1 Guru : Maksimal 2 Siswa (1 Jam)</strong>
                        Setiap rombel hanya menerima maksimal 2 anak per sesi tatap muka. Jadwal guru dilarang bertabrakan (*anti-overlap*).
                      </div>
                    </div>

                    <div className="flex gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-100 dark:border-border">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-black flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <div>
                        <strong className="text-slate-900 dark:text-foreground block">Fleksibilitas Tutor Tetap Sama (*Trust &amp; Bonding*)</strong>
                        Nama tutor selalu otomatis menempel pada data anak. Saat kenaikan level, anak tetap bersama tutor lamanya demi menjaga rasa percaya dan proses belajar tetap lancar.
                      </div>
                    </div>

                    <div className="flex gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-100 dark:border-border">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-black flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <div>
                        <strong className="text-slate-900 dark:text-foreground block">Metode Fonik 6 Langkah &amp; Evaluasi Harian</strong>
                        Setiap sesi menguji 6 langkah AHE. Tutor menginput skor harian, mood belajar bintang 1-5, dan catatan pengulangan rumah langsung ke dashboard orang tua.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeGuideTab === "admin" && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-foreground block text-xs">
                    Langkah Operasional Pengelola (Admin):
                  </span>

                  <ol className="list-decimal pl-4 space-y-2.5 text-slate-600 dark:text-muted-foreground">
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Kelola Rombel (Tab Kelas):</strong> Masukkan nama kelas, guru, dan jadwal. Kapasitas terkunci otomatis ke 2 siswa. Sistem otomatis menolak jika jadwal guru bentrok.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Terima Calon Siswa (Tab Pendaftaran):</strong> Klik &ldquo;Terima&rdquo; dan pilih kelas yang masih memiliki sisa kuota. Jika kelas sudah berisi 2 anak, alihkan ke antrean Waiting List.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Pindah Jadwal (Tab Siswa):</strong> Nama tutor pembimbing tertera jelas. Saat memindahkan kelas, pilih kelas bertanda &ldquo;(★ Tutor Sama)&rdquo; agar anak tidak perlu adaptasi ulang.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Verifikasi Kenaikan Level (Tab Kenaikan Level):</strong> Periksa hasil ujian dari tutor dan klik &ldquo;Setujui&rdquo;. Level anak langsung naik tanpa mengubah rombelnya.
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === "tutor" && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-foreground block text-xs">
                    Langkah Operasional Tutor (Guru Pengajar):
                  </span>

                  <ol className="list-decimal pl-4 space-y-2.5 text-slate-600 dark:text-muted-foreground">
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Cek Jadwal Harian (/tutor/jadwal):</strong> Buka jadwal mengajar sebelum sesi dimulai. Pastikan hanya ada maksimal 2 anak di rombel Anda.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Input Sesi KBM (/tutor/input-sesi):</strong> Setelah jam selesai:
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-[11.5px]">
                        <li>Centang kehadiran (*Hadir/Izin/Sakit/Alpha*).</li>
                        <li>Beri Nilai Pemahaman (0–100) dan Antusiasme/Mood (Rating 1–5 Bintang).</li>
                        <li>Tandai checklist 6 Langkah Fonik yang tuntas diselesaikan.</li>
                        <li>Tulis catatan masukan hangat untuk orang tua.</li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Ajukan Asesmen (/tutor/asesmen):</strong> Bila anak tuntas target level, ajukan ujian kenaikan jenjang untuk diterbitkan sertifikatnya oleh admin.
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === "ortu" && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-foreground block text-xs">
                    Petunjuk Penggunaan Wali Murid (Orang Tua):
                  </span>

                  <ol className="list-decimal pl-4 space-y-2.5 text-slate-600 dark:text-muted-foreground">
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Melihat Profil &amp; Tutor Anak:</strong> Pada banner atas dashboard, Anda dapat langsung melihat nama guru pembimbing (*Tutor: Kak Sari, S.Pd.*), status, dan persentase kehadiran.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Penilaian Individu Sesi Belajar:</strong> Periksa skor nilai pemahaman tiap pertemuan, mood anak (bintang), serta langkah fonik yang telah dikuasai.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Pesan &amp; Evaluasi Tutor:</strong> Baca saran latihan rumah dari guru pembimbing agar latihan membaca di rumah sejalan dengan bimbel.
                    </li>
                    <li>
                      <strong className="text-slate-800 dark:text-foreground">Cetak Rapor &amp; Sertifikat:</strong> Klik tombol &ldquo;Cetak Rapor A4&rdquo; atau &ldquo;Cetak Sertifikat Level&rdquo; untuk mengunduh dokumen resmi kelulusan anak.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-border bg-slate-50 dark:bg-muted/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-muted-foreground">
              <span>AHE Karang Joang &bull; Sistem Bimbingan Semi-Private</span>
              <Button size="xs" onClick={() => setShowGuideModal(false)}>
                Tutup Panduan
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
