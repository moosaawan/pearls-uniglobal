'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, Calendar, Megaphone, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const fallbackAppointments = [
  { id: '1', name: 'Ali Hassan', type: 'Profile Assessment', time: '10:00 AM' },
  { id: '2', name: 'Sana Malik', type: 'Visa Guidance', time: '11:30 AM' },
  { id: '3', name: 'Usman Khan', type: 'Interview Prep', time: '2:00 PM' },
]

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    reviews: 0,
    appointments: 0,
    leads: 0,
  })
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const supabase = createClient()
      
      // 1. Fetch real assigned students (total students in system)
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      // 2. Fetch pending reviews (submitted applications)
      const { count: reviewCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })

      // 3. Fetch appointments
      const { count: aptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })

      // 4. Fetch leads
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      // 5. Fetch appointments list joined with profiles
      const { data: aptsData } = await supabase
        .from('appointments')
        .select('*, profile:profiles!user_id(full_name)')
        .order('scheduled_at', { ascending: true })
        .limit(5)

      setStats({
        students: studentCount || 0,
        reviews: reviewCount || 0,
        appointments: aptCount || 0,
        leads: leadsCount || 0,
      })

      if (aptsData && aptsData.length > 0) {
        // Map real appointments data
        const mapped = aptsData.map((a: any, i: number) => ({
          id: a.id,
          name: a.profile?.full_name || `Student ${i+1}`,
          type: a.type ? a.type.replace(/_/g, ' ') : 'Counseling Session',
          time: new Date(a.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        }))
        setAppointments(mapped)
      } else {
        setAppointments([])
      }

    } catch {
      setAppointments(fallbackAppointments)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Syncing staff dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1 font-sans">Your counseling overview for today</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchData(); }} className="rounded-xl flex items-center gap-2 font-sans border-border/50">
          <RefreshCw className="w-3.5 h-3.5" /> Sync Data
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Assigned Students', value: stats.students, bg: 'bg-blue-500/10', color: 'text-blue-500' },
          { icon: FileText, label: 'Pending Reviews', value: stats.reviews, bg: 'bg-yellow-500/10', color: 'text-yellow-600' },
          { icon: Calendar, label: "Today's Appointments", value: stats.appointments, bg: 'bg-green-500/10', color: 'text-green-500' },
          { icon: Megaphone, label: 'New Leads', value: stats.leads, bg: 'bg-purple-500/10', color: 'text-purple-500' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <Card className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-sans">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1 font-sans">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader><CardTitle className="text-base font-sans font-semibold">Today&apos;s Tasks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: 'Review Fatima\'s application documents', done: true },
                  { text: 'Schedule interview prep with Ahmed', done: false },
                  { text: 'Follow up with new leads from WhatsApp', done: false },
                  { text: 'Update CAS tracker for September intake', done: false },
                  { text: 'Send pre-departure info to approved students', done: true },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    {task.done ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className={`text-sm font-sans ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader><CardTitle className="text-base font-sans font-semibold">Upcoming Appointments</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((apt, idx) => (
                  <div key={apt.id || idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-foreground font-sans">{apt.name}</p>
                      <p className="text-xs text-muted-foreground font-sans">{apt.type}</p>
                    </div>
                    <Badge variant="outline" className="font-sans flex items-center gap-1"><Clock className="w-3 h-3 text-gold" />{apt.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
