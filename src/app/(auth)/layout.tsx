'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Globe, Award, Star, X } from 'lucide-react'
import { BRAND } from '@/lib/constants'
import { fadeLeft, fadeRight } from '@/lib/animations'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex relative">
      {/* Back to Home Button (Cross Icon) */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-card hover:scale-105 transition-all duration-300 shadow-sm"
        aria-label="Back to Home"
      >
        <X className="w-5 h-5" />
      </Link>

      {/* Left Side - Brand Showcase (Hidden on mobile) */}
      <motion.div
        variants={fadeLeft}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-hero"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/3 rounded-full blur-2xl" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/logo/uniglobal.png"
                alt="Pearls UniGlobal Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-sans tracking-tight">
                {BRAND.name}
              </h1>
              <p className="text-xs text-gold-light tracking-widest uppercase">
                {BRAND.tagline}
              </p>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Your Journey to
                <span className="text-gradient block mt-1">Global Education</span>
                Starts Here
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-10">
                {BRAND.description}
              </p>
            </motion.div>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Globe, label: '150+ Partner Universities' },
                { icon: Award, label: '98% Visa Success Rate' },
                { icon: Star, label: 'Premium Guidance' },
                { icon: GraduationCap, label: '2500+ Students Placed' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-sm text-white/80 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-32 right-12 animate-float">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
            <Globe className="w-8 h-8 text-gold/50" />
          </div>
        </div>
        <div className="absolute bottom-48 right-32 animate-float-delayed">
          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
            <Star className="w-6 h-6 text-gold/40" />
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form Area */}
      <motion.div
        variants={fadeRight}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background"
      >
        <div className="w-full max-w-md">{children}</div>
      </motion.div>
    </div>
  )
}
