"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  FileText,
  Settings,
  FolderOpen,
  ClipboardList,
  Award,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  pendingPendaftaranCount?: number;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pendaftaran", label: "Pendaftaran (PPDB)", icon: ClipboardList, badge: true },
  { id: "siswa", label: "Data Siswa", icon: Users },
  { id: "orangtua", label: "Orang Tua", icon: UserCheck },
  { id: "guru", label: "Tutor & Guru", icon: GraduationCap },
  { id: "kelas", label: "Program & Kelas", icon: FolderOpen },
  { id: "monitoring", label: "Monitoring KBM", icon: TrendingUp },
  { id: "kenaikan-level", label: "Kenaikan Level", icon: Award },
  { id: "laporan", label: "Laporan & PDF", icon: FileText },
  { id: "pengaturan", label: "Pengaturan & CMS", icon: Settings },
];

export function AdminSidebar({
  activeTab,
  setActiveTab,
  open = false,
  setOpen,
  pendingPendaftaranCount = 0,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {open && setOpen && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 shadow-sm shrink-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="AHE Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <span className="font-bold text-base text-foreground leading-tight block">
                Admin AHE
              </span>
              <span className="text-[10px] text-primary font-semibold tracking-wide uppercase block -mt-0.5">
                Karang Joang
              </span>
            </div>
          </Link>
          {setOpen && (
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted md:hidden cursor-pointer"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setOpen) setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.id === "pendaftaran" && pendingPendaftaranCount > 0 && (
                  <span className="bg-[var(--ahe-orange)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingPendaftaranCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout / Back to home */}
        <div className="p-3 border-t border-border shrink-0 bg-card">
          <Link href="/">
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              Ke Beranda Website
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
