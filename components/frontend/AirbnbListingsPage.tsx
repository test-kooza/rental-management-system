"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useProperties } from "@/hooks/useProperty";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import { PropertyGrid } from "./PropertyGrid";


const PropertyListingContainer = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || "all";

  const {
    properties,
    totalCount,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useProperties({
    categoryId: categoryId !== "all" ? categoryId : undefined,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading properties. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-2">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {!isLoading && `${totalCount} properties found`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <PropertyGrid properties={properties.map(property => ({
            id: property.id,
            location: property.location,
            country: property.country,
            host: property.host.name,
            dateRange: "Available now", 
            price: {
              amount: property.pricing.basePrice,
              currency: property.pricing.currency,
              period: "night"
            },
            rating: property.avgRating,
            isFeatured: property.isFeatured,
            isAvailable:property.isAvailable,
            images: property.images.map(img => ({ url: img, alt: property.title })),
            slug: property.slug
          }))} />


          {hasNextPage && (
            <div ref={loadMoreRef} className="py-10 flex justify-center">
              {isFetchingNextPage ? (
                <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-primary animate-spin"></div>
              ) : (
                <div className="h-8"></div> 
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function AirbnbListingsPage() {
  return (
    <>
      <Suspense fallback={<PropertyListingsSkeleton />}>
        <PropertyListingContainer />
      </Suspense>
    </>
  );
}

const PropertyListingsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 pb-8 pt-2">
      <div className="mb-4">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};