'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Megaphone, Plus, Search, Filter, Phone, Mail, Clock, MessageSquare, ChevronRight,
  TrendingUp, User, Globe, ArrowRight, ShieldAlert, Award
} from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED'
  preferredCountry: string
  ielts: string
  gpa: string
  notes: string
}

const initialLeads: Lead[] = [
  { id: 'lead-1', name: 'Zeeshan Ali', email: 'zeeshan@gmail.com', phone: '+92 333 1112223', source: 'Facebook Ads', status: 'NEW', preferredCountry: 'United Kingdom', ielts: 'Preparing', gpa: '3.4/4.0', notes: 'Interested in MSc Management.' },
  { id: 'lead-2', name: 'Fatima Nisar', email: 'fatima.n@outlook.com', phone: '+92 345 4445556', source: 'Website Assessment', status: 'CONTACTED', preferredCountry: 'United Kingdom', ielts: '7.0', gpa: '3.6/4.0', notes: 'High GPA, already has IELTS, pre-approved for top 20 UK Universities.' },
  { id: 'lead-3', name: 'Usman Bashir', email: 'usman.b@gmail.com', phone: '+92 300 7778889', source: 'WhatsApp Referral', status: 'QUALIFIED', preferredCountry: 'Australia', ielts: '6.5', gpa: '2.9/4.0', notes: 'Budget around 20k AUD. Needs scholarship guidance.' },
  { id: 'lead-4', name: 'Amina Shah', email: 'amina.s@yahoo.com', phone: '+92 321 8889990', source: 'Google Search', status: 'CONVERTED', preferredCountry: 'United Kingdom', ielts: '7.5', gpa: '3.8/4.0', notes: 'Converted to student portal. Started application for Manchester.' },
]

const columns: { status: Lead['status']; label: string; bg: string; text: string }[] = [
  { status: 'NEW', label: 'New Lead', bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-500' },
  { status: 'CONTACTED', label: 'Contacted', bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-600' },
  { status: 'QUALIFIED', label: 'Qualified', bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-500' },
  { status: 'CONVERTED', label: 'Converted', bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-500' },
]

export default function StaffLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [showAddLead, setShowAddLead] = useState(false)
  
  // New Lead Form States
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newCountry, setNewCountry] = useState('United Kingdom')
  const [newNotes, setNewNotes] = useState('')

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault()
    const newLd: Lead = {
      id: `lead-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      source: 'Manual entry',
      status: 'NEW',
      preferredCountry: newCountry,
      ielts: 'Not started',
      gpa: 'N/A',
      notes: newNotes,
    }
    setLeads([newLd, ...leads])
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setNewNotes('')
    setShowAddLead(false)
    toast.success(`${newName} added as a New Lead!`)
  }

  const handleUpdateStatus = (id: string, nextStatus: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: nextStatus } : l))
    toast.success(`Lead moved to ${nextStatus.toLowerCase()} column!`)
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.preferredCountry.toLowerCase().includes(search.toLowerCase())
  )

  const selectedLead = leads.find(l => l.id === selectedLeadId)

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-gold" /> CRM Pipeline
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage potential students, log initial contacts, and convert qualified leads to active student profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddLead(!showAddLead)}
            className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl font-sans text-xs h-10 px-4"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Lead Card
          </Button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads by name or country..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      {/* Add Lead Form Block */}
      {showAddLead && (
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <Card className="border-gold/30 shadow-premium">
            <CardContent className="p-5 font-sans text-sm text-foreground space-y-4">
              <h3 className="font-bold text-base text-foreground">Create New Lead</h3>
              <form onSubmit={handleCreateLead} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-muted-foreground">Full Name</label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Zeeshan" className="h-10 rounded-lg" required />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-muted-foreground">Phone Number</label>
                    <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+92 333 1234567" className="h-10 rounded-lg" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-muted-foreground">Email Address</label>
                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="name@email.com" className="h-10 rounded-lg" required />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-xs text-muted-foreground">Preferred Study Country</label>
                    <Input value={newCountry} onChange={e => setNewCountry(e.target.value)} placeholder="United Kingdom" className="h-10 rounded-lg" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-xs text-muted-foreground">Initial Assessment Notes</label>
                  <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Wants to study undergraduate Business administration. Has questions about IELTS waivers." className="w-full min-h-[70px] p-2.5 border border-border/50 rounded-xl bg-background text-xs focus:border-gold outline-none" />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddLead(false)} className="flex-1 rounded-xl h-10 text-xs">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs">Add to CRM Pipeline</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colLeads = filtered.filter(l => l.status === col.status)
          return (
            <Card key={col.status} className="border-border/50 bg-muted/20 pb-4 h-full min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0">
                <span className="font-bold text-xs text-foreground font-sans tracking-wide uppercase">{col.label}</span>
                <Badge variant="outline" className={`text-[10px] font-sans font-bold h-5 px-2 ${col.bg} ${col.text}`}>
                  {colLeads.length}
                </Badge>
              </div>

              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px] no-scrollbar">
                {colLeads.map((ld) => (
                  <motion.div key={ld.id} variants={fadeUp} onClick={() => setSelectedLeadId(ld.id === selectedLeadId ? null : ld.id)} className="cursor-pointer">
                    <Card className={`border-border/40 hover:border-gold/30 hover:shadow-premium shadow-sm bg-background transition-all duration-300 ${selectedLeadId === ld.id ? 'border-gold bg-gold/5' : ''}`}>
                      <CardContent className="p-4 font-sans text-xs text-foreground space-y-2.5">
                        <div className="flex items-start justify-between gap-2.5">
                          <h4 className="font-bold text-foreground leading-tight text-[13px] group-hover:text-gold transition-colors">{ld.name}</h4>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 border-border/30 bg-muted/40 font-normal">{ld.source}</Badge>
                        </div>

                        <div className="space-y-1.5 text-muted-foreground text-[11px]">
                          <p className="flex items-center gap-1"><Globe className="w-3 h-3 text-gold" /> {ld.preferredCountry}</p>
                          <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ld.phone}</p>
                        </div>

                        {col.status !== 'CONVERTED' && (
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2.5">
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Quick Move:</span>
                            <Button
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                const nextStat: Record<string, Lead['status']> = {
                                  NEW: 'CONTACTED',
                                  CONTACTED: 'QUALIFIED',
                                  QUALIFIED: 'CONVERTED',
                                }
                                handleUpdateStatus(ld.id, nextStat[col.status])
                              }}
                              className="w-6 h-6 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-navy border border-gold/20"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Selected Lead Drawer/Sidebar preview */}
      {selectedLead && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
          <Card className="border-gold/30 shadow-premium overflow-hidden font-sans text-sm text-foreground">
            <div className="h-1.5 bg-gradient-gold" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                    {selectedLead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base leading-tight">{selectedLead.name}</h4>
                    <p className="text-xs text-muted-foreground">{selectedLead.email} • Source: {selectedLead.source}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] py-0.5 px-2 ${columns.find(col => col.status === selectedLead.status)?.bg} ${columns.find(col => col.status === selectedLead.status)?.text}`}>
                  {selectedLead.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3.5 border-t border-border pt-4 text-xs font-sans text-muted-foreground">
                <div className="flex justify-between"><span>Phone:</span><span className="font-medium text-foreground">{selectedLead.phone}</span></div>
                <div className="flex justify-between"><span>Study Target:</span><span className="font-medium text-foreground">{selectedLead.preferredCountry}</span></div>
                <div className="flex justify-between"><span>GPA:</span><span className="font-medium text-foreground">{selectedLead.gpa}</span></div>
                <div className="flex justify-between"><span>IELTS Status:</span><span className="font-bold text-gold">{selectedLead.ielts}</span></div>
              </div>

              <div className="border-t border-border pt-4 space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Lead Activity Notes</label>
                <p className="text-xs text-muted-foreground bg-muted/40 border border-border/20 rounded-lg p-2.5 italic">
                  &ldquo;{selectedLead.notes}&rdquo;
                </p>
              </div>

              <div className="pt-2.5 border-t border-border flex gap-2">
                <Button
                  onClick={() => handleUpdateStatus(selectedLead.id, 'CONVERTED')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 text-xs"
                >
                  Convert to student portal
                </Button>
                <Button
                  onClick={() => setSelectedLeadId(null)}
                  variant="outline"
                  className="flex-1 border-border/50 hover:bg-muted text-foreground rounded-xl h-10 text-xs"
                >
                  Close panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
