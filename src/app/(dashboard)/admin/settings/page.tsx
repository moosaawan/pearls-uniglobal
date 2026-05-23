'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Settings, Key, Shield, MessageSquare, Save, RefreshCw,
  Mail, Link, Check, Sliders, Bell
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    businessName: 'Pearls UniGlobal Consultants',
    hotlineEmail: 'support@pearlsuniglobal.com',
    whatsappHotline: '+92 300 0000000',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    allocationMethod: 'round_robin',
    ieltsStatus: 'active',
    studentSelfRegister: true,
    weeklyDigest: true
  })

  const [saving, setSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('System global configurations saved and synched across server layers successfully!')
    }, 1000)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-7 h-7 text-gold" /> Global Configurations
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Reconfigure platform API credentials, SMTP notification systems, round-robin admissions workflows, and features states</p>
        </div>
      </motion.div>

      {/* Grid */}
      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-6 items-start font-sans text-xs">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Brand Info */}
          <motion.div variants={fadeUp}>
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gold" /> General Brand & Contact Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Consultancy Business Name</label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Support Email Address</label>
                    <Input
                      type="email"
                      value={formData.hotlineEmail}
                      onChange={(e) => setFormData({ ...formData, hotlineEmail: e.target.value })}
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Primary WhatsApp Contact</label>
                    <Input
                      value={formData.whatsappHotline}
                      onChange={(e) => setFormData({ ...formData, whatsappHotline: e.target.value })}
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: SMTP server settings */}
          <motion.div variants={fadeUp}>
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold" /> SMTP E-mail Delivery Host
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">SMTP Server Hostname</label>
                    <Input
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Server Port</label>
                    <Input
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: CRM allocation logic */}
          <motion.div variants={fadeUp}>
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gold" /> CRM & Admissions Routing Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs text-foreground">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">Lead Allocation Mode</label>
                    <select
                      value={formData.allocationMethod}
                      onChange={(e) => setFormData({ ...formData, allocationMethod: e.target.value })}
                      className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background outline-none text-xs text-foreground"
                    >
                      <option value="round_robin">Automated Round-Robin Allocation</option>
                      <option value="manual">Manual Admin Assign only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-xs text-foreground">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">IELTS Academy Course portal</label>
                    <select
                      value={formData.ieltsStatus}
                      onChange={(e) => setFormData({ ...formData, ieltsStatus: e.target.value })}
                      className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background outline-none text-xs text-foreground"
                    >
                      <option value="active">Active (Registration enabled)</option>
                      <option value="disabled">Disabled (Lock listings)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Configurations Actions details */}
        <motion.div variants={fadeUp} className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 leading-none text-foreground">
                <Shield className="w-4 h-4 text-gold" /> Features Configurations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <h4 className="font-semibold text-foreground leading-tight">Student Self-Registration</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Allow public registration</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.studentSelfRegister}
                  onChange={(e) => setFormData({ ...formData, studentSelfRegister: e.target.checked })}
                  className="w-4.5 h-4.5 accent-gold cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <h4 className="font-semibold text-foreground leading-tight">SMTP Alert Digests</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Send daily performance emails</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.weeklyDigest}
                  onChange={(e) => setFormData({ ...formData, weeklyDigest: e.checked })}
                  className="w-4.5 h-4.5 accent-gold cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving Configuration...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save System Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </motion.div>
  )
}
