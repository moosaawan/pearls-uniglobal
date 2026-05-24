'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar as CalendarIcon, Video, Clock, User, Plus, CheckCircle, ArrowRight,
  BookOpen, Star, RefreshCw, AlertCircle, XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'

const appointmentTypes = [
  { value: 'CONSULTATION', label: 'General Consultation', desc: 'Discuss study abroad plans, programs, and budgets' },
  { value: 'DOCUMENT_REVIEW', label: 'Document Review', desc: 'Get your transcripts, SOP, and CV vetted by an expert' },
  { value: 'IELTS_COUNSELING', label: 'IELTS Counseling', desc: 'Assess your English skills and discuss study strategies' },
  { value: 'VISA_GUIDANCE', label: 'Visa Guidance', desc: 'Step-by-step assistance for your UK student visa process' },
  { value: 'INTERVIEW_PREP', label: 'Mock Credibility Interview', desc: 'Simulated interview with detailed feedback' },
]

export default function AppointmentsPage() {
  const { user } = useAuthStore()
  const [showBook, setShowBook] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [type, setType] = useState('CONSULTATION')
  const [date, setDate] = useState('2026-05-28')
  const [time, setTime] = useState('14:30')
  const [notes, setNotes] = useState('')
  const [appointments, setAppointments] = useState<any[]>([])

  const fetchAppointments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_at', { ascending: false })

      if (error) throw error

      if (data) {
        const mapped = data.map((a: any) => ({
          id: a.id,
          type: (a.type || 'consultation').toUpperCase(),
          scheduledAt: new Date(a.scheduled_at).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          counselor: 'Sarah Ahmed (Senior Counselor)',
          status: (a.status || 'scheduled').toUpperCase(),
          meetingUrl: a.meeting_url || null,
          notes: a.notes || '',
        }))
        setAppointments(mapped)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    
    try {
      const supabase = createClient()
      const scheduledDateTime = `${date}T${time}:00`
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          type: type.toLowerCase() as any,
          scheduled_at: scheduledDateTime,
          duration: 30,
          status: 'scheduled',
          notes: notes || null,
          meeting_url: 'https://meet.google.com/xyz-pdqr-wst'
        })

      if (error) throw error

      toast.success('Appointment booked successfully! A calendar invite has been sent to your email.')
      setShowBook(false)
      setNotes('')
      fetchAppointments()
    } catch (err) {
      console.error(err)
      toast.error('Failed to book appointment in database.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string, typeVal: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a))
      toast.success(`Session for ${typeVal.replace('_', ' ')} cancelled.`)
    } catch {
      toast.error('Failed to cancel appointment.')
    }
  }

  if (loadingList) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Syncing your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-gold" /> Appointments
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage your counseling sessions, credibility mock interviews, and coaching sessions</p>
        </div>
        {!showBook && (
          <Button
            onClick={() => setShowBook(true)}
            className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl font-sans"
          >
            <Plus className="w-4 h-4 mr-2" /> Book counseling session
          </Button>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {showBook ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/50 shadow-premium">
                <CardHeader>
                  <CardTitle className="text-base font-sans">Book a New Session</CardTitle>
                  <CardDescription className="text-xs font-sans">Choose your session type, preferred slot, and share notes with your assigned counselor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBook} className="space-y-4 font-sans text-sm text-foreground">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Session Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                      >
                        {appointmentTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {appointmentTypes.find((t) => t.value === type)?.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-xs text-muted-foreground">Preferred Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-xs text-muted-foreground">Preferred Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Notes for Counselor (Optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What specific questions do you have? Let us know..."
                        className="w-full min-h-[80px] p-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBook(false)}
                        className="flex-1 rounded-xl h-11 border-border/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-11"
                      >
                        {loading ? 'Scheduling...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          <div className="space-y-4">
            <h3 className="font-semibold text-sm font-sans tracking-wide text-foreground flex items-center gap-2">
              Scheduled Sessions
            </h3>
            {appointments.length === 0 ? (
              <Card className="border-dashed border-2 border-border/40 text-center py-12">
                <CardContent>
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-sans text-sm">No scheduled sessions found.</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((apt) => {
                const isUpcoming = apt.status === 'CONFIRMED' || apt.status === 'SCHEDULED'
                const isCancelled = apt.status === 'CANCELLED'
                return (
                  <motion.div key={apt.id} variants={fadeUp}>
                    <Card className={`border-border/50 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-premium ${isCancelled ? 'opacity-65' : ''}`}>
                      <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 font-sans text-sm">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <Badge variant="outline" className="bg-navy/5 dark:bg-navy-light/10 text-navy dark:text-gold border-border/50 font-sans text-[10px] uppercase font-bold py-0.5 px-2">
                              {apt.type.replace('_', ' ')}
                            </Badge>
                            <Badge
                              className={`text-[10px] px-2 py-0.5 ${
                                apt.status === 'CONFIRMED'
                                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                  : apt.status === 'SCHEDULED'
                                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  : apt.status === 'CANCELLED'
                                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {apt.status}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <p className="font-bold text-foreground text-base leading-snug">
                              {appointmentTypes.find((t) => t.value === apt.type)?.label || apt.type}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.scheduledAt}</span>
                              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{apt.counselor}</span>
                            </div>
                          </div>

                          {apt.notes && (
                            <p className="text-xs text-muted-foreground bg-muted/30 border border-border/20 rounded-lg p-2.5 italic">
                              &ldquo;{apt.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {isUpcoming && !isCancelled && (
                          <div className="flex md:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0">
                            {apt.meetingUrl && (
                              <Button
                                asChild
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs flex-1 h-9 px-4"
                              >
                                <a href={apt.meetingUrl} target="_blank" rel="noopener noreferrer">
                                  <Video className="w-3.5 h-3.5 mr-1.5" /> Join Meet
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(apt.id, apt.type)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 rounded-xl text-xs flex-1 h-9 px-3"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Session
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

        {/* Sidebar counseling stats */}
        <motion.div variants={fadeUp} className="space-y-5">
          <Card className="border-border/50 shadow-sm bg-gradient-to-b from-navy to-navy-dark text-white overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-gold">My counselor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm font-sans">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center font-bold text-gold text-lg shrink-0 border border-gold/30">
                  SA
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah Ahmed</h4>
                  <p className="text-xs text-white/60">Senior Study Abroad Counselor</p>
                </div>
              </div>
              
              <div className="space-y-2.5 text-xs text-white/70 border-t border-white/10 pt-3">
                <div className="flex justify-between"><span>Placements:</span><span className="font-bold text-white">450+ students</span></div>
                <div className="flex justify-between"><span>Specialization:</span><span className="font-bold text-white">Russell Group, MBA</span></div>
                <div className="flex justify-between"><span>Active Cases:</span><span className="font-bold text-white">12 students</span></div>
              </div>
              
              <Button
                asChild
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs"
              >
                <a href={`https://wa.me/923000000000`} target="_blank" rel="noopener noreferrer">
                  Contact on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2.5 font-sans leading-relaxed">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>Confirmations are instant and virtual meetings take place over Google Meet/Zoom.</span>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Please cancel or reschedule at least 4 hours in advance if you cannot make it.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
