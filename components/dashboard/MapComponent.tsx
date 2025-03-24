"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"

// Custom marker icon
const createHomeIcon = () => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}

type MapComponentProps = {
  position: [number, number]
  zoom?: number
  readOnly?: boolean
}

// Component to update map view when position changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function MapComponent({ position, zoom = 14, readOnly = true }: MapComponentProps) {
  const markerRef = useRef<L.Marker>(null)
  const homeIcon = createHomeIcon()

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={true}
      dragging={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={homeIcon} ref={markerRef} draggable={!readOnly} />
      <ChangeView center={position} zoom={zoom} />
    </MapContainer>
  )
}

