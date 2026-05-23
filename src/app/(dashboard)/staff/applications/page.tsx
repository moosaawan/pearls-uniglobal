'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  FileText, Search, GraduationCap, Clock, Check, X, ShieldAlert, Award, ChevronRight,
  TrendingUp, MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'

const statusConfig: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  under_review: { label: 'Under Review', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  accepted: { label: 'Accepted', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  visa_applied: { label: 'Visa Applied', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
}

const mockApplications = [
  {
    id: 'app-1',
    student: 'Moosa Khan',
    university: 'University of Manchester',
    program: 'MSc Computer Science',
    status: 'under_review',
    progress: 60,
    intake: 'Sep 2026',
    submittedAt: '2 weeks ago',
  },
  {
    id: 'app-2',
    student: 'Ayesha Rahman',
    university: 'University of Leeds',
    program: 'MBA',
    status: 'accepted',
    progress: 100,
    intake: 'Jan 2027',
    submittedAt: '1 month ago',
  },
  {
    id: 'app-3',
    student: 'Zainab Fatima',
    university: 'University of Birmingham',
    program: 'MSc Data Science',
    status: 'submitted',
    progress: 40,
    intake: 'Sep 2026',
    submittedAt: 'Just now',
  },
]

export default function StaffApplicationsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const handleUpdateStatus = (id: string, newStatus: string, name: string) => {
    toast.success(`Application status for ${name} updated to ${newStatus.replace('_', ' ')}!`)
  }

  const handleSaveNotes = (id: string) => {
    toast.success('Counselor notes saved successfully.')
    setNotes('')
  }

  const filtered = mockApplications.filter((a) => {
    const matchesSearch =
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.university.toLowerCase().includes(search.toLowerCase()) ||
      a.program.toLowerCase().includes(search.toLowerCase())
    
    if (tab === 'all') return matchesSearch
    return matchesSearch && a.status === tab
  })

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-gold" /> Applications Queue
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Review active university admissions, issue CAS updates, and trace visa pipeline cases</p>
        </div>
      </motion.div>

      {/* Search & Tabs */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, university, course..."
            className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="all" className="rounded-lg text-xs font-sans">All Applications</TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-lg text-xs font-sans">Submitted</TabsTrigger>
            <TabsTrigger value="under_review" className="rounded-lg text-xs font-sans">Under Review</TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-lg text-xs font-sans">Accepted</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-sans text-sm">No applications found in this queue.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((app) => (
              <motion.div key={app.id} variants={fadeUp}>
                <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${selectedApp === app.id ? 'border-gold bg-gold/5' : ''}`}
                  onClick={() => setSelectedApp(app.id === selectedApp ? null : app.id)}
                >
                  <CardContent className="p-5 font-sans text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-navy/5 dark:bg-navy-light/10 flex items-center justify-center text-navy dark:text-gold shrink-0 border border-border/30">
                          <GraduationCap className="w-5.5 h-5.5" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div>
                            <h4 className="font-bold text-foreground text-base leading-tight group-hover:text-gold transition-colors">{app.university}</h4>
                            <p className="text-xs font-semibold text-gold mt-0.5">{app.student} • <span className="font-normal text-muted-foreground">{app.program}</span></p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Submitted {app.submittedAt}</span>
                            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />Intake: {app.intake}</span>
                          </div>

                          <div className="w-full pt-1.5">
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium text-foreground">{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-1.5" />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-start">
                        <Badge className={`text-[10px] py-0.5 px-2 ${statusConfig[app.status]?.color}`}>
                          {statusConfig[app.status]?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Sidebar Application Inspector */}
        <motion.div variants={fadeUp}>
          {selectedApp ? (
            (() => {
              const app = mockApplications.find((a) => a.id === selectedApp)
              if (!app) return null
              return (
                <Card className="border-gold/30 shadow-premium overflow-hidden font-sans text-sm text-foreground">
                  <div className="h-1.5 bg-gradient-gold" />
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <Badge className={`text-[10px] py-0.5 px-2 mb-2 ${statusConfig[app.status]?.color}`}>
                        {statusConfig[app.status]?.label}
                      </Badge>
                      <h4 className="font-bold text-foreground text-base leading-tight">{app.university}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{app.program}</p>
                    </div>

                    <div className="space-y-3.5 border-t border-border pt-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applicant Student:</span>
                        <span className="font-bold text-foreground">{app.student}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Intake Option:</span>
                        <span className="font-medium text-foreground">{app.intake}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admissions Phase:</span>
                        <span className="font-medium text-foreground">{app.progress}% (Reviewing transcripts)</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-gold" /> Counselor Review Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write down follow-ups or internal review logs..."
                        className="w-full min-h-[70px] p-2.5 border border-border/50 rounded-xl bg-background outline-none text-xs focus:border-gold"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveNotes(app.id)}
                        className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold rounded-lg h-8 text-[11px]"
                      >
                        Save internal notes
                      </Button>
                    </div>

                    <div className="pt-2 flex flex-col gap-2.5 border-t border-border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Admissions Action</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleUpdateStatus(app.id, 'accepted', app.student)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-9 text-xs flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(app.id, 'rejected', app.student)}
                          variant="outline"
                          className="border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl h-9 text-xs flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleUpdateStatus(app.id, 'under_review', app.student)}
                        variant="secondary"
                        className="w-full rounded-xl h-9 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-yellow-600" /> Keep under review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })()
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5 font-sans">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Application</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any university application card to review admission criteria, logs, and issue acceptance/rejection decisions.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
