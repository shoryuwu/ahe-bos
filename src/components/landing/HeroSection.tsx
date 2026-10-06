"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, MessageCircle, Star, TrendingUp, Users, Award, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "@/data";

const floatingCards = [
  { icon: "📚", label: "Belajar Seru!", delay: 0, position: "top-8 right-8 md:top-12 md:right-0" },
  { icon: "⭐", label: "95% Berhasil", delay: 0.5, position: "bottom-16 left-4 md:bottom-20 md:left-0" },
];

const statIcons: Record<string, React.ReactNode> = {
  "👦": <Users className="w-5 h-5 text-white" />,
  "🏆": <Trophy className="w-5 h-5 text-white" />,
  "✨": <Sparkles className="w-5 h-5 text-white" />,
  "👩‍🏫": <GraduationCap className="w-5 h-5 text-white" />,
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--ahe-magenta)]/20 blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--ahe-orange)]/10 blur-2xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-custom relative z-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <span className="text-base">🌟</span>
              <span className="text-white text-sm font-medium">Lembaga Belajar Membaca Terpercaya</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Belajar Membaca{" "}
              <span className="relative">
                <span className="text-[var(--ahe-orange)]">Menyenangkan</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="var(--ahe-orange)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Bersama AHE Karangjoang
            </h1>

            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              Metode membaca yang menyenangkan untuk anak usia dini dengan pendekatan bertahap dan mudah dipahami. Lebih dari 150 anak sudah berhasil membaca!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/daftar">
                <Button
                  size="lg"
                  className="bg-[var(--ahe-orange)] hover:bg-[var(--ahe-orange)]/90 text-white shadow-xl hover:shadow-2xl transition-all group gap-2 w-full sm:w-auto"
                >
                  Daftarkan Anak Online (PPDB)
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20AHE%20Karang%20Joang%2C%20saya%20ingin%20konsultasi%20bimbingan%20membaca!`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 gap-2 w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konsultasi Gratis
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {["SD", "AF", "RP", "ML"].map((init, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full gradient-brand border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[var(--ahe-orange)] text-[var(--ahe-orange)]" />
                  ))}
                </div>
                <p className="text-white/70 text-xs">150+ orang tua puas</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Illustration + Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Main illustration card */}
            <div className="relative mx-auto max-w-sm lg:max-w-none pt-40">
              <div className="relative glass rounded-3xl p-8 pt-44 text-center flex flex-col items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 z-20"
                >
                  {/* Glow aura behind the character to blend it nicely with the background */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--ahe-purple)]/40 to-[var(--ahe-orange)]/40 blur-2xl opacity-75" />
                  
                  <Image
                    src="/child.webp"
                    alt="Anak Hebat Indonesia Logo"
                    fill
                    sizes="384px"
                    className="object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
                    priority
                  />
                </motion.div>
                <p className="text-white font-bold text-xl">Anak Hebat Indonesia</p>
                <p className="text-white/70 text-sm mt-1">Membaca adalah kunci masa depan</p>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-[var(--ahe-orange)] rounded-2xl px-3.5 py-1.5 shadow-lg flex items-center gap-1.5 text-white"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span className="text-xs font-bold">95% Berhasil!</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-3.5 py-1.5 shadow-lg flex items-center gap-1.5 text-[var(--ahe-purple)] border border-white/80"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">150+ Siswa</span>
                </motion.div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-[var(--ahe-magenta)]/30 blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[var(--ahe-orange)]/30 blur-xl" />
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-white mb-3">
                {statIcons[stat.icon] || stat.icon}
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/70 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 80L1440 80L1440 40C1320 70 1080 80 720 60C360 40 120 70 0 40L0 80Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
