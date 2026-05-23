'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap, Search, MapPin, Award,
  DollarSign, Check, Heart, ExternalLink,
  ChevronRight, Sparkles, Filter,
} from 'lucide-react'
import { toast } from 'sonner'

const mockUniversities = [
  {
    id: 'uni-1',
    name: 'University of Oxford',
    location: 'Oxford, England',
    ranking: 1,
    tuition: '£28,000 - £44,000',
    scholarships: true,
    featured: true,
    logoText: 'UO',
    programs: ['MSc Computer Science', 'MBA', 'MPhil Economics', 'MSc Engineering Science'],
    description: 'One of the oldest and most prestigious universities in the world, offering unparalleled academic excellence.',
  },
  {
    id: 'uni-2',
    name: 'University of Cambridge',
    location: 'Cambridge, England',
    ranking: 2,
    tuition: '£30,000 - £48,000',
    scholarships: true,
    featured: true,
    logoText: 'UC',
    programs: ['MPhil Advanced Computer Science', 'MBA', 'MPhil Finance', 'PhD Physics'],
    description: 'A global leader in research and education, consistently ranked among the top universities worldwide.',
  },
  {
    id: 'uni-3',
    name: 'University of Manchester',
    location: 'Manchester, England',
    ranking: 6,
    tuition: '£22,000 - £31,000',
    scholarships: true,
    featured: false,
    logoText: 'UM',
    programs: ['MSc Computer Science', 'MSc Data Science', 'MBA', 'MSc Finance'],
    description: 'A prestigious Red Brick university with a rich history of innovation and outstanding student employment rates.',
  },
  {
    id: 'uni-4',
    name: 'University of Leeds',
    location: 'Leeds, England',
    ranking: 13,
    tuition: '£20,000 - £28,000',
    scholarships: true,
    featured: false,
    logoText: 'UL',
    programs: ['MBA', 'MSc Business Analytics', 'MSc Software Engineering'],
    description: 'Part of the elite Russell Group, Leeds offers an exceptionally vibrant campus and world-class student facilities.',
  },
  {
    id: 'uni-5',
    name: 'University of Birmingham',
    location: 'Birmingham, England',
    ranking: 12,
    tuition: '£21,500 - £29,500',
    scholarships: true,
    featured: false,
    logoText: 'UB',
    programs: ['MSc Data Science', 'MBA', 'MSc Advanced Computer Science'],
    description: 'A beautiful historic campus offering a highly-rated international student experience and strong industry links.',
  },
  {
    id: 'uni-6',
    name: 'University of Edinburgh',
    location: 'Edinburgh, Scotland',
    ranking: 4,
    tuition: '£24,000 - £36,000',
    scholarships: true,
    featured: true,
    logoText: 'UE',
    programs: ['MSc Artificial Intelligence', 'MSc Finance', 'MSc Design Informatics'],
    description: 'A global top-20 university situated in the breathtaking and historic capital of Scotland.',
  },
]

export default function UniversitiesPage() {
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState<string[]>([])
  const [filterScholarship, setFilterScholarship] = useState(false)

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

  const filteredUnis = mockUniversities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(search.toLowerCase()) ||
      uni.location.toLowerCase().includes(search.toLowerCase()) ||
      uni.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()))
    
    if (filterScholarship && !uni.scholarships) return false
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnis.length === 0 ? (
          <motion.div variants={fadeUp} className="col-span-full py-12 text-center bg-muted/10 border-2 border-dashed border-border/40 rounded-2xl">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-base font-bold text-foreground font-sans">No Universities Found</h3>
            <p className="text-muted-foreground text-sm font-sans">Try modifying your search or filter options.</p>
          </motion.div>
        ) : (
          filteredUnis.map((uni) => (
            <motion.div key={uni.id} variants={fadeUp}>
              <Card className="h-full border-border/50 hover:border-gold/30 hover:shadow-premium shadow-sm transition-all duration-300 flex flex-col relative overflow-hidden group">
                {uni.featured && (
                  <div className="absolute top-0 right-0 bg-gold/15 text-gold border-b border-l border-gold/30 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold tracking-wider font-sans uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-gold/20" /> Elite partner
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 dark:bg-navy-light/10 flex items-center justify-center font-bold text-navy dark:text-gold text-sm shrink-0 border border-border/30">
                      {uni.logoText}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground leading-tight group-hover:text-gold transition-colors">{uni.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs font-sans mt-0.5"><MapPin className="w-3 h-3 text-muted-foreground" /> {uni.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4 space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-2">{uni.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="p-2 rounded-lg bg-muted/40 border border-border/20 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gold" />
                      <div>
                        <p className="text-[9px] text-muted-foreground leading-none">UK Rank</p>
                        <p className="font-semibold text-foreground mt-0.5 font-sans">#{uni.ranking}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 border border-border/20 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-green-500" />
                      <div>
                        <p className="text-[9px] text-muted-foreground leading-none">Tuition/Yr</p>
                        <p className="font-semibold text-foreground mt-0.5 font-sans">£20k-£35k</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold font-sans mb-1.5 uppercase tracking-wider">Popular Programs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.programs.slice(0, 3).map((prog, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0.5 px-2 bg-muted/20 border-border/50 text-foreground font-sans font-normal truncate max-w-full">
                          {prog}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
          ))
        )}
      </div>
    </motion.div>
  )
}
