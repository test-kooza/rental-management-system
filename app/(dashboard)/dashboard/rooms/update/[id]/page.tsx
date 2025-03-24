import { getBlogById, getBlogCategories } from "@/actions/blogs";
import { getRoomById, getUserProperties } from "@/actions/rooms";
import NotFound from "@/app/not-found";
import BlogEditForm from "@/components/dashboard/blogs/blog-edit-form";
import RoomForm from "@/components/Forms/RoomForm";

import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const room = await getRoomById(id)
  const properties = await getUserProperties()

  if (!room) {
    NotFound()
  }

  return (
    <div className="p-2">
      <RoomForm initialData={room} editingId={id} properties={properties} />
    </div>
  )
}
