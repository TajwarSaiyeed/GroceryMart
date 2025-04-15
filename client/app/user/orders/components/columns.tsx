"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderData = {
  id: number;
  order_items: {
    id: number;
    product: {
      name: string;
    };
    quantity: number;
  }[];
  total_price: number;
  order_date: string;
};

export const orderColumns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "order_items",
    header: "Order Items",
    cell: (data) => {
      return data.row.original.order_items.map((item) => {
        return (
          <div key={item.id}>
            {item.product.name} - {item.quantity}
          </div>
        );
      });
    },
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
  },
  {
    accessorKey: "order_date",
    header: "Order Date",
    cell: (data) => {
      return new Date(data.row.original.order_date).toLocaleDateString("en-US");
    },
  },
];
