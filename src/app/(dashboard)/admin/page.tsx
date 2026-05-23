'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users, FileText, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, GraduationCap, CheckCircle,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 }, { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 }, { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 }, { month: 'Aug', revenue: 85000 },
  { month: 'Sep', revenue: 91000 }, { month: 'Oct', revenue: 78000 },
  { month: 'Nov', revenue: 95000 }, { month: 'Dec', revenue: 102000 },
]

const applicationData = [
  { name: 'Accepted', value: 45, color: '#22C55E' },
  { name: 'Under Review', value: 25, color: '#3B82F6' },
  { name: 'Submitted', value: 15, color: '#D4AF37' },
  { name: 'Draft', value: 10, color: '#6B7280' },
  { name: 'Rejected', value: 5, color: '#EF4444' },
]

const recentLeads = [
  { name: 'Ali Hassan', email: 'ali@email.com', source: 'Website', status: 'new', date: '2 hrs ago' },
  { name: 'Fatima Zahra', email: 'fatima@email.com', source: 'WhatsApp', status: 'contacted', date: '5 hrs ago' },
  { name: 'Ahmed Raza', email: 'ahmed@email.com', source: 'Referral', status: 'qualified', date: '1 day ago' },
  { name: 'Sana Malik', email: 'sana@email.com', source: 'Website', status: 'new', date: '1 day ago' },
]

const statusColors: Record<string, string> = {
  new: 'bg-green-500/10 text-green-500',
  contacted: 'bg-blue-500/10 text-blue-500',
  qualified: 'bg-purple-500/10 text-purple-500',
}

export default function AdminDashboard() {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1 font-sans">Overview of your consultancy performance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: '2,547', trend: '+12%', up: true, bg: 'bg-blue-500/10', color: 'text-blue-500' },
          { icon: FileText, label: 'Applications', value: '384', trend: '+8%', up: true, bg: 'bg-green-500/10', color: 'text-green-500' },
          { icon: DollarSign, label: 'Revenue (PKR)', value: '12.5M', trend: '+15%', up: true, bg: 'bg-gold/10', color: 'text-gold' },
          { icon: CheckCircle, label: 'Visa Approvals', value: '98%', trend: '+2%', up: true, bg: 'bg-purple-500/10', color: 'text-purple-500' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <Card className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-sans">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1 font-sans">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.up ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                      <span className={`text-xs font-sans ${stat.up ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                      <span className="text-xs text-muted-foreground font-sans">vs last month</span>
                    </div>
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-sans">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value: unknown) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fill="url(#goldGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Status Pie */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-base font-sans">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={applicationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {applicationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {applicationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm font-sans">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Leads */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-sans">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Source</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-foreground">{lead.name}</td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{lead.email}</td>
                      <td className="py-3 px-2 text-muted-foreground">{lead.source}</td>
                      <td className="py-3 px-2">
                        <Badge className={`${statusColors[lead.status]} border-0 text-xs capitalize`}>{lead.status}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground text-xs">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
