import { getWishlists } from "@/actions/get-wishlists";
import { DataTable } from "@/components/data-table";
import { wishlistColumns } from "./components/columns";

export const dynamic = "force-dynamic";

const WishlistPage = async () => {
  const wishlistData = await getWishlists();

  return (
    <div>
      <DataTable data={wishlistData} columns={wishlistColumns} />
    </div>
  );
};

export default WishlistPage;
