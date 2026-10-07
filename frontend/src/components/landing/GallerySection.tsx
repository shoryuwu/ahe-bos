"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { GALLERY_CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface GalleryDisplayItem {
  id: string;
  caption: string;
  category: string;
  height: string;
  imageUrl: string;
}

const fallbackGalleryItems: GalleryDisplayItem[] = [
  { id: "1", caption: "Sesi belajar suku kata seru!", category: "Belajar", height: "h-48", imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" },
  { id: "2", caption: "Aktivitas membaca bersama teman", category: "Belajar", height: "h-64", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop" },
  { id: "3", caption: "Penyerahan sertifikat kelulusan Level 1", category: "Prestasi", height: "h-40", imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop" },
  { id: "4", caption: "Bermain kartu huruf warna-warni", category: "Aktivitas", height: "h-56", imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=600&auto=format&fit=crop" },
  { id: "5", caption: "Kelas motorik halus pra-membaca", category: "Aktivitas", height: "h-44", imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop" },
  { id: "6", caption: "Kunjungan ke perpustakaan kota", category: "Outing", height: "h-60", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop" },
  { id: "7", caption: "Perayaan hari buku nasional 2024", category: "Event", height: "h-48", imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&auto=format&fit=crop" },
  { id: "8", caption: "Demo membaca untuk orang tua", category: "Event", height: "h-52", imageUrl: "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=600&auto=format&fit=crop" },
  { id: "9", caption: "Anak-anak antusias belajar bersama", category: "Belajar", height: "h-40", imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=600&auto=format&fit=crop" },
  { id: "10", caption: "Mewarnai sambil belajar huruf", category: "Aktivitas", height: "h-56", imageUrl: "https://images.unsplash.com/photo-1603354363425-60bfaa356f88?q=80&w=600&auto=format&fit=crop" },
  { id: "11", caption: "Wisuda mini siswa Level 3", category: "Prestasi", height: "h-64", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" },
  { id: "12", caption: "Game edukatif interaktif", category: "Belajar", height: "h-44", imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop" },
];

const heightClasses = ["h-48", "h-64", "h-40", "h-56", "h-44", "h-60", "h-52"];

export function GallerySection() {
  const [items, setItems] = useState<GalleryDisplayItem[]>(fallbackGalleryItems);
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/galeri");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: GalleryDisplayItem[] = json.data.map(
            (
              g: {
                id?: string;
                caption?: string;
                kategori?: string;
                image_url?: string;
                imageUrl?: string;
              },
              index: number
            ) => ({
              id: g.id || String(index),
              caption: g.caption || "Momen Belajar AHE",
              category: g.kategori || "Belajar",
              height: heightClasses[index % heightClasses.length],
              imageUrl: g.image_url || g.imageUrl || "",
            })
          );
          setItems(mapped);
        }
      } catch {
        // Fallback to initial items on network error
      }
    }

    fetchGallery();
  }, []);

  const filtered = items.filter(
    (item) => activeCategory === "Semua" || item.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <section id="galeri" className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionTitle
          title="Momen "
          highlight="Belajar Bersama"
          subtitle="Setiap sesi adalah petualangan baru yang penuh tawa, semangat, dan pencapaian yang membanggakan."
          center
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12 md:mb-14">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md font-bold"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinterest-style grid */}
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="break-inside-avoid mb-4"
            >
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer card-hover">
                {/* Real Image */}
                <div className={cn("w-full relative bg-muted", item.height)}>
                  <Image
                    src={item.imageUrl}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <span className="text-white/90 text-xs bg-white/20 backdrop-blur-xs rounded-full px-2 py-0.5 mb-1 inline-block font-semibold">
                      {item.category}
                    </span>
                    <p className="text-white text-xs font-medium leading-tight">{item.caption}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground">Belum ada foto untuk kategori ini.</p>
          </div>
        )}

        {/* View more */}
        <div className="text-center mt-14 md:mt-16">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all group"
          >
            <InstagramIcon className="w-4 h-4 shrink-0 transition-colors group-hover:text-pink-600" />
            Lihat Lebih Banyak di Instagram
          </a>
        </div>
      </div>
    </section>
  );
}