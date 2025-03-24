"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { PropertyCategory } from "@prisma/client"
import SortableColumn from "@/components/DataTableColumns/SortableColumn"
import ActionColumn from "@/components/DataTableColumns/ActionColumn"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Eye, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const columns: ColumnDef<PropertyCategory>[] = [
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const category = row.original
      return category.icon ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-md">
          <Image
            src={category.icon || "/placeholder.jpg"}
            alt={category.name}
            className="object-cover"
            fill
            sizes="40px"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Home className="h-5 w-5 text-primary" />
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Category Name" />,
    cell: ({ row }) => {
      const category = row.original
      return <span className="font-medium">{category.name}</span>
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const category = row.original
      return (
        <span className="line-clamp-2 max-w-[300px] text-sm text-muted-foreground">
          {category.description || "No description"}
        </span>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const category = row.original
      return (
        <Badge variant={category.isActive ? "default" : "secondary"}>{category.isActive ? "Active" : "Inactive"}</Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableColumn column={column} title="Created" />,
    cell: ({ row }) => {
      const category = row.original
      return (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(category.createdAt), {
            addSuffix: true,
          })}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className="flex items-center gap-2">
         
          <ActionColumn
            row={row}
            model="property-category"
            editEndpoint={`/dashboard/property-category/update/${category.id}`}
            id={category.id}
          />
        </div>
      )
    },
  },
]

