'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, ExternalLink, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, BRAND } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, setUser } = useAuthStore()

  // Dynamic Auth State checking
  useEffect(() => {
    const supabase = createClient()
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile as any)
        }
      } else {
        setUser(null)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile as any)
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOpen(false)
  }

  // Get dynamic portal path based on role
  const getPortalPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin'
    if (user.role === 'staff') return '/staff'
    return '/student'
  }

  const portalPath = getPortalPath()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-dark shadow-premium-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            "relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300",
            scrolled ? "w-10 h-10" : "w-14 h-14"
          )}>
            <img
              src="/logo/uniglobal.png"
              alt="Pearls UniGlobal Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className={cn(
              "font-bold tracking-tight text-white font-[family-name:var(--font-heading)] transition-all duration-300 leading-tight",
              scrolled ? "text-lg" : "text-xl sm:text-2xl"
            )}>
              Pearls <span className="text-gradient">UniGlobal</span>
            </span>
            <span className={cn(
              "uppercase tracking-[0.2em] text-gold-light/70 hidden sm:block transition-all duration-300 mt-0.5",
              scrolled ? "text-[8px]" : "text-[10px]"
            )}>
              {BRAND.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                  isActive
                    ? 'text-gold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gold"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {/* Logged in: Hide Book Consultation, show PORTAL LOGIN with Book Consultation properties */}
              <Link href={portalPath}>
                <Button className="bg-gradient-gold text-navy font-semibold px-6 py-2.5 h-auto rounded-xl shadow-gold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  PORTAL LOGIN
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white/70 hover:text-red-400 hover:bg-white/5 rounded-xl h-10 px-3 text-sm flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              {/* Not Logged in: Normal view */}
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                PORTAL LOGIN
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link href="/free-assessment">
                <Button className="bg-gradient-gold text-navy font-semibold px-5 py-2.5 h-auto rounded-xl shadow-gold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm">
                  Book Consultation
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] sm:w-[350px] bg-navy border-navy-light/30 p-0 flex flex-col h-full"
            >
              <SheetHeader className="p-6 pb-4 border-b border-white/10 shrink-0">
                <SheetTitle className="text-white flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9">
                    <img
                      src="/logo/uniglobal.png"
                      alt="Pearls UniGlobal Logo"
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">
                      Pearls <span className="text-gradient">UniGlobal</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-gold-light/60">
                      {BRAND.tagline}
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Scrollable Navigation Area */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="flex flex-col">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center px-6 py-3.5 text-[15px] font-medium transition-all duration-200',
                            isActive
                              ? 'text-gold bg-gold/5 border-r-2 border-gold'
                              : 'text-white/75 hover:text-white hover:bg-white/5'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    )
                  })}
                </div>
              </div>

              {/* High-Contrast Action Buttons Area */}
              <div className="p-6 space-y-3 border-t border-white/10 bg-navy-dark shrink-0">
                {user ? (
                  <>
                    {/* Logged in: Hide Book Consultation, show PORTAL LOGIN with full gold background and dynamic path */}
                    <Link href={portalPath} onClick={() => setOpen(false)}>
                      <Button className="w-full h-12 bg-gradient-gold text-navy font-bold rounded-xl shadow-gold flex items-center justify-center gap-2 hover:opacity-90">
                        <User className="w-4 h-4" />
                        PORTAL LOGIN
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full h-11 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-sans"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Not Logged in: High-contrast gold & premium styling to fix all light/dark theme white-on-white bugs */}
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-gold/30 text-gold hover:bg-gold/10 bg-navy-light/10 rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        PORTAL LOGIN
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/free-assessment" onClick={() => setOpen(false)}>
                      <Button className="w-full h-12 bg-gradient-gold text-navy font-bold rounded-xl shadow-gold hover:opacity-90">
                        Book Consultation
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
