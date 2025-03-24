import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 px-6  flex-wrap items-center justify-between text-sm z-10 shadow-sm md:flex hidden">
      <div className="flex items-center flex-wrap">
        <span className="text-gray-600">© 2025 Airbnb, Inc.</span>
        <span className="mx-2 text-gray-400">·</span>
        <a href="#" className="text-gray-600 hover:underline">Terms</a>
        <span className="mx-2 text-gray-400">·</span>
        <a href="#" className="text-gray-600 hover:underline">Sitemap</a>
        <span className="mx-2 text-gray-400">·</span>
        <a href="#" className="text-gray-600 hover:underline">Privacy</a>
        <span className="mx-2 text-gray-400">·</span>
        <div className="flex items-center">
          <Link href="#" className="text-gray-600 hover:underline">Your Privacy Choices</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1 text-blue-500">
            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex items-center mt-2 md:mt-0">
        <button className="flex items-center mr-4 text-gray-600 hover:underline font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          English (US)
        </button>
        <span className="text-gray-600 mr-4 font-semibold">UGX</span>
        <button className="flex items-center text-gray-600 hover:underline font-semibold">
          Support & resources
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </footer>
  );
}