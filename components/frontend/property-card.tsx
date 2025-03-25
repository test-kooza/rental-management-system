"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useWishlist } from "@/hooks/useWishList"


export interface PropertyImage {
  url: string
  alt: string
}

export interface PropertyCardProps {
  id: string
  location: string
  country: string
  host: string
  dateRange: string
  isAvailable: boolean
  price: {
    amount: number
    currency: string
    period: string
  }
  rating: number
  isGuestFavorite?: boolean
  isFeatured: boolean
  images: PropertyImage[]
  slug: string
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  location,
  country,
  host,
  price,
  rating,
  images,
  slug,
  isFeatured,
  isAvailable,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const { usePropertyWishlistStatus } = useWishlist()
  const { isInWishlist, isLoading: isWishlistStatusLoading, toggleWishlist } = usePropertyWishlistStatus(id)

  const canScrollLeft = currentImageIndex > 0
  const canScrollRight = currentImageIndex < images.length - 1

  const scrollLeft = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canScrollLeft) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const scrollRight = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canScrollRight) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleWishlist()
  }

  return (
    <motion.div
      className="relative flex flex-col w-full max-w-sm rounded-xl overflow-hidden shadow-sm transition-shadow duration-300"
      whileHover={{
        y: -4,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Carousel Container */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl">
        {/* Images */}
        <div
          ref={carouselRef}
          className="h-full w-full transition-transform duration-300 ease-in-out flex"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <Link href={`/property/${slug}`} key={index} className="h-full w-full flex-shrink-0">
              <img src={image.url || "/placeholder.svg"} alt={image.alt} className="h-full w-full object-cover" />
            </Link>
          ))}
        </div>

        {/* Guest Favorite Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-medium z-10 flex items-center">
            <img src="/trophy.png" alt="" className="w-4 h-4 object-contain" />
            Guest favorite
          </div>
        )}

        {/* Favorite Button with Enhanced Animation */}
        <motion.button
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm z-10 overflow-hidden"
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <AnimatePresence mode="wait">
            {isWishlistStatusLoading ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key={isInWishlist ? "favorite" : "not-favorite"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? "fill-primary text-primary" : "text-gray-600"}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Navigation Arrows - Only visible on hover */}
        {showControls && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md z-10 ${!canScrollLeft ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canScrollLeft}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md z-10 ${!canScrollRight ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canScrollRight}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </>
        )}

        {/* Navigation Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? "bg-white w-2.5" : "bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Property Information */}
      <Link href={`/property/${slug}`} className="p-3 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {location}, {country}
          </h3>
          <div className="flex items-center">
            <span className="text-sm ml-1 text-yellow-500">★ {rating.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-gray-700 text-sm">Hosted by {host}</p>
        <p className="text-sm font-semibold flex items-center">
          {isAvailable ? (
            <>
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span className="text-green-600">Available now</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              <span className="text-red-400">Not Available</span>
            </>
          )}
        </p>
        <p className="mt-1 font-medium text-base">
          {price.currency}
          {price.amount.toLocaleString()} <span className="font-normal text-gray-600">/ {price.period}</span>
        </p>
      </Link>
    </motion.div>
  )
}

