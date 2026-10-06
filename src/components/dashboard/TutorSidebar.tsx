"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  PenTool,
  TrendingUp,
  Award,
  Video,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorSidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const tutorNavItems = [
  { href: "/tutor", label: "Overview Tutor", icon: LayoutDashboard },
  { href: "/tutor/input-sesi", label: "Input Sesi Belajar", icon: PenTool, highlight: true },
  { href: "/tutor/jadwal", label: "Jadwal Mengajar", icon: Calendar },
  { href: "/tutor/siswa", label: "Daftar Siswa", icon: Users },
  { href: "/tutor/progress", label: "Progress Indikator", icon: TrendingUp },
  { href: "/tutor/asesmen", label: "Asesmen Kenaikan", icon: Award },
];

export function TutorSidebar({ open = false, setOpen }: TutorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 shrink-0 shadow-sm",
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
              Tutor AHE
            </span>
            <span className="text-[10px] text-fuchsia-600 font-semibold tracking-wide uppercase block -mt-0.5">
              Portal Pengajar
            </span>
          </div>
        </Link>
        {setOpen && (
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {tutorNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-fuchsia-600/20"
                  : item.highlight
                  ? "bg-fuchsia-50/70 text-fuchsia-950 border border-fuchsia-200/80 hover:bg-fuchsia-100/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Home */}
      <div className="p-3 border-t border-border shrink-0 bg-card">
        <Link href="/">
          <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Ke Beranda Website
          </button>
        </Link>
      </div>
    </aside>
  );
}
