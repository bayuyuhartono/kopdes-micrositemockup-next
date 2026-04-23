export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Beras Pandan Wangi",
    price: 65000,
    image: "/image/product/rice.jpg",
    description:
      "Beras pandan wangi pilihan dari ladang subur desa kami. Pulen, harum, dan bergizi tinggi. Dipanen langsung oleh petani lokal dengan metode organik tanpa pestisida berbahaya.",
    stock: 150,
    category: "Sembako",
  },
  {
    id: "2",
    name: "Minyak Kelapa Murni",
    price: 45000,
    image: "/image/product/cocooil.jpg",
    description:
      "Minyak kelapa murni hasil produksi UMKM desa, diolah secara tradisional dari kelapa segar pilihan. Kaya manfaat untuk memasak maupun perawatan tubuh.",
    stock: 80,
    category: "Sembako",
  },
  {
    id: "3",
    name: "Gula Aren Asli",
    price: 28000,
    image: "/image/product/brown_sugar.jpg",
    description:
      "Gula aren murni tanpa campuran bahan kimia. Diproses secara tradisional dari nira pohon aren pilihan. Cocok untuk berbagai masakan dan minuman tradisional.",
    stock: 200,
    category: "Sembako",
  },
  {
    id: "4",
    name: "Keripik Singkong Pedas",
    price: 15000,
    image: "/image/product/cassava.jpg",
    description:
      "Keripik singkong renyah dengan bumbu pedas khas desa. Dibuat dari singkong segar pilihan, digoreng dengan minyak bersih tanpa pengawet dan pewarna buatan.",
    stock: 300,
    category: "Makanan Ringan",
  },
  {
    id: "5",
    name: "Tempe Organik",
    price: 8000,
    image: "/image/product/tempe.jpg",
    description:
      "Tempe organik berkualitas tinggi terbuat dari kedelai lokal pilihan. Difermentasi secara alami selama 36 jam untuk mendapatkan tekstur dan rasa terbaik.",
    stock: 100,
    category: "Makanan Segar",
  },
  {
    id: "6",
    name: "Anyaman Bambu (Tampah)",
    price: 35000,
    image: "/image/product/anyaman-bambu.webp",
    description:
      "Tampah anyaman bambu berkualitas tinggi buatan pengrajin desa. Kuat, tahan lama, dan ramah lingkungan. Tersedia dalam berbagai ukuran untuk kebutuhan dapur Anda.",
    stock: 50,
    category: "Kerajinan",
  },
  {
    id: "7",
    name: "Kopi Robusta Desa",
    price: 55000,
    image: "/image/product/robusta.webp",
    description:
      "Kopi robusta premium hasil perkebunan rakyat desa. Diproses dengan metode natural sun-dried untuk menghasilkan cita rasa kopi yang kuat, sedikit manis, dan bersih.",
    stock: 90,
    category: "Minuman",
  },
  {
    id: "8",
    name: "Sambal Terasi Homemade",
    price: 20000,
    image: "/image/product/sambal.webp",
    description:
      "Sambal terasi pedas gurih buatan ibu-ibu PKK desa. Dibuat dari bahan segar pilihan: cabai merah, bawang, terasi kualitas premium, tanpa MSG dan pengawet.",
    stock: 120,
    category: "Bumbu & Saus",
  },
  {
    id: "9",
    name: "Telur Ayam Kampung",
    price: 32000,
    image: "/image/product/telur.webp",
    description:
      "Telur ayam kampung segar isi 10 butir. Ayam dipelihara secara bebas (free-range) dengan pakan alami tanpa hormon. Kuning telur lebih orange dan bergizi tinggi.",
    stock: 200,
    category: "Makanan Segar",
  },
  {
    id: "10",
    name: "Jamu Kunyit Asam",
    price: 18000,
    image: "/image/product/jamukunyit.jpg",
    description:
      "Jamu tradisional kunyit asam segar racikan empu jamu desa. Terbuat dari kunyit segar, asam jawa, gula aren, dan rempah pilihan. Menyehatkan dan menyegarkan.",
    stock: 75,
    category: "Minuman",
  },
  {
    id: "11",
    name: "Batik Tulis Motif Desa",
    price: 185000,
    image: "/image/product/batik.avif",
    description:
      "Batik tulis asli buatan pengrajin desa dengan motif khas lokal. Setiap helai dikerjakan dengan tangan menggunakan malam dan canting. Unik dan bernilai seni tinggi.",
    stock: 25,
    category: "Kerajinan",
  },
  {
    id: "12",
    name: "Emping Melinjo",
    price: 22000,
    image: "/image/product/emping.jpg",
    description:
      "Emping melinjo renyah buatan pengrajin desa. Dipukul tipis-tipis dari biji melinjo pilihan, digoreng hingga renyah sempurna. Camilan sehat kaya antioksidan.",
    stock: 160,
    category: "Makanan Ringan",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getTopProducts(count: number = 5): Product[] {
  return products.slice(0, count);
}
