"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Produk" },
    { href: "/cart", label: "Keranjang" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <span className="text-white font-bold text-sm">SK</span>
            </div>
            <div className="leading-tight">
              <p className="text-green-700 font-bold text-base">Simkopdes</p>
              <p className="text-gray-500 text-xs">Koperasi Desa Makmur</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium text-sm transition-all"
              >
                {link.label}
                {link.href === "/cart" && totalItems > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white text-xs rounded-full font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            ))}

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-800">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile: cart icon + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            {/* User info */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-green-50 rounded-xl mx-1">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">{user?.name}</p>
                  <p className="text-green-600 text-xs">{user?.email}</p>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium text-sm transition-all"
              >
                {link.label}
                {link.href === "/cart" && totalItems > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white text-xs rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium text-sm transition-all"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-green-700 font-semibold text-sm hover:bg-green-50 rounded-lg transition-all"
              >
                Masuk
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
