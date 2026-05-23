'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, ExternalLink, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, BRAND } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, setUser } = useAuthStore()

  // Dynamic Auth State checking
  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Formulate user state from auth session immediately to prevent lag/fetching issues
        const sessionUser = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role: session.user.user_metadata?.role || 'student',
          account_status: 'approved', // fallback default
        }

        // Fetch actual profile from database in background
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile as any)
        } else {
          setUser(sessionUser as any)
        }
      } else {
        setUser(null)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const sessionUser = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role: session.user.user_metadata?.role || 'student',
          account_status: 'approved',
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile as any)
        } else {
          setUser(sessionUser as any)
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

  // Get dynamic dashboard paths based on role
  const getPortalPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin'
    if (user.role === 'staff') return '/staff'
    return '/student'
  }

  const getSettingsPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin/settings'
    if (user.role === 'staff') return '/staff/settings'
    return '/student/settings'
  }

  const portalPath = getPortalPath()
  const settingsPath = getSettingsPath()

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
        <div className="hidden lg:flex items-center gap-3 min-w-[220px] justify-end">
          {!mounted ? (
            /* Hydration Guard placeholder */
            <div className="w-32 h-10 rounded-xl bg-white/5 animate-pulse border border-white/10" />
          ) : user ? (
            /* Logged in: Hide both buttons, show only PFP with dynamic dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="h-11 px-2.5 rounded-xl hover:bg-white/5 flex items-center gap-2 border border-gold/20 shadow-gold bg-navy-light/10" />
                }
              >
                <Avatar className="w-8 h-8 ring-2 ring-gold/40">
                  <AvatarFallback className="bg-gold/20 text-gold text-xs font-bold font-sans">
                    {getInitials(user.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium text-xs font-sans">
                  {user.full_name?.split(' ')[0] || 'User'}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border shadow-premium bg-card text-foreground font-sans">
                <DropdownMenuLabel className="font-sans">
                  <p className="font-semibold text-foreground text-sm leading-tight">{user.full_name}</p>
                  <p className="text-[11px] text-muted-foreground font-normal truncate mt-0.5">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="font-sans cursor-pointer focus:bg-gold/10 focus:text-gold">
                  <Link href={portalPath} className="flex items-center gap-2.5 w-full">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="font-sans cursor-pointer focus:bg-gold/10 focus:text-gold">
                  <Link href={settingsPath} className="flex items-center gap-2.5 w-full">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 font-sans cursor-pointer focus:bg-red-500/10 focus:text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Not Logged in: Normal view */}
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 font-medium font-sans"
              >
                LOGIN
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
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                />
              }
            >
              <Menu className="w-6 h-6" />
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
                {!mounted ? (
                  /* Hydration Guard placeholder */
                  <div className="w-full h-24 rounded-xl bg-white/5 animate-pulse border border-white/10" />
                ) : user ? (
                  /* Logged in on Mobile: Show User summary box with Dashboard, Settings, Logout options */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1.5 py-1">
                      <Avatar className="w-10 h-10 border border-gold/30">
                        <AvatarFallback className="bg-gold/20 text-gold text-sm font-bold font-sans">
                          {getInitials(user.full_name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate font-sans">{user.full_name}</p>
                        <p className="text-white/50 text-[11px] truncate font-sans">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={portalPath} onClick={() => setOpen(false)} className="w-full">
                        <Button className="w-full h-11 bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href={settingsPath} onClick={() => setOpen(false)} className="w-full">
                        <Button className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                          <Settings className="w-3.5 h-3.5" />
                          Settings
                        </Button>
                      </Link>
                    </div>

                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full h-11 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Not Logged in: High-contrast gold & premium styling to fix all light/dark theme white-on-white bugs */}
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-gold/30 text-gold hover:bg-gold/10 bg-navy-light/10 rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        LOGIN
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
