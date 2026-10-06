"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Plus, MessageSquare, Loader2, Award, Calendar, CheckCircle2 } from "lucide-react";

export default function TutorSiswaPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Quick note modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<"progress" | "saran" | "pencapaian">("progress");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/siswa");
        const json = await res.json();
        if (json.success) {
          setStudents(json.data.items);
        }
      } catch {
        //
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudent || !noteText.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch("/api/catatan-guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswa_id: selectedStudent.id,
          catatan: noteText,
          tipe: noteType,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNoteSuccess(true);
        setTimeout(() => {
          setSelectedStudent(null);
          setNoteText("");
          setNoteSuccess(false);
        }, 1200);
      }
    } catch {
      //
    } finally {
      setSubmittingNote(false);
    }
  }

  const filtered = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      (s.orangtua && s.orangtua.nama.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Daftar Peserta Didik Binaan
          </h2>
          <p className="text-xs text-slate-500">
            Pantau perkembangan dan kirim catatan kemajuan langsung ke orang tua
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-fuchsia-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {s.level_saat_ini}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {s.kehadiran_persen}% Hadir
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 text-fuchsia-800 font-extrabold flex items-center justify-center text-base">
                  {s.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{s.nama}</h4>
                  <p className="text-[11px] text-slate-500">
                    Wali: {s.orangtua?.nama || "-"} ({s.orangtua?.no_wa || "-"})
                  </p>
                </div>
              </div>

              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between">
                <span className="text-slate-500">Kelas:</span>
                <span className="font-semibold text-slate-800">{s.kelas?.nama || "Belum ada kelas"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700">
                Progress: {s.progress_persen}%
              </span>
              <button
                onClick={() => setSelectedStudent(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-800 font-bold text-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Kirim Catatan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {noteSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">Catatan Terkirim!</h3>
                <p className="text-xs text-slate-500">Orang tua akan melihat catatan ini di dashboard mereka.</p>
              </div>
            ) : (
              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Tambah Catatan Guru: {selectedStudent.nama}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kategori Catatan
                  </label>
                  <select
                    value={noteType}
                    onChange={(e: any) => setNoteType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                  >
                    <option value="progress">Kemajuan Belajar (Progress)</option>
                    <option value="saran">Saran Latihan di Rumah</option>
                    <option value="pencapaian">Pujian Prestasi / Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Isi Catatan untuk Orang Tua
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Tuliskan evaluasi perkembangan ananda hari ini..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNote}
                    className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    {submittingNote ? "Menyimpan..." : "Kirim Catatan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
