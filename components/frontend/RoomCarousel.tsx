"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Room = {
  id: string
  title: string
  description?: string | null
  beds: number
  bedType?: string | null
  maxGuests: number
  images: string[]
}

type RoomCarouselProps = {
  rooms: Room[]
}

export default function RoomCarousel({ rooms }: RoomCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const roomsPerPage = 2
  const totalPages = Math.ceil(rooms.length / roomsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const openRoomDetail = (room: Room) => {
    setSelectedRoom(room)
  }

  const openFullImage = (image: string) => {
    setSelectedImage(image)
  }

  const visibleRooms = rooms.slice(currentPage * roomsPerPage, (currentPage + 1) * roomsPerPage)

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Where you'll sleep</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={totalPages <= 1}
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={totalPages <= 1}
                className="h-8 w-8 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleRooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openRoomDetail(room)}
            >
              <div className="relative h-48">
                <Image
                  src={room.images[0] || "/placeholder.jpg"}
                  alt={room.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{room.title}</h3>
                <p className="text-gray-600 text-sm">
                  {room.beds} {room.beds === 1 ? "bed" : "beds"}
                  {room.bedType && ` (${room.bedType})`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Detail Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="max-w-3xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">{selectedRoom?.title}</h2>
            <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(null)} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {selectedRoom && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {selectedRoom.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video cursor-pointer rounded-md overflow-hidden"
                    onClick={() => openFullImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.jpg"}
                      alt={`${selectedRoom.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Details</h3>
                  <p className="text-gray-600">
                    {selectedRoom.beds} {selectedRoom.beds === 1 ? "bed" : "beds"}
                    {selectedRoom.bedType && ` (${selectedRoom.bedType})`}
                  </p>
                  <p className="text-gray-600">
                    Accommodates up to {selectedRoom.maxGuests} {selectedRoom.maxGuests === 1 ? "guest" : "guests"}
                  </p>
                </div>

                {selectedRoom.description && (
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-gray-600">{selectedRoom.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 h-[90vh] flex items-center justify-center bg-black">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 rounded-full bg-black/50 text-white z-10"
          >
            <X className="h-5 w-5" />
          </Button>
          {selectedImage && (
            <div className="relative w-full h-full">
              <Image
                src={selectedImage || "/placeholder.jpg"}
                alt="Room image"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

