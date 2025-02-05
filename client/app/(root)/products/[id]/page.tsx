"use client";

import type { ProductProps } from "../page";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "./components/review-form";
import { ReviewList } from "./components/review-list";
import { ProductDetails } from "./components/product-details";
import { getProductDetails } from "./actions/get-product-details";
import { EditReviewForm } from "./components/exit-review-form";

const ProductPage = () => {
  const { status } = useSession();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<{
    id: number;
    rating: number;
    description: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          return;
        }
        const pid = Number.parseInt(Array.isArray(id) ? id[0] : id);
        const data = await getProductDetails(pid);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProductDetails product={product} />
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {status === "authenticated" && !editingReview && (
          <>
            <Separator className="my-5" />
            <ReviewForm productId={product.id} />
          </>
        )}
        {editingReview && (
          <EditReviewForm
            review={editingReview}
            onCancel={() => setEditingReview(null)}
            onSuccess={() => {
              setEditingReview(null);
              window.location.reload();
            }}
          />
        )}
        <Separator className="my-5" />
        <ReviewList
          productId={product.id}
          onEditReview={(review) => setEditingReview(review)}
        />
      </div>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row gap-8">
      <Skeleton className="w-full md:w-1/2 h-96" />
      <div className="w-full md:w-1/2 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

export default ProductPage;
