import { Percent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Deal {
  id: number;
  name: string;
  image: string;
  price: number;
  old_price: number;
}

export const DealCard = ({ deal }: { deal: Deal }) => {
  const hasDiscount = deal.old_price && deal.old_price > deal.price;

  const discountPercentage = hasDiscount
    ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
    : 0;

  return (
    <Link
      href={`/products/${deal.id}`}
      className="border rounded-lg p-4 transition-shadow hover:shadow-xl bg-white"
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
        <Image
          src={deal.image || "/placeholder.svg"}
          alt={deal.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
        {deal.name}
      </h3>

      {hasDiscount && (
        <div className="flex items-center mt-1 text-green-600">
          <Percent className="w-4 h-4" />
          <span className="ml-1 text-sm font-medium">
            Save ${(deal.old_price - deal.price).toFixed(2)}
          </span>
        </div>
      )}

      <div className="mt-2 flex items-baseline">
        <span className="text-lg font-bold text-green-600">
          ${deal.price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="ml-2 text-sm text-gray-500 line-through">
            ${deal.old_price.toFixed(2)}
          </span>
        )}
      </div>
    </Link>
  );
};
