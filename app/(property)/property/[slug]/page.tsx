import PropertyPage from '@/components/frontend/propert-page';
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <div>
      <PropertyPage slug={slug}/>
    </div>
  )
}
