"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  PenTool,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Loader2,
  TrendingUp,
} from "lucide-react";

interface KelasSummary {
  id: string;
  nama: string;
  program: string;
  jam_mulai: string;
  jam_selesai: string;
  jumlah_siswa: number;
  jadwal_hari: string[];
  siswa: { id: string; nama: string; level: string }[];
}

export default function TutorOverviewPage() {
  const [classes, setClasses] = useState<KelasSummary[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kRes, sRes] = await fetch("/api/jadwal/tutor").then((r) => r.json());
        const sessRes = await fetch("/api/sesi").then((r) => r.json());

        if (kRes && kRes.success) {
          setClasses(kRes.data);
        }
        if (sessRes && sessRes.success) {
          setRecentSessions(sessRes.data.slice(0, 5));
        }
      } catch {
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    }

    async function loadDataProper() {
      try {
        const resClasses = await fetch("/api/jadwal/tutor");
        const jsonClasses = await resClasses.json();
        if (jsonClasses.success) {
          setClasses(jsonClasses.data);
        }

        const resSessions = await fetch("/api/sesi");
        const jsonSessions = await resSessions.json();
        if (jsonSessions.success) {
          setRecentSessions(jsonSessions.data.slice(0, 5));
        }
      } catch {
        //
      } finally {
        setLoading(false);
      }
    }

    loadDataProper();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  const totalSiswa = classes.reduce((acc, curr) => acc + curr.jumlah_siswa, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Selamat Mengajar!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Workstation Tutor Pengajar
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Kelola {classes.length} kelas aktif dengan total {totalSiswa} peserta didik binaan.
          </p>
        </div>
        <Link
          href="/tutor/input-sesi"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-950 font-extrabold text-xs shadow-md hover:bg-white/90 transition-all shrink-0 cursor-pointer"
        >
          <PenTool className="w-4 h-4 text-fuchsia-600" />
          <span>Input Sesi Hari Ini</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Kelas Diampu</span>
            <p className="text-2xl font-black text-slate-900">{classes.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Siswa Binaan</span>
            <p className="text-2xl font-black text-slate-900">{totalSiswa}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Sesi Terdokumentasi</span>
            <p className="text-2xl font-black text-slate-900">{recentSessions.length}</p>
          </div>
        </div>
      </div>

      {/* Active Classes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fuchsia-600" />
            Jadwal Kelas Aktif Anda
          </h3>
          <Link href="/tutor/jadwal" className="text-xs font-bold text-fuchsia-600 hover:underline">
            Lihat Semua Jadwal →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {cls.program}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {cls.jumlah_siswa} / 6 Siswa
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{cls.nama}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {cls.jam_mulai} - {cls.jam_selesai} WITA
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cls.jadwal_hari.map((h) => (
                    <span key={h} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {cls.siswa.length > 0 ? `${cls.siswa.length} anak terdaftar` : "Belum ada siswa"}
                </span>
                <Link
                  href={`/tutor/input-sesi`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700"
                >
                  Catat KBM
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Riwayat Sesi Pembelajaran Terbaru
        </h3>

        {recentSessions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">Belum ada sesi pembelajaran yang dicatat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="pb-2.5">Tanggal</th>
                  <th className="pb-2.5">Kelas</th>
                  <th className="pb-2.5">Materi</th>
                  <th className="pb-2.5">Kehadiran</th>
                  <th className="pb-2.5">Rata-rata Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-semibold text-slate-800">{s.tanggal}</td>
                    <td className="py-3 text-slate-700">{s.kelas?.nama || "-"}</td>
                    <td className="py-3 font-medium text-slate-900">{s.materi}</td>
                    <td className="py-3 text-slate-600">
                      {s.hadir_count} / {s.total_siswa} Hadir
                    </td>
                    <td className="py-3 font-bold text-fuchsia-600">
                      {s.rata_rata_nilai ? `${s.rata_rata_nilai} / 100` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
