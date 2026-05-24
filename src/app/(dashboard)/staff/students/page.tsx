'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import {
  Users, Search, Phone, Mail, GraduationCap, CheckCircle, Clock, Eye, ShieldAlert, Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function StaffStudentsPage() {
  const { user: staffUser } = useAuthStore()
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Details for sidebar
  const [selectedStudentData, setSelectedStudentData] = useState<any | null>(null)
  const [selectedStudentDocs, setSelectedStudentDocs] = useState<any[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*, student_profile:student_profiles(*)')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      console.error('Error fetching students:', err)
      toast.error('Failed to load student list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Fetch documents and details when a student is selected
  useEffect(() => {
    if (!selectedStudent) {
      setSelectedStudentData(null)
      setSelectedStudentDocs([])
      return
    }

    const fetchStudentDetails = async () => {
      setLoadingDetails(true)
      try {
        const supabase = createClient()
        
        // 1. Get profile + academic details
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*, student_profile:student_profiles(*)')
          .eq('id', selectedStudent)
          .single()

        if (profileErr) throw profileErr
        setSelectedStudentData(profileData)

        // 2. Get documents
        const { data: docsData, error: docsErr } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', selectedStudent)

        if (docsErr) throw docsErr
        setSelectedStudentDocs(docsData || [])
      } catch (err) {
        console.error('Error loading student details:', err)
        toast.error('Could not load student profile details.')
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchStudentDetails()
  }, [selectedStudent])

  const handleVerifyDocs = async (id: string, name: string) => {
    if (!staffUser) return
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .update({
          verified: true,
          verified_by: staffUser.id,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', id)

      if (error) throw error

      toast.success(`All uploaded documents for ${name} have been marked as verified!`)
      // Refresh documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', id)
      setSelectedStudentDocs(docsData || [])
      
      // Refresh students registry to update indicators
      fetchStudents()
    } catch (err) {
      console.error('Error verifying docs:', err)
      toast.error('Failed to verify documents.')
    }
  }

  const filtered = students.filter((s) => {
    const term = search.toLowerCase()
    const nameMatch = s.full_name?.toLowerCase().includes(term) || false
    const emailMatch = s.email?.toLowerCase().includes(term) || false
    const courseMatch = s.student_profile?.desired_degree?.toLowerCase().includes(term) || false
    const uniMatch = s.student_profile?.preferred_country?.toLowerCase().includes(term) || false
    return nameMatch || emailMatch || courseMatch || uniMatch
  })

  // Get status indicators for registry list
  const getDocumentStatus = (studentId: string) => {
    // Check if we already loaded it for the active selection
    if (selectedStudent === studentId) {
      if (selectedStudentDocs.length === 0) return { text: 'No Uploads', badge: 'bg-gray-500/10 text-gray-500 border-gray-500/20' }
      const allVerified = selectedStudentDocs.every(d => d.verified)
      if (allVerified) return { text: 'Verified', badge: 'bg-green-500/10 text-green-500 border-green-500/20' }
      return { text: 'Pending Review', badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' }
    }
    return { text: 'Registered', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
  }

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

      {/* Registry Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground text-sm font-sans">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold mb-2" />
              Loading student records...
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-sans text-sm">No students found matching search filters.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((s) => {
              const status = getDocumentStatus(s.id)
              const initials = s.full_name
                ? s.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                : 'ST'
              const profile = s.student_profile

              return (
                <motion.div key={s.id} variants={fadeUp}>
                  <Card
                    className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${selectedStudent === s.id ? 'border-gold bg-gold/5' : ''}`}
                    onClick={() => setSelectedStudent(s.id === selectedStudent ? null : s.id)}
                  >
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-sm">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold font-sans">
                            {initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-base group-hover:text-gold transition-colors leading-tight">{s.full_name || 'Anonymous Student'}</h4>
                            <p className="text-xs text-muted-foreground">{s.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground font-sans pt-1">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">Desired Degree</p>
                            <p className="font-medium text-foreground mt-0.5">{profile?.desired_degree || 'Unspecified'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">Intake Preference</p>
                            <p className="font-medium text-foreground mt-0.5">{profile?.preferred_intake || 'Unspecified'}</p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none">Academic GPA</p>
                            <p className="font-medium text-foreground mt-0.5">{profile?.gpa || 'Not Available'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end gap-2.5 shrink-0 self-end sm:self-center">
                        <Badge className={`text-[10px] py-0.5 px-2 ${status.badge}`}>
                          {status.text}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-xs text-gold font-sans h-8 px-2 hover:bg-gold/10 rounded-lg">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Sidebar Details Panel */}
        <motion.div variants={fadeUp}>
          {selectedStudent ? (
            loadingDetails ? (
              <Card className="border-border/50 text-center py-16 px-4 shadow-sm bg-muted/10">
                <CardContent className="space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
                  <p className="text-xs text-muted-foreground">Loading counselor assessment...</p>
                </CardContent>
              </Card>
            ) : selectedStudentData ? (
              (() => {
                const std = selectedStudentData
                const profile = std.student_profile
                const initials = std.full_name
                  ? std.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                  : 'ST'
                
                return (
                  <Card className="border-gold/30 shadow-premium bg-background overflow-hidden font-sans text-sm text-foreground">
                    <div className="h-1.5 bg-gradient-gold" />
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg font-sans">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-base leading-tight">{std.full_name || 'Anonymous Student'}</h4>
                          <p className="text-xs text-muted-foreground">{std.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3.5 border-t border-border pt-4 text-xs font-sans">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone Number:</span>
                          <span className="font-medium text-foreground">{std.phone || 'No phone'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Academic Institution:</span>
                          <span className="font-medium text-foreground text-right max-w-[150px] truncate">{profile?.institution || 'Unspecified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">GPA / Qualification:</span>
                          <span className="font-medium text-foreground">{profile?.last_qualification} ({profile?.gpa || 'N/A'})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IELTS Band:</span>
                          <span className="font-bold text-gold">{profile?.ielts_score || 'Not taken'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Destination:</span>
                          <span className="font-medium text-foreground">{profile?.preferred_country || 'United Kingdom'}</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-border pt-4 font-sans">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Document Checklist</p>
                        {selectedStudentDocs.length === 0 ? (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                            No files uploaded by student yet.
                          </p>
                        ) : (
                          selectedStudentDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-sans">
                              <span className="text-muted-foreground truncate max-w-[150px]">{doc.name}</span>
                              <Badge className={doc.verified ? 'bg-green-500/10 text-green-500 border-green-500/20 border-0' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 border-0'}>
                                {doc.verified ? 'Verified' : 'Pending'}
                              </Badge>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2 flex flex-col gap-2.5">
                        <Button
                          disabled={selectedStudentDocs.length === 0 || selectedStudentDocs.every(d => d.verified)}
                          onClick={() => handleVerifyDocs(std.id, std.full_name || 'Student')}
                          className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs font-sans"
                        >
                          Verify Uploaded Documents
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
            )
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
