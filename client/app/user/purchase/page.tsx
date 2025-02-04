import { DataTable } from "@/components/data-table";
import { purchaseColumns } from "./components/columns";
import { getPurchaseData } from "@/actions/get-purchase";

export const dynamic = "force-dynamic";

const PurchasePage = async () => {
  const purchaseData = await getPurchaseData();

  return (
    <div>
      <DataTable data={purchaseData} columns={purchaseColumns} />
    </div>
  );
};

export default PurchasePage;
