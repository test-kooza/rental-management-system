import { getPropertyCategories } from "@/actions/property-category";
import PropertyForm from "@/components/Forms/PropertyForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page() {
  const categoriesData = (await getPropertyCategories()) || [];
  const categories = categoriesData.map((item) => {
    return {
      name: item.name,
      id: item.id,
    };
  });
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? "";
  return (
    <div>
      <PropertyForm categories={categories} hostId={userId}/>
    </div>
  );
}
