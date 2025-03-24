"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Loader2, ZoomIn, ZoomOut } from "lucide-react"

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006] 

type PropertyMapProps = {
  position: [number, number] | null
  readOnly?: boolean
  className?: string
}

const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading map...</span>
    </div>
  ),
})

export default function PropertyMap({ position, readOnly = true, className }: PropertyMapProps) {
  const [mapPosition, setMapPosition] = useState<[number, number]>(position || DEFAULT_CENTER)
  const [zoom, setZoom] = useState(14)
  
  useEffect(() => {
    if (position) {
      setMapPosition(position)
    }
  }, [position])
  
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
  }
  
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1))
  }

  const handlePositionChange = (newPosition: [number, number]) => {
    if (!readOnly) {
      setMapPosition(newPosition)
    }
  }
  
  return (
    <div className={`relative h-[400px] rounded-lg overflow-hidden ${className}`}>
      {/* Map container with controlled z-index */}
      <div className="absolute inset-0 z-10">
        <MapWithNoSSR 
          position={mapPosition} 
          readOnly={readOnly} 
          zoom={zoom} 
          onPositionChange={handlePositionChange}
        />
      </div>
      
      {/* Controls with higher z-index to stay on top of map */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="icon"
          variant="secondary"
          className="bg-white text-primary shadow-md hover:bg-gray-100 h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="icon"
          variant="secondary"
          className="bg-white text-primary shadow-md hover:bg-gray-100 h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}