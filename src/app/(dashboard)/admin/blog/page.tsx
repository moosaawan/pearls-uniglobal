'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Globe, Search, Plus, Edit, Trash2, Calendar, User,
  FileText, Check, Eye, X, BookOpen
} from 'lucide-react'
import { toast } from 'sonner'

interface BlogPost {
  id: string
  title: string
  category: 'Study Abroad' | 'Visa Guide' | 'IELTS Tips' | 'Student Stories'
  status: 'published' | 'draft'
  author: string
  date: string
  views: number
  content: string
}

const initialPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Top UK Scholarships for Pakistani Students in 2026',
    category: 'Study Abroad',
    status: 'published',
    author: 'Sarah Ahmed',
    date: 'May 10, 2026',
    views: 450,
    content: 'Discover the fully-funded Commonwealth, Chevening, and Great scholarships available for postgraduates from Pakistan this year, including requirements and deadlines.'
  },
  {
    id: 'post-2',
    title: 'UK Student Visa Checklist: Avoid Common Rejection Mistakes',
    category: 'Visa Guide',
    status: 'published',
    author: 'Ali Raza',
    date: 'May 14, 2026',
    views: 890,
    content: 'Avoid visa delays or rejections by double-checking financial maintenance proof requirements, TB certificate validity, and CAS letter details.'
  },
  {
    id: 'post-3',
    title: 'IELTS Band 7.5 Preparation Strategy & Free Resources',
    category: 'IELTS Tips',
    status: 'draft',
    author: 'Sarah Ahmed',
    date: 'Pending Publish',
    views: 0,
    content: 'Get access to actionable tips on listening, speaking, reading, and academic writing modules to score a minimum band score of 7.5.'
  }
]

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [search, setSearch] = useState('')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  
  // Editor panel states
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Study Abroad',
    status: 'draft',
    author: 'Sarah Ahmed',
    content: ''
  })

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPostId(post.id)
    setFormData(post)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setSelectedPostId(null)
    setFormData({
      title: '',
      category: 'Study Abroad',
      status: 'draft',
      author: 'Sarah Ahmed',
      content: ''
    })
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id))
    setSelectedPostId(null)
    setIsEditing(false)
    toast.success('Blog article removed from CMS.')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error('Please enter article title and body content.')
      return
    }

    if (selectedPostId) {
      // Update
      setPosts(posts.map(p => p.id === selectedPostId ? { ...p, ...formData } as BlogPost : p))
      toast.success(`Successfully saved "${formData.title}"!`)
    } else {
      // Create
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: formData.title,
        category: formData.category || 'Study Abroad',
        status: formData.status || 'draft',
        author: formData.author || 'Sarah Ahmed',
        date: formData.status === 'published' ? 'Today' : 'Pending Publish',
        views: 0,
        content: formData.content
      }
      setPosts([newPost, ...posts])
      toast.success(`Article "${formData.title}" added to CMS list!`)
    }

    setIsEditing(false)
    setSelectedPostId(null)
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-7 h-7 text-gold" /> Blog CMS Engine
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Draft, customize, edit, and publish study abroad newsletters and immigration guidelines for prospective leads</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl flex items-center gap-1.5 h-10 px-4 self-start sm:self-center font-sans text-xs"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Button>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-xs">
        {[
          { label: 'Published Posts', value: posts.filter(p => p.status === 'published').length, color: 'text-green-500' },
          { label: 'Draft Articles', value: posts.filter(p => p.status === 'draft').length, color: 'text-yellow-600' },
          { label: 'Total Read Views', value: posts.reduce((sum, p) => sum + p.views, 0), color: 'text-gold' },
          { label: 'Blog Categories', value: 4, color: 'text-blue-500' },
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
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
          placeholder="Search post titles or categories..."
          className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
        />
      </motion.div>

      {/* List + Editor layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start font-sans">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No articles match your query parameters.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <Card
                  onClick={() => handleSelectPost(p)}
                  className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${
                    selectedPostId === p.id && isEditing ? 'border-gold bg-gold/5' : ''
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-border/30">
                        <BookOpen className="w-5 h-5 text-navy dark:text-gold" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">
                          {p.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {p.author}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {p.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-navy border border-border/50 text-white font-semibold text-[9px]">
                        {p.category}
                      </Badge>
                      <Badge className={`text-[8px] uppercase font-bold py-0.5 px-2 ${
                        p.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }`}>
                        {p.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* CMS Editor Sidebar */}
        <motion.div variants={fadeUp}>
          {isEditing ? (
            <Card className="border-gold/30 shadow-premium overflow-hidden text-sm text-foreground bg-background">
              <div className="h-1.5 bg-gradient-gold" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gold" />
                    {selectedPostId ? 'Edit Article' : 'Compose Article'}
                  </h4>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="w-7 h-7 rounded-lg">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Post Title</label>
                    <Input
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 5 Common UK Visa Rejections"
                      className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background outline-none text-xs"
                      >
                        <option value="Study Abroad">Study Abroad</option>
                        <option value="Visa Guide">Visa Guide</option>
                        <option value="IELTS Tips">IELTS Tips</option>
                        <option value="Student Stories">Student Stories</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">Author Name</label>
                      <Input
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="h-10 bg-background border-border/50 rounded-xl text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">CMS Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full h-10 px-2.5 border border-border/50 rounded-xl bg-background outline-none text-xs text-foreground"
                    >
                      <option value="draft">Draft Mode (Internal review)</option>
                      <option value="published">Published (Live to public website)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider font-medium">Content / Article Body</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your rich newsletter content here..."
                      className="w-full p-3 border border-border/50 rounded-xl bg-background outline-none text-xs leading-relaxed focus:border-gold"
                    />
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Article Draft
                    </Button>
                    
                    {selectedPostId && (
                      <Button
                        type="button"
                        onClick={() => handleDelete(selectedPostId)}
                        variant="outline"
                        className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Post
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Post Entry</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any post listing to inspect article statistics, edit draft files, reassign author credits, or publish posts.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
