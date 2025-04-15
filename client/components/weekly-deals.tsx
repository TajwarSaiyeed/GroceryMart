"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilteredWeeklyDeals } from "@/actions/get-weekly-deals";
import { Deal, DealCard } from "./deal-card";

const WeeklyDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchWeeklyDeals = async () => {
    setIsLoading(true);
    try {
      const data = await getFilteredWeeklyDeals();
      setDeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching weekly deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyDeals();
  }, []);

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-green-600 font-bold">Weekly Deals</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <DealCardSkeleton key={index} />
            ))
          : deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)}
      </div>
    </section>
  );
};

const DealCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export default WeeklyDeals;
