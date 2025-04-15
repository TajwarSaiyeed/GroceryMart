import React from "react";
import { getDepositHistory } from "../../actions/action";
import { DataTable } from "@/components/data-table";
import { depositColumns } from "../components/columns";

export const dynamic = 'force-dynamic';

const DepositHistory = async () => {
  const data = await getDepositHistory();

  return (
    <div>
      <DataTable data={data.data} columns={depositColumns} />
    </div>
  );
};

export default DepositHistory;
