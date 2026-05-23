'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  GraduationCap, MapPin, Briefcase, Heart, Globe, Users,
  CheckCircle, ArrowRight, BookOpen, Building, Landmark, Stethoscope,
} from 'lucide-react'

const whyUK = [
  { icon: GraduationCap, title: 'World-Class Education', desc: '4 of the top 10 universities globally are in the UK.' },
  { icon: Briefcase, title: '2-Year Post-Study Work Visa', desc: 'The Graduate Route allows you to work in the UK for 2 years after graduation.' },
  { icon: Globe, title: 'Globally Recognized Degrees', desc: 'UK qualifications are respected by employers worldwide.' },
  { icon: Heart, title: 'Cultural Diversity', desc: 'The UK is home to students from 180+ countries.' },
  { icon: Building, title: 'Shorter Duration', desc: "Master's in just 1 year, saving time and money compared to other countries." },
  { icon: Users, title: 'Career Opportunities', desc: 'Access to the UK job market and global alumni networks.' },
]

const topUniversities = [
  { name: 'University of Oxford', rank: '#1 in UK', city: 'Oxford' },
  { name: 'University of Cambridge', rank: '#2 in UK', city: 'Cambridge' },
  { name: 'Imperial College London', rank: '#3 in UK', city: 'London' },
  { name: 'UCL', rank: '#4 in UK', city: 'London' },
  { name: 'University of Edinburgh', rank: '#5 in UK', city: 'Edinburgh' },
  { name: 'University of Manchester', rank: '#6 in UK', city: 'Manchester' },
  { name: "King's College London", rank: '#7 in UK', city: 'London' },
  { name: 'University of Bristol', rank: '#8 in UK', city: 'Bristol' },
]

const visaRequirements = [
  'Confirmation of Acceptance for Studies (CAS)',
  'Valid passport',
  'Proof of financial funds',
  'TB test certificate',
  'IELTS / English proficiency results',
  'Academic transcripts and certificates',
  'Visa application fee payment',
  'Biometric appointment',
]

export default function StudyInUKPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans">
              <GraduationCap className="w-3 h-3 mr-1" /> Study Destination
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Study in the <span className="text-gradient">United Kingdom</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mx-auto font-sans">
            Home to the world&apos;s oldest and most prestigious universities. Discover why the UK is the #1 choice for Pakistani students.
          </motion.p>
        </motion.div>
      </section>

      {/* Why UK */}
      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="container-wide">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose the <span className="text-gold">UK</span>?</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUK.map((item, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="h-full border-border/50 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-500 group">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 font-sans">{item.title}</h3>
                    <p className="text-muted-foreground text-sm font-sans">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Top Universities */}
      <section className="section-padding bg-muted/50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="container-wide">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Top UK <span className="text-gold">Universities</span></h2>
            <p className="text-muted-foreground font-sans">Our partner universities include the best in the UK</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topUniversities.map((uni, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="border-border/50 shadow-sm hover:shadow-premium hover:border-gold/30 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-navy/5 dark:bg-navy-light/20 flex items-center justify-center mb-3">
                      <Landmark className="w-7 h-7 text-navy dark:text-gold" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm font-sans">{uni.name}</h3>
                    <p className="text-gold text-xs font-semibold mt-1 font-sans">{uni.rank}</p>
                    <p className="text-muted-foreground text-xs mt-1 flex items-center justify-center gap-1 font-sans">
                      <MapPin className="w-3 h-3" />{uni.city}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Visa Requirements */}
      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Student Visa <span className="text-gold">Requirements</span>
              </h2>
              <p className="text-muted-foreground mb-6 font-sans">
                Here&apos;s what you need to apply for a UK Student Visa (Tier 4). Our team guides you through every document.
              </p>
              <div className="space-y-3">
                {visaRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 font-sans text-sm">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="border-gold/20 shadow-premium bg-gradient-to-br from-gold/5 to-transparent">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">98% Visa Success Rate</h3>
                  <p className="text-muted-foreground text-sm mb-6 font-sans">
                    Our meticulous documentation and expert guidance ensure your visa is approved.
                  </p>
                  <Button asChild className="bg-gold hover:bg-gold-dark text-navy rounded-xl font-semibold font-sans">
                    <Link href="/free-assessment">Start Your Application <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-navy text-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">Ready for the UK?</motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-8 text-lg font-sans max-w-xl mx-auto">
            Let our expert counselors guide you through every step of your UK education journey.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-12 px-8 font-sans">
              <Link href="/free-assessment">Get Free Assessment <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 rounded-xl h-12 px-8 font-sans">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
