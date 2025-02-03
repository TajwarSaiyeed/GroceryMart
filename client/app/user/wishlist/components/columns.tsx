"use client";

import { deleteFromWishlist } from "@/actions/toggle-wishlist";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";

export type WishlistData = {
  id: number;
  product_name: string;
  product_image: string;
  timestamp: string;
};

export const wishlistColumns: ColumnDef<WishlistData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "product_name",
    header: "Product",
  },
  {
    accessorKey: "product_image",
    header: "Product Image",
    cell: (data) => {
      return (
        <Image
          src={data.row.original.product_image}
          alt={data.row.original.product_name}
          className="h-10 w-10"
          width={40}
          height={40}
        />
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Added On",
    cell: (data) => {
      return new Date(data.row.original.timestamp).toLocaleDateString("en-US");
    },
  },
  {
    header: "Actions",
    cell: (data) => {
      async function removeFromWishList() {
        try {
          toast.loading("Working...");
          await deleteFromWishlist(data.row.original.id);
          toast.success("Product removed from wishlist");
        } catch {
          toast.error("Failed to add product to wishlist");
        } finally {
          toast.dismiss();
        }
      }

      return (
        <button onClick={removeFromWishList} className="text-red-500">
          Remove
        </button>
      );
    },
  },
];
