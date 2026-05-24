'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-blue to-indigo flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 w-40 h-40 rounded-full bg-yellow/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue/5"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* 404 Number */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-9xl font-black bg-gradient-to-r from-yellow via-orange to-red bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-xl text-white/70 mb-8 leading-relaxed">
          The page you're looking for seems to have taken a flight to another university.
          Let's get you back on track!
        </p>

        {/* Animated border box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-10"
        >
          <p className="text-white/60 text-sm">
            Error Code: <span className="text-yellow font-mono">404_NOT_FOUND</span>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.back()}
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors gap-2 px-6"
            >
              <ArrowLeft size={20} />
              Go Back
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/">
              <Button className="bg-gradient-to-r from-yellow to-orange text-black hover:shadow-lg hover:shadow-yellow/50 transition-shadow gap-2 px-6">
                <Home size={20} />
                Home
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Additional help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-white/50 text-sm"
        >
          If you think this is a mistake, please{' '}
          <Link href="/contact" className="text-yellow hover:underline">
            contact our support team
          </Link>
          .
        </motion.p>
      </motion.div>
    </div>
  )
}
