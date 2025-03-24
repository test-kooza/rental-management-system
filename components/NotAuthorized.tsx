"use client";
import Logo from "@/components/frontend/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Shield, RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotAuthorized() {
  return (
    <div className="bg-gradient-to-b from-red-50 to-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-center flex-col py-16">
          {/* Logo at the top */}
          <div className="mb-8">
            <Logo />
          </div>
          
          {/* Illustration with Shield */}
          <div className="relative">
            <div className="absolute -inset-4 bg-red-100 rounded-full opacity-50 blur-xl"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Shield className="w-48 h-48 text-primary opacity-20 absolute" />
              <svg
                width="220"
                height="140"
                viewBox="0 0 314 171"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <path
                  d="M131.408 134.14L131.407 134.139C124.251 129.827 118.724 123.793 114.83 116.051L114.829 116.049C110.981 108.307 109.065 99.3201 109.065 89.1025C109.065 78.885 110.981 69.8983 114.829 62.156L114.83 62.1539C118.724 54.4117 124.251 48.3783 131.407 44.0663L131.408 44.0655C138.616 39.75 147.163 37.6025 157.029 37.6025C166.894 37.6025 175.419 39.7498 182.582 44.0659C189.784 48.3778 195.311 54.4115 199.16 62.1549C203.054 69.8975 204.993 78.8846 204.993 89.1025C204.993 99.3208 203.054 108.308 199.16 116.051C199.16 116.051 199.159 116.051 199.159 116.051L198.713 115.827C194.905 123.488 189.442 129.449 182.325 133.711L131.408 134.14ZM131.408 134.14C138.616 138.455 147.163 140.603 157.029 140.603C166.894 140.603 175.419 138.455 182.582 134.139L131.408 134.14Z"
                  className="fill-red-50 stroke-primary"
                  strokeWidth="1"
                />
                <path
                  d="M176.88 0.632498L176.88 0.632384L176.869 0.630954C176.264 0.549581 175.654 0.5 175.04 0.5H109.399C102.772 0.5 97.4004 5.84455 97.4004 12.4473V142.715C97.4004 149.318 102.772 154.662 109.399 154.662H204.009C210.652 154.662 216.007 149.317 216.007 142.715V38.9309C216.007 38.0244 215.908 37.1334 215.709 36.2586L215.709 36.2584C215.178 33.9309 213.935 31.7686 212.127 30.1333C212.127 30.1331 212.126 30.1329 212.126 30.1327L183.129 3.65203C183.129 3.6519 183.128 3.65177 183.128 3.65164C181.372 2.03526 179.201 0.995552 176.88 0.632498Z"
                  className="fill-white stroke-red-200"
                />
                <ellipse
                  cx="160.123"
                  cy="81"
                  rx="28.0342"
                  ry="28.0342"
                  className="fill-red-50"
                />
              </svg>
              <Shield className="w-20 h-20 text-primary absolute z-20" />
            </div>
          </div>
          
          <div className="text-center mt-8 max-w-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-primary">403</span> - Not Authorized
            </h1>
            <h2 className="text-base font-medium text-gray-800 mb-4">
              Oops! You don't have access to this area
            </h2>
            <p className="text-gray-500 mb-8 mx-auto max-w-md text-base">
              It seems you don't have the necessary permissions to view this page.
              Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
              <Button className="w-full bg-primary hover:bg-primary text-white shadow-md hover:shadow-lg transition duration-200" asChild>
                <Link href="/dashboard" className="flex items-center justify-center">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full border-indigo-200 text-primary hover:bg-red-50 shadow-sm hover:shadow transition duration-200" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
            
            <button onClick={() => window.location.reload()} className="mt-8 text-primary hover:text-primary text-sm font-medium flex items-center mx-auto">
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh the page
            </button>
          </div>
          
          <div className="mt-12 text-center text-xs text-gray-400">
            If you believe this is an error, please contact our support team.
          </div>
        </div>
      </div>
    </div>
  );
}