"use client";

import React from "react";
import {
  Target,
  Lightbulb,
  Gamepad2,
  Zap,
  User,
  Layers,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Timeline, TimelineMilestone } from "@/components/ui/timeline";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Tanpa Mengeja",
    description:
      "Anak belajar membaca suku kata secara langsung, sehingga prosesnya lebih cepat dan tidak membebani memori.",
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "Belajar Privat/Individual",
    description:
      "Fokus pada tingkat kemampuan masing-masing anak, bukan klasikal (massal).",
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "Asyik dan Menyenangkan",
    description:
      "Proses belajar diselingi permainan agar anak tidak mudah bosan dan tidak stres.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Enam Langkah Terstruktur",
    description:
      "Menggunakan 6 langkah yang konsisten, meliputi senam otak, remidi, membaca modul, pengayaan, menulis, dan permainan.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6" />,
    title: "Semua Gurunya berlisensi",
    description:
      "Setiap pengajar atau pemilik unit yang telah menyelesaikan pelatihan khusus akan mendapatkan dokumen Lisensi Guru tertulis yang diterbitkan oleh AHE Pusat lengkap dengan nomor lisensi resmi.",
  },
];

export function AboutSection() {
  const milestones: TimelineMilestone[] = [
    {
      year: "2014",
      badge: "Perintisan",
      title: "Titik Mula di Karang Joang",
      description:
        "Mulai mendampingi 10 anak pertama lewat bimbingan privat yang sabar, ramah, dan tanpa tekanan.",
      tag: "10 Siswa Perdana",
    },
    {
      year: "2017",
      badge: "Kurikulum",
      title: "Metode 6 Langkah Fonik",
      description:
        "Inovasi belajar membaca terstruktur tanpa mengeja yang cepat, asyik, dan terbukti efektif.",
      tag: "Belajar Tanpa Mengeja",
    },
    {
      year: "2020",
      badge: "Prestasi",
      title: "Lembaga Terbaik Balikpapan",
      description:
        "Meraih apresiasi bimbingan baca terbaik se-Kota Balikpapan didukung 100% tutor berlisensi resmi.",
      tag: "100% Guru Berlisensi",
    },
    {
      year: "2024",
      badge: "10 Tahun",
      title: "Transformasi & Komunitas",
      description:
        "Dipercaya 150+ siswa aktif, mencetak 500+ alumni, dan terintegrasi monitoring progres digital.",
      tag: "150+ Siswa • 500+ Alumni",
    },
  ];

  return (
    <section id="tentang" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle
          title="Mengenal "
          highlight="AHE Karangjoang"
          subtitle="Sejak 2014, kami telah mendedikasikan diri untuk menjadi jembatan pertama anak-anak dalam perjalanan membaca mereka."
        />

        {/* Visi Misi Nilai Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <Target className="w-6 h-6" />,
              title: "Visi",
              color: "bg-purple-50 text-purple-700",
              iconBg: "bg-purple-100",
              content:
                "Menjadi lembaga belajar membaca terdepan di Kalimantan Timur yang melahirkan generasi literat, cerdas, dan berkarakter.",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Misi",
              color: "bg-fuchsia-50 text-fuchsia-700",
              iconBg: "bg-fuchsia-100",
              content:
                "Menghadirkan metode belajar membaca yang menyenangkan, efektif, dan terstruktur untuk setiap anak usia dini dengan bimbingan guru berpengalaman.",
            },
            {
              icon: <Lightbulb className="w-6 h-6" />,
              title: "Nilai Kami",
              color: "bg-orange-50 text-orange-600",
              iconBg: "bg-orange-100",
              content:
                "Kesabaran, kreativitas, dan kasih sayang adalah fondasi kami dalam mendampingi setiap anak menemukan keajaiban membaca.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl p-8 sm:p-9 card-hover border border-slate-200/90 bg-white/80 backdrop-blur-xs shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center mb-6 ${item.color.split(" ")[1]}`}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pembatas Elegan Berjarak Rapi ke Timeline */}
        <div className="my-12 md:my-16 border-t border-slate-200/80" />

        {/* ============================================================== */}
        {/* PERJALANAN KAMI */}
        {/* ============================================================== */}
        <div className="relative">
          <Timeline
            milestones={milestones}
            heading="Perjalanan Kami"
            description="Dari satu ruang bimbingan sederhana di Karang Joang hingga tumbuh menjadi lembaga bimbingan baca terpercaya bagi ratusan ananda di Balikpapan."
          />
        </div>

        {/* Pembatas Elegan Berjarak Rapi ke Keunggulan */}
        <div className="my-12 md:my-16 border-t border-slate-200/80" />

        {/* Features Grid */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Keunggulan Les Baca di AHE
            </h3>
            <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
              Karakteristik metode bimbingan belajar kami yang membedakan AHE dengan bimbingan membaca konvensional.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1.5">{f.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
