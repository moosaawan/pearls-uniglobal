'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/authStore'
import Link from 'next/link'
import {
  FileText, FolderOpen, GraduationCap, Calendar,
  Clock, ArrowRight, Upload, BookOpen, Plus, Bell,
  CheckCircle, AlertCircle, TrendingUp,
} from 'lucide-react'

const quickActions = [
  { icon: Plus, label: 'New Application', href: '/student/applications', color: 'bg-blue-500/10 text-blue-500' },
  { icon: Upload, label: 'Upload Document', href: '/student/documents', color: 'bg-green-500/10 text-green-500' },
  { icon: Calendar, label: 'Book Appointment', href: '/student/appointments', color: 'bg-purple-500/10 text-purple-500' },
  { icon: BookOpen, label: 'IELTS Resources', href: '/student/ielts', color: 'bg-orange-500/10 text-orange-500' },
]

const recentActivity = [
  { icon: CheckCircle, text: 'Profile assessment completed', time: '2 hours ago', color: 'text-green-500' },
  { icon: FileText, text: 'Application to University of Manchester submitted', time: '1 day ago', color: 'text-blue-500' },
  { icon: Upload, text: 'Passport copy uploaded', time: '2 days ago', color: 'text-purple-500' },
  { icon: Bell, text: 'Welcome to Pearls UniGlobal!', time: '3 days ago', color: 'text-gold' },
]

export default function StudentDashboard() {
  const { user } = useAuthStore()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="text-gold">{user?.full_name?.split(' ')[0] || 'Student'}</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-sans">
          Here&apos;s an overview of your study abroad journey.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Applications', value: '2', trend: '+1 this month', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: FolderOpen, label: 'Documents', value: '8', trend: '3 verified', color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: GraduationCap, label: 'Universities', value: '5', trend: 'Saved', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { icon: Calendar, label: 'Appointments', value: '1', trend: 'Upcoming', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <Card className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-sans">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1 font-sans">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                    </p>
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

      {/* Profile Completion + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-base font-sans">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-gold"
                      strokeDasharray={`${65 * 2.2} ${100 * 2.2}`} strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-sans text-foreground">65%</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-sans">Complete your profile to get better recommendations</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Basic Info', done: true },
                  { label: 'Education', done: true },
                  { label: 'Documents', done: false },
                  { label: 'Preferences', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-sans">
                    {item.done ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-base font-sans">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => (
                  <Link key={idx} href={action.href}>
                    <div className="p-4 rounded-xl border border-border/50 hover:border-gold/30 hover:shadow-sm transition-all duration-300 group cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-foreground text-sm font-sans group-hover:text-gold transition-colors">{action.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity + Application Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-sans">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs font-sans">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-sans">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-sans flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Progress */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-sans">Application Progress</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs font-sans">
                <Link href="/student/applications">View All <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm font-sans">University of Manchester</h4>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs font-sans">Under Review</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 font-sans">MSc Computer Science • Sep 2026</p>
                  <Progress value={60} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2 font-sans">Step 3 of 5: Document verification</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm font-sans">University of Leeds</h4>
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs font-sans">Draft</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 font-sans">MBA • Jan 2027</p>
                  <Progress value={20} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2 font-sans">Step 1 of 5: Personal information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
