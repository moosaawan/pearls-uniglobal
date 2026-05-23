'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap, Search, Plus, MapPin, Trophy, BookOpen,
  DollarSign, Trash2, Edit2, Check, RefreshCw, X
} from 'lucide-react'
import { toast } from 'sonner'

interface University {
  id: string
  name: string
  location: string
  ranking: number
  programsCount: number
  tuitionRange: string
  scholarshipAvailable: boolean
}

const initialUniversities: University[] = [
  { id: 'uni-1', name: 'University of Oxford', location: 'Oxford, England', ranking: 3, programsCount: 220, tuitionRange: '£28,000 - £44,000', scholarshipAvailable: true },
  { id: 'uni-2', name: 'University of Cambridge', location: 'Cambridge, England', ranking: 2, programsCount: 200, tuitionRange: '£30,000 - £48,000', scholarshipAvailable: true },
  { id: 'uni-3', name: 'University College London', location: 'London, England', ranking: 9, programsCount: 380, tuitionRange: '£22,000 - £35,000', scholarshipAvailable: true },
  { id: 'uni-4', name: 'University of Manchester', location: 'Manchester, England', ranking: 32, programsCount: 310, tuitionRange: '£19,500 - £29,000', scholarshipAvailable: true },
  { id: 'uni-5', name: 'University of Edinburgh', location: 'Edinburgh, Scotland', ranking: 22, programsCount: 280, tuitionRange: '£21,000 - £32,500', scholarshipAvailable: true },
]

export default function AdminUniversitiesPage() {
  const [unis, setUnis] = useState<University[]>(initialUniversities)
  const [search, setSearch] = useState('')
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null)
  
  // Form states for Add/Edit
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<University>>({
    name: '',
    location: '',
    ranking: 100,
    programsCount: 50,
    tuitionRange: '£15,000 - £25,000',
    scholarshipAvailable: true
  })

  const handleSelectUni = (uni: University) => {
    setSelectedUniId(uni.id)
    setFormData(uni)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setSelectedUniId(null)
    setFormData({
      name: '',
      location: '',
      ranking: 100,
      programsCount: 50,
      tuitionRange: '£15,000 - £25,000',
      scholarshipAvailable: true
    })
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setUnis(unis.filter(u => u.id !== id))
    setSelectedUniId(null)
    setIsEditing(false)
    toast.success('University partner removed from system catalogs.')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.location) {
      toast.error('Please enter university name and location.')
      return
    }

    if (selectedUniId) {
      // Update
      setUnis(unis.map(u => u.id === selectedUniId ? { ...u, ...formData } as University : u))
      toast.success(`Successfully updated ${formData.name}!`)
    } else {
      // Create
      const newUni: University = {
        id: `uni-${Date.now()}`,
        name: formData.name,
        location: formData.location,
        ranking: formData.ranking || 100,
        programsCount: formData.programsCount || 20,
        tuitionRange: formData.tuitionRange || '£12,000 - £20,000',
        scholarshipAvailable: formData.scholarshipAvailable ?? true
      }
      setUnis([newUni, ...unis])
      toast.success(`Partner university ${formData.name} added!`)
    }

    setIsEditing(false)
    setSelectedUniId(null)
  }

  const filtered = unis.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-gold" /> UK Partner Universities
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Configure programs lists, average tuition range, scholarship availability, and global rankings listings</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl flex items-center gap-1.5 h-10 px-4 self-start sm:self-center font-sans text-xs"
        >
          <Plus className="w-4 h-4" /> Add Partner University
        </Button>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sans text-xs">
        {[
          { label: 'Total Universities', value: unis.length, icon: GraduationCap, color: 'text-gold' },
          { label: 'Avg QS Ranking', value: Math.round(unis.reduce((acc, u) => acc + u.ranking, 0) / unis.length), icon: Trophy, color: 'text-yellow-500' },
          { label: 'Total Course Programs', value: unis.reduce((acc, u) => acc + u.programsCount, 0), icon: BookOpen, color: 'text-blue-500' },
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted/10 border border-border/20 flex items-center justify-center">
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
                <p className="text-base font-bold text-foreground mt-0.5">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeUp} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partner universities by name or city..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      {/* Grid: List + CRUD inspector */}
      <div className="grid lg:grid-cols-3 gap-6 items-start font-sans">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No partner universities found matching selection.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((u) => (
              <motion.div key={u.id} variants={fadeUp}>
                <Card
                  onClick={() => handleSelectUni(u)}
                  className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${
                    selectedUniId === u.id && isEditing ? 'border-gold bg-gold/5' : ''
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm shrink-0 border border-gold/20">
                        {u.name.split(' ').filter(n => n.toLowerCase() !== 'of' && n.toLowerCase() !== 'university').map(n => n[0]).join('') || 'U'}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">
                          {u.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {u.location}</span>
                          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> QS Rank: #{u.ranking}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-gold/15 text-gold border-0 font-bold uppercase text-[9px]">
                        {u.programsCount} Programs
                      </Badge>
                      {u.scholarshipAvailable && (
                        <Badge className="bg-green-500/15 text-green-500 border-0 font-bold uppercase text-[9px]">
                          Scholarships
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* CRUD Sidebar Panel */}
        <motion.div variants={fadeUp}>
          {isEditing ? (
            <Card className="border-gold/30 shadow-premium overflow-hidden text-sm text-foreground bg-background">
              <div className="h-1.5 bg-gradient-gold" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1">
                    <Edit2 className="w-4 h-4 text-gold" />
                    {selectedUniId ? 'Edit Partner University' : 'New Partner University'}
                  </h4>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="w-7 h-7 rounded-lg">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">University Name</label>
                    <Input
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. University of Oxford"
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Location / City</label>
                    <Input
                      required
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. London, England"
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">QS World Rank</label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.ranking || ''}
                        onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) || 1 })}
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Course Degrees</label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.programsCount || ''}
                        onChange={(e) => setFormData({ ...formData, programsCount: parseInt(e.target.value) || 1 })}
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Average Tuition (Annual)</label>
                    <Input
                      value={formData.tuitionRange || ''}
                      onChange={(e) => setFormData({ ...formData, tuitionRange: e.target.value })}
                      placeholder="e.g. £18,000 - £26,500"
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="scholarshipCheckbox"
                      checked={formData.scholarshipAvailable ?? true}
                      onChange={(e) => setFormData({ ...formData, scholarshipAvailable: e.target.checked })}
                      className="w-4 h-4 accent-gold border-border/50 rounded cursor-pointer"
                    />
                    <label htmlFor="scholarshipCheckbox" className="text-xs text-muted-foreground cursor-pointer select-none">
                      Scholarships & Waivers available
                    </label>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Partner Entry
                    </Button>
                    
                    {selectedUniId && (
                      <Button
                        type="button"
                        onClick={() => handleDelete(selectedUniId)}
                        variant="outline"
                        className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Partner University
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5">
                <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Partner University</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any university record card to modify programs listing catalog, QS rankings, average tuition ranges, or add new universities.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
