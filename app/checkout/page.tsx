"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import AuthGuard from "@/components/AuthGuard";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function generateVA(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const VA_BANKS = [
  { id: "bca",     label: "BCA",     fullLabel: "BCA Virtual Account",     logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" },
  { id: "mandiri", label: "Mandiri", fullLabel: "Mandiri Virtual Account", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" },
  { id: "bri",     label: "BRI",     fullLabel: "BRI Virtual Account",     logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg" },
  { id: "bni",     label: "BNI",     fullLabel: "BNI Virtual Account",     logo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg" },
];

interface FormErrors {
  phone?: string;
  address?: string;
  payment?: string;
}

function CheckoutContent() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [phone, setPhone] = useState(user?.phone ?? "");
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [vaNumber, setVaNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Keranjang Kosong</h1>
        <p className="text-gray-500 mb-6">Tambahkan produk ke keranjang terlebih dahulu.</p>
        <Link href="/products"><Button size="lg">Belanja Sekarang</Button></Link>
      </div>
    );
  }

  const handlePaymentChange = (id: string) => {
    setPayment(id);
    setVaNumber(id !== "qris" ? generateVA() : "");
    setErrors((prev) => ({ ...prev, payment: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!phone.trim()) errs.phone = "Nomor HP wajib diisi";
    else if (!/^(\+62|62|0)[0-9]{8,14}$/.test(phone.replace(/\s/g, "")))
      errs.phone = "Format nomor HP tidak valid";
    if (delivery === "delivery" && !address.trim())
      errs.address = "Alamat pengiriman wajib diisi";
    if (!payment) errs.payment = "Pilih metode pembayaran";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const orderId = "SKD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const selectedBank = VA_BANKS.find((b) => b.id === payment);

    const orderData = {
      orderId,
      name: user?.name ?? "",
      phone,
      delivery,
      address: delivery === "delivery" ? address : "",
      payment,
      paymentType: payment === "qris" ? "qris" : "va",
      paymentLabel: payment === "qris" ? "QRIS" : selectedBank?.fullLabel ?? payment.toUpperCase(),
      vaNumber: payment !== "qris" ? vaNumber : "",
      items,
      totalPrice,
    };

    sessionStorage.setItem("simkopdes_order", JSON.stringify(orderData));
    clearCart();
    router.push("/order-success");
  };

  const selectedBank = VA_BANKS.find((b) => b.id === payment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 lg:pb-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <form id="checkout-form" onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Personal info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center justify-center">1</span>
                Informasi Pemesan
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5">
                    <span className="text-gray-800 text-sm font-medium flex-1">{user?.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Otomatis</span>
                  </div>
                </div>
                <Input label="Nomor HP" fullWidth required placeholder="08xxxxxxxxxx" type="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
              </div>
            </div>

            {/* 2. Delivery */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center justify-center">2</span>
                Metode Pengiriman
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { value: "pickup",   label: "Ambil di Tempat", desc: "Ambil langsung di Koperasi Desa", icon: "🏬" },
                  { value: "delivery", label: "Dikirim",         desc: "Dikirim ke alamat Anda",          icon: "🚚" },
                ].map((opt) => (
                  <label key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      delivery === opt.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input type="radio" name="delivery" value={opt.value}
                      checked={delivery === opt.value}
                      onChange={() => setDelivery(opt.value as "pickup" | "delivery")}
                      className="mt-0.5 accent-green-600" />
                    <div>
                      <p className="text-xl mb-1">{opt.icon}</p>
                      <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                      <p className="text-gray-500 text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {delivery === "delivery" && (
                <Input label="Alamat Pengiriman" fullWidth required
                  placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan, Kota"
                  value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} />
              )}
            </div>

            {/* 3. Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center justify-center">3</span>
                Metode Pembayaran
              </h2>

              {/* VA Banks */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Virtual Account
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {VA_BANKS.map((bank) => (
                  <label key={bank.id}
                    className={`flex flex-col items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      payment === bank.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input type="radio" name="payment" value={bank.id}
                      checked={payment === bank.id}
                      onChange={() => handlePaymentChange(bank.id)}
                      className="sr-only" />
                    <div className="w-14 h-10 flex items-center justify-center">
                      <Image src={bank.logo} alt={bank.label} width={56} height={40}
                        className="object-contain w-full h-full" unoptimized />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{bank.label} VA</span>
                  </label>
                ))}
              </div>

              {/* QRIS */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">QRIS</p>
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  payment === "qris" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                }`}
              >
                <input type="radio" name="payment" value="qris"
                  checked={payment === "qris"}
                  onChange={() => handlePaymentChange("qris")}
                  className="sr-only" />
                <div className="w-16 h-10 flex items-center justify-center flex-shrink-0">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/e/e1/QRIS_logo.svg"
                    alt="QRIS" width={64} height={40} className="object-contain w-full h-full" unoptimized />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">QRIS</p>
                  <p className="text-gray-500 text-xs">Bayar dengan aplikasi e-wallet apapun</p>
                </div>
                {payment === "qris" && (
                  <svg className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>

              {errors.payment && (
                <p className="text-xs text-red-500 mt-3">{errors.payment}</p>
              )}
            </div>
          </div>

          {/* Right: summary — desktop only */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-800 text-lg mb-5">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <span className="w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      {item.quantity}
                    </span>
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-sm text-gray-700 line-clamp-1 flex-1">{item.product.name}</span>
                      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-extrabold text-green-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Konfirmasi Pesanan"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{items.length} jenis produk</p>
          <p className="text-lg font-extrabold text-green-700 leading-tight">{formatPrice(totalPrice)}</p>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          size="md"
          disabled={submitting}
        >
          {submitting ? "Memproses..." : "Konfirmasi →"}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}
