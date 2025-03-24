import BookHeader from "@/components/frontend/book-header";
import Footer from "@/components/frontend/footer";
import MobileFooter from "@/components/frontend/mobile-footer";
import PropertyFooter from "@/components/frontend/property-footer";
import PropertyHeader from "@/components/frontend/property-header";
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
      <BookHeader session={session} />
      {children}
            <Footer />
    </div>
  );
}
