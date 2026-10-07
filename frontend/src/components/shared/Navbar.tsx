"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronRight, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

interface AuthUser {
  nama: string;
  role: string;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser({
              nama: json.data.nama,
              role: json.data.role,
            });
          }
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "tutor") return "/tutor";
    return "/dashboard";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="AHE Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-bold text-base leading-tight transition-colors",
                  scrolled ? "text-foreground" : "text-white"
                )}
              >
                {SITE_NAME}
              </span>
              <span
                className={cn(
                  "text-xs leading-tight transition-colors",
                  scrolled ? "text-muted-foreground" : "text-white/70"
                )}
              >
                Belajar Membaca Seru!
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    scrolled
                      ? "text-foreground hover:text-primary hover:bg-primary/5"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <Link href={getDashboardLink()}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs font-semibold gap-1.5 transition-all",
                    scrolled
                      ? "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
                      : "bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                  )}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard ({user.role})
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs font-semibold gap-1.5 transition-all",
                    scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                  )}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk Akun
                </Button>
              </Link>
            )}

            <Link href="/daftar">
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all gap-1.5 text-xs px-4"
              >
                Daftar Baru
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
              )}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-100">
                  {user ? (
                    <Link href={getDashboardLink()} onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-center gap-2 border-purple-200 text-purple-900 bg-purple-50">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard ({user.role})
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Masuk Akun
                      </Button>
                    </Link>
                  )}
                  <Link href="/daftar" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                      Daftar Peserta Didik Baru
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
