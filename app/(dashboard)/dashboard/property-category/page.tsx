import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { columns } from "./columns"
import DataTable from "@/components/DataTableComponents/DataTable"
import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { getPropertyCategories } from "@/actions/property-category"
import PropertyCategoryForm from "@/components/dashboard/PropertyCategoryForm"
import { Skeleton } from "@/components/ui/skeleton"
import { redirect } from "next/navigation"

export default async function PropertyCategoriesPage() {
    const session = await getServerSession(authOptions);
     const author=session?.user
      const categories = (await getPropertyCategories()) || []
      if (!author || author.role !== "ADMIN") {
        redirect("/unauthorized"); 
    }
  return (
    <div className="">
      <Tabs defaultValue="categories" className="space-y-8">
        <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
          {["categories", "create-category"].map((feature) => {
            return (
              <TabsTrigger
                key={feature}
                value={feature}
                className="inline-flex items-center gap-2 border-b-2 border-transparent px-8 pb-3 pt-2 data-[state=active]:border-primary capitalize"
              >
                {feature.split("-").join(" ")}
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value="categories" className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 py-3">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
              Property Categories ({categories.length})
            </h2>
          </div>
          <div className="">
            <Suspense fallback={<CategoryTableSkeleton />}>
              <DataTable data={categories} columns={columns} />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="create-category" className="space-y-8">
          <div className="max-w-4xl py-6">
            <PropertyCategoryForm author={author} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CategoryTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <Skeleton className="h-8 w-[120px]" />
      </div>
      <div className="rounded-md border">
        <div className="border-b">
          <div className="grid grid-cols-5 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-[80%]" />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 p-4 border-b">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-6 w-[80%]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

