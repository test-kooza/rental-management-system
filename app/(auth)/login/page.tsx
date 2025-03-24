import LoginForm from "@/components/Forms/LoginForm";
import AuthHeader from "@/components/frontend/AuthHeader";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return (
    <GridBackground>
        <AuthHeader/>
      <div className="px-4">
        <LoginForm />
      </div>
    </GridBackground>
  );
}
