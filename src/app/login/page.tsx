"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Sparkles, Shield, UserCheck, Heart, ArrowRight, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const role = json.data.role;
            if (role === "admin") router.replace("/admin");
            else if (role === "tutor") router.replace("/tutor");
            else if (role === "orangtua") router.replace("/dashboard");
            return;
          }
        }
      } catch {
        // Not logged in
      } finally {
        setCheckingAuth(false);
      }
    }
    checkCurrentSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Silakan isi email dan kata sandi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal masuk. Periksa kembali email dan kata sandi.");
        setLoading(false);
        return;
      }

      const role = data.data.role;
      if (from) {
        router.push(from);
      } else if (role === "admin") {
        router.push("/admin");
      } else if (role === "tutor") {
        router.push("/tutor");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Terjadi gangguan jaringan. Coba lagi beberapa saat lagi.");
      setLoading(false);
    }
  }

  function setDemoCredentials(role: "admin" | "tutor" | "ortu") {
    setError(null);
    if (role === "admin") {
      setEmail("admin@ahe.id");
      setPassword("admin123");
    } else if (role === "tutor") {
      setEmail("sari@ahe.id");
      setPassword("tutor123");
    } else {
      setEmail("sari.dewi@ahe.id");
      setPassword("ortu123");
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-slate-600">Memeriksa status sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-600 bg-clip-text text-transparent">
                AHE Karang Joang
              </span>
              <span className="block text-xs font-semibold text-purple-700 tracking-wider uppercase -mt-1">
                Anak Hebat Membaca
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke Portal Terpadu
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Akses sistem administrasi, pencatatan tutor, & pantauan orang tua
          </p>
        </div>

        {/* 1-Click Demo Credential Chips */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center justify-between gap-1 mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              1-Klik Akses Uji Coba (Demo):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin")}
              className="flex flex-col items-center p-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 hover:border-purple-300 transition-all text-center group cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Admin</span>
              <span className="text-[10px] text-purple-600">admin@ahe.id</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("tutor")}
              className="flex flex-col items-center p-2 rounded-xl border border-fuchsia-200 bg-fuchsia-50/70 hover:bg-fuchsia-100/80 hover:border-fuchsia-300 transition-all text-center group cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-fuchsia-700 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-fuchsia-900">Tutor</span>
              <span className="text-[10px] text-fuchsia-600">sari@ahe.id</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("ortu")}
              className="flex flex-col items-center p-2 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/80 hover:border-orange-300 transition-all text-center group cursor-pointer"
            >
              <Heart className="w-4 h-4 text-orange-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-950">Orang Tua</span>
              <span className="text-[10px] text-orange-700">sari.dewi@ahe.id</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="mt-4 bg-white py-8 px-6 shadow-xl shadow-purple-900/5 sm:rounded-3xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@ahe.id"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-orange-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-orange-600 shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              ← Kembali ke Beranda
            </Link>
            <Link href="/daftar" className="font-semibold text-purple-600 hover:text-purple-700">
              Daftar Peserta Didik Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
