'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, Search, Filter, Phone, Mail, GraduationCap, CheckCircle, Clock, Eye, Check, X
} from 'lucide-react'
import { toast } from 'sonner'

const mockStudents = [
  {
    id: 'std-1',
    name: 'Moosa Khan',
    email: 'moosa.khan@gmail.com',
    phone: '+92 321 4567890',
    preferredCourse: 'MSc Computer Science',
    university: 'University of Manchester',
    gpa: '3.7 / 4.0',
    ielts: '7.5',
    docsStatus: 'Pending Review',
    statusBadge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  },
  {
    id: 'std-2',
    name: 'Ayesha Rahman',
    email: 'ayesha.r@outlook.com',
    phone: '+92 300 9876543',
    preferredCourse: 'MBA',
    university: 'University of Leeds',
    gpa: '3.9 / 4.0',
    ielts: '8.0',
    docsStatus: 'Verified',
    statusBadge: 'bg-green-500/10 text-green-500 border-green-500/20',
  },
  {
    id: 'std-3',
    name: 'Zainab Fatima',
    email: 'zainab.fatima@yahoo.com',
    phone: '+92 312 3456789',
    preferredCourse: 'MSc Data Science',
    university: 'University of Birmingham',
    gpa: '3.5 / 4.0',
    ielts: '7.0',
    docsStatus: 'Uploaded',
    statusBadge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
]

export default function StaffStudentsPage() {
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const handleVerifyDocs = (id: string, name: string) => {
    toast.success(`Documents for ${name} have been marked as fully verified!`)
  }

  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.preferredCourse.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-gold" /> Student Registry
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Manage your assigned students, review their academic profiles, and verify their uploads</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, email, course..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      {/* Table List */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-sans text-sm">No students found matching search filters.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((s) => (
              <motion.div key={s.id} variants={fadeUp}>
                <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${selectedStudent === s.id ? 'border-gold bg-gold/5' : ''}`}
                  onClick={() => setSelectedStudent(s.id === selectedStudent ? null : s.id)}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-sm">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold font-sans">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-base group-hover:text-gold transition-colors leading-tight">{s.name}</h4>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground font-sans pt-1">
                        <div><p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">Course</p><p className="font-medium text-foreground mt-0.5">{s.preferredCourse}</p></div>
                        <div><p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">University</p><p className="font-medium text-foreground mt-0.5">{s.university}</p></div>
                        <div className="hidden sm:block"><p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">GPA</p><p className="font-medium text-foreground mt-0.5">{s.gpa}</p></div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2.5 shrink-0 self-end sm:self-center">
                      <Badge className={`text-[10px] py-0.5 px-2 ${s.statusBadge}`}>
                        {s.docsStatus}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs text-gold font-sans h-8 px-2 hover:bg-gold/10 rounded-lg">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Sidebar Quick Details */}
        <motion.div variants={fadeUp}>
          {selectedStudent ? (
            (() => {
              const std = mockStudents.find((s) => s.id === selectedStudent)
              if (!std) return null
              return (
                <Card className="border-gold/30 shadow-premium bg-background overflow-hidden font-sans text-sm text-foreground">
                  <div className="h-1.5 bg-gradient-gold" />
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg">
                        {std.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base leading-tight">{std.name}</h4>
                        <p className="text-xs text-muted-foreground">{std.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 border-t border-border pt-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <span className="font-medium text-foreground">{std.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Academic GPA:</span>
                        <span className="font-medium text-foreground">{std.gpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IELTS Band:</span>
                        <span className="font-bold text-gold">{std.ielts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target Country:</span>
                        <span className="font-medium text-foreground">United Kingdom</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Document Checklist</p>
                      {[
                        { doc: 'Passport Copy', done: true },
                        { doc: 'Transcript Transcript', done: true },
                        { doc: 'IELTS Results Form', done: std.docsStatus === 'Verified' },
                        { doc: 'Statement of Purpose', done: false },
                      ].map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-sans">
                          <span className="text-muted-foreground">{doc.doc}</span>
                          <Badge className={doc.done ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
                            {doc.done ? 'Uploaded' : 'Missing'}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col gap-2.5">
                      <Button
                        onClick={() => handleVerifyDocs(std.id, std.name)}
                        className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs"
                      >
                        Verify Documents
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border/50 hover:bg-muted text-foreground rounded-xl h-10 text-xs"
                      >
                        Request Documents update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })()
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5 font-sans">
                <Users className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select a Student</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any student card to review their active academic profile and documents verification list.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
