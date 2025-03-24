"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface SiteHeaderProps {
  session?: Session | null;
}

export function UserNav({ session }: SiteHeaderProps) {
  const router=useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  async function handleLogout() {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center rounded-full border px-2 py-1 hover:shadow-lg"
      >
        <Menu className="h-4 w-4 mr-2" />
        <div className="relative h-10 w-10 rounded-full flex items-center justify-center">
          <Avatar className="h-9 w-9">
            {session ? (
              <>
                <AvatarImage src={session.user?.image || "https://github.com/shadcn.png"} />
                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src={"https://github.com/shadcn.png"} />
                <AvatarFallback>U</AvatarFallback>
              </>
            )}
          </Avatar>
          {session && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] text-white">
              2
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto py-2">
              {session ? (
                <>
                  <div className="border-b pb-2">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/messages" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                      Messages
                    </Link>
                    <Link
                  href="/dashboard/notifications"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <span>Notifications</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] text-white">
                    1
                  </span>
                </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                  Account
                </Link>
                <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                  WishList
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <span>Manage listings</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] text-white">
                    1
                  </span>
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                  Help Center
                </Link>
                  </div>
                  <div className="py-2">
                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleLogout()}>
                      Log out
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b py-2">
                    <Link href="/login" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
