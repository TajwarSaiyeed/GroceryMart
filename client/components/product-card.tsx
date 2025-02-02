import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  category: number | string;
  quantity: number;
}

export function ProductCard({
  name,
  description,
  price,
  image,
  category,
  quantity,
}: ProductCardProps) {
  const categoryLabel =
    typeof category === "number" ? `Category ${category}` : category;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
          <span className="text-sm text-gray-500">{quantity}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Category: {categoryLabel}
        </div>
        <Button className="w-full">Add to Cart</Button>
      </div>
    </div>
  );
}
