"use client";

import { useState, useEffect } from "react";
import { getReviews } from "../actions/get-product-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteReview } from "../actions/manage-review";

interface Review {
  id: number;
  rating: number;
  description: string;
  customer: string;
  timestamp: string;
  customer_id: number;
}

interface ReviewListProps {
  productId: number;
  onEditReview: (review: Review) => void;
}

export const ReviewList = ({ productId, onEditReview }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  const handleDelete = async (id: number) => {
    try {
      toast.loading("Deleting review...");
      await deleteReview(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
    finally {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {reviews.map((review) => (
        <div key={review.id} className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{review.customer}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="mt-2">{review.description}</p>
          {status === "authenticated" &&
            (session?.user?.name || "") === review.customer && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onEditReview(review)}
                >
                  <PencilLine size={16} /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDelete(review.id)}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

const ReviewListSkeleton = () => (
  <div className="space-y-6 mt-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border-b pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-full mt-1" />
      </div>
    ))}
  </div>
);
