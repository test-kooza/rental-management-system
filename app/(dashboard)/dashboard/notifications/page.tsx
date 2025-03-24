import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/auth";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NotificationSkeleton } from "@/components/dashboard/NotificationSkeleton";
import { NotificationList } from "@/components/dashboard/NotificationList";


export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login?returnUrl=/notifications");
  }
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <PageHeader
        title="Notifications"
        description="Stay updated with your latest activity"
      />
      
      <div className="mt-8">
        <Suspense fallback={<NotificationSkeleton />}>
          <NotificationList userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}
