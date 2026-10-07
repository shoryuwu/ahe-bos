"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SiswaAdminItem } from "@/types/admin";

interface LaporanTabProps {
  filteredStudents: SiswaAdminItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function LaporanTab({
  filteredStudents,
  searchQuery,
  setSearchQuery,
}: LaporanTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Laporan Hasil Belajar & Sertifikat
          </h3>
          <p className="text-xs text-muted-foreground">
            Cetak rapor bulanan dan piagam kelulusan jenjang resmi siswa AHE Karang Joang
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari siswa untuk cetak dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Nama Siswa</th>
                <th className="px-5 py-3">Level Saat Ini</th>
                <th className="px-5 py-3">Kelas & Pengajar</th>
                <th className="px-5 py-3">Kehadiran</th>
                <th className="px-5 py-3 text-right">Aksi Cetak Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs text-foreground">Tidak ada siswa ditemukan</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Coba sesuaikan kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-foreground block">{s.nama}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">ID: {s.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider">
                        {s.level_saat_ini}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-foreground block">{s.kelas?.nama || "Kelas"}</span>
                      <span className="text-[11px] text-muted-foreground">
                        Tutor: {s.kelas?.guru_nama || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                      {s.kehadiran_persen}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/laporan/rapor/${s.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="xs" variant="secondary" className="gap-1 font-semibold">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Rapor A4</span>
                          </Button>
                        </Link>

                        <Link
                          href={`/laporan/sertifikat/${s.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="xs" variant="outline" className="gap-1 font-semibold">
                            <Award className="w-3.5 h-3.5 text-primary" />
                            <span>Sertifikat</span>
                          </Button>
                        </Link>
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