"use client"

import { useState } from "react"
import { Home, ArrowUpDown, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePropertyRevenue } from "@/hooks/useFinancial"

export default function PropertyRevenueTable() {
  const { properties, isLoading } = usePropertyRevenue()
  const [sortBy, setSortBy] = useState<"title" | "revenue" | "occupancy">("revenue")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSort = (column: "title" | "revenue" | "occupancy") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const filteredProperties = properties
    .filter((property) => property.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (sortBy === "revenue") {
        return sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue
      } else {
        return sortOrder === "asc" ? a.occupancyRate - b.occupancyRate : b.occupancyRate - a.occupancyRate
      }
    })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Revenue</CardTitle>
          <CardDescription>Loading property revenue data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Revenue</CardTitle>
        <CardDescription>Revenue breakdown by property</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Property
                  {sortBy === "title" && <ArrowUpDown className="h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("revenue")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Revenue
                  {sortBy === "revenue" && <ArrowUpDown className="h-3 w-3" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("occupancy")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Occupancy
                  {sortBy === "occupancy" && <ArrowUpDown className="h-3 w-3" />}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {property.image ? (
                          <img
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Home className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{property.formattedRevenue}</span>
                  </TableCell>
                  <TableCell>
                    <OccupancyBadge rate={property.occupancyRate} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function OccupancyBadge({ rate }: { rate: number }) {
  let variant: "default" | "secondary" | "outline" = "outline"

  if (rate >= 80) {
    variant = "default"
  } else if (rate >= 50) {
    variant = "secondary"
  }

  return (
    <Badge variant={variant} className="font-medium">
      {rate}%
    </Badge>
  )
}

