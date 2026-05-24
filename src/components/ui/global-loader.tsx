'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GlobalLoaderProps {
  isLoading: boolean
  message?: string
}

export default function GlobalLoader({ isLoading, message = 'Loading...' }: GlobalLoaderProps) {
  const [displayLoader, setDisplayLoader] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setDisplayLoader(true)
      }
    }, 100)

    if (!isLoading) {
      setDisplayLoader(false)
    }

    return () => clearTimeout(timer)
  }, [isLoading])

  if (!displayLoader) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      {/* Glassmorphism container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/10 p-8 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Animated rings */}
          <div className="relative w-16 h-16">
            {/* Outer ring - Navy blue */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-navy border-r-navy"
              style={{ borderTopColor: '#001f3f', borderRightColor: '#001f3f' }}
            />

            {/* Middle ring - Gold */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-t-yellow border-l-yellow"
              style={{ borderTopColor: '#FFD700', borderLeftColor: '#FFD700' }}
            />

            {/* Inner pulsing dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow to-orange"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              }}
            />
          </div>

          {/* Loading text with gradient */}
          <div className="text-center">
            <motion.h3
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg font-semibold bg-gradient-to-r from-navy via-blue to-yellow bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #001f3f, #0066cc, #FFD700)',
              }}
            >
              {message}
            </motion.h3>

            {/* Animated dots */}
            <div className="flex gap-1 justify-center mt-4">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.15,
                  }}
                  className="w-2 h-2 rounded-full bg-yellow"
                  style={{ backgroundColor: '#FFD700' }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
