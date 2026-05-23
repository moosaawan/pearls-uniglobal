'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { getInitials } from '@/lib/utils'
import { User, Lock, Bell, Shield, Upload, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 max-w-3xl">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm font-sans">Manage your account and preferences</p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-muted/50 rounded-xl p-1 h-auto">
          <TabsTrigger value="profile" className="rounded-lg font-sans text-sm"><User className="w-3.5 h-3.5 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg font-sans text-sm"><Lock className="w-3.5 h-3.5 mr-1.5" />Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg font-sans text-sm"><Bell className="w-3.5 h-3.5 mr-1.5" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gold/10 text-gold text-xl font-bold font-sans">
                    {getInitials(user?.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="rounded-lg font-sans"><Upload className="w-3.5 h-3.5 mr-1.5" />Upload Photo</Button>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">JPG, PNG. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans">Full Name</Label>
                  <Input defaultValue={user?.full_name || ''} className="mt-1.5 h-11 rounded-xl font-sans" />
                </div>
                <div>
                  <Label className="font-sans">Email</Label>
                  <Input defaultValue={user?.email || ''} disabled className="mt-1.5 h-11 rounded-xl font-sans" />
                </div>
                <div>
                  <Label className="font-sans">Phone</Label>
                  <Input defaultValue={user?.phone || ''} placeholder="+92 300 000 0000" className="mt-1.5 h-11 rounded-xl font-sans" />
                </div>
                <div>
                  <Label className="font-sans">WhatsApp</Label>
                  <Input defaultValue={user?.whatsapp || ''} placeholder="WhatsApp number" className="mt-1.5 h-11 rounded-xl font-sans" />
                </div>
              </div>
              <Button className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-sans"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-foreground font-sans">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div><Label className="font-sans">Current Password</Label><Input type="password" className="mt-1.5 h-11 rounded-xl font-sans" /></div>
                <div><Label className="font-sans">New Password</Label><Input type="password" className="mt-1.5 h-11 rounded-xl font-sans" /></div>
                <div><Label className="font-sans">Confirm New Password</Label><Input type="password" className="mt-1.5 h-11 rounded-xl font-sans" /></div>
              </div>
              <Button className="bg-navy hover:bg-navy-light text-white rounded-xl font-sans">Update Password</Button>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground font-sans text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mt-1 font-sans">Once you delete your account, there is no going back.</p>
                <Button variant="destructive" size="sm" className="mt-3 rounded-xl font-sans">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {[
                { label: 'Application Updates', desc: 'Get notified when your application status changes', on: true },
                { label: 'Document Verification', desc: 'Notifications when documents are verified', on: true },
                { label: 'Appointment Reminders', desc: 'Reminders for upcoming appointments', on: true },
                { label: 'Promotional Emails', desc: 'Scholarship opportunities and newsletters', on: false },
                { label: 'SMS Notifications', desc: 'Receive updates via SMS', on: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm font-sans">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-sans">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
