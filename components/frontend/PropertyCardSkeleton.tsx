// components/frontend/PropertyCardSkeleton.tsx
import { cn } from "@/lib/utils";

interface PropertyCardSkeletonProps {
  className?: string;
}

export default function PropertyCardSkeleton({ className }: PropertyCardSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {/* Image placeholder */}
      <div className="aspect-square rounded-xl bg-gray-200" />
      
      {/* Title and rating placeholder */}
      <div className="mt-3 flex justify-between">
        <div className="h-5 bg-gray-200 rounded w-3/5" />
        <div className="h-5 bg-gray-200 rounded w-1/5" />
      </div>
      
      {/* Location placeholder */}
      <div className="mt-2 h-4 bg-gray-200 rounded w-4/5" />
      
      {/* Date range placeholder */}
      <div className="mt-2 h-4 bg-gray-200 rounded w-2/3" />
      
      {/* Price placeholder */}
      <div className="mt-3 h-5 bg-gray-200 rounded w-1/2" />
    </div>
  );
}