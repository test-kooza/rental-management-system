import { getPropertyCategoryById } from "@/actions/property-category"
import PropertyCategoryForm from "@/components/dashboard/PropertyCategoryForm"
import { getAuthenticatedUser } from "@/config/useAuth"
import { notFound } from "next/navigation"

export default async function EditPropertyCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const category = await getPropertyCategoryById(id)
  const author = await getAuthenticatedUser()

  if (!category) {
    return notFound()
  }

  return (
    <div className="p-1">
 
      <div className="max-w-4xl">
        <PropertyCategoryForm initialData={category} editingId={id} author={author} />
      </div>
    </div>
  )
}

