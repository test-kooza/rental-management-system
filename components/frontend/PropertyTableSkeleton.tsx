// app/dashboard/properties/PropertyTableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function PropertyTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <Skeleton className="h-8 w-[180px]" />
      </div>
      
      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
            <Skeleton className="h-6 w-[80%]" /> {/* Image */}
            <Skeleton className="h-6 w-[90%]" /> {/* Title */}
            <Skeleton className="hidden md:block h-6 w-[85%]" /> {/* Category */}
            <Skeleton className="hidden md:block h-6 w-[70%]" /> {/* Price */}
            <Skeleton className="hidden md:block h-6 w-[60%]" /> {/* Status */}
            <Skeleton className="h-6 w-[60%]" /> {/* Actions */}
          </div>
        </div>
        
        {/* Table rows */}
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              {/* Property image */}
              <div className="flex items-center">
                <Skeleton className="h-16 w-24 rounded-md" />
              </div>
              
              {/* Property title & address */}
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
              
              {/* Category */}
              <div className="hidden md:flex items-center">
                <Skeleton className="h-5 w-[80%]" />
              </div>
              
              {/* Price */}
              <div className="hidden md:block">
                <Skeleton className="h-5 w-[60%]" />
              </div>
              
              {/* Status */}
              <div className="hidden md:flex items-center">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}