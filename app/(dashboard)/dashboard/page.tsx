import { getAuthenticatedUser } from "@/config/useAuth";

import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import HostDashboard from "@/components/dashboard/HostDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function Dashboard() {
  const { role } = await getAuthenticatedUser();

  return (
    <main className="min-h-screen md:p-2">
      <Suspense fallback={<DashboardSkeleton />}>
        {role === "ADMIN" ? (
          <AdminDashboard />
        ) : role === "HOST" ? (
          <HostDashboard />
        ) : (
          <UserDashboard />
        )}
      </Suspense>
    </main>
  );
}
