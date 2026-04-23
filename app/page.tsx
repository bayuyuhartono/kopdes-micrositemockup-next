import Link from "next/link";
import Button from "@/components/Button";
import FilterableProducts from "@/components/FilterableProducts";

export default function LandingPage() {

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-green-500 bg-opacity-50 text-green-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-green-400">
              🌾 Produk Unggulan Desa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Belanja Produk Desa,{" "}
              <span className="text-green-200">Dukung UMKM Lokal</span>
            </h1>
            <p className="text-green-100 text-lg sm:text-xl leading-relaxed mb-8">
              Simkopdes menghadirkan produk-produk berkualitas langsung dari
              tangan petani dan pengrajin desa Makmur. Segar, asli, dan
              terjangkau.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products">
                <Button size="lg" className="bg-white !text-green-700 hover:!bg-green-50 font-bold shadow-lg">
                  Lihat Semua Produk
                </Button>
              </Link>
              <Link href="#about">
                <Button
                  size="lg"
                  variant="outline"
                  className="!border-white !text-white hover:!bg-white hover:!bg-opacity-10"
                >
                  Tentang Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Produk Tersedia" },
              { value: "1,200+", label: "Pelanggan Puas" },
              { value: "50+", label: "UMKM Mitra" },
              { value: "100%", label: "Produk Asli Desa" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-green-700">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
                Tentang Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-5 leading-tight">
                Koperasi Desa Makmur untuk Warga Sejahtera
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Koperasi Desa Makmur berdiri sejak tahun 2005 dengan misi
                mempertemukan produsen lokal dengan konsumen secara langsung.
                Kami menjamin setiap produk yang dijual merupakan hasil produksi
                asli warga desa kami.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Dengan bergabung bersama kami, Anda tidak hanya mendapatkan
                produk berkualitas dengan harga terjangkau, tetapi juga
                berkontribusi langsung pada kesejahteraan petani dan pengrajin
                desa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { icon: "🌱", text: "Organik & Alami" },
                  { icon: "🤝", text: "Mendukung UMKM" },
                  { icon: "🚚", text: "Pengiriman Cepat" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Berdiri Sejak",
                  value: "2005",
                  desc: "Melayani masyarakat desa",
                  color: "bg-green-50 border-green-200",
                },
                {
                  title: "Produk Unggulan",
                  value: "12+",
                  desc: "Kategori produk pilihan",
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  title: "Petani Mitra",
                  value: "50+",
                  desc: "Bergabung aktif",
                  color: "bg-yellow-50 border-yellow-200",
                },
                {
                  title: "Kepuasan",
                  value: "4.9/5",
                  desc: "Rating dari pelanggan",
                  color: "bg-purple-50 border-purple-200",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`${card.color} border rounded-2xl p-5 text-center`}
                >
                  <p className="text-3xl font-extrabold text-gray-800 mb-1">
                    {card.value}
                  </p>
                  <p className="font-semibold text-gray-700 text-sm">
                    {card.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Produk Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Semua Produk Unggulan Desa
            </h2>
          </div>
          <FilterableProducts />
        </div>
      </section>
    </div>
  );
}
