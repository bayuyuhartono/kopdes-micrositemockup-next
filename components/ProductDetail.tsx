"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-green-700 transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-green-700 transition-colors">Produk</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={450}
            className="w-full object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-extrabold text-green-700 mb-4">
            {formatPrice(product.price)}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 10 ? "bg-green-500" : "bg-orange-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {product.stock > 10 ? (
                <span>Stok tersedia ({product.stock} unit)</span>
              ) : (
                <span className="text-orange-600 font-medium">
                  Hampir habis — sisa {product.stock} unit
                </span>
              )}
            </span>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-700 hover:border-green-400 hover:bg-green-50 transition-all font-bold text-xl"
              >
                −
              </button>
              <span className="w-14 text-center font-bold text-gray-800 text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-700 hover:border-green-400 hover:bg-green-50 transition-all font-bold text-xl"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-1">
                Max {product.stock}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-xl font-extrabold text-green-700">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`transition-all ${added ? "!bg-green-800" : ""}`}
              >
                {added ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Ditambahkan!
                  </span>
                ) : (
                  "Tambah ke Keranjang"
                )}
              </Button>
            </div>
            <Link href="/cart" className="flex-1">
              <Button fullWidth size="lg" variant="outline">
                Lihat Keranjang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Produk Serupa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="block">
                <div className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    unoptimized
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">
                      {p.name}
                    </p>
                    <p className="text-green-700 font-bold text-sm mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
