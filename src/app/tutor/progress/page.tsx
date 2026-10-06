"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface SiswaItem {
  id: string;
  nama: string;
  level_saat_ini: string;
  kelas?: { nama: string };
}

interface IndikatorState {
  mengenal_huruf: number;
  membaca_suku_kata: number;
  membaca_kata: number;
  membaca_kalimat: number;
  membaca_cerita: number;
}

export default function TutorProgressPage() {
  const [students, setStudents] = useState<SiswaItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [bulan, setBulan] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [indicators, setIndicators] = useState<IndikatorState>({
    mengenal_huruf: 80,
    membaca_suku_kata: 75,
    membaca_kata: 70,
    membaca_kalimat: 60,
    membaca_cerita: 50,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load students on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/siswa");
        const json = await res.json();
        if (json.success && json.data.items.length > 0) {
          setStudents(json.data.items);
          setSelectedStudentId(json.data.items[0].id);
        }
      } catch {
        setError("Gagal memuat data siswa.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When student or month changes, fetch existing indicators
  useEffect(() => {
    if (!selectedStudentId) return;

    async function loadIndicators() {
      try {
        const res = await fetch(`/api/progress-indikator/siswa/${selectedStudentId}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const match = json.data.find((item: any) => item.bulan === bulan);
          if (match) {
            setIndicators({
              mengenal_huruf: match.mengenal_huruf,
              membaca_suku_kata: match.membaca_suku_kata,
              membaca_kata: match.membaca_kata,
              membaca_kalimat: match.membaca_kalimat,
              membaca_cerita: match.membaca_cerita,
            });
          } else {
            // Default baseline
            setIndicators({
              mengenal_huruf: 75,
              membaca_suku_kata: 70,
              membaca_kata: 65,
              membaca_kalimat: 55,
              membaca_cerita: 45,
            });
          }
        }
      } catch {
        //
      }
    }
    loadIndicators();
  }, [selectedStudentId, bulan]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/progress-indikator/siswa/${selectedStudentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulan,
          ...indicators,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Gagal menyimpan indikator.");
      } else {
        setSuccess(`Indikator kemajuan membaca bulan ${bulan} berhasil disimpan.`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  const indicatorFields = [
    { key: "mengenal_huruf" as const, label: "Mengenal Huruf Alfabet", desc: "Ketepatan identifikasi visual & fonik huruf A-Z" },
    { key: "membaca_suku_kata" as const, label: "Membaca Suku Kata", desc: "Kelancaran merangkai vokal & konsonan (ba, ca, da...)" },
    { key: "membaca_kata" as const, label: "Membaca Kata Utuh", desc: "Kelancaran membaca kata sederhana & bermakna" },
    { key: "membaca_kalimat" as const, label: "Membaca Kalimat Pendek", desc: "Intonasi, jeda tanda baca & pemenggalan kata" },
    { key: "membaca_cerita" as const, label: "Membaca Cerita & Pemahaman", desc: "Kemampuan memahami alur cerita anak sederhana" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Penilaian Progress 5 Indikator Membaca
        </h2>
        <p className="text-xs text-slate-500">
          Evaluasi bulanan kompetensi membaca anak untuk laporan grafik perkembangan di akun orang tua
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        {/* Selector Siswa & Periode Bulan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pilih Siswa Binaan *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.level_saat_ini.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bulan Penilaian (Periode) *
            </label>
            <input
              type="month"
              required
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            >
            </input>
          </div>
        </div>

        {/* 5 Indicators Sliders */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            5 Dimensi Kompetensi Membaca Fonik AHE (0 - 100%)
          </h3>

          <div className="space-y-3">
            {indicatorFields.map((field) => (
              <div
                key={field.key}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{field.label}</h4>
                    <p className="text-[11px] text-slate-500">{field.desc}</p>
                  </div>
                  <span className="text-sm font-extrabold text-fuchsia-600 bg-fuchsia-50 px-2.5 py-1 rounded-xl">
                    {indicators[field.key]}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={indicators[field.key]}
                  onChange={(e) =>
                    setIndicators((prev) => ({
                      ...prev,
                      [field.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-fuchsia-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 text-xs font-bold text-white shadow-md disabled:opacity-60 cursor-pointer transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Nilai Indikator Bulan Ini</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
