"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeeklyDeals } from "@/actions/get-weekly-deals";
import { Deal, DealCard } from "@/components/deal-card";

interface DealsData {
  results: Deal[];
  count: number;
  next: string | null;
  previous: string | null;
}

const backendPageSize = 8;

const WeeklyDealsPage = () => {
  const [dealsData, setDealsData] = useState<DealsData>({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const response = await getWeeklyDeals(currentPage);
        setDealsData(response);
      } catch (error) {
        console.error("Error fetching weekly deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(dealsData.count / backendPageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex space-x-2">
        <Button
          size={"sm"}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            size={"sm"}
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "bg-green-500 text-white" : ""}
          >
            {page}
          </Button>
        ))}
        <Button
          size={"sm"}
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
        <h1 className="text-3xl text-green-600 font-bold tracking-tight mb-2">
          Weekly Deals
        </h1>
        <p className="text-muted-foreground">
          Discover amazing discounts on our quality products. Limited time
          offers!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: backendPageSize }).map((_, index) => (
              <DealCardSkeleton key={index} />
            ))
          : dealsData.results.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
      </div>

      <div className="flex justify-center mt-10">{renderPagination()}</div>
    </div>
  );
};

const DealCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export default WeeklyDealsPage;
