"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issue in Next.js
const markerIcon = L.icon({
  iconUrl: "/pointers.png",
  shadowUrl: "/pointers2.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type MapComponentProps = {
  position: [number, number]
  onPositionChange: (position: [number, number]) => void
  readOnly?: boolean
  zoom?: number
}

// Component to handle map events and marker placement
function MapMarker({ position, onPositionChange, readOnly = false }: {
  position: [number, number]
  onPositionChange: (position: [number, number]) => void
  readOnly?: boolean
}) {
  const map = useMap()

  useMapEvents({
    click(e) {
      if (readOnly) return
      const { lat, lng } = e.latlng
      onPositionChange([lat, lng])
    },
  })

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom())
    }
  }, [position, map])

  return position ? <Marker position={position} icon={markerIcon} /> : null
}

export default function MapComponent({ 
  position, 
  onPositionChange, 
  readOnly = false,
  zoom = 13
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)

  const handleMapReady = () => {
    // Access the map instance through the ref after it's mounted
  }

  return (
    <>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        whenReady={handleMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarker 
          position={position} 
          onPositionChange={onPositionChange} 
          readOnly={readOnly}
        />
      </MapContainer>

      {!readOnly && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white p-2 rounded-md shadow-md text-sm">
          <p className="font-medium">Click on the map to set your property location</p>
          {position && (
            <p className="text-xs text-muted-foreground mt-1">
              Latitude: {position[0].toFixed(6)}, Longitude: {position[1].toFixed(6)}
            </p>
          )}
        </div>
      )}
    </>
  )
}