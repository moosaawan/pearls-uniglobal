'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap, Search, MapPin, Award,
  DollarSign, Check, Heart, ExternalLink,
  ChevronRight, Sparkles, Filter, Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function UniversitiesPage() {
  const [search, setSearch] = useState('')
  const [unis, setUnis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState<string[]>([])
  const [filterScholarship, setFilterScholarship] = useState(false)

  const fetchUnis = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('featured', { ascending: false })
        .order('ranking', { ascending: true })

      if (error) throw error
      setUnis(data || [])
    } catch (err) {
      console.error('Error fetching universities:', err)
      toast.error('Failed to load university catalog.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnis()
  }, [])

  const toggleSave = (id: string, name: string) => {
    if (saved.includes(id)) {
      setSaved(saved.filter((i) => i !== id))
      toast.success(`${name} removed from saved list.`)
    } else {
      setSaved([...saved, id])
      toast.success(`${name} saved to your preferences!`)
    }
  }

  const handleApply = (name: string) => {
    toast.success(`Started application for ${name}! Please complete the application wizard.`)
  }

  const filteredUnis = unis.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(search.toLowerCase()) ||
      (uni.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (uni.programs || []).some((p: string) => p.toLowerCase().includes(search.toLowerCase()))
    
    if (filterScholarship && !uni.has_scholarships) return false
    return matchesSearch
  })

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-gold" /> UK Universities
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Browse and research premium UK universities partnering with Pearls UniGlobal</p>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by university name, city, course..."
            className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <Button
            variant={filterScholarship ? 'default' : 'outline'}
            onClick={() => setFilterScholarship(!filterScholarship)}
            className={`h-11 rounded-xl font-sans text-xs gap-1.5 shrink-0 ${filterScholarship ? 'bg-gold text-navy hover:bg-gold/90' : 'border-border/50'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Scholarships Available
          </Button>
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm font-sans">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold mb-2" />
          Syncing partner institutions...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.length === 0 ? (
            <motion.div variants={fadeUp} className="col-span-full py-12 text-center bg-muted/10 border-2 border-dashed border-border/40 rounded-2xl">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-base font-bold text-foreground font-sans">No Universities Found</h3>
              <p className="text-muted-foreground text-sm font-sans">Try modifying your search or filter options.</p>
            </motion.div>
          ) : (
            filteredUnis.map((uni) => {
              const initials = uni.name
                ? uni.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                : 'UN'

              return (
                <motion.div key={uni.id} variants={fadeUp}>
                  <Card className="h-full border-border/50 hover:border-gold/30 hover:shadow-premium shadow-sm transition-all duration-300 flex flex-col relative overflow-hidden group">
                    {uni.featured && (
                      <div className="absolute top-0 right-0 bg-gold/15 text-gold border-b border-l border-gold/30 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold tracking-wider font-sans uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-gold/20" /> Elite partner
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-navy/5 dark:bg-navy-light/10 flex items-center justify-center font-bold text-navy dark:text-gold text-sm shrink-0 border border-border/30 font-sans">
                          {initials}
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-foreground leading-tight group-hover:text-gold transition-colors">{uni.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs font-sans mt-0.5"><MapPin className="w-3 h-3 text-muted-foreground" /> {uni.city || 'United Kingdom'}, {uni.country}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 pb-4 space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-3">{uni.description || 'Highly rated international study destination with premium academic environments.'}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                        <div className="p-2 rounded-lg bg-muted/40 border border-border/20 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-gold" />
                          <div>
                            <p className="text-[9px] text-muted-foreground leading-none">Global Rank</p>
                            <p className="font-semibold text-foreground mt-0.5 font-sans">#{uni.ranking || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/40 border border-border/20 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-green-500" />
                          <div>
                            <p className="text-[9px] text-muted-foreground leading-none">Est. Tuition/Yr</p>
                            <p className="font-semibold text-foreground mt-0.5 font-sans">{uni.tuition_range || '£15k-£23k'}</p>
                          </div>
                        </div>
                      </div>

                      {uni.programs && uni.programs.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold font-sans mb-1.5 uppercase tracking-wider">Popular Programs</p>
                          <div className="flex flex-wrap gap-1.5">
                            {uni.programs.slice(0, 3).map((prog: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[10px] py-0.5 px-2 bg-muted/20 border-border/50 text-foreground font-sans font-normal truncate max-w-full">
                                {prog}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <div className="p-4 pt-0 mt-auto border-t border-border/30 flex items-center justify-between gap-2.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(uni.id, uni.name)}
                        className={`rounded-xl border border-border/40 hover:bg-red-500/10 group/heart ${saved.includes(uni.id) ? 'text-red-500 bg-red-500/5' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`w-4 h-4 transition-transform group-active/heart:scale-75 ${saved.includes(uni.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        onClick={() => handleApply(uni.name)}
                        className="flex-1 bg-gold hover:bg-gold-dark text-navy font-semibold text-xs rounded-xl h-9 font-sans gap-1"
                      >
                        Apply Now <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      )}
    </motion.div>
  )
}
