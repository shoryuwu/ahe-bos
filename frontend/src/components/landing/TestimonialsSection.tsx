"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { testimonials as fallbackTestimonials } from "@/data";

interface TestimonialItem {
  id: string;
  parentName: string;
  childName: string;
  review: string;
  rating: number;
  avatar: string;
  program: string;
}

export function TestimonialsSection() {
  const [items, setItems] = useState<TestimonialItem[]>(fallbackTestimonials);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimoni");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: TestimonialItem[] = json.data.map((t: any, index: number) => {
            const pName = t.nama_ortu || t.parentName || "Orang Tua";
            const initials =
              pName
                .replace(/^(Ibu|Bapak|Pak|Bu)\s+/i, "")
                .split(" ")
                .filter(Boolean)
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "OT";

            return {
              id: t.id || String(index),
              parentName: pName,
              childName: t.nama_anak || t.childName || "Ananda",
              review: t.ulasan || t.review || "",
              rating: Number(t.rating) || 5,
              avatar: t.avatar || initials,
              program: t.program || "Membaca AHE",
            };
          });
          setItems(mapped);
        }
      } catch {
        // Fallback to initial data if fetch fails
      }
    }

    fetchTestimonials();
  }, []);

  const total = items.length;
  const activeItem = total > 0 ? items[current % total] : null;

  const prev = () => {
    if (total === 0) return;
    setCurrent((c) => (c - 1 + total) % total);
  };

  const next = () => {
    if (total === 0) return;
    setCurrent((c) => (c + 1) % total);
  };

  if (!activeItem) return null;

  return (
    <section id="testimoni" className="section-padding bg-background">
      <div className="container-custom">
        <SectionTitle
          title="Kata Mereka tentang "
          highlight="AHE"
          subtitle="Kepercayaan orang tua adalah motivasi terbesar kami untuk terus berkembang dan berinovasi."
          center
        />

        {/* Main Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
                {/* Quote icon */}
                <div className="absolute top-6 right-8">
                  <Quote className="w-12 h-12 text-primary/10" fill="currentColor" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: activeItem.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[var(--ahe-orange)] text-[var(--ahe-orange)]" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 italic">
                  &ldquo;{activeItem.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                    {activeItem.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{activeItem.parentName}</p>
                    <p className="text-muted-foreground text-sm">
                      Orang tua dari <span className="text-primary font-medium">{activeItem.childName}</span>
                    </p>
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium inline-block mt-1">
                      {activeItem.program}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:border-primary hover:text-primary transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:border-primary hover:text-primary transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Mini cards */}
        {total > 1 && (
          <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {items.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setCurrent(i)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  i === current
                    ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{t.parentName}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.childName}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 fill-[var(--ahe-orange)] text-[var(--ahe-orange)]" />
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pagination dots */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? "w-6 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-border"
                }`}
                aria-label={`Testimoni ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}