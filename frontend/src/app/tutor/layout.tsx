"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TutorSidebar } from "@/components/dashboard/TutorSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Loader2 } from "lucide-react";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ nama: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.role !== "tutor" && json.data.role !== "admin") {
            router.replace("/login");
            return;
          }
          setUser({
            nama: json.data.nama,
            role: json.data.role,
          });
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
          <p className="text-xs font-semibold text-slate-600">Memuat Portal Tutor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <TutorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Portal Tutor AHE"
          subtitle="Pencatatan sesi belajar, absensi harian & perkembangan siswa"
          userName={user?.nama || "Tutor AHE"}
          userRole="tutor"
          showSidebarToggle={true}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
