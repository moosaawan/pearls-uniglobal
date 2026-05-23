'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar as CalendarIcon, Clock, User, Video, Plus, CheckCircle, ArrowRight,
  RefreshCw, MapPin
} from 'lucide-react'
import { toast } from 'sonner'

export default function StaffCalendarPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      type: 'CONSULTATION',
      student: 'Moosa Khan',
      scheduledAt: 'May 25, 2026 at 3:00 PM',
      status: 'CONFIRMED',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: 'apt-2',
      type: 'IELTS_COUNSELING',
      student: 'Ayesha Rahman',
      scheduledAt: 'May 26, 2026 at 11:30 AM',
      status: 'CONFIRMED',
      meetingUrl: 'https://meet.google.com/xyz-pdqr-wst',
    },
    {
      id: 'apt-3',
      type: 'INTERVIEW_PREP',
      student: 'Zainab Fatima',
      scheduledAt: 'May 28, 2026 at 2:00 PM',
      status: 'SCHEDULED',
      meetingUrl: 'https://meet.google.com/mno-pqrs-tuv',
    },
  ])

  const handleComplete = (id: string, name: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'COMPLETED' } : a))
    toast.success(`Session for ${name} marked as completed!`)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-gold" /> Counseling Calendar
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage your daily counseling appointments, mock IELTS reviews, and student check-ins</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Calendar visual placeholder */}
        <motion.div variants={fadeUp} className="lg:col-span-1 space-y-4">
          <Card className="border-border/50 shadow-sm p-4">
            <CardHeader className="p-0 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <span className="font-bold text-sm text-foreground">May 2026</span>
              <Badge variant="secondary" className="text-[10px] font-sans">Today: 22nd</Badge>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-sans">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <span key={day} className="font-semibold text-muted-foreground">{day}</span>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const dayNum = i + 1
                  const isToday = dayNum === 22
                  const hasApt = [25, 26, 28].includes(dayNum)
                  return (
                    <span
                      key={i}
                      className={`h-8 flex items-center justify-center rounded-lg font-medium transition-colors relative cursor-pointer ${
                        isToday ? 'bg-gold text-navy font-bold shadow-gold' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {dayNum}
                      {hasApt && !isToday && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />
                      )}
                    </span>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-sm font-sans tracking-wide text-foreground flex items-center gap-2">
            Today&apos;s Appointments & Schedule
          </h3>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="border-dashed border-2 border-border/40 text-center py-12">
                <CardContent>
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-sans text-sm">No appointments scheduled.</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((apt) => {
                const isCompleted = apt.status === 'COMPLETED'
                return (
                  <motion.div key={apt.id} variants={fadeUp}>
                    <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 ${isCompleted ? 'opacity-65' : ''}`}>
                      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-sm">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-navy/5 dark:bg-navy-light/10 text-navy dark:text-gold border-border/50 font-sans text-[9px] uppercase font-bold py-0.5 px-2">
                              {apt.type.replace('_', ' ')}
                            </Badge>
                            <Badge className={`text-[9px] px-2 py-0.5 ${apt.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                              {apt.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-foreground text-base leading-tight">Session with {apt.student}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.scheduledAt}</span>
                            </div>
                          </div>
                        </div>

                        {!isCompleted && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              asChild
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs h-9 px-3"
                            >
                              <a href={apt.meetingUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="w-3.5 h-3.5 mr-1" /> Launch Meet
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleComplete(apt.id, apt.student)}
                              className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl text-xs h-9 px-3"
                            >
                              Mark Done
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
