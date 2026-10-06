"use client";

import React from "react";
import {
  Plus,
  Phone,
  FolderOpen,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GuruAdminItem } from "@/types/admin";

interface GuruTabProps {
  guruList: GuruAdminItem[];
  onOpenAddTeacherModal: () => void;
  onOpenEditTeacher: (teacher: GuruAdminItem) => void;
  onDeleteTeacher: (id: string, nama: string) => void;
}

export function GuruTab({
  guruList,
  onOpenAddTeacherModal,
  onOpenEditTeacher,
  onDeleteTeacher,
}: GuruTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Data Tutor & Pengajar</h3>
          <p className="text-xs text-muted-foreground">
            Kelola akun pengajar bimbingan dan penugasan rombel belajar
          </p>
        </div>

        <Button
          onClick={onOpenAddTeacherModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tutor Baru</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {guruList.length === 0 ? (
          <div className="col-span-full bg-card rounded-2xl p-12 border border-border text-center text-muted-foreground">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-xs text-foreground">Belum ada data tutor</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tambahkan tutor baru untuk mulai mengelola kelas.</p>
          </div>
        ) : (
          guruList.map((g) => (
            <div
              key={g.id}
              className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col justify-between hover:border-border/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary font-black text-base flex items-center justify-center">
                    {g.nama?.charAt(0) || "T"}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      g.is_active
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold uppercase text-[10px]"
                        : "bg-muted text-muted-foreground border-border uppercase text-[10px]"
                    }
                  >
                    {g.is_active ? "Aktif Mengajar" : "Nonaktif"}
                  </Badge>
                </div>

                <h4 className="font-bold text-sm text-foreground">{g.nama}</h4>
                <p className="text-xs text-muted-foreground mb-3">{g.email}</p>

                <div className="space-y-1.5 text-xs text-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {g.no_wa ? (
                      <a
                        href={`https://wa.me/${g.no_wa?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                        title="Chat WhatsApp Tutor"
                      >
                        {g.no_wa}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{g.total_kelas || 0}</strong> Kelas • <strong className="text-foreground">{g.total_siswa || 0}</strong> Siswa Aktif
                    </span>
                  </div>
                </div>

                {g.spesialisasi && g.spesialisasi.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Spesialisasi Level:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {g.spesialisasi.map((s: string) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold uppercase"
                        >
                          {s.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Kelas yang Diampu:
                  </span>
                  {g.kelas_list && g.kelas_list.length > 0 ? (
                    <div className="space-y-1.5">
                      {g.kelas_list.map((k) => (
                        <div
                          key={k.id}
                          className="p-2 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-foreground block text-xs">{k.nama}</span>
                            {k.jam && <span className="text-[10px] text-muted-foreground">{k.jam} WITA</span>}
                          </div>
                          <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {k.siswa_count || 0}/{k.kapasitas || 6}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Belum memegang kelas aktif</span>
                  )}
                </div>
              </div>

              <div className="pt-3.5 border-t border-border flex items-center justify-between gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => onOpenEditTeacher(g)}
                  className="gap-1 font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => onDeleteTeacher(g.id, g.nama)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}