"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Create a little wiggle effect when the button appears
  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0px 8px 15px rgba(245, 158, 11, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.9,
      boxShadow: "0px 2px 5px rgba(245, 158, 11, 0.2)"
    },
    exit: {
      opacity: 0,
      scale: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  // Bouncing animation for the arrow
  const arrowVariants = {
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 right-4 z-50 lg:bottom-6 lg:right-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <div className="relative">
            {/* Pulse effect ring */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary opacity-30"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <Button
              onClick={scrollToTop}
              className="relative rounded-full p-3 lg:p-5 bg-gradient-to-br from-primary to-red-500 hover:from-red-500 hover:to-red-600 shadow-lg border-2 border-red-300 text-white"
              size="icon"
            >
              <motion.div
                variants={arrowVariants}
                animate="animate"
              >
                <ChevronUp className="h-6 w-6 lg:h-9 lg:w-9" />
              </motion.div>
            </Button>
            
            {/* Yellow particle effects */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-300"
              animate={{
                x: [0, 10, 0],
                y: [0, -10, 0],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-red-300"
              animate={{
                x: [0, -8, 0],
                y: [0, 8, 0],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.2
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}