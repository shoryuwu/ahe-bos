"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";

interface SiswaItem {
  id: string;
  nama: string;
  level_saat_ini: string;
}

export default function TutorAsesmenPage() {
  const [students, setStudents] = useState<SiswaItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [dariLevel, setDariLevel] = useState("pra-membaca");
  const [keLevel, setKeLevel] = useState("level-1");
  const [nilaiTertulis, setNilaiTertulis] = useState(85);
  const [nilaiPraktik, setNilaiPraktik] = useState(90);
  const [catatan, setCatatan] = useState("");
  const [rekomendasi, setRekomendasi] = useState<"lulus" | "belum-siap">("lulus");

  const [checklists, setChecklists] = useState<string[]>([
    "Dapat membedakan huruf fonik secara visual dan bunyi",
    "Mampu mengeja 10 kombinasi suku kata tanpa bantuan",
  ]);

  const [asesmenList, setAsesmenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const levels = [
    { id: "pra-membaca", name: "Pra Membaca" },
    { id: "level-1", name: "Level 1 (Suku Kata)" },
    { id: "level-2", name: "Level 2 (Kata Utuh)" },
    { id: "level-3", name: "Level 3 (Kalimat)" },
    { id: "lanjutan", name: "Level Lanjutan (Cerita)" },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/siswa").then((r) => r.json()),
          fetch("/api/asesmen").then((r) => r.json()),
        ]);

        if (sRes.success && sRes.data.items.length > 0) {
          setStudents(sRes.data.items);
          setSelectedStudentId(sRes.data.items[0].id);
          setDariLevel(sRes.data.items[0].level_saat_ini);
        }
        if (aRes.success) {
          setAsesmenList(aRes.data);
        }
      } catch {
        setError("Gagal memuat data asesmen.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    const s = students.find((item) => item.id === selectedStudentId);
    if (s) {
      setDariLevel(s.level_saat_ini);
      // Auto-suggest next level
      const idx = levels.findIndex((lvl) => lvl.id === s.level_saat_ini);
      if (idx !== -1 && idx < levels.length - 1) {
        setKeLevel(levels[idx + 1].id);
      }
    }
  }, [selectedStudentId, students]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudentId || !catatan.trim()) {
      setError("Catatan evaluasi penguji wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/asesmen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswa_id: selectedStudentId,
          dari_level: dariLevel,
          ke_level: keLevel,
          nilai_tertulis: nilaiTertulis,
          nilai_praktik: nilaiPraktik,
          checklist_indikator: checklists,
          catatan,
          rekomendasi,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Gagal mengirim pengajuan asesmen.");
      } else {
        setSuccess(
          "Pengajuan asesmen kenaikan level berhasil dikirim ke Administrator untuk persetujuan resmi."
        );
        setCatatan("");
        // Reload list
        const aRes = await fetch("/api/asesmen").then((r) => r.json());
        if (aRes.success) setAsesmenList(aRes.data);
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
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
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Asesmen & Pengajuan Kenaikan Level
        </h2>
        <p className="text-xs text-slate-500">
          Uji kompetensi membaca anak hebat dan ajukan kelulusan jenjang untuk diverifikasi Admin
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Pengajuan */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-fuchsia-600" />
            Formulir Evaluasi Asesmen
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilih Peserta Didik *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} (Level saat ini: {s.level_saat_ini.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dari Level Asal
                </label>
                <select
                  value={dariLevel}
                  onChange={(e) => setDariLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                >
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Kenaikan Level *
                </label>
                <select
                  value={keLevel}
                  onChange={(e) => setKeLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                >
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Nilai Ujian Tertulis / Lembar Kerja:
                  </label>
                  <span className="text-xs font-black text-fuchsia-600">{nilaiTertulis}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={nilaiTertulis}
                  onChange={(e) => setNilaiTertulis(Number(e.target.value))}
                  className="w-full accent-fuchsia-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Nilai Praktik Membaca Nyaring:
                  </label>
                  <span className="text-xs font-black text-fuchsia-600">{nilaiPraktik}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={nilaiPraktik}
                  onChange={(e) => setNilaiPraktik(Number(e.target.value))}
                  className="w-full accent-fuchsia-600 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Rekomendasi Tutor Penguji *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    rekomendasi === "lulus"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="rekomendasi"
                    value="lulus"
                    checked={rekomendasi === "lulus"}
                    onChange={() => setRekomendasi("lulus")}
                    className="sr-only"
                  />
                  ✓ Direkomendasikan Lulus Level
                </label>

                <label
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    rekomendasi === "belum-siap"
                      ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="rekomendasi"
                    value="belum-siap"
                    checked={rekomendasi === "belum-siap"}
                    onChange={() => setRekomendasi("belum-siap")}
                    className="sr-only"
                  />
                  Perlu Pengayaan Tambahan
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Catatan Komprehensif Asesmen *
              </label>
              <textarea
                rows={3}
                required
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Uraikan kemajuan penguasaan bunyi fonik, kefasihan membaca kata, dan kesiapan ananda naik ke level berikutnya..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pengajuan Asesmen</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Riwayat Pengajuan Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Status Pengajuan Terbaru
          </h3>

          {asesmenList.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Belum ada asesmen yang diajukan.</p>
          ) : (
            <div className="space-y-3">
              {asesmenList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.siswa?.nama || "Siswa"}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.status === "disetujui"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "menunggu"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {item.dari_level} → <strong className="text-purple-700">{item.ke_level}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Nilai: {item.nilai_tertulis} (Tulis), {item.nilai_praktik} (Praktik)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
