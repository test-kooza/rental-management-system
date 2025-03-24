import AuthHeader from "@/components/frontend/AuthHeader";
import BecomeHostForm from "@/components/frontend/BecomeHostForm";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function BecomeHostPage() {
  const session = await getServerSession(authOptions);
  
  if (session && session.user.role === "HOST") {
    redirect("/dashboard");
  }
  
  return (
    <GridBackground>
      <AuthHeader />
      <div className="px-4">
        <BecomeHostForm />
      </div>
    </GridBackground>
  );
}