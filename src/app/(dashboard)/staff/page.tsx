'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, Calendar, Megaphone, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function StaffDashboard() {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-1 font-sans">Your counseling overview for today</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Assigned Students', value: '24', bg: 'bg-blue-500/10', color: 'text-blue-500' },
          { icon: FileText, label: 'Pending Reviews', value: '7', bg: 'bg-yellow-500/10', color: 'text-yellow-600' },
          { icon: Calendar, label: "Today's Appointments", value: '3', bg: 'bg-green-500/10', color: 'text-green-500' },
          { icon: Megaphone, label: 'New Leads', value: '5', bg: 'bg-purple-500/10', color: 'text-purple-500' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <Card className="border-border/50 shadow-sm">
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
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader><CardTitle className="text-base font-sans">Today&apos;s Tasks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: 'Review Fatima\'s application documents', done: true },
                  { text: 'Schedule interview prep with Ahmed', done: false },
                  { text: 'Follow up with new leads from WhatsApp', done: false },
                  { text: 'Update CAS tracker for September intake', done: false },
                  { text: 'Send pre-departure info to approved students', done: true },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    {task.done ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className={`text-sm font-sans ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader><CardTitle className="text-base font-sans">Upcoming Appointments</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Ali Hassan', type: 'Profile Assessment', time: '10:00 AM' },
                  { name: 'Sana Malik', type: 'Visa Guidance', time: '11:30 AM' },
                  { name: 'Usman Khan', type: 'Interview Prep', time: '2:00 PM' },
                ].map((apt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm text-foreground font-sans">{apt.name}</p>
                      <p className="text-xs text-muted-foreground font-sans">{apt.type}</p>
                    </div>
                    <Badge variant="outline" className="font-sans"><Clock className="w-3 h-3 mr-1" />{apt.time}</Badge>
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
