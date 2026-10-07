"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AsesmenAdminItem } from "@/types/admin";

interface KenaikanLevelTabProps {
  asesmenList: AsesmenAdminItem[];
  onApproveAssessment: (id: string) => void;
}

export function KenaikanLevelTab({
  asesmenList,
  onApproveAssessment,
}: KenaikanLevelTabProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disetujui":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase text-[10px] font-bold">
            Disetujui
          </Badge>
        );
      case "ditolak":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 uppercase text-[10px] font-bold">
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 uppercase text-[10px] font-bold">
            {status || "Menunggu"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Pengajuan Asesmen Kenaikan Level
        </h3>
        <p className="text-xs text-muted-foreground">
          Verifikasi kelulusan siswa dan terbitkan pengakuan kenaikan jenjang membaca
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Nama Siswa</th>
                <th className="px-5 py-3">Kenaikan Level</th>
                <th className="px-5 py-3 text-center">Nilai Ujian</th>
                <th className="px-5 py-3">Tutor Penguji</th>
                <th className="px-5 py-3">Catatan Tutor</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {asesmenList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs text-foreground">Belum ada pengajuan asesmen</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Pengajuan evaluasi membaca dari tutor akan muncul di sini untuk verifikasi admin.
                    </p>
                  </td>
                </tr>
              ) : (
                asesmenList.map((asm) => (
                  <tr key={asm.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {(asm.siswa?.nama || asm.siswa_nama || "S").charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">
                            {asm.siswa?.nama || asm.siswa_nama || "-"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {asm.siswa_id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-border uppercase text-[10px]">
                          {asm.dari_level?.replace("-", " ")}
                        </Badge>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-bold">
                          {asm.ke_level?.replace("-", " ")}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-mono">
                        <span className="text-muted-foreground">Tulis: <strong className="text-foreground">{asm.nilai_tertulis}</strong></span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground">Praktik: <strong className="text-primary">{asm.nilai_praktik}</strong></span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-foreground font-medium">
                      {asm.guru?.nama || asm.guru_nama || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground max-w-xs truncate text-xs">
                      {asm.catatan}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(asm.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {asm.status === "menunggu" ? (
                        <Button
                          size="xs"
                          onClick={() => onApproveAssessment(asm.id)}
                          className="gap-1 font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                          Telah Disetujui
                        </span>
                      )}
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