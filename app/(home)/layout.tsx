import Footer from "@/components/frontend/footer";
import MobileFooter from "@/components/frontend/mobile-footer";
import SiteHeader from "@/components/frontend/site-header";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";


export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="bg-white relative">
      <SiteHeader session={session} />
      {children}
      <Footer />
      <MobileFooter/>
    </div>
  );
}
