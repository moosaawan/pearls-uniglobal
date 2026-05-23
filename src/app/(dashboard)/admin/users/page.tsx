'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, Search, Shield, ShieldCheck, Mail, Calendar, Trash2, Check, UserMinus, Clock, Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/database'
import { useAuthStore } from '@/stores/authStore'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<UserRole>('student')

  const fetchProfiles = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load system profiles.')
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleApprove = async (id: string, name: string) => {
    const targetUser = profiles.find(p => p.id === id)
    if (targetUser && (targetUser.role === 'admin' || targetUser.role === 'super_admin')) {
      toast.error("Administrators cannot manage other admin accounts.")
      return
    }
    if (id === currentUser?.id) {
      toast.error("You cannot manage your own account.")
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: 'approved' })
        .eq('id', id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(`Account for ${name} approved successfully!`)
      setProfiles(profiles.map(p => p.id === id ? { ...p, account_status: 'approved' } : p))
      setSelectedUser(null)
    } catch {
      toast.error('Failed to approve user.')
    }
  }

  const handleReject = async (id: string, name: string) => {
    const targetUser = profiles.find(p => p.id === id)
    if (targetUser && (targetUser.role === 'admin' || targetUser.role === 'super_admin')) {
      toast.error("Administrators cannot manage other admin accounts.")
      return
    }
    if (id === currentUser?.id) {
      toast.error("You cannot manage your own account.")
      return
    }

    const confirmDelete = window.confirm(`Are you sure you want to reject and delete ${name}'s data? This will permanently erase their credentials and assessment profile from the entire system.`)
    if (!confirmDelete) return

    try {
      const supabase = createClient()
      
      // Execute the custom cascade delete function we defined in Postgres
      const { error } = await supabase.rpc('delete_user_cascade', { user_uuid: id })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(`Account and data for ${name} deleted successfully from database!`)
      setProfiles(profiles.filter(p => p.id !== id))
      setSelectedUser(null)
    } catch {
      toast.error('Failed to reject and delete user.')
    }
  }

  const handleUpdateRole = async (id: string, name: string) => {
    const targetUser = profiles.find(p => p.id === id)
    if (targetUser && (targetUser.role === 'admin' || targetUser.role === 'super_admin')) {
      toast.error("Administrators cannot manage other admin accounts.")
      return
    }
    if (id === currentUser?.id) {
      toast.error("You cannot manage your own account.")
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(`Role for ${name} updated to ${newRole}!`)
      setProfiles(profiles.map(p => p.id === id ? { ...p, role: newRole } : p))
      setSelectedUser(null)
    } catch {
      toast.error('Failed to update role.')
    }
  }

  const filtered = profiles.filter(p =>
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const pendingUsers = filtered.filter(p => p.account_status === 'pending')
  const activeUsers = filtered.filter(p => p.account_status !== 'pending')

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Loading system accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-gold" /> System Users
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Verify student applications, manage credentials, and configure access levels across clients, counselors, and admins.</p>
        </div>
      </motion.div>

      {/* Search Input */}
      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          
          {/* ========== PENDING APPROVALS SECTION ========== */}
          {pendingUsers.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-3">
              <h2 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold animate-pulse" /> Pending Approvals ({pendingUsers.length})
              </h2>
              <div className="space-y-3">
                {pendingUsers.map((u) => (
                  <Card key={u.id} className="border border-gold/30 bg-gold/5 shadow-md relative overflow-hidden font-sans text-xs">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-gold/20">
                          {getInitials(u.full_name || 'U')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-foreground text-sm leading-tight flex items-center gap-2">
                            {u.full_name || 'Anonymous User'} 
                            <Badge className="bg-gold/20 text-gold text-[9px] hover:bg-gold/20 border-gold/30 uppercase px-1.5 font-sans">Pending Review</Badge>
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      {/* Direct Approve/Reject Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          onClick={() => handleApprove(u.id, u.full_name)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg h-9 px-3 text-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(u.id, u.full_name)}
                          variant="destructive"
                          className="font-semibold rounded-lg h-9 px-3 text-xs flex items-center gap-1"
                        >
                          <UserMinus className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========== ACTIVE SYSTEM USERS SECTION ========== */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Active System Users ({activeUsers.length})
            </h2>
            <div className="space-y-3.5">
              {activeUsers.length === 0 ? (
                <Card className="border-dashed border-2 border-border/40 text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-sans text-sm">No active accounts found.</p>
                  </CardContent>
                </Card>
              ) : (
                activeUsers.map((u) => {
                  const isAdmin = u.role === 'admin' || u.role === 'super_admin'
                  const isSelf = u.id === currentUser?.id
                  const isDisabled = isAdmin || isSelf
                  return (
                    <motion.div key={u.id} variants={fadeUp}>
                      <Card 
                        className={`border-border/50 transition-all duration-300 shadow-sm ${
                          isDisabled 
                            ? 'opacity-65 cursor-not-allowed bg-muted/10 border-dashed hover:border-dashed' 
                            : 'hover:shadow-premium group cursor-pointer'
                        } ${selectedUser === u.id ? 'border-gold bg-gold/5' : ''}`}
                        onClick={() => {
                          if (isDisabled) {
                            if (isSelf) {
                              toast.error("You cannot manage your own account.")
                            } else {
                              toast.error("Administrators cannot manage other admin accounts.")
                            }
                            return
                          }
                          setSelectedUser(u.id === selectedUser ? null : u.id)
                          setNewRole(u.role)
                        }}
                      >
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-navy/5 dark:bg-navy-light/10 text-foreground flex items-center justify-center font-bold text-sm shrink-0 border border-border/30 group-hover:border-gold/30 transition-all duration-300">
                            {getInitials(u.full_name || 'U')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">{u.full_name || 'Anonymous User'}</h4>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 font-sans ${
                            u.role === 'admin' || u.role === 'super_admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            u.role === 'staff' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-green-500/10 text-green-500 border-green-500/20'
                          }`}>
                            {u.role}
                          </Badge>
                          <Badge className="text-[9px] uppercase font-bold py-0.5 px-2 font-sans bg-green-500/10 text-green-500 border-green-500/20">
                            APPROVED
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>

        </div>

        {/* Sidebar Inspector role changer */}
        <motion.div variants={fadeUp}>
          {selectedUser ? (
            (() => {
              const u = profiles.find(usr => usr.id === selectedUser)
              if (!u) return null
              return (
                <Card className="border-gold/30 shadow-premium overflow-hidden font-sans text-sm text-foreground bg-background">
                  <div className="h-1.5 bg-gradient-gold" />
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                        {getInitials(u.full_name || 'U')}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm leading-tight">{u.full_name || 'Anonymous User'}</h4>
                        <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 border-t border-border pt-4 text-xs font-sans text-muted-foreground">
                      <div className="flex justify-between"><span>Registered Date:</span><span className="font-medium text-foreground">{new Date(u.created_at).toLocaleDateString()}</span></div>
                      <div className="flex justify-between"><span>Status:</span><span className="font-medium text-foreground uppercase">{u.account_status}</span></div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Change User Role</label>
                      <select
                        value={newRole}
                        onChange={e => setNewRole(e.target.value as UserRole)}
                        className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background text-xs outline-none focus:border-gold"
                      >
                        <option value="student">STUDENT (Study Portal access)</option>
                        <option value="staff">STAFF (Admissions/CRM Counselor)</option>
                        <option value="admin">ADMIN (Full ERP system access)</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateRole(u.id, u.full_name)}
                        className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-lg h-9 text-xs"
                      >
                        Save Role configuration
                      </Button>
                    </div>

                    <div className="pt-3.5 border-t border-border flex flex-col gap-2">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Delete user account</p>
                      <Button
                        onClick={() => handleReject(u.id, u.full_name)}
                        variant="destructive"
                        className="w-full rounded-xl h-9 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Permanent Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })()
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5 font-sans">
                <Users className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select User Profile</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any active account card to manage login permissions, configuration credentials, and upgrade/downgrade access roles.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
