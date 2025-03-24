import { getPropertyById } from "@/actions/property"
import { getPropertyCategories } from "@/actions/property-category"
import PropertyForm from "@/components/Forms/PropertyForm"
import { authOptions } from "@/config/auth"
import { SystemRole } from "@prisma/client"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"

export default async function EditPropertyCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const userRole = session?.user?.role || SystemRole.USER;
  
  const property = await getPropertyById(id);
  
  if (!property) {
    return notFound();
  }
  
  if (userRole !== SystemRole.ADMIN && property.hostId !== userId) {
    return redirect("/dashboard/properties");
  }
  
  const categoriesData = (await getPropertyCategories()) || [];
  const categories = categoriesData.map((item) => ({
    name: item.name,
    id: item.id,
  }));

  return (
    <div className="container mx-auto md:px-4 px-1 py-2">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">Edit Property</h1>
        <p className="text-muted-foreground">
          Update the details of your property listing.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm md:p-6 p-1 border border-gray-200 dark:border-gray-700">
        <PropertyForm 
          categories={categories} 
          hostId={userId} 
          property={property}
        />
      </div>
    </div>
  );
}