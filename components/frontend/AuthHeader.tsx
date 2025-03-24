"use client"
import BookHeader from "@/components/frontend/book-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

export default function AuthHeader() {
  const router=useRouter()
  const handleGoBack = () => {
    router.back()
  }
  return <div>
   <header className="w-full py-0 px-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center pt-2">
          {/* <Logo /> */}
          <Button variant="outline" asChild size="sm" > 
            <Link href="/">
              <Home/>
            </Link>
          </Button>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-bold mt-2"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>
 </div>;
}
