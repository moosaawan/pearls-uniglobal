'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard, FileText, FolderOpen, GraduationCap,
  Calendar, BookOpen, HeadphonesIcon, Settings, LogOut,
  ChevronLeft, Users, BarChart3, Mail, Megaphone,
  Ticket, Database, Globe, CreditCard, Clock,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  pathname: string
}

const studentNav = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/applications', label: 'Applications', icon: FileText },
  { href: '/student/documents', label: 'Documents', icon: FolderOpen },
  { href: '/student/universities', label: 'Universities', icon: GraduationCap },
  { href: '/student/appointments', label: 'Appointments', icon: Calendar },
  { href: '/student/ielts', label: 'IELTS Prep', icon: BookOpen },
  { href: '/student/support', label: 'Support', icon: HeadphonesIcon },
  { href: '/student/settings', label: 'Settings', icon: Settings },
]

const staffNav = [
  { href: '/staff', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/students', label: 'Students', icon: Users },
  { href: '/staff/applications', label: 'Applications', icon: FileText },
  { href: '/staff/leads', label: 'Leads', icon: Megaphone },
  { href: '/staff/calendar', label: 'Calendar', icon: Calendar },
  { href: '/staff/messages', label: 'Messages', icon: Mail },
  { href: '/staff/tasks', label: 'Tasks', icon: Ticket },
  { href: '/staff/settings', label: 'Settings', icon: Settings },
]

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/applications', label: 'Applications', icon: FileText },
  { href: '/admin/leads', label: 'Leads / CRM', icon: Megaphone },
  { href: '/admin/universities', label: 'Universities', icon: GraduationCap },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/finance', label: 'Finance', icon: CreditCard },
  { href: '/admin/blog', label: 'Blog CMS', icon: Globe },
  { href: '/admin/storage', label: 'Storage', icon: Database },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, pathname }: SidebarProps) {
  const router = useRouter()
  const { user } = useAuthStore()

  const getNavItems = () => {
    // If student is pending/not approved, do not show any options in the sidebar
    if (user?.role === 'student' && user?.account_status !== 'approved') {
      return []
    }
    if (pathname.startsWith('/admin')) return adminNav
    if (pathname.startsWith('/staff')) return staffNav
    return studentNav
  }

  const navItems = getNavItems()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarInner = () => (
    <div className="flex flex-col h-full bg-navy text-white">
      {/* Logo */}
      <div className="h-20 flex items-center px-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
            <img
              src="/logo/uniglobal.png"
              alt="Pearls UniGlobal Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
            />
          </div>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold font-sans whitespace-nowrap">
              Pearls <span className="text-gold">UniGlobal</span>
            </motion.span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hidden lg:flex ml-auto text-white/50 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8"
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Status: Pending</p>
              {!collapsed && (
                <p className="text-[11px] text-white/50 leading-relaxed font-sans mt-2">
                  Your application is under review by our administration.
                </p>
              )}
            </div>
          </div>
        ) : (
          navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 font-sans group',
                  isActive
                    ? 'bg-gold/15 text-gold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-gold')} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </Link>
            )
          })
        )}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="border-t border-white/10 p-4">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gold/20 text-gold text-xs font-bold font-sans">
                {getInitials(user.full_name || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate font-sans">{user.full_name || 'User'}</p>
              <p className="text-xs text-white/40 truncate font-sans">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-sans',
            collapsed ? 'w-full justify-center p-2' : 'w-full justify-start'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Log Out</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:block fixed top-0 left-0 h-screen z-40 transition-all duration-300 border-r border-white/5',
        collapsed ? 'w-20' : 'w-64'
      )}>
        <SidebarInner />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-72 p-0 border-none">
          <SidebarInner />
        </SheetContent>
      </Sheet>
    </>
  )
}
