'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Settings, User, Lock, Bell, Shield, ArrowRight, Upload, Phone, Mail, Globe, Check
} from 'lucide-react'
import { toast } from 'sonner'

export default function StaffSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('Sarah Ahmed')
  const [phone, setPhone] = useState('+92 300 0000000')
  const [specialty, setSpecialty] = useState('Russell Group, MBA admissions')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      toast.success('Settings updated successfully!')
    }, 1000)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-gold" /> Counselor Profile Settings
        </h1>
        <p className="text-muted-foreground text-sm font-sans">Configure your counselor profile, set specialty listings, and edit contact information</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base font-sans">Account Profile Details</CardTitle>
            <CardDescription className="text-xs font-sans">These details are shown to assigned students in their portal overview cards.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 font-sans text-sm text-foreground">
              <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center font-bold text-xl shrink-0">
                  SA
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-sm">Counselor Avatar</h4>
                  <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg text-xs font-sans border-border/50">
                    <Upload className="w-3.5 h-3.5 mr-1" /> Upload Profile Image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-muted-foreground">Full Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} className="h-11 bg-background border-border/50 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-muted-foreground">Contact Phone</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-11 bg-background border-border/50 rounded-xl" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-muted-foreground">Counselor Specialization</label>
                <Input value={specialty} onChange={e => setSpecialty(e.target.value)} className="h-11 bg-background border-border/50 rounded-xl" required />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-11 px-6 text-xs sm:w-auto w-full"
                >
                  {loading ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
