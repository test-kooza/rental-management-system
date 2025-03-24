"use client"

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishList';
import { PropertyGrid } from './PropertyGrid';
import PropertyCardSkeleton from './PropertyCardSkeleton';

interface PropertyCardProps {
  id: string;
  location: string;
  country: string;
  host: string;
  dateRange: string;
  isAvailable: boolean;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  rating: number; // Note: This expects a number, not null
  isFeatured: boolean;
  images: { url: string; alt: string }[];
  slug: string;
}

export default function WishlistPage() {
  const { wishlistProperties, isLoadingWishlist, isWishlistError } = useWishlist();
  const router = useRouter();

  // Map database properties to PropertyCardProps with proper type handling
  const mappedProperties: PropertyCardProps[] = wishlistProperties.map((property: any) => ({
    id: property.id,
    location: property.address?.city || 'Unknown location', 
    country: property.address?.country || 'Unknown country',
    host: property.host?.name || 'Unknown host',
    dateRange: "Available now",
    price: {
      amount: property.pricing?.basePrice ? Number(property.pricing.basePrice) : 0,
      currency: property.pricing?.currency || 'USD',
      period: "night"
    },
    isAvailable: property.isAvailable ?? true,
    rating: property.avgRating ? Number(property.avgRating) : 0,
    isFeatured: property.isFeatured || false,
    images: (property.images || []).map((img: string) => ({ 
      url: img, 
      alt: property.title || 'Property image' 
    })),
    slug: property.slug || property.id
  }));

  // Handle loading state
  if (isLoadingWishlist) {
    return <WishlistSkeleton />;
  }

  // Handle error state
  if (isWishlistError) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">We couldn't load your wishlist. Please try again later.</p>
          <button 
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (mappedProperties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div 
            className="rounded-full bg-gray-100 p-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <Heart className="h-6 w-6 text-gray-400" />
          </motion.div>
          <h1 className="text-lg font-semibold mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">Save properties you like by clicking the heart icon</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Explore properties
          </Link>
        </div>
      </div>
    );
  }

  // Render wishlist grid
  return (
    <div className="container mx-auto px-4 md:py-14 py-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-gray-500 text-sm">
          {mappedProperties.length} {mappedProperties.length === 1 ? 'property' : 'properties'} saved
        </p>
      </div>
      
      <PropertyGrid properties={mappedProperties} />
    </div>
  );
}

// Skeleton loading state
const WishlistSkeleton = () => {
  return (
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
  );
};