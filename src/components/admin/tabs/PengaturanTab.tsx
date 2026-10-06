"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Key,
  Star,
  Trash2,
  Clock,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  AkunAdminItem,
  FaqAdminItem,
  TestimoniAdminItem,
  LogAdminItem,
  GaleriAdminItem,
} from "@/types/admin";

interface PengaturanTabProps {
  pengaturanSubtab: "profil" | "akun" | "galeri" | "faq" | "testimoni" | "log";
  setPengaturanSubtab: (subtab: "profil" | "akun" | "galeri" | "faq" | "testimoni" | "log") => void;
  // Profil
  settingsMap: Record<string, string>;
  setSettingsMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSaveSettings: (e: React.FormEvent) => void;
  isProcessing: boolean;
  // Akun
  akunList: AkunAdminItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterAkunRole: string;
  setFilterAkunRole: (role: string) => void;
  filterAkunStatus: string;
  setFilterAkunStatus: (status: string) => void;
  onOpenAddUserModal: () => void;
  handleUnlockUser: (user: AkunAdminItem) => void;
  handleResetUserPassword: (user: AkunAdminItem) => void;
  handleToggleUserActive: (user: AkunAdminItem) => void;
  // Galeri
  galeriList: GaleriAdminItem[];
  newGaleriForm: { image_url: string; caption: string; kategori: string };
  setNewGaleriForm: React.Dispatch<React.SetStateAction<{ image_url: string; caption: string; kategori: string }>>;
  selectedGaleriFile: File | null;
  setSelectedGaleriFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleCreateGaleri: (e: React.FormEvent) => void;
  handleDeleteGaleri: (id: string) => void;
  // FAQ
  faqList: FaqAdminItem[];
  newFaqForm: { pertanyaan: string; jawaban: string };
  setNewFaqForm: React.Dispatch<React.SetStateAction<{ pertanyaan: string; jawaban: string }>>;
  handleCreateFaq: (e: React.FormEvent) => void;
  handleDeleteFaq: (id: string) => void;
  // Testimoni
  testimoniList: TestimoniAdminItem[];
  newTestiForm: { nama_ortu: string; nama_anak: string; usia_anak: string; ulasan: string; rating: number };
  setNewTestiForm: React.Dispatch<React.SetStateAction<{ nama_ortu: string; nama_anak: string; usia_anak: string; ulasan: string; rating: number }>>;
  handleCreateTestimoni: (e: React.FormEvent) => void;
  handleToggleTestimoni: (id: string, currentStatus: boolean) => void;
  handleDeleteTestimoni: (id: string) => void;
  // Log
  logList: LogAdminItem[];
}

export function PengaturanTab({
  pengaturanSubtab,
  setPengaturanSubtab,
  settingsMap,
  setSettingsMap,
  handleSaveSettings,
  isProcessing,
  akunList,
  searchQuery,
  setSearchQuery,
  filterAkunRole,
  setFilterAkunRole,
  filterAkunStatus,
  setFilterAkunStatus,
  onOpenAddUserModal,
  handleUnlockUser,
  handleResetUserPassword,
  handleToggleUserActive,
  galeriList,
  newGaleriForm,
  setNewGaleriForm,
  selectedGaleriFile,
  setSelectedGaleriFile,
  handleCreateGaleri,
  handleDeleteGaleri,
  faqList,
  newFaqForm,
  setNewFaqForm,
  handleCreateFaq,
  handleDeleteFaq,
  testimoniList,
  newTestiForm,
  setNewTestiForm,
  handleCreateTestimoni,
  handleToggleTestimoni,
  handleDeleteTestimoni,
  logList,
}: PengaturanTabProps) {
  const [uploadMode, setUploadMode] = useState<"device" | "url">("device");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedGaleriFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleClearFile = () => {
    setSelectedGaleriFile(null);
    setFilePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Consistent Segmented Control for Subtabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-muted p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setPengaturanSubtab("profil")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            pengaturanSubtab === "profil"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Profil Bimbel
        </button>
        <button
          type="button"
          onClick={() => setPengaturanSubtab("akun")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            pengaturanSubtab === "akun"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Kelola Akun</span>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0">
            {akunList.length}
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setPengaturanSubtab("galeri")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            pengaturanSubtab === "galeri"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Galeri Foto</span>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0">
            {galeriList.length}
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setPengaturanSubtab("faq")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            pengaturanSubtab === "faq"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          FAQ ({faqList.length})
        </button>
        <button
          type="button"
          onClick={() => setPengaturanSubtab("testimoni")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            pengaturanSubtab === "testimoni"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Testimoni ({testimoniList.length})
        </button>
        <button
          type="button"
          onClick={() => setPengaturanSubtab("log")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            pengaturanSubtab === "log"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Log Aktivitas ({logList.length})
        </button>
      </div>

      {/* Subtab 1: Profil Bimbel Form */}
      {pengaturanSubtab === "profil" && (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-xs max-w-2xl">
          <h4 className="font-bold text-sm text-foreground mb-4">
            Informasi Identitas & Kontak Unit
          </h4>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Nama Lembaga / Bimbel
              </label>
              <input
                type="text"
                value={settingsMap.nama_bimbel || "Bimbel AHE Karang Joang"}
                onChange={(e) =>
                  setSettingsMap({ ...settingsMap, nama_bimbel: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Alamat Lengkap Unit
              </label>
              <textarea
                rows={2}
                value={
                  settingsMap.alamat ||
                  "Jl. Soekarno Hatta Km. 11, Karang Joang, Balikpapan Utara"
                }
                onChange={(e) =>
                  setSettingsMap({ ...settingsMap, alamat: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Nomor WhatsApp Hotline
                </label>
                <input
                  type="text"
                  value={settingsMap.kontak_wa || "6281234567890"}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, kontak_wa: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Email Kontak
                </label>
                <input
                  type="email"
                  value={settingsMap.email || "ahe.karangjoang@gmail.com"}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Jam Operasional Bimbingan
              </label>
              <input
                type="text"
                value={
                  settingsMap.jam_operasional ||
                  "Senin - Sabtu: 08.00 - 17.30 WITA"
                }
                onChange={(e) =>
                  setSettingsMap({ ...settingsMap, jam_operasional: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="font-bold text-xs"
            >
              {isProcessing ? "Menyimpan..." : "Simpan Perubahan Pengaturan"}
            </Button>
          </form>
        </div>
      )}

      {/* Subtab 2: Kelola Akun Pengguna */}
      {pengaturanSubtab === "akun" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Kelola Akun Pengguna Sistem
              </h3>
              <p className="text-xs text-muted-foreground">
                Manajemen hak akses, pembukaan akun terkunci (unlock), dan reset kata sandi
              </p>
            </div>

            <Button
              onClick={onOpenAddUserModal}
              className="gap-1.5 font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun Baru</span>
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-semibold">Role:</span>
                <select
                  value={filterAkunRole}
                  onChange={(e) => setFilterAkunRole(e.target.value)}
                  className="border border-input rounded-xl px-2.5 py-1.5 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Administrator</option>
                  <option value="tutor">Tutor Pengajar</option>
                  <option value="orangtua">Orang Tua Murid</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-semibold">Status:</span>
                <select
                  value={filterAkunStatus}
                  onChange={(e) => setFilterAkunStatus(e.target.value)}
                  className="border border-input rounded-xl px-2.5 py-1.5 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="terkunci">Terkunci</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Users */}
          <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Nama Pengguna</th>
                    <th className="px-5 py-3">Email (Login ID)</th>
                    <th className="px-5 py-3">Peran / Role</th>
                    <th className="px-5 py-3">Status Akun</th>
                    <th className="px-5 py-3">Terakhir Login</th>
                    <th className="px-5 py-3 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {akunList
                    .filter((u) => {
                      const matchSearch =
                        u.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchRole = filterAkunRole === "all" || u.role === filterAkunRole;
                      const matchStatus =
                        filterAkunStatus === "all" ||
                        (filterAkunStatus === "terkunci" && u.is_locked) ||
                        (filterAkunStatus === "aktif" && u.is_active && !u.is_locked) ||
                        (filterAkunStatus === "nonaktif" && !u.is_active);
                      return matchSearch && matchRole && matchStatus;
                    })
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                              {u.nama?.charAt(0) || "U"}
                            </div>
                            <div>
                              <span className="font-bold text-foreground block">{u.nama}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">ID: {u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-foreground font-semibold">
                          {u.email}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase ${
                              u.role === "admin"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : u.role === "tutor"
                                ? "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                            }`}
                          >
                            {u.role === "admin" ? "Admin" : u.role === "tutor" ? "Tutor" : "Orang Tua"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.is_locked ? (
                            <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 font-bold uppercase text-[10px]">
                              Terkunci
                            </Badge>
                          ) : u.is_active ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold uppercase text-[10px]">
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-bold uppercase text-[10px]">
                              Nonaktif
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground font-mono text-[11px]">
                          {u.last_login_at || "Belum login"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.is_locked && (
                              <Button
                                size="xs"
                                onClick={() => handleUnlockUser(u)}
                                className="bg-[var(--ahe-orange)] hover:opacity-90 text-white font-bold"
                                title="Buka kunci akun akibat salah sandi berturut-turut"
                              >
                                Buka Kunci
                              </Button>
                            )}
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleResetUserPassword(u)}
                              className="gap-1 font-semibold"
                              title="Reset Password Pengguna"
                            >
                              <Key className="w-3.5 h-3.5" />
                              <span>Reset PW</span>
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleToggleUserActive(u)}
                              className={
                                u.is_active
                                  ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50"
                              }
                            >
                              {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Galeri Foto Kegiatan */}
      {pengaturanSubtab === "galeri" && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-xs max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span>Tambah Foto Momen Galeri</span>
              </h4>

              {/* Toggle upload method */}
              <div className="inline-flex items-center bg-muted p-1 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadMode("device")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    uploadMode === "device"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dari Perangkat
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    uploadMode === "url"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Link URL
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateGaleri} className="space-y-4 text-xs">
              {/* Device Upload Dropzone */}
              {uploadMode === "device" ? (
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Pilih File Gambar dari Komputer / HP
                  </label>

                  {selectedGaleriFile && filePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-muted p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background shrink-0 border border-border">
                          <Image
                            src={filePreview}
                            alt="Preview file terpilih"
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-xs truncate">
                            {selectedGaleriFile.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {(selectedGaleriFile.size / (1024 * 1024)).toFixed(2)} MB • Siap diunggah
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={handleClearFile}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                        title="Batal pilih file ini"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-foreground text-xs">
                        Klik untuk pilih foto dari perangkat Anda
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1">
                        Format PNG, JPG, JPEG, WEBP (Maksimal 10 MB)
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                /* URL Input Mode */
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    URL Gambar Foto
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newGaleriForm.image_url}
                    onChange={(e) =>
                      setNewGaleriForm({ ...newGaleriForm, image_url: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {newGaleriForm.image_url && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border bg-muted mt-2">
                      <Image
                        src={newGaleriForm.image_url}
                        alt="Preview URL gambar"
                        fill
                        sizes="400px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-foreground mb-1">
                    Keterangan Momen / Caption
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Belajar membaca kartu huruf..."
                    value={newGaleriForm.caption}
                    onChange={(e) =>
                      setNewGaleriForm({ ...newGaleriForm, caption: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Kategori Momen
                  </label>
                  <select
                    value={newGaleriForm.kategori}
                    onChange={(e) =>
                      setNewGaleriForm({ ...newGaleriForm, kategori: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Belajar">Belajar</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Aktivitas">Aktivitas</option>
                    <option value="Outing">Outing</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                size="sm"
                className="font-bold gap-1.5"
              >
                {isProcessing ? (
                  <span>Mengunggah...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah & Simpan ke Galeri</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Grid List of Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriList.length === 0 ? (
              <div className="col-span-full bg-card rounded-2xl p-12 border border-border text-center text-muted-foreground">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-xs text-foreground">Belum ada foto galeri</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Unggah foto dari perangkat Anda untuk langsung tampil di beranda.</p>
              </div>
            ) : (
              galeriList.map((g) => (
                <div
                  key={g.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="relative w-full h-44 bg-muted">
                    <Image
                      src={g.image_url}
                      alt={g.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="outline" className="bg-black/60 text-white border-white/20 text-[10px] font-bold backdrop-blur-xs">
                        {g.kategori}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <p className="text-xs font-semibold text-foreground line-clamp-2 mb-3">
                      {g.caption}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {g.id}
                      </span>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteGaleri(g.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
                        title="Hapus foto dari galeri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 4: FAQ Management */}
      {pengaturanSubtab === "faq" && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-xs max-w-2xl">
            <h4 className="font-bold text-sm text-foreground mb-3">Tambah FAQ Baru</h4>
            <form onSubmit={handleCreateFaq} className="space-y-3 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Pertanyaan umum yang sering diajukan..."
                  value={newFaqForm.pertanyaan}
                  onChange={(e) =>
                    setNewFaqForm({ ...newFaqForm, pertanyaan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Jawaban resmi..."
                  value={newFaqForm.jawaban}
                  onChange={(e) =>
                    setNewFaqForm({ ...newFaqForm, jawaban: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                type="submit"
                disabled={isProcessing}
                size="sm"
                className="font-bold"
              >
                Simpan FAQ
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {faqList.map((f) => (
              <div
                key={f.id}
                className="bg-card p-4 rounded-2xl border border-border flex items-start justify-between gap-4 shadow-xs"
              >
                <div>
                  <h5 className="font-bold text-xs text-foreground">{f.pertanyaan}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{f.jawaban}</p>
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleDeleteFaq(f.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: Testimoni Management */}
      {pengaturanSubtab === "testimoni" && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-xs max-w-2xl">
            <h4 className="font-bold text-sm text-foreground mb-3">
              Tambah Testimoni Orang Tua
            </h4>
            <form onSubmit={handleCreateTestimoni} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Orang Tua..."
                  value={newTestiForm.nama_ortu}
                  onChange={(e) =>
                    setNewTestiForm({ ...newTestiForm, nama_ortu: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="Nama Anak..."
                  value={newTestiForm.nama_anak}
                  onChange={(e) =>
                    setNewTestiForm({ ...newTestiForm, nama_anak: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Ulasan pengalaman belajar ananda..."
                value={newTestiForm.ulasan}
                onChange={(e) =>
                  setNewTestiForm({ ...newTestiForm, ulasan: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="submit"
                disabled={isProcessing}
                size="sm"
                className="font-bold"
              >
                Simpan Testimoni
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimoniList.map((t) => (
              <div
                key={t.id}
                className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[var(--ahe-orange)]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        t.is_tampil
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {t.is_tampil ? "Tampil di Web" : "Disembunyikan"}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground italic mb-3">&ldquo;{t.ulasan}&rdquo;</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border text-[11px]">
                  <span className="font-bold text-foreground">
                    {t.nama_ortu} (Ortu {t.nama_anak})
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="xs"
                      variant="link"
                      onClick={() => handleToggleTestimoni(t.id, t.is_tampil)}
                      className="font-bold cursor-pointer"
                    >
                      {t.is_tampil ? "Sembunyikan" : "Tampilkan"}
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDeleteTestimoni(t.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Hapus Testimoni"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 6: Log Aktivitas Sistem */}
      {pengaturanSubtab === "log" && (
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10.5px] font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3">Waktu Kejadian</th>
                  <th className="px-5 py-3">Aksi / Aktivitas</th>
                  <th className="px-5 py-3">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-xs text-foreground">Belum ada riwayat aktivitas</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Semua aksi administratif akan tercatat otomatis di sini.</p>
                    </td>
                  </tr>
                ) : (
                  logList.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {l.created_at}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase bg-primary/10 text-primary border-primary/20">
                          {l.aksi}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-foreground">
                        {l.detail}
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