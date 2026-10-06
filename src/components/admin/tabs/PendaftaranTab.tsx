"use client";

import React from "react";
import {
  Users,
  Phone,
  CheckCircle,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PendaftaranItem, WaitingListItem, KelasAdminItem } from "@/types/admin";

interface PendaftaranTabProps {
  pendaftaranList: PendaftaranItem[];
  waitingList: WaitingListItem[];
  kelasList: KelasAdminItem[];
  pendaftaranSubtab: "berkas" | "waiting-list";
  setPendaftaranSubtab: (subtab: "berkas" | "waiting-list") => void;
  onOpenAcceptModal: (pendaftaran: PendaftaranItem) => void;
  onAddToWaitingList: (pendaftaran: PendaftaranItem) => void;
  onRejectRegistration: (id: string) => void;
  onOpenAssignWaitingListModal: (wlItem: WaitingListItem) => void;
  onDeleteWaitingList: (id: string) => void;
}

export function PendaftaranTab({
  pendaftaranList,
  waitingList,
  pendaftaranSubtab,
  setPendaftaranSubtab,
  onOpenAcceptModal,
  onAddToWaitingList,
  onRejectRegistration,
  onOpenAssignWaitingListModal,
  onDeleteWaitingList,
}: PendaftaranTabProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "diterima":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold uppercase text-[10px]">
            Diterima
          </Badge>
        );
      case "ditolak":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 font-bold uppercase text-[10px]">
            Ditolak
          </Badge>
        );
      case "ditunda":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-bold uppercase text-[10px]">
            Ditunda
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase text-[10px]">
            {status || "Menunggu"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Penerimaan Siswa Baru & Antrean
          </h3>
          <p className="text-xs text-muted-foreground">
            Verifikasi berkas pendaftaran online dan kelola antrean waiting list saat kelas penuh
          </p>
        </div>

        {/* Segmented Control */}
        <div className="inline-flex items-center gap-1 bg-muted p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPendaftaranSubtab("berkas")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              pendaftaranSubtab === "berkas"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Berkas Masuk ({pendaftaranList.length})
          </button>
          <button
            type="button"
            onClick={() => setPendaftaranSubtab("waiting-list")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pendaftaranSubtab === "waiting-list"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Waiting List</span>
            {waitingList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--ahe-orange)] text-white font-black text-[10px] flex items-center justify-center">
                {waitingList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {pendaftaranSubtab === "berkas" && (
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3">No. Registrasi</th>
                  <th className="px-5 py-3">Calon Siswa</th>
                  <th className="px-5 py-3">Wali Murid & Kontak</th>
                  <th className="px-5 py-3">Program & Waktu</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pendaftaranList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-xs text-foreground">Belum ada berkas pendaftaran</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Semua berkas via formulir PPDB online akan muncul di sini</p>
                    </td>
                  </tr>
                ) : (
                  pendaftaranList.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                        {p.no_registrasi}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-foreground block">{p.nama_anak}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {p.tempat_lahir}, {p.tanggal_lahir}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-foreground block">{p.nama_ortu}</span>
                        <a
                          href={`https://wa.me/${p.no_wa_ortu?.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {p.no_wa_ortu}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-foreground block">
                          {p.program_nama || p.program_diminati}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          Waktu: {p.preferensi_jadwal}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.status === "menunggu" || p.status === "diproses" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="xs"
                              onClick={() => onOpenAcceptModal(p)}
                              className="gap-1 font-bold"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Terima</span>
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => onAddToWaitingList(p)}
                              title="Masukkan ke antrean daftar tunggu"
                              className="gap-1"
                            >
                              <Clock3 className="w-3.5 h-3.5" />
                              <span>Antrean</span>
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => onRejectRegistration(p.id)}
                            >
                              <span>Tolak</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Selesai diverifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pendaftaranSubtab === "waiting-list" && (
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-center">Antrean</th>
                  <th className="px-5 py-3">Calon Siswa & No. Reg</th>
                  <th className="px-5 py-3">Wali Murid</th>
                  <th className="px-5 py-3">Program & Waktu</th>
                  <th className="px-5 py-3">Catatan / Status</th>
                  <th className="px-5 py-3 text-right">Aksi Alokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {waitingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                      <Clock3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-xs text-foreground">Antrean Waiting List Kosong</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md mx-auto">
                        Saat rombel kelas 6/6 penuh, calon siswa dapat dialihkan ke waiting list agar mendapatkan prioritas rombel berikutnya.
                      </p>
                    </td>
                  </tr>
                ) : (
                  waitingList.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 text-center">
                        <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-black text-xs inline-flex items-center justify-center">
                          #{w.urutan_antrian}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-foreground block">
                          {w.pendaftaran?.nama_anak || "-"}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {w.pendaftaran?.no_registrasi || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-foreground block">
                          {w.pendaftaran?.nama_ortu || "-"}
                        </span>
                        <a
                          href={`https://wa.me/${w.pendaftaran?.no_wa_ortu?.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {w.pendaftaran?.no_wa_ortu || "-"}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-foreground block">
                          {w.program?.nama || "Level Program"}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          Waktu: {w.preferensi_jadwal}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant="outline"
                          className={
                            w.status === "ditempatkan"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase text-[10px]"
                              : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 uppercase text-[10px]"
                          }
                        >
                          {w.status}
                        </Badge>
                        {w.catatan && (
                          <p className="text-[11px] text-muted-foreground max-w-xs truncate mt-0.5">
                            {w.catatan}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status === "menunggu" && (
                            <Button
                              size="xs"
                              onClick={() => onOpenAssignWaitingListModal(w)}
                              className="gap-1 font-bold"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Alokasikan</span>
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => onDeleteWaitingList(w.id)}
                          >
                            Hapus
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
      )}
    </div>
  );
}