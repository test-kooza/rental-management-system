import RegisterForm from "@/components/Forms/RegisterForm";
import AuthHeader from "@/components/frontend/AuthHeader";
import { GridBackground } from "@/components/reusable-ui/grid-background";

import React from "react";

export default async function page() {

  return (
    <GridBackground>
        <AuthHeader/>
      <div className="px-4">
        <RegisterForm />
      </div>
    </GridBackground>
  );
}
