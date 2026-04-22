import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-green-400 rounded-lg flex items-center justify-center">
                <span className="text-green-900 font-bold text-sm">SK</span>
              </div>
              <div>
                <p className="text-white font-bold">Simkopdes</p>
                <p className="text-green-300 text-xs">Koperasi Desa Makmur</p>
              </div>
            </div>
            <p className="text-green-300 text-sm leading-relaxed">
              Platform belanja produk unggulan desa. Mendukung UMKM lokal dan
              perekonomian masyarakat desa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/products", label: "Semua Produk" },
                { href: "/cart", label: "Keranjang" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-green-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategori Produk</h3>
            <ul className="space-y-2 text-green-300 text-sm">
              {["Sembako", "Makanan Ringan", "Minuman", "Kerajinan", "Bumbu & Saus"].map(
                (cat) => (
                  <li key={cat}>{cat}</li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak Kami</h3>
            <ul className="space-y-2 text-green-300 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Desa Makmur No. 1, Kec. Sejahtera, Kab. Bahagia</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(0321) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@simkopdes.desa.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-green-400 text-xs">
            &copy; {new Date().getFullYear()} Simkopdes — Koperasi Desa Makmur. Semua hak dilindungi.
          </p>
          <p className="text-green-500 text-xs">
            Membangun Desa, Memajukan Bangsa
          </p>
        </div>
      </div>
    </footer>
  );
}
