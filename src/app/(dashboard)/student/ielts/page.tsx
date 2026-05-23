'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  BookOpen, Play, CheckCircle2, Headphones, FileText, Mic, PenTool, Award,
  HelpCircle, ChevronRight, BarChart3, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function IeltsPage() {
  const [listening, setListening] = useState('7.0')
  const [reading, setReading] = useState('7.5')
  const [writing, setWriting] = useState('6.5')
  const [speaking, setSpeaking] = useState('7.0')
  const [activeTab, setActiveTab] = useState('overview')

  const calcBand = () => {
    const l = parseFloat(listening) || 0
    const r = parseFloat(reading) || 0
    const w = parseFloat(writing) || 0
    const s = parseFloat(speaking) || 0
    const avg = (l + r + w + s) / 4
    // Round to nearest 0.5
    return (Math.round(avg * 2) / 2).toFixed(1)
  }

  const handlePracticeStart = (section: string) => {
    toast.success(`Starting ${section} practice drill! Loading materials...`)
  }

  const handleStartMock = () => {
    toast.success('Loading complete IELTS Mock Exam! Good luck.')
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-gold" /> IELTS Preparation
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Access preparation drills, evaluate mock bands, and track your progress in real-time</p>
        </div>
        <Button
          onClick={handleStartMock}
          className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl font-sans"
        >
          <Play className="w-4 h-4 mr-2 fill-navy" /> Full Mock Exam
        </Button>
      </motion.div>

      {/* Tab controls */}
      <motion.div variants={fadeUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-sans">Overview & Drills</TabsTrigger>
            <TabsTrigger value="calculator" className="rounded-lg text-xs font-sans">Band Calculator</TabsTrigger>
            <TabsTrigger value="resources" className="rounded-lg text-xs font-sans">Premium Prep Kits</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Skill Drills Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Listening Drill', type: 'audio', desc: '4 Sections, 40 questions, diverse accents', icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { title: 'Reading Passage', type: 'academic', desc: '3 Passages, 40 questions, deep comprehension', icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
                { title: 'Writing Task', type: 'evaluation', desc: 'Task 1 (Graph) & Task 2 (Essay) templates', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { title: 'Speaking Mock', type: 'interactive', desc: '3 Part structured conversation with feedback', icon: Mic, color: 'text-orange-500', bg: 'bg-orange-500/10' },
              ].map((drill, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <Card className="border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group">
                    <CardContent className="p-5 font-sans text-sm">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl ${drill.bg} flex items-center justify-center shrink-0`}>
                          <drill.icon className={`w-5 h-5 ${drill.color}`} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-bold text-foreground leading-snug group-hover:text-gold transition-colors">{drill.title}</h3>
                          <p className="text-xs text-muted-foreground font-sans leading-relaxed">{drill.desc}</p>
                          <div className="pt-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider py-0.5 px-2 bg-muted/30 border-border/50 text-muted-foreground">{drill.type}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePracticeStart(drill.title)}
                              className="text-xs hover:text-gold text-gold/80 hover:bg-gold/5 rounded-lg h-7 px-2 font-sans"
                            >
                              Practice <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Diagnostic tracker */}
            <motion.div variants={fadeUp}>
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold tracking-wide uppercase text-foreground">Diagnostic Mock History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-sans text-sm">
                  {[
                    { exam: 'Mock Test #3 (Full)', date: 'May 18, 2026', band: '7.0', scores: 'L:7.0 | R:7.5 | W:6.5 | S:7.0', status: 'Graded', isHighest: true },
                    { exam: 'Mock Test #2 (Partial)', date: 'May 10, 2026', band: '6.5', scores: 'L:6.5 | R:7.0 | W:6.0 | S:6.5', status: 'Graded', isHighest: false },
                    { exam: 'Mock Test #1 (Diagnostic)', date: 'May 02, 2026', band: '6.0', scores: 'L:5.5 | R:6.5 | W:5.5 | S:6.5', status: 'Graded', isHighest: false },
                  ].map((mock, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/40 hover:border-gold/20 transition-all bg-muted/10">
                      <div>
                        <p className="font-bold text-foreground">{mock.exam}</p>
                        <p className="text-xs text-muted-foreground font-sans mt-0.5">{mock.date} • <span className="font-medium text-foreground">{mock.scores}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        {mock.isHighest && (
                          <Badge className="bg-gold/15 text-gold border-gold/20 text-[9px] uppercase font-bold py-0.5 px-1.5 hidden sm:inline-flex">Highest</Badge>
                        )}
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs font-sans font-bold h-7 px-2.5 rounded-lg flex items-center justify-center">
                          Band {mock.band}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick tips & Upgrade banner */}
          <motion.div variants={fadeUp} className="space-y-5">
            <Card className="border-border/50 shadow-sm bg-gradient-to-b from-navy to-navy-dark text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gold/[0.04] blur-xl" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold tracking-wide uppercase text-gold">IELTS Live Class Prep</CardTitle>
                <CardDescription className="text-xs text-white/50">Unlock premium courses & mentorship.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm font-sans">
                <p className="text-xs text-white/70 leading-relaxed">
                  Join our upcoming IELTS intensive classes with native coaches. Gain access to 40+ mocks, essay grading, and spoken fluency sessions.
                </p>
                <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between"><span>Batch Timings:</span><span className="font-bold text-white">6:00 PM - 8:00 PM PKT</span></div>
                  <div className="flex justify-between"><span>Next Intake:</span><span className="font-bold text-white">June 01, 2026</span></div>
                  <div className="flex justify-between"><span>Active Students:</span><span className="font-bold text-white">120+ Placed</span></div>
                </div>
                <Button
                  asChild
                  className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-10 text-xs"
                >
                  <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer">
                    Upgrade to Premium
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-gold" /> Pro Study Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-3 font-sans leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground mb-0.5">1. Scan & Skim (Reading)</h4>
                  <p className="text-[11px]">Don&apos;t read word-for-word. Skim passages first to get the main idea, then scan specifically for question keywords.</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-0.5">2. Paraphrase prompts (Writing)</h4>
                  <p className="text-[11px]">Avoid copying prompts directly. Use synonyms and alternative grammar patterns in introductions to show lexical range.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Band Calculator tab */}
      {activeTab === 'calculator' && (
        <motion.div variants={fadeUp} className="max-w-2xl mx-auto">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle className="text-base font-sans flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" /> IELTS Band Score Estimator
              </CardTitle>
              <CardDescription className="text-xs font-sans">Input individual component band estimations to calculate your target overall band score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 font-sans text-sm text-foreground">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Listening Band', val: listening, set: setListening },
                  { label: 'Reading Band', val: reading, set: setReading },
                  { label: 'Writing Band', val: writing, set: setWriting },
                  { label: 'Speaking Band', val: speaking, set: setSpeaking },
                ].map((input, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="font-semibold text-xs text-muted-foreground">{input.label}</label>
                    <select
                      value={input.val}
                      onChange={(e) => input.set(e.target.value)}
                      className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                    >
                      {['9.0', '8.5', '8.0', '7.5', '7.0', '6.5', '6.0', '5.5', '5.0', '4.5', '4.0'].map((bandVal) => (
                        <option key={bandVal} value={bandVal}>{bandVal}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-1">
                  <p className="font-bold text-lg text-foreground">Estimated Overall Band</p>
                  <p className="text-xs text-muted-foreground font-sans">Calculated based on standard IELTS rounding algorithms.</p>
                </div>
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border-2 border-gold/30 shadow-gold">
                  <span className="text-3xl font-extrabold text-gold font-sans">{calcBand()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Premium Prep Kits tab */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'IELTS Standard Prep Kit', price: 'Free', features: ['4 Interactive Diagnostics Mock exams', 'Standard skill drills library', 'Vocabulary lists (1000+ words)', 'Auto-graded progress reports'], active: true },
            { name: 'IELTS Master Class (Bronze)', price: '£25', features: ['All Free features', '10 Practice Mock tests with transcripts', 'Detailed writing essay reviews', 'Weekly webinars with experts'], active: false },
            { name: 'IELTS Ultimate VIP Coaching', price: '£75', features: ['All Bronze features', 'Unlimited live exam simulations', '1-on-1 private speaking coaching', 'Personalized band diagnostics', 'Exemption consultancy included'], active: false },
          ].map((kit, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <Card className="h-full border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <Badge variant="outline" className={`w-fit text-[9px] uppercase font-bold py-0.5 px-2 mb-2 ${kit.active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                    {kit.active ? 'Active Plan' : 'Upgrade Option'}
                  </Badge>
                  <CardTitle className="text-base font-bold text-foreground">{kit.name}</CardTitle>
                  <p className="text-2xl font-black text-foreground font-sans mt-1.5">{kit.price}</p>
                </CardHeader>
                <CardContent className="flex-1 pb-6 space-y-4">
                  <ul className="text-xs text-muted-foreground space-y-2.5 font-sans">
                    {kit.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button
                    disabled={kit.active}
                    onClick={() => toast.success(`Initiated purchase of ${kit.name}!`)}
                    className={`w-full rounded-xl font-semibold h-10 font-sans text-xs ${kit.active ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-gold hover:bg-gold-dark text-navy'}`}
                  >
                    {kit.active ? 'Current active prep plan' : `Purchase upgrade plan`}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
