'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, Calendar, ArrowRight, Clock, User, 
  Search, X, Sparkles, BookOpenCheck, ChevronRight 
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const categoryColors: Record<string, string> = {
  'Visa Guide': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Universities': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'IELTS': 'bg-green-500/10 text-green-500 border-green-500/20',
  'IELTS Tips': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Scholarships': 'bg-amber-500/10 text-gold border-amber-500/20',
  'Student Life': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Application Tips': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'Study Abroad': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  'Student Stories': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching dynamic blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPosts()
  }, [])

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans py-1.5 px-4 rounded-full text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-gold" /> Resource Center
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-none">
            Insights & <span className="text-gradient">Resources</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mx-auto font-sans font-light">
            Stay up to date with immigration guides, visa policies, IELTS test prep tips, and premium student articles.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Listing Section */}
      <section className="container-wide mt-12">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-border/40 font-sans">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, visa advice, articles..."
              className="pl-10 h-11 bg-card border-border/50 rounded-xl text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground font-medium shrink-0">
            {loading ? 'Searching...' : `Showing ${filteredPosts.length} dynamic articles`}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm font-sans font-medium">Fetching active publication catalog...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-20 max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4 border border-border/50">
              <BookOpenCheck className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1.5">No Articles Published</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              We are currently drafting new immigration columns. Head to your admin settings to draft and publish new posts.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.05 }} 
            variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, idx) => (
              <motion.div key={post.id} variants={fadeUp}>
                <Card 
                  onClick={() => setSelectedPost(post)}
                  className="h-full border-border/50 shadow-sm hover:shadow-premium-lg hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden cursor-pointer flex flex-col bg-card"
                >
                  <div className="h-44 bg-gradient-to-br from-navy/35 to-gold/10 flex items-center justify-center relative overflow-hidden border-b border-border/20 shrink-0">
                    <div className="absolute inset-0 bg-navy/10 group-hover:scale-105 transition-transform duration-700" />
                    <BookOpen className="w-10 h-10 text-gold opacity-50 relative z-10" />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Badge className={`${categoryColors[post.category] || 'bg-muted text-muted-foreground'} border text-[10px] mb-3 font-sans px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider`}>
                        {post.category || 'Guide'}
                      </Badge>
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-gold transition-colors font-sans line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mb-4 line-clamp-3 font-sans leading-relaxed font-light">{post.excerpt}</p>
                    </div>

                    <div className="pt-4 border-t border-border/30 mt-auto">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans mb-2">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gold/70" />{post.author}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold/70" />5 min read</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-sans">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold/70" />{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-gold font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-1 transition-transform duration-300">
                          Read Full <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Premium Modal Reader */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card border border-border shadow-premium-lg rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-border/40 flex items-center justify-between bg-muted/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Badge className={`${categoryColors[selectedPost.category] || 'bg-muted text-muted-foreground'} text-[10px] uppercase font-sans tracking-wide px-2.5 py-0.5 rounded-full`}>
                    {selectedPost.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-sans">
                    <Calendar className="w-3 h-3 text-gold" />
                    {new Date(selectedPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground font-sans leading-tight">
                  {selectedPost.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground font-sans pb-4 border-b border-border/40">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px]">
                      {selectedPost.author?.substring(0, 2).toUpperCase()}
                    </div>
                    <span>By <strong className="text-foreground">{selectedPost.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold/70" /> 5 Min Read</div>
                  <div className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-gold" /> Live Supabase CMS</div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 font-sans leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/40 bg-muted/10 flex items-center justify-between shrink-0 font-sans text-xs">
                <span className="text-muted-foreground">Pearls UniGlobal Publication Engine</span>
                <Button 
                  onClick={() => setSelectedPost(null)}
                  className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-9 text-xs"
                >
                  Close Article
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

