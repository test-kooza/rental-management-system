"use client";

import { usePropertyCategories } from "@/hooks/useBookings";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function MobileCategoriesScroller() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading } = usePropertyCategories();
  
  const activeCategory = searchParams.get("category") || "all";

  const allCategory = {
    id: "all",
    name: "All",
    slug: "all",
    icon: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg",
    isActive: true
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="border-b pb-0 flex md:hidden">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide px-4">
        {/* All category always displayed first */}
        <div 
          key="all"
          className={`flex flex-col items-center cursor-pointer pt-4 pb-2 min-w-16 ${
            activeCategory === "all" ? "border-b-2 border-black" : ""
          }`}
          onClick={() => handleCategorySelect("all")}
        >
          <div className="h-6 w-6 relative mb-1">
            <Image
              src={allCategory.icon}
              alt={allCategory.name}
              fill
              className="object-cover"
            />
          </div>
          <span className={`text-xs whitespace-nowrap ${
            activeCategory === "all" ? "font-medium" : "text-gray-500"
          }`}>
            {allCategory.name}
          </span>
        </div>

        {isLoading ? (
          // Display skeletons while loading
          Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="flex flex-col items-center pt-4 pb-2 min-w-16">
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full mb-1"></div>
              <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))
        ) : (
          // Display actual categories
          categories.map((category) => (
            <div 
              key={category.id}
              className={`flex flex-col items-center cursor-pointer pt-4 pb-2 min-w-16 ${
                activeCategory === category.id ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="h-6 w-6 relative mb-1">
                <Image
                  src={category.icon || "/placeholder.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className={`text-xs whitespace-nowrap ${
                activeCategory === category.id ? "font-medium" : "text-gray-500"
              }`}>
                {category.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}