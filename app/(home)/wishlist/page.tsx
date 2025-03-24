import { Suspense } from "react";
import { getAuthenticatedUser } from "@/config/useAuth";
import { redirect } from "next/navigation";
import PropertyCardSkeleton from "@/components/frontend/PropertyCardSkeleton";
import WishlistPage from "@/components/frontend/WishlistPage";


export const dynamic = "force-dynamic";

export default async function WishlistRoute() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect("/login?returnUrl=/wishlist");
  }
  
  return (
    <main className="md:py-5">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      }>
        <WishlistPage />
      </Suspense>
    </main>
  );
}

export function generateMetadata() {
  return {
    title: "My Wishlist | Property Rentals",
    description: "View and manage your saved properties",
  };
}