"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopRatedProducts } from "@/actions/get-top-rated-products";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  avg_rating: number;
  price: number;
}

const TopRatedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopRatedProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getTopRatedProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching top rated products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedProducts();
  }, []);

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Top Rated Products</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    href={`/products/${product.id}`}
    className="border rounded-lg p-4 transition-shadow hover:shadow-lg"
  >
    <div className="relative aspect-square mb-2">
      <Image
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
    <div className="flex items-center mt-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="ml-1 text-sm font-medium">
        {product.avg_rating?.toFixed(1) || "N/A"}
      </span>
    </div>
    <div className="mt-2 font-bold text-green-600">
      ${product.price.toFixed(2)}
    </div>
  </Link>
);

const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export default TopRatedProducts;
