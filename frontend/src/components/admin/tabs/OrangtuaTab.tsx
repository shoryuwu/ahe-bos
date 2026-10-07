"use client";

import React from "react";
import {
  Search,
  Phone,
  Edit,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OrangtuaAdminItem } from "@/types/admin";

interface OrangtuaTabProps {
  filteredOrangtua: OrangtuaAdminItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenEditParent: (parent: OrangtuaAdminItem) => void;
}

export function OrangtuaTab({
  filteredOrangtua,
  searchQuery,
  setSearchQuery,
  onOpenEditParent,
}: OrangtuaTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Data Orang Tua & Wali Murid
          </h3>
          <p className="text-xs text-muted-foreground">
            Daftar kontak wali murid dan akses akun portal orang tua
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari wali murid, no WA, atau nama anak..."
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
                <th className="px-5 py-3">Nama Wali Murid</th>
                <th className="px-5 py-3">Akun Login Portal</th>
                <th className="px-5 py-3">Kontak WhatsApp</th>
                <th className="px-5 py-3">Ananda Terdaftar</th>
                <th className="px-5 py-3">Alamat</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrangtua.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs text-foreground">Tidak ada data wali murid</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Coba sesuaikan kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredOrangtua.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {o.nama?.charAt(0) || "W"}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{o.nama}</span>
                          <span className="text-[10px] text-muted-foreground capitalize">{o.hubungan || "Wali"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-mono text-foreground font-semibold block text-[11px]">
                          {o.user_email || o.email || `${o.no_wa?.replace(/\D/g, "")}@ahe.id`}
                        </span>
                        <Badge
                          variant="outline"
                          className={`mt-0.5 text-[9px] font-bold uppercase ${
                            o.user_active
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {o.user_active ? "Akun Aktif" : "Belum Aktif"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`https://wa.me/${o.no_wa?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {o.no_wa}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {o.anak && o.anak.length > 0 ? (
                          o.anak.map((c) => (
                            <Badge
                              key={c.id}
                              variant="outline"
                              className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold"
                            >
                              {c.nama} ({c.level})
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[11px] text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground max-w-xs truncate">
                      {o.alamat || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => onOpenEditParent(o)}
                        className="gap-1 font-semibold"
                        title="Edit Data Wali Murid"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
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