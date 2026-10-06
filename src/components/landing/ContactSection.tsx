"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { CONTACT_INFO } from "@/constants";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", topic: "trial", message: "" });

  const buildWaUrl = () => {
    const topicLabel =
      form.topic === "trial"
        ? "Kelas Trial Gratis"
        : form.topic === "jadwal"
        ? "Jadwal & Kuota Belajar"
        : form.topic === "biaya"
        ? "Biaya & Program"
        : "Informasi Umum";

    const text = [
      `Halo AHE Karang Joang, saya ${form.name.trim() || "Orang Tua"}${form.phone ? ` (${form.phone})` : ""}.`,
      `Topik: ${topicLabel}`,
      form.message.trim() ? `Pertanyaan: ${form.message.trim()}` : "Saya ingin berkonsultasi mengenai bimbingan baca AHE.",
    ].join("\n\n");

    return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="kontak" className="py-20 md:py-28 bg-slate-50/70 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Hubungi "
          highlight="AHE Karang Joang"
          subtitle="Konsultasikan kebutuhan belajar ananda atau daftarkan sesi belajar langsung bersama tim pengajar kami."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Kolom Kiri: 2 Jalur (Pendaftaran & Konsultasi) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Pendaftaran Resmi (PPDB & Trial) */}
            <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-4 border border-white/10">
                  <span>Penerimaan Peserta Didik Baru</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white">
                  Pendaftaran Online & Kelas Trial
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-xl">
                  Pilih pendaftaran program reguler untuk langsung mendapatkan jadwal kelas, atau coba 1x sesi kelas trial gratis untuk ananda.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Trial 1x sesi tanpa komitmen</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Nomor registrasi resmi online</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/daftar?tipe=trial"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <span>Daftar Kelas Trial Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/daftar?tipe=reguler"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <span>Pendaftaran Reguler</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Konsultasi via WhatsApp */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                    Konsultasi Cepat via WhatsApp
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Respon cepat oleh pengelola AHE Karang Joang pada jam operasional
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Orang Tua
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Contoh: Ibu Sari"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Topik Pertanyaan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "trial", label: "Kelas Trial" },
                      { id: "jadwal", label: "Jadwal Belajar" },
                      { id: "biaya", label: "Biaya & Modul" },
                      { id: "umum", label: "Lainnya" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, topic: t.id })}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          form.topic === t.id
                            ? "bg-purple-50 text-purple-700 border-purple-300"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pesan atau Pertanyaan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tuliskan pertanyaan spesifik Anda seputar anak atau jadwal..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
                  />
                </div>

                <a
                  href={buildWaUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Mulai Chat WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Info Kontak & Peta */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-4">
                Informasi Kontak
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Alamat Unit</span>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-0.5">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Telepon & WhatsApp</span>
                    <a
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors mt-0.5 block"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Email Resmi</span>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-slate-800 hover:text-purple-600 text-xs sm:text-sm font-semibold transition-colors mt-0.5 block"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Jam Operasional</span>
                    <p className="text-slate-700 text-xs sm:text-sm mt-0.5">
                      {CONTACT_INFO.hours}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs">
              <div className="h-56 relative bg-slate-100">
                <iframe
                  src="https://maps.google.com/maps?q=-1.107141,116.885806&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                  title="Lokasi AHE Karang Joang"
                />
              </div>
              <div className="p-3.5 bg-white flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium truncate pr-2">
                  Karang Joang, Balikpapan Utara
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=-1.107141,116.885806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:text-purple-900 shrink-0"
                >
                  <span>Buka Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
