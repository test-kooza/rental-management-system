"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Globe, Menu, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { UserNav } from "./userNav"
import { SearchModal } from "./SearchModal"
import { MobileSearch } from "./MobileSearch"
import Image from "next/image"
import Logo from "./Logo"
import MobileCategoriesScroller from "./MobileScroller"
import CategoryScroller from "./CategoryScroller"

interface SiteHeaderProps {
  session?: any
}

export default function PropertyHeader({ session }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollThreshold = 20
  
  // Add debounce to prevent rapid state changes
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  useEffect(() => {
    // Get initial scroll position
    if (window.scrollY > scrollThreshold) {
      setScrolled(true)
    }
    
    // Use debounced handler with requestAnimationFrame for smoother transitions
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (window.scrollY > scrollThreshold) {
          if (!scrolled) setScrolled(true)
        } else {
          if (scrolled) setScrolled(false)
        }
      })
    }
    
    // Use a slightly debounced scroll handler
    const debouncedHandleScroll = debounce(handleScroll, 10)
    window.addEventListener("scroll", debouncedHandleScroll)
    
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll)
    }
  }, [scrolled])

  // Animation variants for smoother transitions
  const expandedVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 }
  }
  
  const collapsedVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 }
  }

  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300 md:px-4 md:pt-4 bg-white flex flex-col",
          scrolled ? "md:pb-2 shadow-sm" : "md:pb-2"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Logo/>
            </div>

            {/* Mobile Search Button */}
            <div className="flex md:hidden flex-col">
              <button 
                onClick={() => setMobileSearchOpen(true)}
                className="flex items-center w-full rounded-full border shadow-sm px-4 py-2"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="text-sm text-gray-500">Start your search</span>
              </button>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center">
              <Link 
                href="#" 
                className="hidden md:flex items-center rounded-full px-4 py-2 text-sm hover:bg-accent font-bold"
              >
                Switch to hosting
              </Link>
              <button className="rounded-full p-2 hover:bg-accent">
                <Globe className="h-5 w-5" />
              </button>
              <UserNav session={session} />
            </div>
          </div>
        </div>
      </header>
      
    
      
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <MobileSearch onClose={() => setMobileSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}