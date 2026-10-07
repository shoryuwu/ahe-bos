"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, BookOpen, PenTool, ArrowRight, Loader2 } from "lucide-react";

export default function TutorJadwalPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await fetch("/api/jadwal/tutor");
        const json = await res.json();
        if (json.success) {
          setClasses(json.data);
        }
      } catch {
        //
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Jadwal Mengajar Tutor
          </h2>
          <p className="text-xs text-slate-500">
            Kalender dan daftar alokasi kelas bimbingan aktif Anda
          </p>
        </div>
        <Link
          href="/tutor/input-sesi"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <PenTool className="w-4 h-4" />
          <span>Input Sesi KBM</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                {cls.program}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>
                  {cls.jam_mulai} - {cls.jam_selesai} WITA
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{cls.nama}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cls.jadwal_hari.map((h: string) => (
                  <span
                    key={h}
                    className="text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* List of enrolled students in this class */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Daftar Peserta Didik ({cls.siswa.length} / {cls.kapasitas}):
              </span>
              {cls.siswa.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada siswa di kelas ini.</p>
              ) : (
                <div className="space-y-1.5">
                  {cls.siswa.map((st: any) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                          {st.nama.charAt(0)}
                        </div>
                        <span>{st.nama}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{st.level}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <Link
                href="/tutor/input-sesi"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700"
              >
                Mulai Catat Sesi Kelas Ini
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
