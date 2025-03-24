"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tag, User, ShoppingCart, ShoppingBag, Heart, Search, Car, SendIcon } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  {
    label: "Explore",
    icon: Search,
    href: "/",
  },
  {
    label: "WishList",
    icon: Heart,
    href: "/wishlist",
  },
 
  {
    label: "Messages",
    icon: SendIcon,
    href: "/messages",
  },
  {
    label: "My Account",
    icon: User,
    href: "/dashboard",
  },
]

export default function MobileFooter() {
  const pathname = usePathname()
  
  const cartCountVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    exit: { scale: 0.8, opacity: 0 }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring", 
                  stiffness: 300
                }}
              >
                <item.icon 
                  className={`h-6 w-6 ${isActive ? "text-primary" : "text-gray-600"}`} 
                  strokeWidth={1.5} 
                />
              </motion.div>
              <motion.span 
                className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-600"}`}
                animate={{ 
                  y: isActive ? [0, -2, 0] : 0,
                  transition: { duration: 0.3 }
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          )
        })}
        
      </div>
    </div>
  )
}