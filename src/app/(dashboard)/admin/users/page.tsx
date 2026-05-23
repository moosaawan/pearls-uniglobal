'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, Search, Shield, ShieldCheck, Mail, Calendar, Trash2, Edit2, Plus, Check
} from 'lucide-react'
import { toast } from 'sonner'

interface UserItem {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'STAFF' | 'ADMIN'
  createdAt: string
  status: 'ACTIVE' | 'DEACTIVATED'
}

const initialUsers: UserItem[] = [
  { id: 'usr-1', name: 'Sarah Ahmed', email: 'sarah.ahmed@pearlsuniglobal.com', role: 'STAFF', createdAt: 'Jan 12, 2026', status: 'ACTIVE' },
  { id: 'usr-2', name: 'Moosa Khan', email: 'moosa.khan@gmail.com', role: 'STUDENT', createdAt: 'May 10, 2026', status: 'ACTIVE' },
  { id: 'usr-3', name: 'Ayesha Rahman', email: 'ayesha.r@outlook.com', role: 'STUDENT', createdAt: 'May 12, 2026', status: 'ACTIVE' },
  { id: 'usr-4', name: 'Admin Master', email: 'admin@pearlsuniglobal.com', role: 'ADMIN', createdAt: 'Jan 01, 2026', status: 'ACTIVE' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<'STUDENT' | 'STAFF' | 'ADMIN'>('STUDENT')

  const handleUpdateRole = (id: string, name: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    toast.success(`Role for ${name} updated to ${newRole}!`)
    setSelectedUser(null)
  }

  const handleToggleStatus = (id: string, name: string, status: string) => {
    const nextStat = status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE'
    setUsers(users.map(u => u.id === id ? { ...u, status: nextStat } : u))
    toast.success(`Account for ${name} marked as ${nextStat.toLowerCase()}!`)
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-gold" /> System Users
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage credentials, assign operational permissions, and configure roles across students, counselors, and admins</p>
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

      {/* List layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-sans text-sm">No accounts found.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((u) => (
              <motion.div key={u.id} variants={fadeUp}>
                <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${selectedUser === u.id ? 'border-gold bg-gold/5' : ''}`}
                  onClick={() => {
                    setSelectedUser(u.id === selectedUser ? null : u.id)
                    setNewRole(u.role)
                  }}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-border/30">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">{u.name}</h4>
                        <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 ${
                        u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        u.role === 'STAFF' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                        {u.role}
                      </Badge>
                      <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 ${
                        u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        {u.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Sidebar Inspector role changer */}
        <motion.div variants={fadeUp}>
          {selectedUser ? (
            (() => {
              const u = users.find(usr => usr.id === selectedUser)
              if (!u) return null
              return (
                <Card className="border-gold/30 shadow-premium overflow-hidden font-sans text-sm text-foreground bg-background">
                  <div className="h-1.5 bg-gradient-gold" />
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm leading-tight">{u.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 border-t border-border pt-4 text-xs font-sans text-muted-foreground">
                      <div className="flex justify-between"><span>Registered Date:</span><span className="font-medium text-foreground">{u.createdAt}</span></div>
                      <div className="flex justify-between"><span>Status:</span><span className="font-medium text-foreground">{u.status}</span></div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Change User Role</label>
                      <select
                        value={newRole}
                        onChange={e => setNewRole(e.target.value as any)}
                        className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background text-xs outline-none focus:border-gold"
                      >
                        <option value="STUDENT">STUDENT (Study Portal access)</option>
                        <option value="STAFF">STAFF (Admissions/CRM Counselor)</option>
                        <option value="ADMIN">ADMIN (Full ERP system access)</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateRole(u.id, u.name)}
                        className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-lg h-9 text-xs"
                      >
                        Save Role configuration
                      </Button>
                    </div>

                    <div className="pt-3.5 border-t border-border flex flex-col gap-2">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Deactivate user account</p>
                      <Button
                        onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                        variant="outline"
                        className={`w-full rounded-xl h-9 text-xs flex items-center justify-center gap-1.5 ${
                          u.status === 'ACTIVE' ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : 'border-green-500/20 text-green-500 hover:bg-green-500/10'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate Account' : 'Reactivate Account'}
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
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any account card to manage login permissions, configuration credentials, and upgrade/downgrade access roles.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
