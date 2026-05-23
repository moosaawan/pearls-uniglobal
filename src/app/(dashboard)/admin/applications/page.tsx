'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText, Search, GraduationCap, Clock, Filter, Trash2, ShieldAlert,
  ArrowRight, ShieldCheck, User
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminApp {
  id: string
  student: string
  counselor: string
  university: string
  program: string
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected'
  progress: number
  intake: string
  submittedAt: string
}

const initialApps: AdminApp[] = [
  { id: 'app-1', student: 'Moosa Khan', counselor: 'Sarah Ahmed', university: 'University of Oxford', program: 'MSc Computer Science', status: 'under_review', progress: 65, intake: 'Sep 2026', submittedAt: '2 weeks ago' },
  { id: 'app-2', student: 'Ayesha Rahman', counselor: 'Sarah Ahmed', university: 'University of Cambridge', program: 'MBA', status: 'accepted', progress: 100, intake: 'Jan 2027', submittedAt: '1 month ago' },
  { id: 'app-3', student: 'Zainab Fatima', counselor: 'Ali Raza', university: 'University of Manchester', program: 'MSc Data Science', status: 'draft', progress: 20, intake: 'Sep 2026', submittedAt: '' },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  under_review: { label: 'Under Review', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  accepted: { label: 'Accepted', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<AdminApp[]>(initialApps)
  const [search, setSearch] = useState('')
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const handleUpdateStatus = (id: string, name: string, stat: AdminApp['status']) => {
    setApps(apps.map(a => a.id === id ? { ...a, status: stat, progress: stat === 'accepted' ? 100 : a.progress } : a))
    toast.success(`Application status for ${name} updated to ${stat.replace('_', ' ')}!`)
  }

  const handleDelete = (id: string) => {
    setApps(apps.filter(a => a.id !== id))
    setSelectedAppId(null)
    toast.success('Application record removed.')
  }

  const filtered = apps.filter(a =>
    a.student.toLowerCase().includes(search.toLowerCase()) ||
    a.university.toLowerCase().includes(search.toLowerCase()) ||
    a.counselor.toLowerCase().includes(search.toLowerCase())
  )

  const selectedApp = apps.find(a => a.id === selectedAppId)

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-gold" /> Master Admissions Ledger
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Monitor all university admissions cases, reassign student profiles to counselors, and view global enrollments</p>
        </div>
      </motion.div>

      {/* Search Filter */}
      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, university, counselor..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-sans text-sm">No applications matching search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((a) => (
              <motion.div key={a.id} variants={fadeUp}>
                <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${selectedAppId === a.id ? 'border-gold bg-gold/5' : ''}`}
                  onClick={() => setSelectedAppId(a.id === selectedAppId ? null : a.id)}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-border/30">
                        <GraduationCap className="w-5 h-5 text-navy dark:text-gold" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">{a.university}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium truncate font-sans">
                          Student: <span className="text-foreground font-semibold">{a.student}</span> • Counselor: <span className="text-gold font-semibold">{a.counselor}</span>
                        </p>
                        <div className="w-full pt-1">
                          <Progress value={a.progress} className="h-1" />
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 ${statusConfig[a.status]?.color}`}>
                        {statusConfig[a.status]?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Sidebar Inspector Panel */}
        <motion.div variants={fadeUp}>
          {selectedApp ? (
            <Card className="border-gold/30 shadow-premium overflow-hidden font-sans text-sm text-foreground bg-background">
              <div className="h-1.5 bg-gradient-gold" />
              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge className={`text-[9px] py-0.5 px-2 mb-2 ${statusConfig[selectedApp.status]?.color}`}>
                    {statusConfig[selectedApp.status]?.label}
                  </Badge>
                  <h4 className="font-bold text-foreground text-base leading-tight font-sans">{selectedApp.university}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedApp.program}</p>
                </div>

                <div className="space-y-3.5 border-t border-border pt-4 text-xs font-sans text-muted-foreground">
                  <div className="flex justify-between"><span>Applicant Student:</span><span className="font-bold text-foreground">{selectedApp.student}</span></div>
                  <div className="flex justify-between"><span>Assigned Counselor:</span><span className="font-semibold text-gold">{selectedApp.counselor}</span></div>
                  <div className="flex justify-between"><span>Intake Semester:</span><span className="font-medium text-foreground">{selectedApp.intake || 'N/A'}</span></div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Configure Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['under_review', 'accepted', 'rejected'].map((stVal) => (
                      <Button
                        key={stVal}
                        size="sm"
                        variant={selectedApp.status === stVal ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.student, stVal as any)}
                        className={`capitalize h-8 text-[10px] rounded-lg font-sans ${
                          selectedApp.status === stVal && stVal === 'accepted' ? 'bg-green-600 hover:bg-green-700 text-white' :
                          selectedApp.status === stVal && stVal === 'rejected' ? 'bg-red-500 hover:bg-red-600 text-white' :
                          selectedApp.status === stVal ? 'bg-gold text-navy hover:bg-gold/90' : ''
                        }`}
                      >
                        {stVal.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-border flex flex-col gap-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">ERP record commands</p>
                  <Button
                    onClick={() => handleDelete(selectedApp.id)}
                    variant="outline"
                    className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl h-9 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Admissions Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5 font-sans">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Admissions Case</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any record card to inspect applicant history, configure assigned counselor records, or delete files.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
