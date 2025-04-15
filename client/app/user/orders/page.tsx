import { DataTable } from "@/components/data-table";
import { getOrders } from "@/actions/get-orders";
import { orderColumns } from "./components/columns";

export const dynamic = "force-dynamic";

const OrdersPage = async () => {
  const ordersData = await getOrders();

  return (
    <div>
      <DataTable data={ordersData} columns={orderColumns} />
    </div>
  );
};

export default OrdersPage;
