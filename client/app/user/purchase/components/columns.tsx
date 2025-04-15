"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type purchaseData = {
  id: number;
  product: string;
  product_id: string;
  quantity: number;
  purchase_date: string;
};

export const purchaseColumns: ColumnDef<purchaseData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: (data) => {
      return (
        <Link  href={`/products/${data.row.original.product_id}`}>
          {data.row.original.product}
        </Link>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: (data) => {
      return new Date(data.row.original.purchase_date).toLocaleDateString(
        "en-US"
      );
    },
  },
];
