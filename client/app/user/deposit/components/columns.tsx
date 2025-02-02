"use client";

import { ColumnDef } from "@tanstack/react-table";

export type DepositData = {
  id: number;
  amount: string;
  deposit_date: string;
};

export const depositColumns: ColumnDef<DepositData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "deposit_date",
    header: "Deposit Date",
    cell: (data) => {
      return new Date(data.row.original.deposit_date).toLocaleDateString(
        "en-US"
          
      );
    },
  },
];
