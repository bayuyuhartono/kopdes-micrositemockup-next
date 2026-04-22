"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function LoginPage() {
  const { login, isLoggedIn, initialized } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialized && isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [initialized, isLoggedIn, router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const ok = login(email, password);
    if (ok) {
      router.replace(redirectTo);
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white font-extrabold text-xl">SK</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Masuk ke Simkopdes</h1>
          <p className="text-gray-500 text-sm mt-1">Koperasi Desa Makmur</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              fullWidth
              required
              placeholder="budi@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              fullWidth
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Masuk...
                </span>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-green-700 font-medium">Demo Login</p>
          <p className="text-xs text-green-600 mt-0.5">
            budi@mail.com &nbsp;/&nbsp; password111
          </p>
        </div>
      </div>
    </div>
  );
}
