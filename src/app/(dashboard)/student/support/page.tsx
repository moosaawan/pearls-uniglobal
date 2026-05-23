'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  HeadphonesIcon, MessageSquare, Plus, CheckCircle, Clock, AlertCircle, FileText,
  Search, ShieldQuestion, HelpCircle, ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  medium: { label: 'Medium', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  high: { label: 'High', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  RESOLVED: { label: 'Resolved', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
}

export default function SupportPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const [tickets, setTickets] = useState([
    {
      id: 'tkt-1',
      subject: 'IELTS score submission query',
      description: 'Can I upload my academic transcripts now and send my IELTS result later when it arrives?',
      status: 'RESOLVED',
      priority: 'low',
      createdAt: 'May 18, 2026',
      replies: [
        {
          author: 'Sarah Ahmed (Senior Counselor)',
          text: 'Yes, absolutely. Most UK universities will issue a conditional offer letter based on your academic transcripts. You can upload your IELTS results later to convert it to an unconditional offer.',
          time: '3 hours later',
        },
      ],
    },
    {
      id: 'tkt-2',
      subject: 'CAS Deposit and refund policy',
      description: 'What is the minimum CAS deposit required for University of Birmingham, and is it refundable if the visa is refused?',
      status: 'IN_PROGRESS',
      priority: 'high',
      createdAt: 'May 21, 2026',
      replies: [],
    },
  ])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const newTkt = {
        id: `tkt-${Date.now()}`,
        subject,
        description,
        status: 'OPEN',
        priority,
        createdAt: 'Just now',
        replies: [],
      }

      setTickets([newTkt, ...tickets])
      setLoading(false)
      setShowCreate(false)
      setSubject('')
      setDescription('')
      toast.success('Support ticket created successfully! A consultant will respond shortly.')
    }, 1200)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <HeadphonesIcon className="w-7 h-7 text-gold" /> Support Desk
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Reach out to our experts or resolve issues with documents, payments, or applications</p>
        </div>
        {!showCreate && (
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl font-sans"
          >
            <Plus className="w-4 h-4 mr-2" /> Open New Ticket
          </Button>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {showCreate ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/50 shadow-premium">
                <CardHeader>
                  <CardTitle className="text-base font-sans">Open a Support Ticket</CardTitle>
                  <CardDescription className="text-xs font-sans">Submit your request below, and the counselor assigned to your case will respond shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-4 font-sans text-sm text-foreground">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Subject / Query Topic</label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. CAS deposit query, document verification delay"
                        className="h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Priority Level</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                      >
                        <option value="low">Low - General query</option>
                        <option value="medium">Medium - Application problem</option>
                        <option value="high">High - Urgent (Visa, payment deadine)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Description of Query</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please details your issue or questions so that our counselors can help you efficiently..."
                        className="w-full min-h-[120px] p-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreate(false)}
                        className="flex-1 rounded-xl h-11 border-border/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-11"
                      >
                        {loading ? 'Submitting...' : 'Submit Support Ticket'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          <div className="space-y-4">
            <h3 className="font-semibold text-sm font-sans tracking-wide text-foreground flex items-center gap-2">
              Support History
            </h3>
            {tickets.length === 0 ? (
              <Card className="border-dashed border-2 border-border/40 text-center py-12">
                <CardContent>
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-sans text-sm">No support tickets found.</p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((tkt) => (
                <motion.div key={tkt.id} variants={fadeUp}>
                  <Card className="border-border/50 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-premium">
                    <CardContent className="p-5 space-y-4 font-sans text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`text-[10px] uppercase font-bold py-0.5 px-2 font-sans ${priorityConfig[tkt.priority]?.color}`}>
                            {priorityConfig[tkt.priority]?.label} Priority
                          </Badge>
                          <Badge className={`text-[10px] py-0.5 px-2 font-sans ${statusConfig[tkt.status]?.color}`}>
                            {statusConfig[tkt.status]?.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tkt.createdAt}</p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-base leading-tight">{tkt.subject}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{tkt.description}</p>
                      </div>

                      {tkt.replies.length > 0 && (
                        <div className="bg-muted/30 border border-border/20 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-gold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Response from {tkt.replies[0].author}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{tkt.replies[0].time}</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed font-sans">{tkt.replies[0].text}</p>
                        </div>
                      )}

                      {tkt.status !== 'RESOLVED' && tkt.replies.length === 0 && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5">
                          <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
                          <span>Our team is actively reviewing your query. Response will be posted here.</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar FAQs */}
        <motion.div variants={fadeUp} className="space-y-5">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-gold" /> Quick Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-sans leading-relaxed text-muted-foreground">
              {[
                { q: 'How long does CAS document review take?', a: 'Typically 24-48 business hours once uploaded.' },
                { q: 'Is there a limit on support queries?', a: 'No, you can ask as many questions as you need.' },
                { q: 'Can I chat live with my counselor?', a: 'Yes, click the WhatsApp button on your sidebar!' },
              ].map((faq, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-foreground">{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
