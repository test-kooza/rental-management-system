import BookingPage from '@/components/frontend/BookingPage'
import { authOptions } from '@/config/auth';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?returnUrl=/booking");
  }
  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }
  return (
    <div>
      <BookingPage/>
    </div>
  )
}
