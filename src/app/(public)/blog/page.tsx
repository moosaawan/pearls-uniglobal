'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Calendar, ArrowRight, Clock, User } from 'lucide-react'

const blogPosts = [
  {
    slug: 'complete-guide-uk-student-visa-2026',
    title: 'Complete Guide to UK Student Visa 2026',
    excerpt: 'Everything you need to know about applying for a UK student visa in 2026, including requirements, costs, and processing times.',
    category: 'Visa Guide',
    author: 'Muhammad Ali Khan',
    date: 'May 15, 2026',
    readTime: '8 min',
  },
  {
    slug: 'top-10-uk-universities-for-pakistani-students',
    title: 'Top 10 UK Universities for Pakistani Students',
    excerpt: 'Discover the best UK universities offering excellent programs, scholarships, and support for Pakistani students.',
    category: 'Universities',
    author: 'Fatima Zahra',
    date: 'May 10, 2026',
    readTime: '6 min',
  },
  {
    slug: 'how-to-score-band-7-in-ielts',
    title: 'How to Score Band 7+ in IELTS',
    excerpt: 'Proven strategies and tips from our expert trainers to help you achieve a band 7 or higher in your IELTS exam.',
    category: 'IELTS',
    author: 'Sarah Malik',
    date: 'May 5, 2026',
    readTime: '10 min',
  },
  {
    slug: 'uk-scholarship-opportunities-2026',
    title: 'UK Scholarship Opportunities for 2026',
    excerpt: 'A comprehensive list of scholarships available for international students planning to study in the UK in 2026.',
    category: 'Scholarships',
    author: 'Ayesha Noor',
    date: 'Apr 28, 2026',
    readTime: '7 min',
  },
  {
    slug: 'student-life-in-london',
    title: 'Student Life in London: What to Expect',
    excerpt: 'From accommodation to transportation, here\'s your complete guide to student life in one of the world\'s greatest cities.',
    category: 'Student Life',
    author: 'Hassan Sheikh',
    date: 'Apr 20, 2026',
    readTime: '9 min',
  },
  {
    slug: 'writing-perfect-statement-of-purpose',
    title: 'Writing the Perfect Statement of Purpose',
    excerpt: 'Step-by-step guide to crafting a compelling SOP that will impress university admissions committees.',
    category: 'Application Tips',
    author: 'Fatima Zahra',
    date: 'Apr 15, 2026',
    readTime: '6 min',
  },
]

const categoryColors: Record<string, string> = {
  'Visa Guide': 'bg-blue-500/10 text-blue-500',
  'Universities': 'bg-purple-500/10 text-purple-500',
  'IELTS': 'bg-green-500/10 text-green-500',
  'Scholarships': 'bg-gold/10 text-gold',
  'Student Life': 'bg-orange-500/10 text-orange-500',
  'Application Tips': 'bg-pink-500/10 text-pink-500',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans"><BookOpen className="w-3 h-3 mr-1" /> Blog</Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Insights & <span className="text-gradient">Resources</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mx-auto font-sans">
            Expert advice, guides, and tips for your study abroad journey.
          </motion.p>
        </motion.div>
      </section>

      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={staggerContainer} className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="h-full border-border/50 shadow-sm hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/5 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className={`${categoryColors[post.category] || 'bg-muted text-muted-foreground'} border-0 text-xs mb-3 font-sans`}>
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors font-sans line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 font-sans">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 font-sans">
                      <Calendar className="w-3 h-3" />{post.date}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
