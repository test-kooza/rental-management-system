import Link from 'next/link';
import React from 'react';

export default function PropertyFooter() {
  return (
    <footer className="py-8 border-t border-[#f7f7f7] mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Get help with a safety issue</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">AirCover</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Anti-discrimination</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Disability support</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Cancellation options</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Report neighborhood concern</Link></li>
            </ul>
          </div>

          {/* Hosting Column */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Airbnb your home</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">AirCover for Hosts</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Hosting resources</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Community forum</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Hosting responsibly</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Airbnb-friendly apartments</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Join a free Hosting class</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Find a co-host</Link></li>
            </ul>
          </div>

          {/* Airbnb Column */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Airbnb</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Newsroom</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">New features</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline ">Investors</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Gift cards</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline text-sm">Airbnb.org emergency stays</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-0">
            <span className="text-gray-600 text-sm">© 2025 Airbnb, Inc.</span>
            <span className="text-gray-300 mx-1 text-sm">·</span>
            <Link href="#" className="text-gray-600 hover:underline">Terms</Link>
            <span className="text-gray-300 mx-1 text-sm">·</span>
            <Link href="#" className="text-gray-600 hover:underline text-sm">Sitemap</Link>
            <span className="text-gray-300 mx-1">·</span>
            <Link href="#" className="text-gray-600 hover:underline text-sm">Privacy</Link>
            <span className="text-gray-300 mx-1">·</span>
            <div className="flex items-center">
              <Link href="#" className="text-gray-600 hover:underline text-sm">Your Privacy Choices</Link>
              <svg width="26" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M5.996 9.251c1.715 0 3.105-1.39 3.105-3.104 0-1.715-1.39-3.104-3.105-3.104-1.714 0-3.104 1.389-3.104 3.104 0 1.715 1.39 3.104 3.104 3.104Z" fill="#06F"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12.822 1.037H19.9a2.063 2.063 0 1 1 0 4.125h-7.08a2.063 2.063 0 0 1 0-4.125Zm.001 6.075H19.9a2.063 2.063 0 1 1 0 4.125h-7.08a2.063 2.063 0 1 1 0-4.125Z" fill="#06F"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M1.041 3.1A4.059 4.059 0 0 1 5.1 0a4.059 4.059 0 0 1 4.058 4.059A4.059 4.059 0 0 1 5.1 8.117a4.059 4.059 0 0 1-4.058-4.058Zm1.063 0A2.996 2.996 0 0 1 5.1 1.063a2.996 2.996 0 0 1 2.996 2.996A2.996 2.996 0 0 1 5.1 7.054 2.996 2.996 0 0 1 2.104 4.06Z" fill="#06F"/>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <button className="flex items-center gap-2 text-gray-600 text-sm">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S4.41 1.5 8 1.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"/>
                  <path d="M11.99 8c0 .01 0 .01 0 0H12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.59 0 1.15.13 1.65.36l.71-1.83C9.64 2.19 8.84 2 8 2 4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6h-.01z"/>
                </svg>
                <span>English (US)</span>
              </button>
              <button className="ml-4 text-gray-600 text-sm">UGX</button>
            </div>
            
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook" className="text-gray-600">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Twitter" className="text-gray-600">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram" className="text-gray-600">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}