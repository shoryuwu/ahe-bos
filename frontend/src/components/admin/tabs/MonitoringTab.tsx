"use client";

import React from "react";
import {
  CalendarCheck,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SesiAdminItem, KelasAdminItem } from "@/types/admin";

interface MonitoringTabProps {
  filteredSesi: SesiAdminItem[];
  kelasList: KelasAdminItem[];
  filterSesiKelas: string;
  setFilterSesiKelas: (kelasId: string) => void;
  onViewSessionDetail: (id: string) => void;
  onOpenSubstituteModal: (sesi: SesiAdminItem) => void;
  onOpenCancelModal: (sesi: SesiAdminItem) => void;
}

export function MonitoringTab({
  filteredSesi,
  kelasList,
  filterSesiKelas,
  setFilterSesiKelas,
  onViewSessionDetail,
  onOpenSubstituteModal,
  onOpenCancelModal,
}: MonitoringTabProps) {
  const getSesiStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase text-[10px] font-bold">
            Selesai
          </Badge>
        );
      case "dibatalkan":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 uppercase text-[10px] font-bold">
            Dibatalkan
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-bold">
            {status || "Berlangsung"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Monitoring KBM & Sesi Belajar
          </h3>
          <p className="text-xs text-muted-foreground">
            Pemantauan riwayat sesi, kehadiran anak, modul diajarkan, dan guru pengganti
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Filter Kelas:</span>
          <select
            value={filterSesiKelas}
            onChange={(e) => setFilterSesiKelas(e.target.value)}
            className="text-xs border border-input bg-background text-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
          >
            <option value="all">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Tanggal & Waktu</th>
                <th className="px-5 py-3">Kelas & Program</th>
                <th className="px-5 py-3">Tutor Pengajar</th>
                <th className="px-5 py-3">Modul & Materi</th>
                <th className="px-5 py-3 text-center">Presensi Hadir</th>
                <th className="px-5 py-3 text-center">Rata Nilai</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSesi.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs text-foreground">Belum ada riwayat sesi belajar</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Setiap pertemuan KBM yang diinput oleh tutor akan otomatis terdata di sini.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSesi.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-foreground block">{s.tanggal}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {s.jam_mulai} - {s.jam_selesai} WITA
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      {s.kelas?.nama || "Kelas"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-foreground block">
                        {s.guru?.nama || "-"}
                      </span>
                      {s.guru_pengganti && (
                        <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md font-bold inline-block mt-0.5">
                          Pengganti: {s.guru_pengganti.nama}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="font-semibold text-foreground block truncate">
                        {s.modul?.judul || s.materi || "Membaca Fonik"}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                        &ldquo;{s.catatan_umum || "Tidak ada catatan umum"}&rdquo;
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant="outline" className="font-bold bg-primary/10 text-primary border-primary/20">
                        {s.hadir_count} / {s.total_siswa} Hadir
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-center font-black text-foreground">
                      {s.rata_rata_nilai ? s.rata_rata_nilai : "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      {getSesiStatusBadge(s.status_sesi)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => onViewSessionDetail(s.id)}
                          className="gap-1 font-semibold"
                          title="Lihat Presensi & Nilai Siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian</span>
                        </Button>

                        {s.status_sesi !== "selesai" && s.status_sesi !== "dibatalkan" && (
                          <>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => onOpenSubstituteModal(s)}
                              className="gap-1 font-semibold"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Ganti Tutor</span>
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => onOpenCancelModal(s)}
                            >
                              Batal
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}