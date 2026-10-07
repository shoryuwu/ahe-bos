"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  ClipboardList,
  Award,
  CheckCircle2,
  AlertTriangle,
  Activity,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  AdminStats,
  PendaftaranItem,
  KelasAdminItem,
  AsesmenAdminItem,
  SiswaAdminItem,
  LogAdminItem,
} from "@/types/admin";

interface DashboardTabProps {
  stats: AdminStats;
  pendaftaranList: PendaftaranItem[];
  kelasList: KelasAdminItem[];
  asesmenList: AsesmenAdminItem[];
  siswaList: SiswaAdminItem[];
  logList: LogAdminItem[];
  onTabChange: (tabId: string) => void;
  onNavigateToLog: () => void;
}

export function DashboardTab({
  stats,
  pendaftaranList,
  kelasList,
  asesmenList,
  siswaList,
  logList,
  onTabChange,
  onNavigateToLog,
}: DashboardTabProps) {
  if (!stats) return null;

  const pendingRegs = pendaftaranList.filter((p) => p.status === "menunggu");
  const fullClasses = kelasList.filter(
    (k) => k.status === "aktif" && (k.siswa_count || k.jumlah_siswa || 0) >= k.kapasitas
  );
  const pendingAssessments = asesmenList.filter((a) => a.status === "menunggu");
  const lowAttendanceStudents = siswaList.filter(
    (s) => s.status === "aktif" && (s.kehadiran_persen || 100) < 75
  );

  const totalAlerts =
    (pendingRegs.length > 0 ? 1 : 0) +
    (fullClasses.length > 0 ? 1 : 0) +
    (pendingAssessments.length > 0 ? 1 : 0) +
    (lowAttendanceStudents.length > 0 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Aktif */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Siswa Aktif
            </span>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {stats.kpi?.siswaAktif ?? 0}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                / {stats.kpi?.totalSiswa ?? 0}
              </span>
            </h4>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
              Presensi: {stats.kpi?.persentaseKehadiran ?? 0}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pendaftaran PPDB */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              PPDB Baru
            </span>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {stats.kpi?.pendaftaranMenunggu ?? 0}
            </h4>
            <button
              onClick={() => onTabChange("pendaftaran")}
              className="text-[11px] text-primary font-bold hover:underline inline-flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              Tinjau Berkas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--ahe-orange)]/15 text-[var(--ahe-orange)] flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Asesmen Menunggu */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Asesmen Level
            </span>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {stats.kpi?.asesmenMenunggu ?? 0}
            </h4>
            <button
              onClick={() => onTabChange("kenaikan-level")}
              className="text-[11px] text-primary font-bold hover:underline inline-flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              Verifikasi Asesmen <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Tutor & Kelas */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Tutor & Kelas
            </span>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {stats.kpi?.totalGuru ?? 0}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                Guru • {stats.kpi?.totalKelas ?? 0} Kelas
              </span>
            </h4>
            <span className="text-[11px] text-muted-foreground font-medium block mt-0.5">
              Standar: Maks 6 anak/kelas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Urgent Alerts Section */}
      {totalAlerts === 0 ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Semua operasional bimbingan belajar berjalan lancar. Tidak ada antrean atau kendala mendesak.</span>
          </div>
          <Badge variant="outline" className="bg-background text-emerald-700 dark:text-emerald-400 border-emerald-200">
            Sistem Normal
          </Badge>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-5 border border-amber-200 dark:border-amber-900 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Perhatian & Tindakan Mendesak
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Terdapat {totalAlerts} kategori operasional yang memerlukan tindak lanjut
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
              {totalAlerts} Tindakan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {pendingRegs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-orange-950 dark:text-orange-200 block">
                    {pendingRegs.length} Pendaftaran PPDB Menunggu
                  </span>
                  <span className="text-[11px] text-orange-800 dark:text-orange-300 block">
                    Ada berkas calon siswa baru belum diverifikasi.
                  </span>
                </div>
                <Button
                  size="xs"
                  onClick={() => onTabChange("pendaftaran")}
                  className="bg-[var(--ahe-orange)] hover:opacity-90 text-white shrink-0"
                >
                  Tinjau
                </Button>
              </div>
            )}

            {fullClasses.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-rose-950 dark:text-rose-200 block">
                    {fullClasses.length} Rombel Penuh (6/6)
                  </span>
                  <span className="text-[11px] text-rose-800 dark:text-rose-300 block truncate max-w-[200px]">
                    {fullClasses.map((c) => c.nama).join(", ")}
                  </span>
                </div>
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={() => onTabChange("kelas")}
                  className="shrink-0"
                >
                  Kelola
                </Button>
              </div>
            )}

            {pendingAssessments.length > 0 && (
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-foreground block">
                    {pendingAssessments.length} Asesmen Naik Level
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Tutor mengajukan evaluasi kenaikan jenjang.
                  </span>
                </div>
                <Button
                  size="xs"
                  onClick={() => onTabChange("kenaikan-level")}
                  className="shrink-0"
                >
                  Review
                </Button>
              </div>
            )}

            {lowAttendanceStudents.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-amber-950 dark:text-amber-200 block">
                    {lowAttendanceStudents.length} Presensi Perlu Perhatian
                  </span>
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 block truncate max-w-[200px]">
                    Kehadiran &lt; 75%: {lowAttendanceStudents.map((s) => s.nama).join(", ")}
                  </span>
                </div>
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => onTabChange("monitoring")}
                  className="shrink-0 font-bold"
                >
                  Pantau
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Operational Section: Kapasitas Kelas & Distribusi Level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Kapasitas Rombel Kelas Aktif
              </h3>
              <p className="text-xs text-muted-foreground">
                Pemantauan kuota maksimal 6 siswa per kelompok belajar
              </p>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => onTabChange("kelas")}
              className="text-xs"
            >
              Kelola Semua Kelas →
            </Button>
          </div>

          <div className="space-y-3">
            {stats.kapasitasKelas?.map((k) => {
              const percent = Math.min(100, Math.round((k.terisi / k.kapasitas) * 100));
              const isFull = k.terisi >= k.kapasitas;
              return (
                <div
                  key={k.id}
                  className="p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {k.nama}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Tutor: {k.guru}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isFull
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {k.terisi} / {k.kapasitas} Siswa
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isFull ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Distribusi Level Membaca
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Sebaran jenjang kurikulum AHE
            </p>

            <div className="space-y-2.5 text-xs">
              {Object.entries(stats.distribusiLevel || {}).map(([lvl, count]) => (
                <div key={lvl} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                  <span className="font-semibold text-foreground uppercase">
                    {lvl.replace("-", " ")}
                  </span>
                  <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {count} Siswa
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Link
              href="/daftar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Buka Formulir PPDB Publik ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Activity Log Feed */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Linimasa Log Aktivitas Terkini
              </h3>
              <p className="text-xs text-muted-foreground">
                Riwayat perubahan data dan aksi operasional sistem secara real-time
              </p>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={onNavigateToLog}
            className="text-xs"
          >
            Lihat Semua Log ({logList.length}) →
          </Button>
        </div>

        {logList.length > 0 ? (
          <div className="divide-y divide-border/60">
            {logList.slice(0, 5).map((l) => (
              <div
                key={l.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-muted/40 rounded-xl px-2.5 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <Badge variant="outline" className="font-bold text-[10px] uppercase bg-primary/10 text-primary border-primary/20 shrink-0">
                    {l.aksi}
                  </Badge>
                  <span className="text-foreground font-medium">
                    {l.detail}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono shrink-0 pl-2">
                  {l.created_at}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Belum ada catatan aktivitas tercatat di sistem.
          </div>
        )}
      </div>
    </div>
  );
}