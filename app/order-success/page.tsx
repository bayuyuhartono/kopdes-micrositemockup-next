"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/context/CartContext";
import Button from "@/components/Button";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export interface StoredOrder {
  orderId: string;
  name: string;
  phone: string;
  delivery: "pickup" | "delivery";
  address: string;
  payment: string;
  paymentType: "va" | "qris";
  paymentLabel: string;
  vaNumber: string;
  items: CartItem[];
  totalPrice: number;
  status: "unpaid" | "paid";
  createdAt: string;
}

export function saveOrderToHistory(order: StoredOrder) {
  try {
    const raw = localStorage.getItem("simkopdes_orders");
    const existing: StoredOrder[] = raw ? JSON.parse(raw) : [];
    const updated = [order, ...existing.filter((o) => o.orderId !== order.orderId)];
    localStorage.setItem("simkopdes_orders", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("simkopdes_order");
    if (!raw) return;
    const data = JSON.parse(raw);
    const stored: StoredOrder = { ...data, status: "unpaid", createdAt: new Date().toISOString() };
    setOrder(stored);
    saveOrderToHistory(stored);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-4">📋</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Tidak ada pesanan ditemukan</h1>
        <p className="text-gray-500 mb-6">Silakan lakukan pemesanan terlebih dahulu.</p>
        <Link href="/products"><Button size="lg">Mulai Belanja</Button></Link>
      </div>
    );
  }

  const qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SIMKOPDES-${order.orderId}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pesanan Berhasil!</h1>
        <p className="text-gray-500">Terima kasih, {order.name}! Segera selesaikan pembayaran Anda.</p>
      </div>

      {/* Order card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-green-200 text-xs font-medium">ID Pesanan</p>
            <p className="text-xl font-extrabold tracking-wider">{order.orderId}</p>
          </div>
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full">
            Menunggu Pembayaran
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Info rows */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nama Pemesan",      value: order.name },
              { label: "Nomor HP",          value: order.phone },
              { label: "Metode Pengiriman", value: order.delivery === "pickup" ? "Ambil di Tempat" : "Dikirim ke Alamat" },
              { label: "Metode Pembayaran", value: order.paymentLabel },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs text-gray-400 font-medium">{row.label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          {order.delivery === "delivery" && order.address && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 font-medium mb-1">Alamat Pengiriman</p>
              <p className="text-gray-800 text-sm">{order.address}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="font-bold text-gray-700 text-sm mb-3">Detail Produk</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {item.quantity}
                    </span>
                    <span className="text-sm text-gray-700 line-clamp-1">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-4">
            <span className="font-bold text-gray-800">Total Pembayaran</span>
            <span className="text-2xl font-extrabold text-green-700">{formatPrice(order.totalPrice)}</span>
          </div>

          {/* Payment instruction — VA */}
          {order.paymentType === "va" && order.vaNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="font-semibold text-blue-800 text-sm mb-3">
                Transfer ke {order.paymentLabel}
              </p>
              <p className="text-xs text-blue-500 mb-1">Nomor Virtual Account</p>
              <div className="flex items-center justify-between gap-3 bg-white rounded-lg border border-blue-100 px-4 py-3 mb-3">
                <span className="font-mono font-bold text-gray-800 text-xl tracking-widest">
                  {order.vaNumber}
                </span>
                <button
                  onClick={() => handleCopy(order.vaNumber)}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {copied ? "✓ Disalin" : "Salin"}
                </button>
              </div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>· Transfer tepat sesuai nominal tagihan</li>
                <li>· Pembayaran otomatis terverifikasi dalam 1–5 menit</li>
                <li>· Berlaku 24 jam sejak pesanan dibuat</li>
              </ul>
            </div>
          )}

          {/* Payment instruction — QRIS */}
          {order.paymentType === "qris" && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center">
              <p className="font-semibold text-gray-800 text-sm mb-1">Scan QR Code untuk Membayar</p>
              <p className="text-xs text-gray-500 mb-5">
                Gunakan aplikasi e-wallet apa pun yang mendukung QRIS
              </p>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Image
                  src={qrisUrl}
                  alt="QRIS Code"
                  width={220}
                  height={220}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                ID: <span className="font-mono font-semibold">{order.orderId}</span> · Berlaku 30 menit
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link href="/products" className="flex-1">
          <Button fullWidth size="lg">Belanja Lagi</Button>
        </Link>
        <Link href="/profile" className="flex-1">
          <Button fullWidth size="lg" variant="outline">Lihat Riwayat Pesanan</Button>
        </Link>
      </div>
    </div>
  );
}
