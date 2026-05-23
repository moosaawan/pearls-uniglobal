'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3, TrendingUp, Users, Calendar, Trophy,
  DollarSign, Sparkles, CheckCircle2, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, Cell,
  PieChart, Pie
} from 'recharts'

const funnelData = [
  { stage: 'Inquiries', count: 1200 },
  { stage: 'Contacted', count: 850 },
  { stage: 'Qualified', count: 540 },
  { stage: 'Applications', count: 320 },
  { stage: 'Visa Approved', count: 148 },
]

const channelData = [
  { name: 'WhatsApp', value: 450, color: '#22C55E' },
  { name: 'Website Form', value: 310, color: '#3B82F6' },
  { name: 'Facebook CRM', value: 240, color: '#6366F1' },
  { name: 'Direct Referral', value: 120, color: '#D4AF37' },
  { name: 'Instagram DM', value: 80, color: '#EC4899' },
]

const counselorData = [
  { name: 'Sarah Ahmed', cases: 82, approved: 79 },
  { name: 'Ali Raza', cases: 65, approved: 61 },
  { name: 'Bilal Qureshi', cases: 48, approved: 42 },
]

const monthlyTrends = [
  { month: 'Jan', approvals: 12, applicationCost: 4500 },
  { month: 'Feb', approvals: 15, applicationCost: 5200 },
  { month: 'Mar', approvals: 18, applicationCost: 4900 },
  { month: 'Apr', approvals: 25, applicationCost: 6100 },
  { month: 'May', approvals: 30, applicationCost: 6500 },
  { month: 'Jun', approvals: 48, applicationCost: 8900 },
]

export default function AdminAnalyticsPage() {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-gold" /> System Analytics & Reports
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Evaluate organizational conversion metrics, acquisition efficiency, counselor success, and enrollment forecasts</p>
        </div>
      </motion.div>

      {/* Analytics Highlights */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        {[
          { label: 'Avg Funnel Conversion', value: '12.3%', detail: '+1.4% this month', color: 'text-green-500' },
          { label: 'Top Acquisition Channel', value: 'WhatsApp (42%)', detail: 'Organic traffic growth', color: 'text-gold' },
          { label: 'Counselor Success Rate', value: '94.2%', detail: 'Avg response time <1hr', color: 'text-blue-500' },
          { label: 'Monthly Visa approvals', value: '148 Students', detail: '98.5% historical rate', color: 'text-purple-500' }
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
              <p className={`text-base md:text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Grid: Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 font-sans">
        {/* Conversion Funnel */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" /> Lead Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis dataKey="stage" type="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#D4AF37" radius={[0, 6, 6, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={index} fill={index === 4 ? '#22C55E' : '#D4AF37'} fillOpacity={1 - index * 0.15} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acquisition Pie */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" /> Acquisition Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col justify-between h-[280px]">
              <div className="relative w-full h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                      {channelData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-border/50">
                {channelData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grid: Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 font-sans">
        {/* Visa Approvals trend */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Monthly Visa Success Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="approvals" stroke="#22C55E" fill="url(#greenArea)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Counselors Performance */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Counselor Performance Index
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={counselorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                  <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="cases" name="Assigned Cases" fill="#D4AF37" opacity={0.6} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Successful Visas" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
