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
import { getCategories } from "@/actions/get-categories";
import { getProducts } from "@/actions/get-products";

interface CategoryProps {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: number;
  quantity: number;
}

interface ProductsData {
  results: Product[];
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
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories([{ id: 0, name: "All" }, ...response]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryId =
          selectedCategory === "All" ? undefined : selectedCategory;
        const response = await getProducts(categoryId, currentPage);
        setProductsData(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]);

  const pageCount = Math.ceil(productsData.count / backendPageSize);

  const handleCategoryChange = (value: string) => {
    const newCategory = value === "All" ? "All" : parseInt(value, 10);
    setSelectedCategory(newCategory);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pagesToShow = 3;
    const pageButtons = [];
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(pageCount, startPage + pagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="px-3 py-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {startPage > 1 && (
          <>
            <Button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1"
              variant={currentPage === 1 ? "default" : "outline"}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageButtons}

        {endPage < pageCount && (
          <>
            {endPage < pageCount - 1 && <span className="px-2">...</span>}
            <Button
              onClick={() => setCurrentPage(pageCount)}
              className="px-3 py-1"
              variant={currentPage === pageCount ? "default" : "outline"}
            >
              {pageCount}
            </Button>
          </>
        )}

        <Button
          onClick={() => setCurrentPage((old) => Math.min(old + 1, pageCount))}
          disabled={currentPage === pageCount}
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
        </div>
        <div className="flex justify-center">{renderPagination()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {productsData.results.map((product) => (
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

export default ProductsPage;
