'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Ticket, Plus, CheckCircle, Clock, AlertCircle, FileText,
  Search, RefreshCw, Calendar, Trash2
} from 'lucide-react'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  student: string
  category: string
  dueDate: string
  completed: boolean
}

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Verify passport copy and ID card translations', student: 'Moosa Khan', category: 'Documentation', dueDate: 'May 24, 2026', completed: false },
  { id: 'task-2', title: 'Submit CAS request to admissions panel', student: 'Ayesha Rahman', category: 'Admissions', dueDate: 'May 25, 2026', completed: false },
  { id: 'task-3', title: 'Log diagnostic mock test results', student: 'Zainab Fatima', category: 'IELTS Prep', dueDate: 'May 26, 2026', completed: true },
]

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  
  // New Task Form
  const [title, setTitle] = useState('')
  const [student, setStudent] = useState('')
  const [category, setCategory] = useState('Documentation')
  const [dueDate, setDueDate] = useState('2026-05-27')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !student.trim()) return

    const newT: Task = {
      id: `task-${Date.now()}`,
      title,
      student,
      category,
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      completed: false,
    }

    setTasks([newT, ...tasks])
    setTitle('')
    setStudent('')
    setShowAdd(false)
    toast.success('Task created successfully!')
  }

  const handleToggle = (id: string, name: string, status: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    if (!status) {
      toast.success(`Task for ${name} marked as completed!`)
    }
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    toast.success('Task deleted.')
  }

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.student.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Ticket className="w-7 h-7 text-gold" /> Counselor Checklist
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Track academic deadlines, document reviews, and mock interview milestones for your cases</p>
        </div>
        {!showAdd && (
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl font-sans"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Task Item
          </Button>
        )}
      </motion.div>

      {/* Search & Add form */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <motion.div variants={fadeUp} className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks or student names..."
              className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
            />
          </motion.div>

          {showAdd && (
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-gold/30 shadow-premium">
                <CardHeader>
                  <CardTitle className="text-base font-sans">New Task Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-4 font-sans text-sm text-foreground">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Task Title</label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Verify bank certificate..." className="h-11 border-border/50 rounded-xl" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-xs text-muted-foreground">Student Name</label>
                        <Input value={student} onChange={e => setStudent(e.target.value)} placeholder="Moosa Khan" className="h-11 border-border/50 rounded-xl" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-xs text-muted-foreground">Task Category</label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="w-full h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-sm focus:border-gold"
                        >
                          <option value="Documentation">Documentation</option>
                          <option value="Admissions">Admissions</option>
                          <option value="IELTS Prep">IELTS Prep</option>
                          <option value="Visa Pipeline">Visa Pipeline</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-xs text-muted-foreground">Due Date</label>
                      <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-11 border-border/50 rounded-xl" />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowAdd(false)} className="flex-1 rounded-xl h-11 border-border/50">Cancel</Button>
                      <Button type="submit" className="flex-1 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-11">Create Task</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Task lists */}
          <div className="space-y-3.5">
            {filtered.length === 0 ? (
              <Card className="border-dashed border-2 border-border/40 text-center py-12">
                <CardContent>
                  <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-sans text-sm">No checklist items found.</p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 ${t.completed ? 'opacity-60 bg-muted/20' : ''}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4 font-sans text-sm">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(t.id, t.student, t.completed)}
                          className={`w-5.5 h-5.5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                            t.completed ? 'border-green-500 bg-green-500 text-white' : 'border-border/60 bg-background hover:border-gold'
                          }`}
                        >
                          {t.completed && <CheckCircle className="w-4 h-4 fill-green-500 text-white" />}
                        </button>
                        <div className="space-y-1">
                          <p className={`font-semibold text-foreground text-sm leading-snug ${t.completed ? 'line-through text-muted-foreground' : ''}`}>{t.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-semibold text-gold">{t.student}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Due: {t.dueDate}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-[9px] font-sans font-bold uppercase tracking-wider py-0 px-2 bg-muted/40 text-muted-foreground">{t.category}</Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl shrink-0 w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar tasks summary */}
        <motion.div variants={fadeUp} className="space-y-5">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-foreground">Task Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs font-sans text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Active Tasks:</span>
                <span className="font-bold text-foreground text-sm">{tasks.filter(t => !t.completed).length} items</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed Tasks:</span>
                <span className="font-bold text-foreground text-sm">{tasks.filter(t => t.completed).length} items</span>
              </div>
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Documentation Completion</span>
                  <span className="font-semibold text-foreground">66%</span>
                </div>
                <Progress value={66} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
