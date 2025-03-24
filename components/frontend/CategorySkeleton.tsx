// components/skeletons/CategorySkeleton.tsx
import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1 min-w-fit px-6">
      <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse mb-1"></div>
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
};

export default CategorySkeleton;