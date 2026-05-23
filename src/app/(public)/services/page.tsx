'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/lib/constants'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Sparkles, GraduationCap, FileText, BookOpen, Shield, Stethoscope, Users, Award, Plane, ClipboardCheck } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck, GraduationCap, FileText, BookOpen, Shield, Stethoscope, Users, Award, Plane,
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}><Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans"><Sparkles className="w-3 h-3 mr-1" /> Our Services</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Comprehensive <span className="text-gradient">Study Abroad</span> Services
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mx-auto font-sans">
            From your first consultation to landing in the UK — we handle every step with precision and care.
          </motion.p>
        </motion.div>
      </section>

      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={staggerContainer} className="container-wide">
          <div className="space-y-8">
            {SERVICES.map((service, idx) => {
              const Icon = iconMap[service.icon] || CheckCircle
              const isEven = idx % 2 === 0
              return (
                <motion.div key={idx} variants={fadeUp}>
                  <Card className="border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 overflow-hidden group">
                    <div className="h-1 bg-gradient-gold w-0 group-hover:w-full transition-all duration-700" />
                    <CardContent className="p-8 md:p-10">
                      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                        <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                          <Icon className="w-10 h-10 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">{service.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4 font-sans">{service.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {['Expert Guidance', 'Personalized Approach', 'Proven Results'].map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gold/5 text-gold text-xs rounded-full font-sans">
                                <CheckCircle className="w-3 h-3" /> {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 font-sans">Book a free consultation and let us guide you to your dream university.</p>
            <Button size="lg" asChild className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-12 px-8 font-sans">
              <Link href="/free-assessment">Start Free Assessment <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
