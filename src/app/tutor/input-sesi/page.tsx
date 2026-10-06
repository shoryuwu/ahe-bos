"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Smile,
  Meh,
  Frown,
  Star,
  Users,
  Sparkles,
} from "lucide-react";

interface KelasItem {
  id: string;
  nama: string;
  program: string;
  level_kode: string;
  jadwal_hari: string[];
  jam_mulai: string;
  jam_selesai: string;
  siswa: { id: string; nama: string; level: string }[];
}

interface ModulItem {
  id: string;
  kode: string;
  judul: string;
}

interface SiswaFormState {
  siswa_id: string;
  nama: string;
  absensi: "hadir" | "izin" | "sakit" | "alpha";
  nilai: number;
  mood: number;
  langkah_selesai: number[];
  catatan: string;
}

export default function InputSesiPage() {
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [selectedKelasId, setSelectedKelasId] = useState("");
  const [modulList, setModulList] = useState<ModulItem[]>([]);
  const [selectedModulId, setSelectedModulId] = useState("");

  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jamMulai, setJamMulai] = useState("08:30");
  const [jamSelesai, setJamSelesai] = useState("09:30");
  const [materi, setMateri] = useState("");
  const [catatanUmum, setCatatanUmum] = useState("");

  const [siswaData, setSiswaData] = useState<SiswaFormState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load teacher's classes on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch("/api/jadwal/tutor");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setKelasList(json.data);
          const firstClass = json.data[0];
          setSelectedKelasId(firstClass.id);
          setJamMulai(firstClass.jam_mulai || "08:30");
          setJamSelesai(firstClass.jam_selesai || "09:30");
        }
      } catch {
        setError("Gagal memuat jadwal kelas tutor.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // When selected class changes, load modules & students
  useEffect(() => {
    if (!selectedKelasId) return;

    const currentClass = kelasList.find((k) => k.id === selectedKelasId);
    if (currentClass) {
      setJamMulai(currentClass.jam_mulai || "08:30");
      setJamSelesai(currentClass.jam_selesai || "09:30");

      // Initialize students form state
      setSiswaData(
        currentClass.siswa.map((s) => ({
          siswa_id: s.id,
          nama: s.nama,
          absensi: "hadir",
          nilai: 85,
          mood: 5,
          langkah_selesai: [1, 2, 3, 4, 5, 6],
          catatan: "Mengikuti sesi dengan sangat baik dan fokus.",
        }))
      );
    }

    // Fetch modules
    async function fetchModules() {
      try {
        const res = await fetch("/api/modul");
        const json = await res.json();
        if (json.success) {
          setModulList(json.data);
        }
      } catch {
        // Module optional
      }
    }
    fetchModules();
  }, [selectedKelasId, kelasList]);

  // Method 6 steps AHE
  const aheSteps = [
    { num: 1, label: "Senam Otak" },
    { num: 2, label: "Tunjuk Bunyi" },
    { num: 3, label: "Remas Kata" },
    { num: 4, label: "Baca Kartu" },
    { num: 5, label: "Tulis Fonik" },
    { num: 6, label: "Dongeng Penutup" },
  ];

  function toggleStep(studentIndex: number, stepNum: number) {
    setSiswaData((prev) => {
      const copy = [...prev];
      const steps = copy[studentIndex].langkah_selesai;
      if (steps.includes(stepNum)) {
        copy[studentIndex].langkah_selesai = steps.filter((s) => s !== stepNum);
      } else {
        copy[studentIndex].langkah_selesai = [...steps, stepNum].sort();
      }
      return copy;
    });
  }

  function updateStudentField<K extends keyof SiswaFormState>(
    index: number,
    field: K,
    val: SiswaFormState[K]
  ) {
    setSiswaData((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!materi.trim()) {
      setError("Materi pembelajaran hari ini wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/sesi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_id: selectedKelasId,
          tanggal,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
          modul_id: selectedModulId || null,
          materi,
          catatan_umum: catatanUmum,
          siswa_data: siswaData,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Gagal menyimpan sesi belajar.");
      } else {
        setSuccess(
          `Sesi belajar tanggal ${tanggal} berhasil disimpan! Absensi dan penilaian telah otomatis masuk ke dashboard orang tua.`
        );
        setMateri("");
        setCatatanUmum("");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Terjadi gangguan jaringan saat menyimpan data sesi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-600/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
              Workstation Tutor
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pencatatan Sesi KBM Harian
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Catat kehadiran, nilai langkah metode AHE, indikator mood, dan pesan untuk orang tua
              secara langsung dalam satu kali simpan.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Info Sesi & Kelas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-fuchsia-600" />
            1. Informasi Kelas & Sesi Belajar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilih Kelas Bimbingan *
              </label>
              <select
                value={selectedKelasId}
                onChange={(e) => setSelectedKelasId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
              >
                {kelasList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama} ({k.program})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal Pertemuan *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mulai
                </label>
                <input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Selesai
                </label>
                <input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilih Modul Materi (Opsional)
              </label>
              <select
                value={selectedModulId}
                onChange={(e) => {
                  setSelectedModulId(e.target.value);
                  const m = modulList.find((x) => x.id === e.target.value);
                  if (m && !materi) {
                    setMateri(m.judul);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
              >
                <option value="">-- Pilih dari silabus modul --</option>
                {modulList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.kode} - {m.judul}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topik / Materi yang Dipelajari *
              </label>
              <input
                type="text"
                required
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
                placeholder="contoh: Suku kata ba, bi, bu, be, bo & latihan kartu kata"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Input Per Siswa (Quick Card Workstation) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-fuchsia-600" />
              2. Penilaian Peserta Didik ({siswaData.length} Siswa)
            </h3>
            <span className="text-xs text-slate-500">Maksimal 6 siswa per kelas AHE</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {siswaData.map((s, idx) => (
              <div
                key={s.siswa_id}
                className={`bg-white rounded-3xl p-5 border transition-all ${
                  s.absensi === "hadir"
                    ? "border-slate-200 shadow-sm"
                    : "border-slate-200 bg-slate-50/60 opacity-80"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 text-fuchsia-700 font-extrabold flex items-center justify-center text-sm">
                      {s.nama.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.nama}</h4>
                      <span className="text-[11px] text-slate-500">Siswa Aktif</span>
                    </div>
                  </div>

                  {/* Quick Attendance Switcher (Anti-slop pill from skill) */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(["hadir", "izin", "sakit", "alpha"] as const).map((stat) => (
                      <button
                        type="button"
                        key={stat}
                        onClick={() => updateStudentField(idx, "absensi", stat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                          s.absensi === stat
                            ? stat === "hadir"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : stat === "izin"
                              ? "bg-amber-500 text-white shadow-sm"
                              : stat === "sakit"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-rose-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* If Attended, show Score Sliders, Mood, Steps & Notes */}
                {s.absensi === "hadir" && (
                  <div className="mt-4 space-y-4 pt-1">
                    {/* Nilai & Mood */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase">
                            Skor Nilai Sesi:
                          </label>
                          <span className="text-sm font-extrabold text-fuchsia-600">
                            {s.nilai} / 100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          step="1"
                          value={s.nilai}
                          onChange={(e) =>
                            updateStudentField(idx, "nilai", Number(e.target.value))
                          }
                          className="w-full accent-fuchsia-600 cursor-pointer"
                        />
                      </div>

                      {/* Mood Selector */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Mood / Semangat Anak:
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => updateStudentField(idx, "mood", star)}
                              className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  s.mood >= star ? "fill-amber-400 text-amber-400" : "text-slate-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 6 Langkah Metode AHE Pills */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        Langkah Metode AHE yang Diselesaikan:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {aheSteps.map((st) => {
                          const isDone = s.langkah_selesai.includes(st.num);
                          return (
                            <button
                              type="button"
                              key={st.num}
                              onClick={() => toggleStep(idx, st.num)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                isDone
                                  ? "bg-purple-50 border-purple-400 text-purple-900 font-bold"
                                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                              }`}
                            >
                              {isDone ? "✓ " : ""}{st.num}. {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Catatan Khusus untuk Ortu */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Catatan Khusus untuk Orang Tua
                      </label>
                      <input
                        type="text"
                        value={s.catatan}
                        onChange={(e) => updateStudentField(idx, "catatan", e.target.value)}
                        placeholder="contoh: Pengucapan vokal sangat baik, perlu review kata berakhiran n di rumah"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Umum Sesi */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Catatan Evaluasi Umum Sesi (Opsional)
          </label>
          <textarea
            rows={2}
            value={catatanUmum}
            onChange={(e) => setCatatanUmum(e.target.value)}
            placeholder="Catatan umum mengenai dinamika kelas hari ini..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 hover:opacity-90 text-sm font-extrabold text-white shadow-xl shadow-fuchsia-600/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan Seluruh Sesi...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Sesi & Nilai Harian</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
