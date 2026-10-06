"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, Award, Sparkles, Loader2 } from "lucide-react";

export default function SertifikatPrintPage() {
  const params = useParams();
  const siswaId = params.siswaId as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/siswa/${siswaId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat sertifikat:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [siswaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-600">Data sertifikat tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:bg-white print:p-0">
      {/* Top action bar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
          Cetak Sertifikat / Simpan PDF
        </button>
      </div>

      {/* Certificate Frame (Landscape orientation) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-14 rounded-3xl shadow-lg border-8 border-double border-amber-300 relative overflow-hidden print:border-8 print:shadow-none print:rounded-none">
        {/* Decorative corner patterns */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-500" />

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-extrabold text-amber-700 mb-1">
              BIMBINGAN BELAJAR ANAK HEBAT (AHE) KARANG JOANG
            </h4>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-wide uppercase">
              SERTIFIKAT KELULUSAN
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Nomor: AHE-KJ/SERT/{new Date().getFullYear()}/{data.id.substring(4)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 italic max-w-lg mx-auto pt-2">
            Dengan bangga dan penuh apresiasi memberikan sertifikat penghargaan kelulusan kepada:
          </p>

          {/* Student Name */}
          <div className="py-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 tracking-tight underline decoration-amber-400 decoration-4 underline-offset-8">
              {data.nama}
            </h2>
            <p className="text-xs text-slate-500 mt-3 font-mono">
              Tempat, Tanggal Lahir: {data.tempat_lahir}, {data.tanggal_lahir}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
            Telah dinyatakan <strong>LULUS DENGAN PREDIKAT BAIK</strong> pada tahapan kurikulum membaca:
          </p>

          <div className="inline-block bg-gradient-to-r from-purple-100 via-fuchsia-100 to-orange-100 border border-purple-200 px-6 py-2 rounded-2xl">
            <span className="text-base font-extrabold uppercase text-purple-900 tracking-wider">
              {data.level_saat_ini.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Semoga ilmu yang didapat menjadi fondasi kecintaan membaca sepanjang hayat bagi ananda.
          </p>

          {/* Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-xs text-center max-w-lg mx-auto">
            <div>
              <p className="text-slate-500 mb-14">
                Balikpapan, {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
                <br />
                <strong>Tutor Pengajar,</strong>
              </p>
              <p className="font-bold text-slate-900 underline">
                {data.kelas?.guru_nama || "Tutor AHE"}
              </p>
            </div>

            <div>
              <p className="text-slate-500 mb-14">
                Mengetahui,
                <br />
                <strong>Kepala Unit AHE,</strong>
              </p>
              <p className="font-bold text-slate-900 underline">Nur Hikmah, S.Pd.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
