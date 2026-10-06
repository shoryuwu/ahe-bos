"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RaporPrintPage() {
  const params = useParams();
  const siswaId = params.siswaId as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRapor() {
      try {
        const res = await fetch(`/api/laporan/rapor/${siswaId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat rapor:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRapor();
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
        <p className="text-sm text-slate-600">Data rapor siswa tidak ditemukan.</p>
      </div>
    );
  }

  const { siswa, orangtua, kelas, guru, kehadiran, indikator, catatan_evaluasi } = data;

  function getPredicate(val: number) {
    if (val >= 85) return { grade: "A", label: "Sangat Baik" };
    if (val >= 70) return { grade: "B", label: "Baik" };
    if (val >= 60) return { grade: "C", label: "Cukup" };
    return { grade: "D", label: "Perlu Bimbingan" };
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:bg-white print:p-0">
      {/* Top action bar (hidden during print) */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between print:hidden">
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
          Cetak Rapor / Simpan PDF
        </button>
      </div>

      {/* Rapor Sheet (A4 format) */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-6 print:rounded-none">
        {/* Kop Surat Resmi */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                BIMBINGAN BELAJAR ANAK HEBAT (AHE)
              </h1>
              <p className="text-xs font-bold text-purple-700 uppercase">
                Unit Karang Joang — Balikpapan Utara
              </p>
              <p className="text-[11px] text-slate-500">
                Jl. Soekarno Hatta Km. 11, Karang Joang, Balikpapan • WA: 0812-3456-7890
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-extrabold text-slate-400 block">
              Laporan Hasil Belajar
            </span>
            <span className="text-sm font-mono font-bold text-slate-900">
              Periode: {indikator.bulan}
            </span>
          </div>
        </div>

        {/* Identitas Siswa Grid */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-xs mb-6 print:bg-white print:border-slate-300">
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 w-28">Nama Lengkap</td>
                  <td className="py-1 font-bold text-slate-900">: {siswa.nama}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">ID Peserta</td>
                  <td className="py-1 font-mono text-slate-900">: {siswa.id}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Tempat, Tgl Lahir</td>
                  <td className="py-1 text-slate-800">
                    : {siswa.tempat_lahir}, {siswa.tanggal_lahir}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 w-28">Jenjang / Level</td>
                  <td className="py-1 font-bold text-purple-700 uppercase">
                    : {siswa.level}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Kelas Belajar</td>
                  <td className="py-1 text-slate-800">: {kelas?.nama || "-"}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">Tutor Pengajar</td>
                  <td className="py-1 font-semibold text-slate-800">: {guru?.nama || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. Rekapitulasi Kehadiran */}
        <div className="mb-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            A. Rekapitulasi Presensi Belajar
          </h3>
          <table className="w-full text-xs border border-slate-200 text-center">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Total Pertemuan</th>
                <th className="py-2 px-3">Hadir</th>
                <th className="py-2 px-3">Izin</th>
                <th className="py-2 px-3">Sakit</th>
                <th className="py-2 px-3">Alpha</th>
                <th className="py-2 px-3">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-x divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-semibold">{kehadiran.total}</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">{kehadiran.hadir}</td>
                <td className="py-2.5 px-3">{kehadiran.izin}</td>
                <td className="py-2.5 px-3">{kehadiran.sakit}</td>
                <td className="py-2.5 px-3 text-rose-600 font-semibold">{kehadiran.alpha}</td>
                <td className="py-2.5 px-3 font-extrabold text-purple-700">
                  {kehadiran.persen}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Capaian Kompetensi Membaca (5 Indikator AHE) */}
        <div className="mb-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            B. Capaian Kompetensi Membaca Fonik AHE
          </h3>
          <table className="w-full text-xs border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3 text-left w-12">No</th>
                <th className="py-2 px-3 text-left">Aspek Kompetensi Belajar</th>
                <th className="py-2 px-3 text-center w-24">Skor (0-100)</th>
                <th className="py-2 px-3 text-center w-20">Predikat</th>
                <th className="py-2 px-3 text-left w-44">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                {
                  no: 1,
                  aspek: "Mengenal Huruf Fonik A-Z",
                  val: indikator.mengenal_huruf,
                  ket: "Identifikasi visual dan bunyi fonik",
                },
                {
                  no: 2,
                  aspek: "Membaca Suku Kata",
                  val: indikator.membaca_suku_kata,
                  ket: "Kombinasi vokal-konsonan dasar",
                },
                {
                  no: 3,
                  aspek: "Membaca Kata Utuh",
                  val: indikator.membaca_kata,
                  ket: "Kefasihan kata 2-3 suku kata bermakna",
                },
                {
                  no: 4,
                  aspek: "Membaca Kalimat Pendek",
                  val: indikator.membaca_kalimat,
                  ket: "Intonasi dan pemenggalan kata",
                },
                {
                  no: 5,
                  aspek: "Membaca Cerita & Pemahaman",
                  val: indikator.membaca_cerita,
                  ket: "Kelancaran dan pemahaman isi cerita",
                },
              ].map((row) => {
                const pred = getPredicate(row.val);
                return (
                  <tr key={row.no}>
                    <td className="py-2.5 px-3 text-center text-slate-500">{row.no}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{row.aspek}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-purple-700">
                      {row.val}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">{pred.grade}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{pred.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3. Catatan Evaluasi & Saran Guru */}
        <div className="mb-8 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            C. Catatan Evaluasi & Saran Perkembangan
          </h3>
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 leading-relaxed print:bg-white print:border-slate-300">
            {catatan_evaluasi}
          </div>
        </div>

        {/* 4. Kolom Tanda Tangan */}
        <div className="grid grid-cols-2 gap-8 text-xs pt-4 text-center">
          <div>
            <p className="text-slate-500 mb-16">
              Balikpapan, {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
              <br />
              <strong>Tutor Pembimbing,</strong>
            </p>
            <p className="font-bold text-slate-900 underline">{guru?.nama || "Tutor AHE"}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-16">
              Mengetahui,
              <br />
              <strong>Kepala Unit AHE Karang Joang,</strong>
            </p>
            <p className="font-bold text-slate-900 underline">Nur Hikmah, S.Pd.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
