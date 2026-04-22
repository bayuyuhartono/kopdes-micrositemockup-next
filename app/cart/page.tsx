"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import AuthGuard from "@/components/AuthGuard";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function CartContent() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">
          Keranjang Belanja Kosong
        </h1>
        <p className="text-gray-500 mb-8">
          Belum ada produk di keranjang Anda. Yuk, mulai belanja produk unggulan
          desa!
        </p>
        <Link href="/products">
          <Button size="lg">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  const shippingNote = "Biaya pengiriman dihitung saat checkout";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Keranjang Belanja
          </h1>
          <p className="text-gray-500 mt-1">{totalItems} item dalam keranjang</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Item list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-5">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 line-clamp-1 flex-1 mr-3">
                    {item.product.name}{" "}
                    <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal ({totalItems} item)</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-400">{shippingNote}</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-extrabold text-green-700">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link href="/checkout">
              <Button fullWidth size="lg">
                Lanjut ke Checkout →
              </Button>
            </Link>

            <Link href="/products">
              <Button fullWidth size="md" variant="outline" className="mt-3">
                Lanjut Belanja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}
