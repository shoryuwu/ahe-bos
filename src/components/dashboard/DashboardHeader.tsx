"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Menu, LogOut, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  avatarInitials?: string;
  avatarUrl?: string;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  userName = "Pengguna",
  userRole = "Member",
  avatarInitials = "U",
  avatarUrl,
  onToggleSidebar,
  showSidebarToggle = false,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors
    } finally {
      router.replace("/login");
    }
  }

  const roleLabel =
    userRole === "admin"
      ? "Administrator"
      : userRole === "tutor"
      ? "Tutor Pengajar"
      : userRole === "orangtua"
      ? "Wali Murid"
      : userRole;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden text-foreground"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-base md:text-lg font-bold text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="relative text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--ahe-orange)] ring-2 ring-white" />
          </Button>

          {showNotifModal && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Pemberitahuan Sistem
                </span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Terbaru
                </span>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Sistem Aktif Berjalan
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Seluruh fitur administrasi AHE siap digunakan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors">
                  <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Metode AHE Terintegrasi
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pencatatan 6 langkah belajar aktif pada sesi bimbingan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs md:text-sm font-semibold text-foreground">
              {userName}
            </span>
            <span className="text-[11px] text-muted-foreground">{roleLabel}</span>
          </div>

          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border flex items-center justify-center text-white font-bold text-xs shadow-sm bg-purple-600">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span>{avatarInitials || userName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Keluar dari Akun"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
