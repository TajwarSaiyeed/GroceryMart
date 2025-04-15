"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { ProductProps } from "../../page";

interface ProductDetailsProps {
  product: ProductProps;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success("Added to Cart", {
      description: `${quantity} ${
        quantity > 1 ? "items" : "item"
      } added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm font-semibold">In Stock: {product.quantity}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 mt-4">
            <Input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => {
                if (e.target.value === "") {
                  setQuantity(1);
                  return;
                }
                const newQuantity = Number.parseInt(e.target.value);
                setQuantity(
                  Math.min(Math.max(1, newQuantity), product.quantity)
                );
              }}
              className="w-20"
            />
            <Button
              className=" bg-green-600 hover:bg-green-700"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
        {product.quantity < 10 && product.quantity > 0 && (
          <p className="text-sm text-red-500 mt-2">
            Only {product.quantity} left in stock - order soon!
          </p>
        )}
      </div>
    </div>
  );
};
