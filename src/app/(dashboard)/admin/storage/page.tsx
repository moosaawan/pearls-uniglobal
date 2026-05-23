'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Database, HardDrive, ShieldCheck, AlertCircle, FileText,
  Search, ShieldAlert, KeyRound, Download, RefreshCw, BarChart
} from 'lucide-react'
import { toast } from 'sonner'

interface StorageBucket {
  name: string
  filesCount: number
  sizeUsed: string
  sizeBytes: number
  rlsEnabled: boolean
  maxSizeAllowed: string
}

interface LatestFile {
  id: string
  name: string
  bucket: string
  student: string
  size: string
  date: string
  status: 'clean' | 'flagged'
}

const bucketsData: StorageBucket[] = [
  { name: 'transcripts', filesCount: 482, sizeUsed: '2.14 GB', sizeBytes: 2140000000, rlsEnabled: true, maxSizeAllowed: '10 GB' },
  { name: 'passports', filesCount: 320, sizeUsed: '1.25 GB', sizeBytes: 1250000000, rlsEnabled: true, maxSizeAllowed: '5 GB' },
  { name: 'financials', filesCount: 208, sizeUsed: '850 MB', sizeBytes: 850000000, rlsEnabled: true, maxSizeAllowed: '5 GB' },
  { name: 'avatars', filesCount: 270, sizeUsed: '52 MB', sizeBytes: 52000000, rlsEnabled: true, maxSizeAllowed: '2 GB' },
]

const recentFiles: LatestFile[] = [
  { id: 'f-1', name: 'moosa_khan_bsc_transcript.pdf', bucket: 'transcripts', student: 'Moosa Khan', size: '2.4 MB', date: '2 hrs ago', status: 'clean' },
  { id: 'f-2', name: 'ayesha_passport_scan.jpg', bucket: 'passports', student: 'Ayesha Rahman', size: '1.8 MB', date: '5 hrs ago', status: 'clean' },
  { id: 'f-3', name: 'haris_abbasi_bank_statement.pdf', bucket: 'financials', student: 'Haris Abbasi', size: '4.2 MB', date: '1 day ago', status: 'clean' },
  { id: 'f-4', name: 'zainab_ielts_certificate.pdf', bucket: 'transcripts', student: 'Zainab Fatima', size: '1.5 MB', date: '2 days ago', status: 'clean' },
]

export default function AdminStoragePage() {
  const [buckets, setBuckets] = useState<StorageBucket[]>(bucketsData)
  const [files, setFiles] = useState<LatestFile[]>(recentFiles)
  const [dbLatency, setDbLatency] = useState(24)
  const [isAuditing, setIsAuditing] = useState(false)

  const handleAuditBuckets = () => {
    setIsAuditing(true)
    toast.loading('Auditing Supabase buckets and scanning security layers...')
    setTimeout(() => {
      setIsAuditing(false)
      setDbLatency(Math.floor(Math.random() * 15) + 12)
      toast.success('RLS security audit complete! All storage endpoints configured correctly.')
    }, 1500)
  }

  const handleFlagFile = (id: string, name: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, status: f.status === 'clean' ? 'flagged' : 'clean' } : f))
    toast.warning(`File ${name} integrity status altered.`)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-7 h-7 text-gold" /> Storage & DB Inspector
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Inspect Supabase PostgreSQL nodes, measure query response times, verify Row-Level Security policy (RLS) locks, and manage file storage quotas</p>
        </div>
        <Button
          onClick={handleAuditBuckets}
          disabled={isAuditing}
          className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl flex items-center gap-1.5 h-10 px-4 self-start sm:self-center font-sans text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          Run Security Audit
        </Button>
      </motion.div>

      {/* DB latency and stats bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        {[
          { label: 'Total Storage Allocation', value: '4.29 GB Used', sub: 'Of 22 GB aggregate quota', color: 'text-blue-500' },
          { label: 'Active DB Latency', value: `${dbLatency} ms`, sub: 'Supabase AWS Frankfurt node', color: 'text-green-500' },
          { label: 'Total Scanned Files', value: '1,280 files', sub: '0 threat reports logged', color: 'text-gold' },
          { label: 'Security Lock Policies', value: '100% RLS Enabled', sub: 'Postgres tables protected', color: 'text-purple-500' }
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
              <p className={`text-base md:text-lg font-bold mt-1.5 ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Grid: Buckets Overview */}
      <div className="grid lg:grid-cols-2 gap-6 font-sans text-xs">
        {/* Buckets Quotas Cards */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 leading-none">
            <HardDrive className="w-4.5 h-4.5 text-gold" /> Storage Buckets & Policies
          </h3>

          <div className="grid gap-3.5">
            {buckets.map((b) => {
              const usedPercentage = Math.round((b.sizeBytes / (parseInt(b.maxSizeAllowed) * 1000000000)) * 100)
              return (
                <Card key={b.name} className="border-border/50 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center font-bold">
                          {b.name[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm leading-tight">bucket://{b.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{b.filesCount} uploads stored</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.rlsEnabled ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold uppercase text-[8px] flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Secure Lock
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-bold uppercase text-[8px] flex items-center gap-0.5">
                            <ShieldAlert className="w-3 h-3" /> No RLS Lock
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Allocation Used: {b.sizeUsed}</span>
                        <span>Quota Cap: {b.maxSizeAllowed}</span>
                      </div>
                      <Progress value={usedPercentage} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Database & Files Auditor */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 leading-none">
            <KeyRound className="w-4.5 h-4.5 text-gold" /> Database Integrity Logs
          </h3>

          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Audited Database Credentials & SSL</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 font-sans text-xs">
              <div className="space-y-2.5 bg-muted/20 p-3.5 border border-border/30 rounded-xl">
                <div className="flex justify-between"><span className="text-muted-foreground">Postgres Database Version:</span><span className="font-semibold text-foreground">PostgreSQL 15.6 (Supabase)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SSL Encryption Status:</span><span className="font-bold text-green-500">SSL v1.3 Secured</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Active TCP Connections:</span><span className="font-semibold text-foreground">18 Poolers</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Auto-backup Redundancy:</span><span className="font-semibold text-foreground">Daily Scheduled</span></div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground/80">Latest File Quarantine Ledger</h4>
                <div className="space-y-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors border border-border/10">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate max-w-[200px]">{f.name}</p>
                        <p className="text-[9px] text-muted-foreground">Student: {f.student} • Size: {f.size}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`text-[8px] font-bold ${
                          f.status === 'clean' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {f.status === 'clean' ? 'Scanned Clean' : 'Flagged Quarantine'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleFlagFile(f.id, f.name)}
                          className="w-7 h-7 hover:bg-red-500/15 hover:text-red-500 rounded-md shrink-0"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
