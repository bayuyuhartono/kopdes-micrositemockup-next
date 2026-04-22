"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Image
        src={product.image}
        alt={product.name}
        width={96}
        height={96}
        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
        unoptimized
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
            title="Hapus"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all font-bold text-lg leading-none"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-gray-800 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all font-bold text-lg leading-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-xs text-gray-400">Subtotal</p>
            <p className="font-bold text-green-700 text-sm">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
