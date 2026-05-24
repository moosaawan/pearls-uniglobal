'use client'

import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  User,
  BarChart3,
  CreditCard,
  BookOpen,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    href: '/dashboard/admin/users',
    icon: Users,
  },
  {
    label: 'Staff',
    href: '/dashboard/admin/staff',
    icon: User,
  },
  {
    label: 'Applications',
    href: '/dashboard/admin/applications',
    icon: FileText,
  },
  {
    label: 'CRM',
    href: '/dashboard/admin/crm',
    icon: TrendingUp,
  },
  {
    label: 'Finance',
    href: '/dashboard/admin/finance',
    icon: CreditCard,
  },
  {
    label: 'CMS',
    href: '/dashboard/admin/cms',
    icon: BookOpen,
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-navy via-blue to-indigo border-r border-white/10 z-50 lg:relative lg:translate-x-0 flex flex-col overflow-hidden"
      >
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow/5 rounded-full blur-3xl -z-10" />

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={28} className="text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow to-orange bg-clip-text text-transparent">
                Pearls Admin
              </h1>
            </div>
            {onClose && (
              <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
                <X size={24} />
              </button>
            )}
          </div>
          <p className="text-sm text-white/60">Administration Dashboard</p>
        </div>

        {/* User Profile Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-yellow/10 to-orange/10 border border-yellow/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow to-orange flex items-center justify-center">
              <Zap size={24} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.full_name || 'Administrator'}
              </p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <motion.div key={item.href} whileHover={{ x: 4 }}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-yellow/20 to-orange/20 border border-yellow/30 text-white shadow-lg shadow-yellow/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={18} className="text-yellow-400" />}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <motion.button
            onClick={handleLogout}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <LogOut size={20} />
            <span className="font-medium">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
