'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, Search, Bell, Settings, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types/database'
import Link from 'next/link'

interface TopBarProps {
  onMenuClick: () => void
  user: Profile | null
}

export default function TopBar({ onMenuClick, user }: TopBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      window.location.href = '/login'
    }
  }

  const getSettingsPath = () => {
    if (!user) return '/student/settings'
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin/settings'
    if (user.role === 'staff') return '/staff/settings'
    return '/student/settings'
  }
  const settingsPath = getSettingsPath()

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden rounded-xl"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0 font-sans"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-xl relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-10 px-2 rounded-xl gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gold/10 text-gold text-xs font-bold font-sans">
                    {getInitials(user?.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium font-sans max-w-[120px] truncate">
                  {user?.full_name || 'User'}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="font-sans">
              <p className="font-semibold">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href={settingsPath} className="font-sans cursor-pointer flex items-center w-full" />}
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={settingsPath} className="font-sans cursor-pointer flex items-center w-full" />}
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive font-sans cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
