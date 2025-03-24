// app/dashboard/properties/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Property, PropertyStyle, SystemRole } from "@prisma/client";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Building, Check, Eye, Globe, Star, User, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { togglePropertyPublishStatus, togglePropertyFeatureStatus } from "@/actions/property";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import PropertyActionColumn from "@/components/DataTableColumns/PropertyActionColumn";

export type PropertyWithRelations = Property & {
  category: { name: string; id: string; slug: string; description: string | null; };
  host: { 
    id: string;
    name: string; 
    email: string;
    image: string | null; 
  };
  address?: { 
    city: string; 
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  pricing?: { 
    basePrice: number;
    cleaningFee: number | null;
    serviceFee: number | null;
    taxRate: number | null;
    weeklyDiscount: number | null;
    monthlyDiscount: number | null;
    currency: string; 
  };
  _count?: { 
    bookings: number; 
    reviews: number; 
  };
  bookingSettings?: { /* fields */ } | null;
};

export const columns: ColumnDef<PropertyWithRelations>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const property = row.original;
      const featuredImage = property.images?.[0] || "";
      
      return (
        <div className="relative h-16 w-24 overflow-hidden rounded-md">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={property.title}
              className="object-cover"
              fill
              sizes="96px"
            />
          ) : (
            <div className="flex h-16 w-24 items-center justify-center rounded-md bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortableColumn column={column} title="Property" />,
    cell: ({ row }) => {
      const property = row.original;
      const location = property.address 
        ? `${property.address.city}, ${property.address.country}` 
        : "No location";
      
      return (
        <div className="flex flex-col">
          <Link 
            href={`/dashboard/properties/${property.id}`}
            className="font-medium text-primary hover:underline"
          >
            {property.title}
          </Link>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Globe className="h-3 w-3" /> {location}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <Badge variant="outline" className="font-normal">
          {property.category?.name || "Uncategorized"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pricing.basePrice",
    header: ({ column }) => <SortableColumn column={column} title="Price" />,
    cell: ({ row }) => {
      const property = row.original;
      const price = property.pricing?.basePrice || 0;
      const currency = property.pricing?.currency || "USD";
      
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(Number(price))}
          <span className="text-xs text-muted-foreground">/night</span>
        </div>
      );
    },
  },
  {
    accessorKey: "propertyStyle",
    header: "Style",
    cell: ({ row }) => {
      const property = row.original;
      const styles = property.propertyStyle as PropertyStyle[];
      
      if (!styles || styles.length === 0) return <span className="text-muted-foreground">None</span>;
      
      // Show only first style badge and a count if more exist
      return (
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="capitalize text-xs">
            {styles[0].toLowerCase().replace("_", " ")}
          </Badge>
          {styles.length > 1 && (
            <span className="text-xs text-muted-foreground">+{styles.length - 1}</span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const styles = row.getValue(id) as PropertyStyle[];
      return value.length === 0 || value.some((style: string) => styles.includes(style as PropertyStyle));
    },
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const property = row.original;
      return property.isPublished ? (
        <Badge className="bg-green-500 hover:bg-green-600">
          <Check className="mr-1 h-3 w-3" /> Published
        </Badge>
      ) : (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Draft
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
      const [isToggling, setIsToggling] = useState(false);
      const { data: session } = useSession();
      
      // Check if user is admin
      const isAdmin = session?.user?.role === SystemRole.ADMIN;
      // Check if user is property owner or admin
      const canManage = isAdmin || session?.user?.id === property.host.id;

      const handlePublishToggle = async () => {
        if (!isAdmin) {
          toast.error("Only administrators can change publication status");
          return;
        }
        
        setIsToggling(true);
        try {
          const result = await togglePropertyPublishStatus(property.id);
          if (result.success) {
            toast.success(
              `Property ${property.isPublished ? "unpublished" : "published"} successfully`
            );
          } else {
            toast.error("Failed to update property status");
          }
        } catch (error) {
          toast.error("An error occurred");
        } finally {
          setIsToggling(false);
        }
      };

      const handleFeatureToggle = async () => {
        if (!isAdmin) {
          toast.error("Only administrators can feature properties");
          return;
        }
        
        setIsToggling(true);
        try {
          const result = await togglePropertyFeatureStatus(property.id);
          if (result.success) {
            toast.success(
              `Property ${property.isFeatured ? "unfeatured" : "featured"} successfully`
            );
          } else {
            toast.error("Failed to update property feature status");
          }
        } catch (error) {
          toast.error("An error occurred");
        } finally {
          setIsToggling(false);
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePublishToggle}
                disabled={isToggling}
                title={property.isPublished ? "Unpublish" : "Publish"}
              >
                {property.isPublished ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFeatureToggle}
                disabled={isToggling}
                title={property.isFeatured ? "Remove from featured" : "Add to featured"}
              >
                <Star 
                  className={`h-4 w-4 ${property.isFeatured ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} 
                />
              </Button>
            </>
          )}
          
          <Link href={`/properties/${property.slug}`} >
            <Button
              variant="ghost"
              size="icon"
              title="View property"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          
          {canManage && (
            <PropertyActionColumn
              row={row}
              model="properties"
              editEndpoint={`/dashboard/properties/update/${property.id}`}
              id={property.id}
            />
          )}
        </div>
      );
    },
  },
];