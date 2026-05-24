'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Megaphone, Search, ArrowRight, UserPlus, Phone, Mail,
  Calendar, Trash2, CheckCircle2, RefreshCw, Filter, Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  source: 'WhatsApp' | 'Website' | 'Facebook' | 'Referral' | 'Instagram'
  status: string
  intendedDegree: string
  assignedCounselor: string
  assignedCounselorId?: string
  createdAt: string
  notes: string
}

const sourceColors: Record<string, string> = {
  WhatsApp: 'bg-green-500/10 text-green-500 border-green-500/20',
  Website: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Facebook: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  Referral: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Instagram: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'New Lead', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  contacted: { label: 'Contacted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  qualified: { label: 'Qualified', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  proposal: { label: 'Proposal', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  negotiation: { label: 'Negotiation', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  converted: { label: 'Converted', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  lost: { label: 'Lost', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>([])
  const [search, setSearch] = useState('')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLeadsAndStaff = async () => {
    try {
      const supabase = createClient()
      
      // 1. Fetch counselors list
      const { data: staffData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('role', ['staff', 'admin', 'super_admin'])
      
      if (staffData) {
        setStaffList(staffData.map(s => ({ id: s.id, name: s.full_name || 'Anonymous' })))
      }

      // 2. Fetch leads
      const { data: leadsData, error } = await supabase
        .from('leads')
        .select('*, counselor:profiles!counselor_id(full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (leadsData) {
        const mappedLeads: Lead[] = leadsData.map((l: any) => ({
          id: l.id,
          name: l.full_name,
          email: l.email,
          phone: l.phone || '',
          whatsapp: l.whatsapp || (l.phone ? `https://wa.me/${l.phone.replace(/[^0-9]/g, '')}` : ''),
          source: (l.source || 'Website') as any,
          status: l.status || 'new',
          intendedDegree: l.desired_degree || 'Unspecified',
          assignedCounselor: l.counselor?.full_name || 'Unassigned',
          assignedCounselorId: l.counselor_id || '',
          createdAt: new Date(l.created_at).toLocaleDateString(),
          notes: l.notes || ''
        }))
        setLeads(mappedLeads)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to sync CRM records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeadsAndStaff()
  }, [])

  const handleUpdateStatus = async (id: string, name: string, stat: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .update({ status: stat, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setLeads(leads.map(l => l.id === id ? { ...l, status: stat } : l))
      toast.success(`Lead ${name} is now marked as "${stat.replace('_', ' ')}"!`)
    } catch {
      toast.error('Failed to update lead status in database.')
    }
  }

  const handleReassignCounselor = async (id: string, name: string, counselorId: string, counselorName: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .update({ counselor_id: counselorId || null, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setLeads(leads.map(l => l.id === id ? { ...l, assignedCounselor: counselorName, assignedCounselorId: counselorId } : l))
      toast.success(`Assigned counselor for ${name} updated to ${counselorName}!`)
    } catch {
      toast.error('Failed to update assigned counselor.')
    }
  }

  const handleConvertToStudent = async (id: string, name: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .update({ status: 'converted', converted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setLeads(leads.map(l => l.id === id ? { ...l, status: 'converted' } : l))
      toast.success(`🎉 Lead ${name} upgraded to Student Profile successfully!`)
    } catch {
      toast.error('Failed to convert lead.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error

      setLeads(leads.filter(l => l.id !== id))
      setSelectedLeadId(null)
      toast.success('Lead record deleted from database.')
    } catch {
      toast.error('Failed to delete lead record.')
    }
  }

  const filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.intendedDegree.toLowerCase().includes(search.toLowerCase())
    const matchesSource = filterSource === 'all' || l.source === filterSource
    return matchesSearch && matchesSource
  })

  const selectedLead = leads.find(l => l.id === selectedLeadId)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Syncing CRM records...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-gold" /> CRM & System Leads
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Track global inquiries, evaluate acquisition pipelines, and dispatch tasks directly to counseling officers</p>
        </div>
      </motion.div>

      {/* Stats Counter Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
        {[
          { label: 'Total Leads', value: leads.length, bg: 'bg-blue-500/10', text: 'text-blue-500' },
          { label: 'Unassigned/New', value: leads.filter(l => l.status === 'new').length, bg: 'bg-purple-500/10', text: 'text-purple-500' },
          { label: 'Active Pipeline', value: leads.filter(l => l.status === 'in_progress' || l.status === 'contacted').length, bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
          { label: 'Success (Converted)', value: leads.filter(l => l.status === 'converted').length, bg: 'bg-green-500/10', text: 'text-green-500' },
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center font-bold text-sm ${item.text}`}>
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prospective leads by name, academic goal..."
            className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto font-sans text-xs">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-foreground w-full sm:w-40"
          >
            <option value="all">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Website">Website</option>
            <option value="Facebook">Facebook</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
      </motion.div>

      {/* Main Grid: List + Inspector */}
      <div className="grid lg:grid-cols-3 gap-6 items-start font-sans">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No leads match the specified query.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((l) => (
              <motion.div key={l.id} variants={fadeUp}>
                <Card
                  onClick={() => setSelectedLeadId(l.id === selectedLeadId ? null : l.id)}
                  className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${
                    selectedLeadId === l.id ? 'border-gold bg-gold/5' : ''
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-border/30">
                        {l.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">
                          {l.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">
                          Course Goal: <span className="text-foreground font-semibold">{l.intendedDegree}</span>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge variant="outline" className={`text-[8px] uppercase font-bold py-0.2 px-1.5 ${sourceColors[l.source]}`}>
                            {l.source}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Officer: <span className="font-medium text-foreground">{l.assignedCounselor}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 ${statusConfig[l.status]?.color}`}>
                        {statusConfig[l.status]?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Lead Inspector Details Panel */}
        <motion.div variants={fadeUp}>
          {selectedLead ? (
            <Card className="border-gold/30 shadow-premium overflow-hidden text-sm text-foreground bg-background">
              <div className="h-1.5 bg-gradient-gold" />
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                    {selectedLead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm leading-tight">{selectedLead.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{selectedLead.email}</p>
                  </div>
                </div>

                {/* Contact options */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs rounded-xl flex items-center justify-center gap-1 bg-green-500/5 hover:bg-green-500/10 border-green-500/20 text-green-600"
                    asChild
                  >
                    <a href={selectedLead.whatsapp} target="_blank" rel="noopener noreferrer">
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs rounded-xl flex items-center justify-center gap-1 border-border/50 text-muted-foreground"
                    asChild
                  >
                    <a href={`mailto:${selectedLead.email}`}>
                      <Mail className="w-3.5 h-3.5" /> Send Email
                    </a>
                  </Button>
                </div>

                <div className="space-y-3.5 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Intended Intake:</span><span className="font-medium text-foreground">{selectedLead.createdAt}</span></div>
                  <div className="flex justify-between"><span>Academic Goal:</span><span className="font-medium text-foreground text-right max-w-[150px] truncate">{selectedLead.intendedDegree}</span></div>
                  <div className="flex justify-between"><span>Acquisition Channel:</span><span className="font-medium text-foreground">{selectedLead.source}</span></div>
                  <div className="border-t border-border/50 pt-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Lead Notes</p>
                    <p className="text-[11px] text-foreground leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/30">{selectedLead.notes}</p>
                  </div>
                </div>

                {/* Assigned Counselor configuration */}
                <div className="space-y-2 border-t border-border pt-4 text-xs">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Assigned Counselor</label>
                  <select
                    value={selectedLead.assignedCounselorId || ''}
                    onChange={(e) => {
                      const selected = staffList.find(s => s.id === e.target.value);
                      handleReassignCounselor(selectedLead.id, selectedLead.name, e.target.value, selected ? selected.name : 'Unassigned');
                    }}
                    className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background outline-none focus:border-gold text-foreground"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Modify Status panel */}
                <div className="space-y-2 border-t border-border pt-4 text-xs">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Change Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'lost'] as string[]).map((st) => (
                      <Button
                        key={st}
                        size="sm"
                        variant={selectedLead.status === st ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedLead.id, selectedLead.name, st)}
                        className={`capitalize h-8 text-[10px] rounded-lg ${
                          selectedLead.status === st ? 'bg-gold text-navy hover:bg-gold/90' : 'border-border/50'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Upgrade to Student / Delete commands */}
                <div className="pt-4 border-t border-border flex flex-col gap-2">
                  <Button
                    onClick={() => handleConvertToStudent(selectedLead.id, selectedLead.name)}
                    disabled={selectedLead.status === 'converted'}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5 font-bold"
                  >
                    <UserPlus className="w-4 h-4" /> Convert to Active Student
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedLead.id)}
                    variant="outline"
                    className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Lead Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5">
                <Megaphone className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Lead Profile</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any pipeline inquiry to trace user notes, upgrade permissions, reallocate staff counselors, or delete files.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
