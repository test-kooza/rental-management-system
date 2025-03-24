// components/frontend/CategoryScroller.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { usePropertyCategories } from "@/hooks/useBookings";
import CategorySkeleton from "./CategorySkeleton";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryScrollerProps {
  className?: string;
}

export default function CategoryScroller({ className }: CategoryScrollerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading } = usePropertyCategories();
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showTotalBeforeTaxes, setShowTotalBeforeTaxes] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get selected category from URL params, default to "all"
  const selectedCategory = searchParams.get("category") || "all";

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Create the ALL category
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
    <div className={cn("relative border-b border-gray-200 bg-white py-4 overflow-hidden hidden md:block ", className)}>
      <div className="container mx-auto px-4 flex items-center">
        {/* Categories section - fixed to 70% width */}
        <div className="relative w-[70%] flex-shrink-0 mr-6">
          {/* Left scroll button with gradient background */}
          <div className={cn(
            "absolute left-0 top-0 h-full flex items-center bg-gradient-to-r from-white to-transparent pr-8 transition-opacity z-10",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}>
            <button 
              onClick={scrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Categories scroll container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide pb-1 pt-1 px-2 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          >
            {/* All category always displayed first */}
            <button
              key="all"
              onClick={() => handleCategorySelect("all")}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 min-w-fit px-6 font-semibold",
                selectedCategory === "all" ? "opacity-100 border-b-2 font-semibold border-black pb-2" : "opacity-70 hover:opacity-100"
              )}
            >
              <div className="relative h-6 w-6 mb-1">
                <Image 
                  src={allCategory.icon} 
                  alt={allCategory.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs whitespace-nowrap">{allCategory.name}</span>
            </button>

            {isLoading ? (
              // Display skeletons while loading
              Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              // Display actual categories
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 min-w-fit px-6 font-semibold",
                    category.id === selectedCategory ? "opacity-100 border-b-2 font-semibold border-black pb-2" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="relative h-6 w-6 mb-1">
                    <Image 
                      src={category.icon || "/placeholder.jpg"} 
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs whitespace-nowrap">{category.name}</span>
                </button>
              ))
            )}
          </div>

          {/* Right scroll button with gradient background */}
          <div className={cn(
            "absolute right-0 top-0 h-full flex items-center bg-gradient-to-l from-white to-transparent pl-8 transition-opacity z-10",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}>
            <button 
              onClick={scrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters section - fixed to 30% width */}
        <div className="hidden md:flex items-center gap-4 w-[30%] flex-shrink-0 pl-6 border-l border-gray-200">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" /> 
            Filters
          </button>

          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-4 py-3">
            <span>Display total before taxes</span>
            <Switch 
              checked={showTotalBeforeTaxes}
              onCheckedChange={setShowTotalBeforeTaxes}
            />
          </button>
        </div>
      </div>
    </div>
  );
}