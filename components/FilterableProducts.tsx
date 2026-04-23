"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Input from "@/components/Input";
import { products } from "@/data/products";

const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

export default function FilterableProducts() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "Semua" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            fullWidth
            placeholder="Cari produk... (misal: beras, kopi, batik)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || activeCategory !== "Semua") && (
        <p className="text-sm text-gray-500 mb-4">
          Menampilkan{" "}
          <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
          produk
          {search && (
            <>
              {" "}untuk kata kunci &ldquo;
              <span className="font-semibold text-green-700">{search}</span>&rdquo;
            </>
          )}
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} showDescription />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Produk tidak ditemukan
          </h3>
          <p className="text-gray-500">
            Coba kata kunci lain atau ubah filter kategori
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("Semua"); }}
            className="mt-4 text-green-600 font-semibold hover:underline"
          >
            Reset pencarian
          </button>
        </div>
      )}
    </>
  );
}
