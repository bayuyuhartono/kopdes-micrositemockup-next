import { products, getProductById } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-4">❌</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Produk tidak ditemukan
        </h1>
        <a href="/products" className="text-green-600 font-semibold hover:underline">
          Kembali ke Produk
        </a>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
