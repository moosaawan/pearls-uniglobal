'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.error('Error caught by boundary:', error)
  }, [error])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-80 h-80 rounded-full bg-red-500/10"
        />
      </div>

      {/* Error content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-red-400/30 rounded-2xl p-8 shadow-2xl">
          {/* Error icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-red-500/20 rounded-full">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
          </motion.div>

          {/* Error title */}
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Oops! Something Went Wrong
          </h2>

          {/* Error message */}
          <p className="text-white/70 text-center mb-6">
            We encountered an unexpected error. Our team has been notified.
          </p>

          {/* Error details */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="bg-black/30 border border-red-400/20 rounded-lg p-4 mb-6">
              <p className="text-xs text-red-300 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={reset}
                className="w-full bg-gradient-to-r from-yellow to-orange text-black hover:shadow-lg hover:shadow-orange/50 transition-shadow gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={() => {
                  window.location.href = '/'
                }}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                Return Home
              </Button>
            </motion.div>
          </div>

          {/* Support info */}
          <p className="text-center text-white/50 text-sm mt-6">
            Need help?{' '}
            <a href="/contact" className="text-yellow hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
