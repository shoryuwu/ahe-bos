"use client";

import { motion } from "framer-motion";
import { Clock, Users, CheckCircle, ArrowRight, Sprout, BookOpen, Type, Book, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { programs } from "@/data";
import { cn } from "@/lib/utils";

const getProgramIcon = (emoji: string, colorClass: string) => {
  const props = { className: cn("w-6 h-6", colorClass) };
  switch (emoji) {
    case "🌱": return <Sprout {...props} />;
    case "📚": return <BookOpen {...props} />;
    case "🔤": return <Type {...props} />;
    case "📖": return <Book {...props} />;
    case "🦋": return <Award {...props} />;
    default: return <BookOpen {...props} />;
  }
};

export function ProgramsSection() {
  return (
    <section id="program" className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionTitle
          // badge="📚 Program Belajar"
          title="Program Terstruktur untuk Setiap Anak"
          highlight="Terstruktur"
          subtitle="Lima level program yang dirancang khusus sesuai usia dan kemampuan anak, dari pengenalan huruf hingga membaca cerita."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, i) => (
            <div
              key={program.id}
              className={`group relative rounded-3xl bg-card border border-border overflow-hidden card-hover shadow-sm ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              {/* Top decoration */}
              <div className={`h-2 w-full ${program.bgColor.replace("bg-", "bg-").replace("-50", "-400")}`} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${program.bgColor} flex items-center justify-center shrink-0`}>
                    {getProgramIcon(program.icon, program.color)}
                  </div>
                  <Badge variant="secondary" className={`${program.bgColor} ${program.color} border-0 font-semibold`}>
                    {program.level}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{program.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{program.description}</p>

                {/* Targets */}
                <ul className="space-y-2 mb-5">
                  {program.targets.map((target) => (
                    <li key={target} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${program.color}`} />
                      {target}
                    </li>
                  ))}
                </ul>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {program.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {program.ageRange}
                  </span>
                </div>

                <a
                  href="#kontak"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    `w-full group-hover:${program.bgColor} ${program.color} transition-colors gap-1`
                  )}
                >
                  Daftar Program Ini
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 rounded-3xl gradient-hero p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "30px 30px" }} />
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-2">🎁 Promo Terbatas</p>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
              Kelas Trial GRATIS untuk Pendaftar Baru!
            </h3>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Coba 1 sesi belajar bersama AHE tanpa biaya apapun. Lihat sendiri betapa menyenangkannya belajar membaca bersama kami.
            </p>
            <a href={`https://wa.me/6281234567890?text=Halo%20AHE%2C%20saya%20ingin%20daftar%20kelas%20trial%20gratis!`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[var(--ahe-orange)] hover:bg-[var(--ahe-orange)]/90 text-white shadow-xl gap-2">
                Daftar Trial Gratis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
