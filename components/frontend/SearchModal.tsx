"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Search } from "lucide-react"

interface SearchModalProps {
  onClose: () => void
}

export function SearchModal({ onClose }: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20"
    >
      <motion.div
        ref={modalRef}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
          <div className="flex space-x-4">
            <button className="border-b-2 border-black px-4 py-2 font-medium">Homes</button>
            <button className="px-4 py-2 text-gray-500 hover:text-black">Experiences</button>
          </div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Where to?</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-[#FF385C] focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested destinations</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Nearby</div>
                  <div className="text-sm text-gray-500">Find what's around you</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Rome, Italy</div>
                  <div className="text-sm text-gray-500">A favorite of Airbnb travelers</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Jinja, Uganda</div>
                  <div className="text-sm text-gray-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">When</h3>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left hover:border-black">
                Add dates
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Who</h3>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left hover:border-black">
                Add guests
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button className="font-medium underline">Clear all</button>
            <button className="rounded-lg bg-[#FF385C] px-6 py-3 font-medium text-white hover:bg-[#E31C5F]">
              Search
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}