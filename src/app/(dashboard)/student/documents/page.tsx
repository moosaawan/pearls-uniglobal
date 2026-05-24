'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, Image, File, CheckCircle, Clock, Trash2, Eye, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const docTypes = [
  { id: 'all', label: 'All Files' },
  { id: 'passport', label: 'Passport' },
  { id: 'transcript', label: 'Transcripts' },
  { id: 'ielts_result', label: 'IELTS' },
  { id: 'sop', label: 'SOP' },
  { id: 'cv', label: 'CV' },
  { id: 'financial', label: 'Financial' },
  { id: 'other', label: 'Other' },
]

const fileIcon = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) return Image
  if (lower.endsWith('.pdf')) return FileText
  return File
}

export default function DocumentsPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('all')
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState('passport')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocs = async () => {
    if (!user) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocs(data || [])
    } catch (err) {
      console.error('Error fetching docs:', err)
      toast.error('Failed to load documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!user || !selectedFile) return
    setUploading(true)
    
    try {
      const supabase = createClient()
      
      // 1. Upload to storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${selectedType}_${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadErr) throw uploadErr

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)
      
      const fileUrl = urlData.publicUrl

      // 3. Insert Database Record
      const { error: dbErr } = await supabase
        .from('documents')
        .insert([
          {
            user_id: user.id,
            name: selectedFile.name,
            type: selectedType,
            file_url: fileUrl,
            file_size: selectedFile.size,
            mime_type: selectedFile.type,
            verified: false,
          }
        ])

      if (dbErr) throw dbErr

      toast.success('Document uploaded successfully! It is pending counselor verification.')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchDocs()
    } catch (err) {
      console.error('Error uploading doc:', err)
      toast.error('Failed to upload document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      const supabase = createClient()
      
      // Extract file path from public URL
      const pathParts = fileUrl.split('/documents/')
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        await supabase.storage.from('documents').remove([filePath])
      }
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)

      if (error) throw error

      toast.success('Document deleted successfully.')
      fetchDocs()
    } catch (err) {
      console.error('Error deleting doc:', err)
      toast.error('Failed to delete document.')
    }
  }

  const filtered = tab === 'all' ? docs : docs.filter((d) => d.type === tab)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents Portal</h1>
          <p className="text-muted-foreground text-sm font-sans">Upload your transcripts, passports, and statements for visa assessment</p>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeUp}>
        <Card className="border-dashed border-2 border-gold/30 bg-gold/5 p-6 rounded-2xl relative">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Upload className="w-10 h-10 text-gold mb-3 animate-pulse" />
            
            <h3 className="font-semibold text-foreground font-sans mb-1 text-base">Select Document Type & File</h3>
            <p className="text-xs text-muted-foreground font-sans mb-4 text-center max-w-md">
              Please choose the correct type of document before uploading. Supports PDF, JPG, PNG, DOC (Max 10MB).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mb-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={uploading}
                className="flex-1 h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold font-sans"
              >
                <option value="passport">Passport Scan</option>
                <option value="transcript">Academic Transcript</option>
                <option value="degree">Degree Certificate</option>
                <option value="ielts_result">IELTS / English Test Result</option>
                <option value="sop">Statement of Purpose (SOP)</option>
                <option value="cv">Curriculum Vitae (CV)</option>
                <option value="financial">Financial / Bank Statement</option>
                <option value="other">Other Document</option>
              </select>

              <div className="flex-1 flex gap-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                  ref={fileInputRef}
                  className="hidden"
                  id="doc-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('doc-file-input')?.click()}
                  className="w-full h-11 rounded-xl border-border/50 hover:bg-muted font-sans text-sm"
                >
                  Choose File
                </Button>
              </div>
            </div>

            {selectedFile && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2.5 w-full max-w-md bg-background border border-border/50 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-sm text-foreground font-sans">
                  <FileText className="w-5 h-5 text-gold shrink-0" />
                  <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground font-sans shrink-0">({formatSize(selectedFile.size)})</span>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-10 w-full font-sans text-xs flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading Document...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Confirm & Upload
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex flex-wrap gap-1 border-0">
            {docTypes.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="rounded-lg text-xs font-sans py-1.5 px-3 border-0">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Documents Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm font-sans">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold mb-2" />
          Loading your document files...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2 border-border/40 text-center py-16">
          <CardContent>
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-sans text-sm">No documents found in this category.</p>
          </CardContent>
        </Card>
      ) : (
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
                        <span className="text-xs text-muted-foreground font-sans">{formatSize(doc.file_size || 0)}</span>
                        <span className="text-xs text-muted-foreground font-sans">
                          {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {doc.verified ? (
                          <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] font-sans">
                            <CheckCircle className="w-2.5 h-2.5 mr-1" />Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-0 text-[10px] font-sans">
                            <Clock className="w-2.5 h-2.5 mr-1" />Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                      <a href={doc.file_url} download={doc.name}>
                        <Button variant="ghost" size="icon" className="rounded-lg w-8 h-8">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id, doc.file_url)}
                        className="rounded-lg w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
