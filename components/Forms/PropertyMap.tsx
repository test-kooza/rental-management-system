"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Default coordinates (can be set to a popular city or region)
const DEFAULT_CENTER: [number, number] = [40.7128, -74.006] // New York City

type PropertyMapProps = {
  position: [number, number] | null
  onPositionChange: (position: [number, number]) => void
}

// Create a client-side only version of the map component
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading map...</span>
    </div>
  ),
})

export default function PropertyMap({ position, onPositionChange }: PropertyMapProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mapPosition, setMapPosition] = useState<[number, number]>(position || DEFAULT_CENTER)

  const getCurrentLocation = () => {
    setIsLoading(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPosition: [number, number] = [latitude, longitude]
          setMapPosition(newPosition)
          onPositionChange(newPosition)
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (position) {
      setMapPosition(position)
    }
  }, [position])

  return (
    <div className="relative h-full">
      <div className="absolute top-3 right-3 z-[1000]">
        <Button
          onClick={getCurrentLocation}
          size="sm"
          disabled={isLoading}
          className="bg-white text-primary shadow-md hover:bg-gray-100"
        >
          {isLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : "Use Current Location"}
        </Button>
      </div>

      <MapWithNoSSR position={mapPosition} onPositionChange={onPositionChange} />
    </div>
  )
}

