import React from "react";

export default function DashboardLoader() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Main Content area with sidebar and content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left sidebar - message list (visible on lg screens) */}
        <div className="hidden lg:block w-1/3 border-r">
          <div className="p-3 border-b">
            {/* Search input placeholder */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Message list placeholders */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="flex items-center p-4 border-b animate-pulse"
              >
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-3 w-40 mt-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile message list (visible on mobile/md screens) */}
        <div className="w-full md:w-1/3 border-r block lg:hidden">
          <div className="p-4 border-b">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Mobile message list placeholders */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="flex items-center p-4 border-b animate-pulse"
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-40 mt-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state / conversation view placeholder */}
        <div className="hidden md:flex md:flex-1 items-center justify-center bg-gray-50">
          <div className="text-center p-8 animate-pulse">
            <div className="h-6 w-48 mx-auto bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-64 mx-auto bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Mobile Footer */}
      <div className="h-16 bg-white border-t flex items-center justify-around md:hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-12 mt-1 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}