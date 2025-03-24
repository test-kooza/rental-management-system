import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns, PropertyWithRelations } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { Suspense } from "react";
import { getProperties } from "@/actions/property";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { SystemRole } from "@prisma/client";
import PropertyTableSkeleton from "@/components/frontend/PropertyTableSkeleton";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const userRole = session?.user?.role || SystemRole.USER;
  
  // Fetch properties based on user role
  const properties = await getProperties(userId, userRole as SystemRole) || [];

  return (
    <div className="container mx-auto px-4 py-2">
      <Tabs defaultValue="properties" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="inline-flex h-auto bg-transparent p-0 flex-wrap">
            {["properties", "featured", "published", "drafts"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="inline-flex items-center gap-2 border-b-2 border-transparent px-4 sm:px-6 pb-3 pt-2 data-[state=active]:border-primary capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Link href="/dashboard/properties/new">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>
        
        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3">
            <h2 className="scroll-m-20 md:text-2xl text-lg font-semibold tracking-tight">
              All Properties ({properties.length})
            </h2>
            <p className="md:text-sm text-xs text-muted-foreground">
              {userRole === SystemRole.ADMIN 
                ? "Showing all properties " 
                : "Showing properties you manage"}
            </p>
          </div>
          
          <Suspense fallback={<PropertyTableSkeleton />}>
            <DataTable 
              data={properties} 
              columns={columns} 
            />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Featured Properties ({properties.filter((p:any)=> p.isFeatured).length})
            </h2>
          </div>
          
          <Suspense fallback={<PropertyTableSkeleton />}>
            <DataTable 
              data={properties.filter((p:any)=> p.isFeatured)} 
              columns={columns}
            />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="published" className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Published Properties ({properties.filter((p:any)=> p.isPublished).length})
            </h2>
          </div>
          
          <Suspense fallback={<PropertyTableSkeleton />}>
            <DataTable 
              data={properties.filter((p:any)=> p.isPublished)} 
              columns={columns}
            />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Draft Properties ({properties.filter((p:any)=> !p.isPublished).length})
            </h2>
          </div>
          
          <Suspense fallback={<PropertyTableSkeleton />}>
            <DataTable 
              data={properties.filter((p:any)=> !p.isPublished)} 
              columns={columns}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}