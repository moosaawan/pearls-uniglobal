'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Image, File, CheckCircle, Clock, FolderOpen, Trash2, Eye, Download } from 'lucide-react'

const docTypes = [
  { id: 'all', label: 'All Files' },
  { id: 'passport', label: 'Passport' },
  { id: 'transcript', label: 'Transcripts' },
  { id: 'ielts_result', label: 'IELTS' },
  { id: 'sop', label: 'SOP' },
  { id: 'cv', label: 'CV' },
  { id: 'financial', label: 'Financial' },
]

const mockDocs = [
  { id: '1', name: 'Passport_scan.pdf', type: 'passport', size: '2.4 MB', verified: true, date: '3 days ago' },
  { id: '2', name: 'BSc_Transcript.pdf', type: 'transcript', size: '1.8 MB', verified: true, date: '5 days ago' },
  { id: '3', name: 'IELTS_Result.pdf', type: 'ielts_result', size: '680 KB', verified: false, date: '1 week ago' },
  { id: '4', name: 'Statement_of_Purpose.docx', type: 'sop', size: '45 KB', verified: false, date: '1 week ago' },
  { id: '5', name: 'CV_2026.pdf', type: 'cv', size: '120 KB', verified: true, date: '2 weeks ago' },
  { id: '6', name: 'Bank_Statement.pdf', type: 'financial', size: '3.1 MB', verified: false, date: '2 weeks ago' },
  { id: '7', name: 'Degree_Certificate.pdf', type: 'transcript', size: '1.2 MB', verified: true, date: '3 weeks ago' },
  { id: '8', name: 'Passport_Photo.jpg', type: 'passport', size: '450 KB', verified: true, date: '3 weeks ago' },
]

const fileIcon = (name: string) => {
  if (name.endsWith('.jpg') || name.endsWith('.png')) return Image
  if (name.endsWith('.pdf')) return FileText
  return File
}

export default function DocumentsPage() {
  const [tab, setTab] = useState('all')
  const filtered = tab === 'all' ? mockDocs : mockDocs.filter((d) => d.type === tab)

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm font-sans">Upload and manage your documents</p>
        </div>
        <Button className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-sans"><Upload className="w-4 h-4 mr-2" /> Upload File</Button>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeUp}>
        <Card className="border-dashed border-2 border-gold/30 bg-gold/5 hover:bg-gold/10 transition-colors cursor-pointer">
          <CardContent className="p-8 text-center">
            <Upload className="w-10 h-10 mx-auto text-gold mb-3" />
            <h3 className="font-semibold text-foreground font-sans mb-1">Drag & drop files here</h3>
            <p className="text-sm text-muted-foreground font-sans">or click to browse. Supports PDF, DOC, JPG, PNG (Max 10MB)</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap">
            {docTypes.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="rounded-lg text-xs font-sans">{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          const Icon = fileIcon(doc.name)
          return (
            <motion.div key={doc.id} variants={fadeUp}>
              <Card className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300 group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate font-sans">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground font-sans">{doc.size}</span>
                      <span className="text-xs text-muted-foreground font-sans">{doc.date}</span>
                      {doc.verified ? (
                        <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] font-sans"><CheckCircle className="w-2.5 h-2.5 mr-1" />Verified</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-0 text-[10px] font-sans"><Clock className="w-2.5 h-2.5 mr-1" />Pending</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8"><Eye className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8"><Download className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
