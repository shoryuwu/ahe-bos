"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SiswaAdminItem } from "@/types/admin";

interface SiswaTabProps {
  filteredStudents: SiswaAdminItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLevel: string;
  setFilterLevel: (level: string) => void;
  onOpenAddStudentModal: () => void;
  onViewStudentDetail: (id: string) => void;
  onOpenEditStudent: (student: SiswaAdminItem) => void;
  onOpenStatusModal: (student: SiswaAdminItem) => void;
}

export function SiswaTab({
  filteredStudents,
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel,
  onOpenAddStudentModal,
  onViewStudentDetail,
  onOpenEditStudent,
  onOpenStatusModal,
}: SiswaTabProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
      case "lulus":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Data Seluruh Siswa</h3>
          <p className="text-xs text-muted-foreground">
            Kelola data peserta didik, mutasi status, dan penempatan kelas belajar
          </p>
        </div>

        <Button
          onClick={onOpenAddStudentModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama siswa atau orang tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground font-semibold">Level:</span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs border border-input bg-background text-foreground rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Semua Level</option>
            <option value="pra-membaca">Pra Membaca</option>
            <option value="level-1">Level 1</option>
            <option value="level-2">Level 2</option>
            <option value="level-3">Level 3</option>
            <option value="lanjutan">Lanjutan</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Nama Siswa</th>
                <th className="px-5 py-3">Level Kurikulum</th>
                <th className="px-5 py-3">Kelas & Tutor</th>
                <th className="px-5 py-3">Wali Murid</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Kehadiran</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs text-foreground">Tidak ada data siswa ditemukan</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Coba sesuaikan kata kunci pencarian atau filter level.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {s.nama?.charAt(0) || "S"}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onViewStudentDetail(s.id)}
                            className="font-bold text-foreground block hover:text-primary hover:underline text-left cursor-pointer"
                            title="Lihat Profil Lengkap Siswa"
                          >
                            {s.nama}
                          </button>
                          <span className="text-[10px] text-muted-foreground">
                            {s.tempat_lahir}, {s.tanggal_lahir}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
                        {s.level_saat_ini}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-foreground block">{s.kelas?.nama || "Belum ada"}</span>
                      <span className="text-[11px] text-muted-foreground">
                        Tutor: {s.kelas?.guru_nama || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-foreground block">{s.orangtua?.nama || "-"}</span>
                      <span className="text-[11px] text-muted-foreground">{s.orangtua?.no_wa || "-"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onOpenStatusModal(s)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadge(
                          s.status
                        )}`}
                        title="Klik untuk ubah status siswa"
                      >
                        {s.status} ✎
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-emerald-700 dark:text-emerald-400">
                      {s.kehadiran_persen}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => onViewStudentDetail(s.id)}
                          className="gap-1 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onOpenEditStudent(s)}
                          className="gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>
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