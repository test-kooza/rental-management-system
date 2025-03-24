"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Eye, Bed, Users } from 'lucide-react'

import SortableColumn from "@/components/DataTableColumns/SortableColumn"
import ActionColumn from "@/components/DataTableColumns/ActionColumn"
import ImageColumn from "@/components/DataTableColumns/ImageColumn"
import DateColumn from "@/components/DataTableColumns/DateColumn"
import { Badge } from "@/components/ui/badge"

// Define the type for room data in the table
export type RoomTableData = {
  id: string
  title: string
  roomType: string
  propertyTitle: string
  propertyId: string
  beds: number
  maxGuests: number
  isPrivate: boolean
  hasEnsuite: boolean
  images: string[]
  createdAt: string
}

export const columns: ColumnDef<RoomTableData>[] = [
 
  
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableColumn column={column} title="Room Title" />
    ),
  },
  {
    accessorKey: "roomType",
    header: "Room Type",
    cell: ({ row }) => {
      const room = row.original
      return (
        <Badge variant="outline" className="font-normal">
          {room.roomType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "propertyTitle",
    header: "Property",
    cell: ({ row }) => {
      const room = row.original
      return (
        <Link 
          href={`/dashboard/properties/${room.propertyId}`}
          className="text-primary hover:underline"
        >
          {room.propertyTitle}
        </Link>
      )
    },
  },
  {
    accessorKey: "details",
    header: "Room Details",
    cell: ({ row }) => {
      const room = row.original
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-muted-foreground">
            <Bed className="mr-1 h-4 w-4" />
            <span>{room.beds}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            <span>{room.maxGuests}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "view",
    header: "View Room",
    cell: ({ row }) => {
      const room = row.original
      return (
        <Link
          className="flex items-center justify-center"
          href={`/rooms/${room.id}`}
          target="_blank"
        >
          <Eye className="text-blue-500 h-5 w-5" />
        </Link>
      )
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created On",
  //   cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original
      return (
        <ActionColumn
          row={row}
          model="room"
          editEndpoint={`rooms/update/${room.id}`}
          id={room.id}
        />
      )
    },
  },
]
