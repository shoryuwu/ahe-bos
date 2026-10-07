"use client";

import React from "react";
import {
  Plus,
  Users,
  Edit,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { KelasAdminItem } from "@/types/admin";

interface KelasTabProps {
  kelasList: KelasAdminItem[];
  onOpenAddClassModal: () => void;
  onViewClassStudents: (kelas: KelasAdminItem) => void;
  onOpenEditClass: (kelas: KelasAdminItem) => void;
  onDeleteClass: (id: string, nama: string) => void;
}

export function KelasTab({
  kelasList,
  onOpenAddClassModal,
  onViewClassStudents,
  onOpenEditClass,
  onDeleteClass,
}: KelasTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Program & Kelompok Belajar</h3>
          <p className="text-xs text-muted-foreground">
            Struktur rombel kelas sesuai standar AHE (Maksimal 6 siswa per kelompok)
          </p>
        </div>

        <Button
          onClick={onOpenAddClassModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kelasList.length === 0 ? (
          <div className="col-span-full bg-card rounded-2xl p-12 border border-border text-center text-muted-foreground">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-xs text-foreground">Belum ada kelompok kelas</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Buat kelas baru untuk menempatkan siswa terdaftar.</p>
          </div>
        ) : (
          kelasList.map((k) => {
            const isFull = (k.siswa_count || 0) >= (k.kapasitas || 6);
            const percent = Math.min(100, Math.round(((k.siswa_count || 0) / (k.kapasitas || 6)) * 100));

            return (
              <div
                key={k.id}
                className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col justify-between hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {k.program_nama || k.program?.nama || "Program AHE"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        k.status === "nonaktif"
                          ? "bg-muted text-muted-foreground border-border"
                          : isFull
                          ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      {k.status === "nonaktif"
                        ? "Nonaktif"
                        : isFull
                        ? "Penuh"
                        : "Tersedia"}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-base text-foreground">{k.nama}</h4>
                  <p className="text-xs text-muted-foreground mb-3.5">
                    Tutor: {k.guru_nama || k.guru?.nama || "-"}
                  </p>

                  <div className="bg-muted/40 p-3 rounded-xl border border-border/60 space-y-2 text-xs mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Jadwal:</span>
                      <span className="font-semibold text-foreground">{k.jadwal_hari?.join(", ") || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Waktu:</span>
                      <span className="font-semibold font-mono text-foreground">
                        {k.jam_mulai} - {k.jam_selesai} WITA
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Kapasitas:</span>
                      <span className="font-bold text-primary">
                        {k.siswa_count || 0} / {k.kapasitas || 6} Siswa
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isFull ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-1.5">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => onViewClassStudents(k)}
                      className="gap-1 font-semibold"
                      title="Lihat Siswa di Kelas Ini"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Siswa ({k.siswa_count || 0})</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => onOpenEditClass(k)}
                        className="gap-1 font-semibold"
                        title="Edit Jadwal & Pengajar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onDeleteClass(k.id, k.nama)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Nonaktifkan Kelas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}