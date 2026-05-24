'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Plus, GraduationCap, Calendar, MapPin, ArrowRight, FileText, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  under_review: { label: 'Under Review', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  accepted: { label: 'Accepted', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  visa_applied: { label: 'Visa Applied', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  visa_approved: { label: 'Visa Approved', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  visa_rejected: { label: 'Visa Rejected', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  enrolled: { label: 'Enrolled', color: 'bg-gold/10 text-gold border-gold/20' },
}

interface Application {
  id: string
  university: string
  program: string
  status: string
  progress: number
  intake: string
  location: string
  submitted: string | null
}

export default function ApplicationsPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('all')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchApplications = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('applications')
          .select('*, university:universities(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          const mapped: Application[] = data.map((app: any) => {
            const statusVal = app.status || 'draft'
            let progressVal = 20
            if (statusVal === 'submitted') progressVal = 40
            else if (statusVal === 'under_review') progressVal = 60
            else if (statusVal === 'accepted') progressVal = 80
            else if (statusVal === 'visa_applied' || statusVal === 'visa_approved' || statusVal === 'enrolled') progressVal = 100

            return {
              id: app.id,
              university: app.university?.name || 'UK University',
              program: app.program_name,
              status: statusVal,
              progress: progressVal,
              intake: app.preferred_intake || 'September 2026',
              location: app.university ? `${app.university.city}, ${app.university.country}` : 'United Kingdom',
              submitted: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : null
            }
          })
          setApplications(mapped)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  const filtered = tab === 'all' ? applications : applications.filter((a) => a.status === tab)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Syncing your applications...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground text-sm font-sans">Track and manage your university applications</p>
        </div>
        <Button className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-sans">
          <Plus className="w-4 h-4 mr-2" /> New Application
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap">
            {['all', 'draft', 'submitted', 'under_review', 'accepted', 'rejected'].map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-lg capitalize text-xs font-sans">{t.replace('_', ' ')}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp}>
            <Card className="border-dashed border-2 border-border">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">No Applications Found</h3>
                <p className="text-muted-foreground text-sm font-sans mb-4">Start a new application to begin your journey</p>
                <Button className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-sans"><Plus className="w-4 h-4 mr-2" /> Start Application</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          filtered.map((app) => (
            <motion.div key={app.id} variants={fadeUp}>
              <Card className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 dark:bg-navy-light/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 text-navy dark:text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-foreground font-sans">{app.university}</h3>
                          <p className="text-sm text-muted-foreground font-sans">{app.program}</p>
                        </div>
                        <Badge className={`${statusConfig[app.status]?.color} text-xs font-sans shrink-0`}>
                          {statusConfig[app.status]?.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground font-sans">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{app.intake}</span>
                        {app.submitted && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Submitted {app.submitted}</span>}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-sans">Progress</span>
                          <span className="font-medium text-foreground font-sans">{app.progress}%</span>
                        </div>
                        <Progress value={app.progress} className="h-1.5" />
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors hidden md:block" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
