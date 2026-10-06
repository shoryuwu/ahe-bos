"use client";

import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle2, Zap } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { faqs as fallbackFaqs } from "@/data";

interface FAQDisplayItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQSection() {
  const [items, setItems] = useState<FAQDisplayItem[]>(fallbackFaqs);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await fetch("/api/faq");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: FAQDisplayItem[] = json.data.map((f: any, index: number) => ({
            id: f.id || String(index),
            question: f.pertanyaan || f.question || "",
            answer: f.jawaban || f.answer || "",
          }));
          setItems(mapped);
        }
      } catch {
        // Fallback to initial data if fetch fails
      }
    }

    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-24">
            <SectionTitle
              title="Pertanyaan yang "
              highlight="Sering Ditanyakan"
              subtitle="Temukan jawaban atas pertanyaan umum seputar program belajar AHE Karangjoang."
            />

            {/* Extra info card */}
            <div className="rounded-3xl gradient-hero p-7 text-white mt-8 md:mt-10">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-white mb-4">
                <MessageCircle className="w-5 h-5 fill-white/10" />
              </div>
              <h3 className="font-bold text-lg mb-2">Masih ada pertanyaan lain?</h3>
              <p className="text-white/80 text-sm mb-5 leading-relaxed">
                Tim kami siap membantu Anda! Hubungi kami via WhatsApp dan dapatkan jawaban dalam hitungan menit.
              </p>
              <a
                href="https://wa.me/6281234567890?text=Halo%20AHE%2C%20saya%20ingin%20bertanya..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl text-[var(--ahe-purple)] text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 shrink-0 fill-current" /> Chat WhatsApp Sekarang
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "Pertanyaan Terjawab", value: "500+", icon: <CheckCircle2 className="w-5 h-5" /> },
                { label: "Respon Rata-rata", value: "< 5 menit", icon: <Zap className="w-5 h-5" /> },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex flex-col items-start">
                  <div className="w-8 h-8 rounded-lg bg-[var(--ahe-purple)]/10 text-[var(--ahe-purple)] flex items-center justify-center mb-3">
                    {s.icon}
                  </div>
                  <div className="font-bold text-xl text-foreground">{s.value}</div>
                  <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div>
            <div className="space-y-4">
              {items.map((faq, i) => {
                const isOpen = activeIndex === i;
                return (
                  <div
                    key={faq.id}
                    className="bg-card border border-border rounded-2xl px-5 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setActiveIndex(isOpen ? null : i)}
                      className="w-full text-left font-semibold text-foreground hover:text-[var(--ahe-purple)] hover:no-underline py-5 text-sm md:text-base flex items-start justify-between gap-4 outline-none cursor-pointer"
                    >
                      <span className="flex items-start gap-3">
                        <span className="text-[var(--ahe-purple)] font-bold text-xs shrink-0 mt-0.5 bg-[var(--ahe-purple-light)] rounded-full w-5 h-5 flex items-center justify-center">
                          {i + 1}
                        </span>
                        {faq.question}
                      </span>
                      <span className="text-xl text-muted-foreground transition-transform duration-200">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="text-muted-foreground text-sm leading-relaxed pb-5 pl-8 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}