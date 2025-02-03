"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/actions/get-products";
import { getCategories } from "@/actions/get-categories";

interface CategoryProps {
  id: number;
  name: string;
}

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: number;
  quantity: number;
}

interface Props extends ProductProps {
  wishlist_users: string[];
}

interface ProductsData {
  results: Props[];
  count: number;
  next: string | null;
  previous: string | null;
}

const backendPageSize = 8;

const ProductsPage = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All"
  );
  const [productsData, setProductsData] = useState<ProductsData>({
    results: [] as (ProductProps & { wishlist_users: string[] })[],
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories([{ id: 0, name: "All" }, ...response]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const categoryId =
          selectedCategory === "All" ? undefined : selectedCategory;
        const response = await getProducts(categoryId, currentPage);
        setProductsData(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "All" ? "All" : Number.parseInt(value));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(productsData.count / backendPageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "bg-blue-500 text-white" : ""}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mb-5 mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Explore our Products
        </h1>
        <p className="text-muted-foreground">
          Discover a wide range of fresh and quality products for your daily
          needs.
        </p>
      </div>

      <div className="flex flex-row items-center justify-between mb-10">
        <div>
          {isCategoryLoading ? (
            <Skeleton className="w-[180px] h-10" />
          ) : (
            <Select
              value={
                selectedCategory === "All" ? "All" : String(selectedCategory)
              }
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id === 0 ? "All" : String(category.id)}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex justify-center">{renderPagination()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: backendPageSize }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : productsData.results.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                category={
                  categories.find((cat) => cat.id === product.category)?.name ||
                  product.category
                }
              />
            ))}
      </div>
    </div>
  );
};

const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export default ProductsPage;
