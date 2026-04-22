"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({
  product,
  showDescription = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 group flex flex-col">
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        {product.stock <= 10 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Sisa {product.stock}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 leading-snug mb-1">
          {product.name}
        </h3>

        {showDescription && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <p className="text-green-700 font-bold text-base">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Lihat Detail
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
