'use client'

import { motion } from 'framer-motion'
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from 'next-themes'

interface StudentTopBarProps {
  onMenuClick: () => void
}

export default function StudentTopBar({ onMenuClick }: StudentTopBarProps) {
  const [notifications, setNotifications] = useState<number>(0)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: notifs } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false)

      setNotifications(notifs?.length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/10 bg-navy/50 backdrop-blur-md sticky top-0 z-40"
    >
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-white" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1 max-w-xs">
            <Search size={18} className="text-white/50" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchNotifications}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bell size={24} className="text-white/70 hover:text-white" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </motion.button>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={24} className="text-white/70 hover:text-white" />
              ) : (
                <Moon size={24} className="text-white/70 hover:text-white" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
