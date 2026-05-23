'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Mail, Search, Send, User, MessageSquare, Plus, CheckCircle, ChevronRight,
  Sparkles, Check, ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  sender: 'student' | 'staff'
  text: string
  time: string
}

interface Thread {
  id: string
  studentName: string
  lastMessage: string
  unread: boolean
  messages: Message[]
}

const initialThreads: Thread[] = [
  {
    id: 'th-1',
    studentName: 'Moosa Khan',
    lastMessage: 'Got my offer letter from Manchester!',
    unread: true,
    messages: [
      { id: 'm1', sender: 'student', text: 'Hi Sarah, did you get a chance to review my personal statement?', time: 'Yesterday' },
      { id: 'm2', sender: 'staff', text: 'Yes Moosa! It looks excellent. I just made some minor tweaks to your introduction. You can upload it now.', time: 'Yesterday' },
      { id: 'm3', sender: 'student', text: 'Awesome, uploaded. Also, got my offer letter from Manchester! 🎉', time: '10:00 AM' },
    ],
  },
  {
    id: 'th-2',
    studentName: 'Ayesha Rahman',
    lastMessage: 'Is the bank statement format okay?',
    unread: false,
    messages: [
      { id: 'a1', sender: 'student', text: 'Is the bank statement format okay? I uploaded it in the documents tab.', time: '2 days ago' },
      { id: 'a2', sender: 'staff', text: 'Yes Ayesha, the format is 100% correct. We will submit it along with your CAS request tomorrow.', time: '1 day ago' },
    ],
  },
]

export default function StaffMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState('th-1')
  const [inputText, setInputText] = useState('')

  const activeThread = threads.find(t => t.id === activeThreadId)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'staff',
      text: inputText,
      time: 'Just now',
    }

    setThreads(threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: inputText,
          unread: false,
          messages: [...t.messages, newMsg],
        }
      }
      return t
    }))
    setInputText('')
    toast.success('Message sent!')
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-7 h-7 text-gold" /> Messaging Center
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Communicate directly with your assigned students regarding their visa procedures and courses</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[500px]">
        {/* Thread list */}
        <motion.div variants={fadeUp} className="lg:col-span-1 border border-border/50 rounded-2xl bg-muted/10 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/40 shrink-0">
            <h3 className="font-bold text-sm text-foreground mb-3 font-sans">Conversations</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 h-10 bg-background text-xs font-sans rounded-xl border-border/50" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id)
                  setThreads(threads.map(tr => tr.id === t.id ? { ...tr, unread: false } : tr))
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-start gap-2.5 font-sans text-xs ${
                  t.id === activeThreadId ? 'bg-gold/10 border border-gold/20' : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-navy/5 dark:bg-navy-light/10 text-navy dark:text-gold flex items-center justify-center font-bold font-sans shrink-0">
                  {t.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2.5 mb-1">
                    <span className="font-bold text-foreground text-[13px]">{t.studentName}</span>
                    {t.unread && (
                      <Badge className="bg-gold text-navy text-[8px] font-bold rounded-full w-2 h-2 p-0 flex items-center justify-center animate-pulse" />
                    )}
                  </div>
                  <p className="text-muted-foreground truncate leading-relaxed">{t.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversation window */}
        <motion.div variants={fadeUp} className="lg:col-span-2 border border-border/50 rounded-2xl overflow-hidden bg-background flex flex-col h-full min-h-[500px]">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0 bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0">
                    {activeThread.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm leading-tight font-sans">{activeThread.studentName}</h4>
                    <p className="text-[10px] text-muted-foreground">Active now</p>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 no-scrollbar bg-muted/5">
                {activeThread.messages.map((m) => {
                  const isStaff = m.sender === 'staff'
                  return (
                    <div key={m.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl p-3 font-sans text-xs shadow-sm leading-relaxed ${
                        isStaff ? 'bg-navy text-white rounded-tr-none' : 'bg-muted border border-border/40 text-foreground rounded-tl-none'
                      }`}>
                        <p>{m.text}</p>
                        <p className={`text-[9px] mt-1.5 text-right ${isStaff ? 'text-white/40' : 'text-muted-foreground'}`}>{m.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-border/40 flex items-center gap-3 shrink-0 bg-muted/10 font-sans">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write message to ${activeThread.studentName}...`}
                  className="flex-1 h-11 bg-background text-xs rounded-xl border-border/50 pl-4"
                />
                <Button type="submit" className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-11 w-11 p-0 shrink-0">
                  <Send className="w-4 h-4 fill-navy text-navy" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
              <h4 className="font-bold text-sm text-foreground">No Conversation Selected</h4>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
