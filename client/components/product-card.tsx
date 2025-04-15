"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";
import { addToWishList } from "@/actions/toggle-wishlist";
import { useSession } from "next-auth/react";

interface Props {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: number | string;
  quantity: number;
}

interface ProductCardProps extends Props {
  wishlist_users: string[];
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  quantity,
  wishlist_users = [],
}: ProductCardProps) {
  const { data: session } = useSession();
  const categoryLabel =
    typeof category === "number" ? `Category ${category}` : category;

  async function handleAddToWishlist() {
    try {
      toast.loading("Working...");
      const response = await addToWishList(id);
      toast.success(response.message);
    } catch {
      toast.error("Failed to add product to wishlist");
    } finally {
      toast.dismiss();
    }
  }

  const isWishlist =
    !session?.user || wishlist_users.length === 0
      ? false
      : wishlist_users.includes(session.user?.name ?? "");

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      {!isWishlist && (
        <Button
          variant={"outline"}
          size={"icon"}
          className="absolute top-2 right-2 border-none"
          onClick={handleAddToWishlist}
        >
          <HeartIcon size={24} />
        </Button>
      )}
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {description.length > 20
            ? `${description.slice(0, 20)}...`
            : description}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">In stock: {quantity}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Category: {categoryLabel}
        </div>
        <Link href={`/products/${id}`} passHref>
          <Button className="w-full bg-green-600 hover:bg-green-700">View Details</Button>
        </Link>
      </div>
    </div>
  );
}
