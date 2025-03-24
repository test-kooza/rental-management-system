"use client";
import Logo from "@/components/frontend/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="bg-gradient-to-b from-red-50 to-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-center flex-col py-16">
          {/* Logo at the top */}
          <div className="mb-8">
            <Logo/>
          </div>
          
          {/* Illustration */}
          <div className="relative">
            <div className="absolute -inset-4 bg-red-100 rounded-full opacity-50 blur-xl"></div>
            <svg
              width="280"
              height="160"
              viewBox="0 0 314 171"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path
                d="M131.408 134.14L131.407 134.139C124.251 129.827 118.724 123.793 114.83 116.051L114.829 116.049C110.981 108.307 109.065 99.3201 109.065 89.1025C109.065 78.885 110.981 69.8983 114.829 62.156L114.83 62.1539C118.724 54.4117 124.251 48.3783 131.407 44.0663L131.408 44.0655C138.616 39.75 147.163 37.6025 157.029 37.6025C166.894 37.6025 175.419 39.7498 182.582 44.0659C189.784 48.3778 195.311 54.4115 199.16 62.1549C203.054 69.8975 204.993 78.8846 204.993 89.1025C204.993 99.3208 203.054 108.308 199.16 116.051C199.16 116.051 199.159 116.051 199.159 116.051L198.713 115.827C194.905 123.488 189.442 129.449 182.325 133.711L131.408 134.14ZM131.408 134.14C138.616 138.455 147.163 140.603 157.029 140.603C166.894 140.603 175.419 138.455 182.582 134.139L131.408 134.14ZM43.4542 138.063V138.563H43.9542H62.7222H63.2222V138.063V123.331H71.4262H71.9262V122.831V105.559V105.059H71.4262H63.2222V81.0785V80.5785H62.7222H43.9542H43.4542V81.0785V105.059H23.3911L53.9264 40.3559L54.2631 39.6425H53.4742H32.2582H31.9413L31.8061 39.9291L0.934056 105.345L0.88623 105.446V105.559V122.831V123.331H1.38623H43.4542V138.063ZM181.318 106.729L181.317 106.732C179.31 111.726 176.288 115.563 172.254 118.267C168.232 120.963 163.171 122.284 157.036 122.195C150.898 122.105 145.83 120.695 141.803 117.995C137.767 115.29 134.722 111.495 132.671 106.591C130.661 101.678 129.649 95.853 129.649 89.1025C129.649 82.3519 130.661 76.4793 132.672 71.4739C134.724 66.4795 137.769 62.6418 141.803 59.9379C145.825 57.2419 150.887 55.9209 157.021 56.0105C163.16 56.1001 168.227 57.5104 172.254 60.2099C176.29 62.9151 179.312 66.709 181.318 71.6119L181.319 71.6154C183.374 76.5274 184.409 82.3523 184.409 89.1025C184.409 95.8524 183.374 101.724 181.318 106.729ZM284.642 138.063V138.563H285.142H303.91H304.41V138.063V123.331H312.614H313.114V122.831V105.559V105.059H312.614H304.41V81.0785V80.5785H303.91H285.142H284.642V81.0785V105.059H264.579L295.114 40.3559L295.451 39.6425H294.662H273.446H273.129L272.994 39.9291L242.122 105.345L242.074 105.446V105.559V122.831V123.331H242.574H284.642V138.063Z"
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
              <path
                d="M179.3 61.3061L179.3 61.3058C168.559 50.5808 151.17 50.5804 140.444 61.3061C129.703 72.0316 129.703 89.4361 140.444 100.162C151.17 110.903 168.559 110.903 179.3 100.162C190.026 89.4364 190.026 72.0317 179.3 61.3061ZM185.924 54.6832C200.31 69.0695 200.31 92.3985 185.924 106.785C171.522 121.171 148.208 121.171 133.806 106.785C119.419 92.3987 119.419 69.0693 133.806 54.683C148.208 40.2965 171.522 40.2966 185.924 54.6832Z"
                className="stroke-gray-200"
              />
              <path
                d="M190.843 119.267L182.077 110.492C184.949 108.267 187.537 105.651 189.625 102.955L198.39 111.729L190.843 119.267Z"
                className="stroke-red-200"
              />
              <path
                d="M219.183 125.781L219.183 125.78L203.374 109.988C203.374 109.987 203.374 109.987 203.373 109.986C202.057 108.653 199.91 108.657 198.582 109.985L198.931 110.335L198.582 109.985L189.108 119.459C187.792 120.775 187.796 122.918 189.105 124.247L189.108 124.249L204.919 140.06C208.85 143.992 215.252 143.992 219.183 140.06C223.13 136.113 223.13 129.728 219.183 125.781Z"
                className="fill-indigo-200 stroke-red-400"
              />
            </svg>
          </div>
          
          <div className="text-center mt-8 max-w-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-primary">404</span> - Page Not Found
            </h1>
            <h2 className="text-base font-medium text-gray-800 mb-4">
              Oops! Looks like you've wandered off the path
            </h2>
            <p className="text-gray-500 mb-8 mx-auto max-w-md text-base">
              The page you're looking for might have been moved, renamed, or might never have existed. 
              Let's get you back on track.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
              <Button className="w-full bg-primary hover:bg-primary text-white shadow-md hover:shadow-lg transition duration-200" asChild>
                <Link href="/" className="flex items-center justify-center">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full border-indigo-200 text-primary hover:bg-indigo-50 shadow-sm hover:shadow transition duration-200" onClick={() => window.history.back()}>
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