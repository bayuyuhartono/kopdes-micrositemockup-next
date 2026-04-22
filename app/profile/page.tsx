"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Button from "@/components/Button";
import { StoredOrder } from "@/app/order-success/page";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ─── Order Detail ─────────────────────────────────────────────── */
function OrderDetail({ order, onBack }: { order: StoredOrder; onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<StoredOrder>(order);

  useEffect(() => {
    const raw = localStorage.getItem("simkopdes_orders");
    if (raw) setOrders(JSON.parse(raw));
  }, []);

  const markAsPaid = () => {
    const updated = orders.map((o) =>
      o.orderId === currentOrder.orderId ? { ...o, status: "paid" as const } : o
    );
    localStorage.setItem("simkopdes_orders", JSON.stringify(updated));
    setOrders(updated);
    setCurrentOrder((prev) => ({ ...prev, status: "paid" }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SIMKOPDES-${currentOrder.orderId}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Riwayat
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-green-200 text-xs font-medium">ID Pesanan</p>
            <p className="text-xl font-extrabold tracking-wider">{currentOrder.orderId}</p>
            <p className="text-green-200 text-xs mt-1">{formatDate(currentOrder.createdAt)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            currentOrder.status === "paid"
              ? "bg-green-400 text-green-900"
              : "bg-yellow-400 text-yellow-900"
          }`}>
            {currentOrder.status === "paid" ? "Lunas" : "Menunggu Pembayaran"}
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nama Pemesan",      value: currentOrder.name },
              { label: "Nomor HP",          value: currentOrder.phone },
              { label: "Metode Pengiriman", value: currentOrder.delivery === "pickup" ? "Ambil di Tempat" : "Dikirim" },
              { label: "Metode Pembayaran", value: currentOrder.paymentLabel },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs text-gray-400 font-medium">{row.label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          {currentOrder.delivery === "delivery" && currentOrder.address && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-500 font-medium mb-1">Alamat Pengiriman</p>
              <p className="text-gray-800 text-sm">{currentOrder.address}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="font-bold text-gray-700 text-sm mb-3">Detail Produk</p>
            <div className="space-y-2">
              {currentOrder.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
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
          <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3">
            <span className="font-bold text-gray-800">Total Pembayaran</span>
            <span className="text-xl font-extrabold text-green-700">{formatPrice(currentOrder.totalPrice)}</span>
          </div>

          {/* Payment info — only when unpaid */}
          {currentOrder.status === "unpaid" && (
            <>
              {currentOrder.paymentType === "va" && currentOrder.vaNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="font-semibold text-blue-800 text-sm mb-3">
                    Transfer ke {currentOrder.paymentLabel}
                  </p>
                  <p className="text-xs text-blue-500 mb-1">Nomor Virtual Account</p>
                  <div className="flex items-center justify-between gap-3 bg-white rounded-lg border border-blue-100 px-4 py-3 mb-3">
                    <span className="font-mono font-bold text-gray-800 text-xl tracking-widest">
                      {currentOrder.vaNumber}
                    </span>
                    <button onClick={() => handleCopy(currentOrder.vaNumber)}
                      className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        copied ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {copied ? "✓ Disalin" : "Salin"}
                    </button>
                  </div>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>· Transfer tepat sesuai nominal tagihan</li>
                    <li>· Berlaku 24 jam sejak pesanan dibuat</li>
                  </ul>
                </div>
              )}

              {currentOrder.paymentType === "qris" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center">
                  <p className="font-semibold text-gray-800 text-sm mb-1">Scan QR Code untuk Membayar</p>
                  <p className="text-xs text-gray-500 mb-4">Gunakan e-wallet apapun yang mendukung QRIS</p>
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Image src={qrisUrl} alt="QRIS" width={200} height={200} className="rounded-lg" unoptimized />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    ID: <span className="font-mono font-semibold">{currentOrder.orderId}</span>
                  </p>
                </div>
              )}

              {/* Demo: mark as paid */}
              <button onClick={markAsPaid}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-green-300 text-green-700 text-sm font-semibold hover:bg-green-50 transition-colors"
              >
                ✓ Tandai Sudah Bayar (Demo)
              </button>
            </>
          )}

          {currentOrder.status === "paid" && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-800 text-sm">Pembayaran Diterima</p>
                <p className="text-green-600 text-xs">Pesanan Anda sedang diproses oleh koperasi</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Order List Item ───────────────────────────────────────────── */
function OrderCard({ order, onClick }: { order: StoredOrder; onClick: () => void }) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  return (
    <button onClick={onClick} className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-gray-800 text-sm">{order.orderId}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
          order.status === "paid"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {order.status === "paid" ? "Lunas" : "Belum Bayar"}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-1">
        {order.items.map((i) => i.product.name).join(", ")}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{itemCount} item · {order.paymentLabel}</span>
        <span className="font-bold text-green-700 text-sm">{formatPrice(order.totalPrice)}</span>
      </div>
    </button>
  );
}

/* ─── Profile Content ───────────────────────────────────────────── */
function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("order");

  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("simkopdes_orders");
    if (raw) setOrders(JSON.parse(raw));
  }, []);

  const selectedOrder = selectedId ? orders.find((o) => o.orderId === selectedId) ?? null : null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => router.push("/profile")} />;
  }

  const totalSpent = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.totalPrice, 0);
  const unpaidCount = orders.filter((o) => o.status === "unpaid").length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* User card */}
      <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-extrabold text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{user?.name}</h1>
            <p className="text-green-200 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 bg-green-600 bg-opacity-50 text-green-100 text-xs px-2 py-0.5 rounded-full">
              Anggota Koperasi
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Pesanan", value: orders.length },
            { label: "Belum Bayar",   value: unpaidCount },
            { label: "Total Belanja", value: formatPrice(totalSpent) },
          ].map((s) => (
            <div key={s.label} className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
              <p className="font-extrabold text-lg leading-tight">{s.value}</p>
              <p className="text-green-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/products">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-green-200 transition-all">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Belanja</span>
          </div>
        </Link>
        <button onClick={handleLogout} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-red-200 hover:bg-red-50 transition-all w-full text-left">
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-red-500">Keluar</span>
        </button>
      </div>

      {/* Order history */}
      <div>
        <h2 className="font-bold text-gray-800 text-lg mb-4">Riwayat Pesanan</h2>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">🧾</div>
            <p className="font-semibold text-gray-700 mb-1">Belum ada pesanan</p>
            <p className="text-gray-400 text-sm mb-5">Yuk mulai belanja produk desa!</p>
            <Link href="/products"><Button>Mulai Belanja</Button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onClick={() => router.push(`/profile?order=${order.orderId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </AuthGuard>
  );
}
