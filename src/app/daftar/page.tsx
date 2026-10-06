"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
  MessageCircle,
  Sparkles,
  User,
  Heart,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
  Copy,
  BadgeCheck,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { CONTACT_INFO } from "@/constants";

export default function DaftarPage() {
  const [activeTab, setActiveTab] = useState<"daftar" | "cek">("daftar");

  // Multi-step form state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successData, setSuccessData] = useState<{
    no_registrasi: string;
    tipe_pendaftaran: string;
    nama_anak: string;
    status: string;
    pesan: string;
  } | null>(null);

  // Form Fields with safe initial state
  const [formData, setFormData] = useState(() => {
    let initialTipe = "trial";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tipe = params.get("tipe");
      if (tipe === "reguler") initialTipe = "reguler";
      if (tipe === "trial") initialTipe = "trial";
    }
    return {
      tipe_pendaftaran: initialTipe,
      // Step 1: Anak
      nama_anak: "",
      tempat_lahir: "Balikpapan",
      tanggal_lahir: "",
      jenis_kelamin: "L",
      pengalaman: "Belum pernah les membaca",
      // Step 2: Ortu
      nama_ortu: "",
      no_wa_ortu: "",
      email_ortu: "",
      alamat: "",
      hubungan: "ibu",
      // Step 3: Program & Jadwal
      program_diminati: "prg-001",
      preferensi_jadwal: "pagi",
      sumber_info: "Instagram",
    };
  });

  // Cek Status state
  const [searchNoReg, setSearchNoReg] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    no_registrasi: string;
    tipe_pendaftaran: string;
    nama_anak: string;
    program_diminati: string;
    status: string;
    keterangan: string;
    tanggal_daftar: string;
  } | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function calculateAge(dob: string) {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function validateStep(currentStep: number) {
    setError(null);
    if (currentStep === 1) {
      if (!formData.nama_anak.trim()) {
        setError("Nama lengkap calon siswa wajib diisi.");
        return false;
      }
      if (!formData.tanggal_lahir) {
        setError("Tanggal lahir anak wajib diisi.");
        return false;
      }
      const age = calculateAge(formData.tanggal_lahir);
      if (age !== null && (age < 3 || age > 9)) {
        setError("Program AHE ditujukan untuk anak usia 3 hingga 8 tahun.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.nama_ortu.trim()) {
        setError("Nama orang tua/wali wajib diisi.");
        return false;
      }
      if (!formData.no_wa_ortu.trim() || formData.no_wa_ortu.length < 10) {
        setError("Nomor WhatsApp aktif minimal 10 digit (contoh: 08123456789).");
        return false;
      }
      if (!formData.alamat.trim()) {
        setError("Alamat tempat tinggal wajib diisi.");
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.tipe_pendaftaran) {
        setError("Silakan tentukan jenis pendaftaran (Kelas Trial atau Reguler).");
        return false;
      }
      if (!formData.program_diminati) {
        setError("Silakan pilih level program yang diminati.");
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) {
      if (step < 3) {
        setStep((prev) => prev + 1);
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    }
  }

  function prevStep() {
    setError(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (step !== 3) {
      nextStep();
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Gagal memproses pendaftaran.");
        setLoading(false);
        return;
      }

      setSuccessData(json.data);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!searchNoReg.trim()) {
      setStatusError("Masukkan nomor registrasi pendaftaran Anda.");
      return;
    }

    setCheckingStatus(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const res = await fetch(
        `/api/pendaftaran/cek/${encodeURIComponent(searchNoReg.trim())}`
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatusError(json.error || "Nomor registrasi tidak ditemukan.");
      } else {
        setStatusResult(json.data);
      }
    } catch {
      setStatusError("Gagal menghubungi server untuk verifikasi status.");
    } finally {
      setCheckingStatus(false);
    }
  }

  const steps = [
    { num: 1, title: "Data Calon Siswa", desc: "Identitas anak & usia" },
    { num: 2, title: "Data Orang Tua", desc: "Kontak WhatsApp & domisili" },
    { num: 3, title: "Program & Trial", desc: "Pilihan tipe & jadwal" },
  ];

  const calculatedAge = calculateAge(formData.tanggal_lahir);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-base font-black text-slate-900 tracking-tight leading-tight">
                AHE Karang Joang
              </span>
              <span className="block text-xs font-semibold text-purple-700">
                Penerimaan Siswa Baru (PPDB)
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("daftar")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "daftar"
                    ? "bg-white text-purple-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Formulir
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cek")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "cek"
                    ? "bg-white text-purple-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cek Status
              </button>
            </div>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Title Banner */}
          <div className="mb-8 sm:mb-10 text-center md:text-left md:flex md:items-end md:justify-between pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === "daftar"
                  ? "Formulir Pendaftaran Siswa Baru"
                  : "Lacak Status Registrasi Siswa"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {activeTab === "daftar"
                  ? "Pilih kelas trial 1x sesi gratis untuk mencoba metode AHE atau daftar langsung ke bimbingan reguler."
                  : "Pantau proses verifikasi berkas dan jadwal kelas dengan nomor registrasi resmi Anda."}
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex md:hidden items-center gap-1.5 mt-4 text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Beranda</span>
            </Link>
          </div>

          {/* TAB 1: FORM PENDAFTARAN */}
          {activeTab === "daftar" && (
            <div>
              {successData ? (
                /* Success Card */
                <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    {successData.tipe_pendaftaran === "trial"
                      ? "Pendaftaran Kelas Trial Berhasil!"
                      : "Pendaftaran Berhasil Dikirim!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                    {successData.pesan}
                  </p>

                  {/* Kode Registrasi */}
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 max-w-md mx-auto mb-6">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-purple-700 block mb-1">
                      Nomor Registrasi Anda
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-purple-950 tracking-wider">
                        {successData.no_registrasi}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(successData.no_registrasi)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 hover:bg-purple-100 text-purple-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        title="Salin Nomor"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-purple-700 mt-2">
                      Simpan nomor ini untuk memeriksa perkembangan status di tab &ldquo;Cek Status&rdquo;.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto mb-8 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {successData.tipe_pendaftaran === "trial" ? (
                        <>
                          <strong>Langkah Selanjutnya:</strong> Tim Admin AHE Karang Joang akan
                          menghubungi Anda via WhatsApp untuk menyepakati tanggal dan jam sesi
                          trial gratis ananda.
                        </>
                      ) : (
                        <>
                          <strong>Pemberitahuan Akun:</strong> Setelah berkas diverifikasi tim
                          admin, Anda akan menerima informasi jadwal kelas dan{" "}
                          <strong>kredensial login akun orang tua melalui WhatsApp</strong>.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                        successData.tipe_pendaftaran === "trial"
                          ? `Halo Admin AHE Karang Joang, saya telah mendaftar kelas trial gratis untuk ananda ${successData.nama_anak} dengan No. Registrasi: ${successData.no_registrasi}. Mohon konfirmasi jadwal trial-nya. Terima kasih.`
                          : `Halo Admin AHE Karang Joang, saya telah mendaftar online untuk ananda ${successData.nama_anak} dengan No. Registrasi: ${successData.no_registrasi}. Mohon konfirmasinya. Terima kasih.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi via WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setSuccessData(null);
                        setStep(1);
                        setFormData({
                          tipe_pendaftaran: "trial",
                          nama_anak: "",
                          tempat_lahir: "Balikpapan",
                          tanggal_lahir: "",
                          jenis_kelamin: "L",
                          pengalaman: "Belum pernah les membaca",
                          nama_ortu: "",
                          no_wa_ortu: "",
                          email_ortu: "",
                          alamat: "",
                          hubungan: "ibu",
                          program_diminati: "prg-001",
                          preferensi_jadwal: "pagi",
                          sumber_info: "Instagram",
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Daftar Anak Lainnya
                    </button>
                  </div>
                </div>
              ) : (
                /* Split Layout: Sidebar Steps on Left + Form on Right */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Vertical Step Navigation & Highlights */}
                  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    {/* Vertical Step Progress Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                        Tahapan Pendaftaran
                      </span>

                      <div className="space-y-4">
                        {steps.map((s) => {
                          const isDone = step > s.num;
                          const isCurrent = step === s.num;

                          return (
                            <div
                              key={s.num}
                              className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                                isCurrent
                                  ? "bg-purple-50/80 border border-purple-200/70"
                                  : isDone
                                  ? "bg-slate-50/60"
                                  : "opacity-60"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                  isDone
                                    ? "bg-purple-600 text-white"
                                    : isCurrent
                                    ? "bg-white border-2 border-purple-600 text-purple-700 shadow-2xs"
                                    : "bg-white border border-slate-200 text-slate-400"
                                }`}
                              >
                                {isDone ? (
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                ) : (
                                  s.num
                                )}
                              </div>
                              <div>
                                <span
                                  className={`text-xs sm:text-sm font-bold block ${
                                    isCurrent || isDone ? "text-slate-900" : "text-slate-500"
                                  }`}
                                >
                                  {s.title}
                                </span>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  {s.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>Kemajuan Pengisian:</span>
                          <span className="font-bold text-purple-700">
                            {step === 1 ? "33%" : step === 2 ? "66%" : "100%"}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-purple-600 rounded-full"
                            initial={false}
                            animate={{
                              width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                            }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Highlights Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-3.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Standar Kualitas AHE
                      </span>

                      <div className="flex items-start gap-2.5 text-xs text-slate-700">
                        <BadgeCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>100% Pengajar berlisensi resmi AHE Pusat</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-700">
                        <BadgeCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>Belajar privat individual (maksimal 6 siswa per kelas)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-700">
                        <BadgeCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>Metode fonik 6 langkah terstruktur tanpa mengeja</span>
                      </div>
                    </div>

                    {/* WhatsApp Help Card */}
                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Butuh Bantuan Mendaftar?
                        </span>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          Tim kami siap memandu Anda via WhatsApp jika ada pertanyaan.
                        </p>
                        <a
                          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Halo%20Admin%20AHE%20Karang%20Joang%2C%20saya%20butuh%20bantuan%20mengenai%20pendaftaran%20online.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Hubungi WhatsApp Kami</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Multi-Step Form Card */}
                  <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
                      {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                          <p className="leading-relaxed font-medium">{error}</p>
                        </div>
                      )}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (step < 3) {
                            nextStep();
                          } else {
                            handleSubmit(e);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                            e.preventDefault();
                            if (step < 3) {
                              nextStep();
                            }
                          }
                        }}
                        className="space-y-6"
                      >
                        <AnimatePresence mode="wait">
                          {/* STEP 1: Data Calon Siswa */}
                          {step === 1 && (
                            <motion.div
                              key="step-1"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-5"
                            >
                              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                                    Langkah 1 dari 3
                                  </span>
                                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                                    <User className="w-5 h-5 text-purple-600" />
                                    <span>Identitas Calon Peserta Didik</span>
                                  </h3>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Nama Lengkap Anak <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  name="nama_anak"
                                  value={formData.nama_anak}
                                  onChange={handleChange}
                                  placeholder="Contoh: Bintang Arya Putra"
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Kota Kelahiran
                                  </label>
                                  <input
                                    type="text"
                                    name="tempat_lahir"
                                    value={formData.tempat_lahir}
                                    onChange={handleChange}
                                    placeholder="Balikpapan"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                      Tanggal Lahir <span className="text-rose-500">*</span>
                                    </label>
                                    {calculatedAge !== null && (
                                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                        Usia: {calculatedAge} Tahun
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="date"
                                    required
                                    name="tanggal_lahir"
                                    value={formData.tanggal_lahir}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Jenis Kelamin <span className="text-rose-500">*</span>
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <label
                                      className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                                        formData.jenis_kelamin === "L"
                                          ? "bg-purple-50 border-purple-600 text-purple-900 shadow-2xs"
                                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="jenis_kelamin"
                                        value="L"
                                        checked={formData.jenis_kelamin === "L"}
                                        onChange={handleChange}
                                        className="sr-only"
                                      />
                                      Laki-laki
                                    </label>
                                    <label
                                      className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                                        formData.jenis_kelamin === "P"
                                          ? "bg-purple-50 border-purple-600 text-purple-900 shadow-2xs"
                                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="jenis_kelamin"
                                        value="P"
                                        checked={formData.jenis_kelamin === "P"}
                                        onChange={handleChange}
                                        className="sr-only"
                                      />
                                      Perempuan
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Pengalaman Belajar Membaca
                                  </label>
                                  <select
                                    name="pengalaman"
                                    value={formData.pengalaman}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  >
                                    <option value="Belum pernah les membaca">Belum pernah les membaca</option>
                                    <option value="Sudah hafal beberapa huruf">Sudah hafal beberapa huruf</option>
                                    <option value="Bisa mengeja suku kata mudah">Bisa mengeja suku kata mudah</option>
                                    <option value="Pernah les di tempat lain">Pernah les di tempat lain</option>
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 2: Data Orang Tua */}
                          {step === 2 && (
                            <motion.div
                              key="step-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-5"
                            >
                              <div className="pb-3 border-b border-slate-100">
                                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                                  Langkah 2 dari 3
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                                  <Heart className="w-5 h-5 text-purple-600" />
                                  <span>Data Orang Tua / Wali Murid</span>
                                </h3>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Nama Lengkap Orang Tua / Wali <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    name="nama_ortu"
                                    value={formData.nama_ortu}
                                    onChange={handleChange}
                                    placeholder="Contoh: Ibu Sari Dewi"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Hubungan <span className="text-rose-500">*</span>
                                  </label>
                                  <select
                                    name="hubungan"
                                    value={formData.hubungan}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  >
                                    <option value="ibu">Ibu Kandung</option>
                                    <option value="ayah">Ayah Kandung</option>
                                    <option value="wali">Wali Murid</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    required
                                    name="no_wa_ortu"
                                    value={formData.no_wa_ortu}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  />
                                  <span className="text-[11px] text-slate-400 mt-1 block">
                                    Konfirmasi jadwal & kredensial login akan dikirim via nomor ini.
                                  </span>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Alamat Email (Opsional)
                                  </label>
                                  <input
                                    type="email"
                                    name="email_ortu"
                                    value={formData.email_ortu}
                                    onChange={handleChange}
                                    placeholder="nama@email.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Alamat Domisili <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                  required
                                  rows={3}
                                  name="alamat"
                                  value={formData.alamat}
                                  onChange={handleChange}
                                  placeholder="Contoh: Jl. Soekarno Hatta Km. 11, RT 05 No. 12, Karang Joang"
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all resize-none"
                                />
                              </div>
                            </motion.div>
                          )}

                          {/* STEP 3: Program & Tipe Belajar */}
                          {step === 3 && (
                            <motion.div
                              key="step-3"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6"
                            >
                              <div className="pb-3 border-b border-slate-100">
                                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                                  Langkah 3 dari 3
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-purple-600" />
                                  <span>Pilihan Program & Jenis Pendaftaran</span>
                                </h3>
                              </div>

                              {/* Tipe Pendaftaran Choice */}
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Pilih Jenis Pendaftaran <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                  <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, tipe_pendaftaran: "trial" }))}
                                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                      formData.tipe_pendaftaran === "trial"
                                        ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-100 text-emerald-950 shadow-xs"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                        formData.tipe_pendaftaran === "trial"
                                          ? "border-emerald-600 bg-emerald-600 text-white"
                                          : "border-slate-300"
                                      }`}
                                    >
                                      {formData.tipe_pendaftaran === "trial" && (
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-slate-900">
                                          Kelas Trial Gratis
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                                          1x Sesi Gratis
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 leading-relaxed">
                                        Coba 1 sesi belajar gratis untuk mengenal metode AHE tanpa komitmen biaya.
                                      </p>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, tipe_pendaftaran: "reguler" }))}
                                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                      formData.tipe_pendaftaran === "reguler"
                                        ? "bg-purple-50/70 border-purple-600 ring-2 ring-purple-100 text-purple-950 shadow-xs"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                        formData.tipe_pendaftaran === "reguler"
                                          ? "border-purple-600 bg-purple-600 text-white"
                                          : "border-slate-300"
                                      }`}
                                    >
                                      {formData.tipe_pendaftaran === "reguler" && (
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-slate-900">
                                          Pendaftaran Reguler
                                        </span>
                                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-200 px-1.5 py-0.2 rounded-md">
                                          Kelas Rutin
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 leading-relaxed">
                                        Daftar langsung ke kelas bimbingan mingguan dengan alokasi tutor dan modul belajar.
                                      </p>
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Program Levels */}
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Level Belajar yang Diminati <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {[
                                    { id: "prg-001", nama: "Pra Membaca (Level 0)", ket: "Usia 3-4 th • Pengenalan alfabet & bunyi huruf" },
                                    { id: "prg-002", nama: "Membaca Level 1", ket: "Usia 4-5 th • Suku kata konsonan-vokal langsung" },
                                    { id: "prg-003", nama: "Membaca Level 2", ket: "Usia 4-6 th • Kata utuh & variasi konsonan" },
                                    { id: "prg-004", nama: "Membaca Level 3", ket: "Usia 5-6 th • Kalimat pendek & intonasi lancar" },
                                    { id: "prg-005", nama: "Membaca Lanjutan (Level 4)", ket: "Usia 5-7 th • Cerita & pemahaman bacaan" },
                                  ].map((p) => (
                                    <label
                                      key={p.id}
                                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                        formData.program_diminati === p.id
                                          ? "bg-purple-50/70 border-purple-600 shadow-2xs ring-1 ring-purple-200"
                                          : "bg-white border-slate-200 hover:border-slate-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                                          {p.nama}
                                        </span>
                                        <input
                                          type="radio"
                                          name="program_diminati"
                                          value={p.id}
                                          checked={formData.program_diminati === p.id}
                                          onChange={handleChange}
                                          className="text-purple-600"
                                        />
                                      </div>
                                      <span className="text-[11px] text-slate-500 leading-snug">
                                        {p.ket}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Preferensi Waktu Belajar
                                  </label>
                                  <select
                                    name="preferensi_jadwal"
                                    value={formData.preferensi_jadwal}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  >
                                    <option value="pagi">Pagi Hari (08:00 – 11:00 WITA)</option>
                                    <option value="siang">Siang / Sore (13:30 – 16:30 WITA)</option>
                                    <option value="fleksibel">Fleksibel (Sesuai kuota kelas)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Mengetahui AHE dari mana?
                                  </label>
                                  <select
                                    name="sumber_info"
                                    value={formData.sumber_info}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
                                  >
                                    <option value="Instagram">Instagram AHE Karang Joang</option>
                                    <option value="Rekomendasi Teman / Keluarga">Rekomendasi Teman / Tetangga</option>
                                    <option value="Spanduk / Brosur">Spanduk / Brosur Karang Joang</option>
                                    <option value="Google">Pencarian Google</option>
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Navigation Buttons Footer */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                          {step > 1 ? (
                            <button
                              type="button"
                              onClick={prevStep}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4 text-slate-500" />
                              <span>Kembali</span>
                            </button>
                          ) : (
                            <Link
                              href="/"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4 text-purple-600" />
                              <span>Kembali ke Beranda</span>
                            </Link>
                          )}

                          {step < 3 ? (
                            <button
                              type="button"
                              onClick={nextStep}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                            >
                              <span>Lanjutkan ke Langkah {step + 1}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading}
                              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-60 ${
                                formData.tipe_pendaftaran === "trial"
                                  ? "bg-emerald-600 hover:bg-emerald-700"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Memproses Pendaftaran...</span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {formData.tipe_pendaftaran === "trial"
                                      ? "Kirim Pendaftaran Trial Gratis"
                                      : "Kirim Pendaftaran Resmi"}
                                  </span>
                                  <CheckCircle2 className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LACAK STATUS PENDAFTARAN */}
          {activeTab === "cek" && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 tracking-tight">
                  Lacak Status Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Ketik nomor registrasi yang Anda dapatkan saat mendaftar (contoh: REG-2026-001 atau TRL-2026-001)
                </p>

                <form onSubmit={handleCheckStatus} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      required
                      value={searchNoReg}
                      onChange={(e) => setSearchNoReg(e.target.value.toUpperCase())}
                      placeholder="REG-2026-001 / TRL-2026-001"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-black tracking-wider text-slate-900 text-base focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none uppercase transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={checkingStatus}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {checkingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memeriksa Berkas...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Periksa Status</span>
                      </>
                    )}
                  </button>
                </form>

                {statusError && (
                  <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">{statusError}</p>
                  </div>
                )}

                {statusResult && (
                  <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Nomor Registrasi
                        </span>
                        <span className="text-sm sm:text-base font-mono font-black text-slate-900">
                          {statusResult.no_registrasi}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          statusResult.status === "diterima"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : statusResult.status === "menunggu"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : statusResult.status === "ditunda"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {statusResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Calon Siswa</span>
                        <span className="font-bold text-slate-900">{statusResult.nama_anak}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Program</span>
                        <span className="font-bold text-slate-900">{statusResult.program_diminati}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[11px] font-medium">Jenis Pendaftaran</span>
                        <span
                          className={`font-bold ${
                            statusResult.tipe_pendaftaran === "trial"
                              ? "text-emerald-700"
                              : "text-purple-700"
                          }`}
                        >
                          {statusResult.tipe_pendaftaran === "trial"
                            ? "Kelas Trial Gratis (1x Sesi Coba)"
                            : "Pendaftaran Program Reguler"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-400 block text-[11px] font-medium mb-1">
                        Keterangan Status:
                      </span>
                      <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                        {statusResult.keterangan}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Official Unified Footer */}
      <Footer />
    </div>
  );
}
