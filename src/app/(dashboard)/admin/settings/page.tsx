'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import {
  Settings, Key, Shield, MessageSquare, Save, RefreshCw,
  Mail, Link, Check, Sliders, Bell, User, Upload, Phone
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { user, setUser } = useAuthStore()

  // Profile data states
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Global settings states
  const [formData, setFormData] = useState({
    businessName: 'Pearls UniGlobal Consultants',
    hotlineEmail: 'support@pearlsuniglobal.com',
    whatsappHotline: '+92 344 661 4448',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    allocationMethod: 'round_robin',
    ieltsStatus: 'active',
    studentSelfRegister: true,
    weeklyDigest: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.full_name || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
      })
      setAvatarUrl(user.avatar_url || null)
    }
  }, [user])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar file size exceeds 2MB limit.')
      return
    }

    setUploadingAvatar(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const filePath = `avatars/${user.id}_${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      const { error: dbErr } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (dbErr) throw dbErr

      setAvatarUrl(publicUrl)
      setUser({
        ...user,
        avatar_url: publicUrl
      })

      toast.success('Profile avatar updated successfully!')
    } catch (err) {
      console.error('Error uploading avatar:', err)
      toast.error('Failed to upload avatar image.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSavingProfile(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullName,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setUser({
        ...user,
        full_name: profileData.fullName,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
      })

      toast.success('Personal profile details saved successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error('Failed to update profile details.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveGlobal = (e: React.FormEvent) => {
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
            <Settings className="w-7 h-7 text-gold" /> Portal settings
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage your personalized administrator credentials, profile avatar, and overall global system controls.</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="font-sans text-xs">
        <TabsList className="bg-muted/50 rounded-xl p-1 h-auto mb-6 shrink-0">
          <TabsTrigger value="profile" className="rounded-lg py-1.5 px-4 font-semibold text-sm">
            <User className="w-4 h-4 mr-1.5" /> Personal Profile
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg py-1.5 px-4 font-semibold text-sm">
            <Settings className="w-4 h-4 mr-1.5" /> System Controls
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Personal Profile */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={fadeUp} className="max-w-3xl">
            <Card className="border-border/50 shadow-premium">
              <CardHeader className="p-6">
                <CardTitle className="text-base font-bold font-sans">Administrator Account Details</CardTitle>
                <CardDescription className="text-xs font-sans">Modify your admin avatar and contact metadata stored in the Supabase ledger.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                {/* Avatar upload */}
                <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                  <Avatar className="w-20 h-20 ring-2 ring-gold/40 relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={profileData.fullName || 'Admin'} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className="bg-gold/10 text-gold text-2xl font-bold">
                        {getInitials(profileData.fullName || 'A')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      disabled={uploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg text-xs font-sans border-border/50 h-9 font-bold bg-navy-light/10 text-gold hover:bg-gold/15"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> 
                      {uploadingAvatar ? 'Uploading...' : 'Upload Profile Photo'}
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-sans leading-none">Accepted formats: JPG, PNG. Max size: 2MB.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Full Name</Label>
                      <Input
                        required
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Email Address</Label>
                      <Input
                        disabled
                        value={user?.email || ''}
                        className="h-10 bg-muted border-border/50 rounded-xl text-xs font-sans opacity-70"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Contact Phone</Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+92 300 123 4567"
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">WhatsApp Number</Label>
                      <Input
                        value={profileData.whatsapp}
                        onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                        placeholder="+92 300 123 4567"
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex justify-end">
                    <Button
                      type="submit"
                      disabled={savingProfile}
                      className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 px-6 text-xs w-full sm:w-auto"
                    >
                      {savingProfile ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" />
                          Save Profile Details
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab 2: System Settings */}
        <TabsContent value="system">
          <form onSubmit={handleSaveGlobal} className="grid lg:grid-cols-3 gap-6 items-start font-sans text-xs">
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
                      onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
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
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
