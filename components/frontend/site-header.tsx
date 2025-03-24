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
import { Session } from "next-auth"

interface SiteHeaderProps {
  session?: Session | null;
}


export default function SiteHeader({ session }: SiteHeaderProps) {
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
    if (window.scrollY > scrollThreshold) {
      setScrolled(true)
    }
    
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (window.scrollY > scrollThreshold) {
          if (!scrolled) setScrolled(true)
        } else {
          if (scrolled) setScrolled(false)
        }
      })
    }
    
    const debouncedHandleScroll = debounce(handleScroll, 10)
    window.addEventListener("scroll", debouncedHandleScroll)
    
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll)
    }
  }, [scrolled])

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
          scrolled ? "md:pb-4 shadow-sm" : "md:pb-24"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Logo/>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {!scrolled ? (
                  <motion.div 
                    key="expanded"
                    variants={expandedVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="pt-24"
                  >
                    <div className="flex gap-6 items-center justify-center mb-4">
                      <button className="font-bold">Homes</button>
                      <button className="font-medium">Experiences</button>
                    </div>
                    <div className="relative">
                      <div className="flex h-16 items-center rounded-full border shadow-2 bg-[#ffffff]">
                        <div className="flex cursor-pointer flex-col border-r px-16">
                          <span className="text-xs font-semibold">Where</span>
                          <span className="text-sm text-muted-foreground">Search destinations</span>
                        </div>
                        <div className="flex cursor-pointer flex-col border-r px-6">
                          <span className="text-xs font-semibold">Check in</span>
                          <span className="text-sm text-muted-foreground">Add dates</span>
                        </div>
                        <div className="flex cursor-pointer flex-col border-r px-6">
                          <span className="text-xs font-semibold">Check out</span>
                          <span className="text-sm text-muted-foreground">Add dates</span>
                        </div>
                        <div className="flex cursor-pointer flex-col px-16">
                          <span className="text-xs font-semibold">Who</span>
                          <span className="text-sm text-muted-foreground">Add guests</span>
                        </div>
                        <button 
                          className="ml-8 mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff385c] text-white"
                          onClick={() => setSearchOpen(true)}
                        >
                          <Search className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="collapsed"
                    variants={collapsedVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div 
                      className="flex h-14 items-center rounded-full border shadow-2 cursor-pointer"
                      onClick={() => setSearchOpen(true)}
                    >
                      <div className="px-4 font-semibold text-sm">Anywhere</div>
                      <div className="border-l border-r px-4 font-semibold text-sm">Any week</div>
                      <div className="px-4 text-muted-foreground text-sm">Add guests</div>
                      <div className="ml-2 mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff385c] text-white">
                        <Search className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                href="/become-host" 
                className="hidden md:flex items-center rounded-full px-4 py-2 text-sm hover:bg-accent font-bold"
              >
                Switch to hosting
              </Link>
              <Link 
                href="/become-host"  className="rounded-full p-2 hover:bg-accent">
                <Globe className="h-5 w-5" />
              </Link>
              <UserNav session={session} />
            </div>
          </div>
        </div>
        <MobileCategoriesScroller/>
      </header>
      
      <div className="sticky top-[14%] z-20 w-full transition-all duration-300 md:px-4  bg-white flex flex-col">
        <CategoryScroller/>
      </div>
      
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