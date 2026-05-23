'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, hoverLift } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  BookOpen, Target, Users, Clock, Award, CheckCircle,
  Headphones, PenTool, BookMarked, Mic, MessageCircle,
} from 'lucide-react'

const modules = [
  {
    icon: Headphones,
    title: 'Listening',
    description: 'Master all question types with intensive audio practice sessions and proven note-taking techniques.',
    tips: ['Predictive listening', 'Keyword spotting', 'Map & diagram labeling'],
  },
  {
    icon: BookMarked,
    title: 'Reading',
    description: 'Develop speed-reading skills and learn to tackle Academic/General Training passages effectively.',
    tips: ['Skimming & scanning', 'True/False/Not Given', 'Matching headings'],
  },
  {
    icon: PenTool,
    title: 'Writing',
    description: 'Structure Task 1 & Task 2 responses with confidence using templates and advanced vocabulary.',
    tips: ['Task 1 data analysis', 'Essay structures', 'Cohesion & coherence'],
  },
  {
    icon: Mic,
    title: 'Speaking',
    description: 'Build fluency and confidence through mock interviews and practice with experienced examiners.',
    tips: ['Part 2 cue cards', 'Pronunciation drills', 'Natural fluency'],
  },
]

const features = [
  { icon: Target, title: 'Target Band Score', desc: 'Personalized strategy to reach your required band score' },
  { icon: Users, title: 'Small Batch Sizes', desc: 'Maximum 8 students per batch for focused attention' },
  { icon: Clock, title: 'Flexible Schedule', desc: 'Morning, evening, and weekend batches available' },
  { icon: Award, title: 'Certified Trainers', desc: 'British Council certified IELTS trainers' },
  { icon: BookOpen, title: 'Study Materials', desc: 'Cambridge & official IELTS preparation materials included' },
  { icon: CheckCircle, title: 'Mock Tests', desc: 'Weekly full-length mock tests with detailed feedback' },
]

const packages = [
  {
    name: 'Foundation',
    duration: '4 Weeks',
    band: '5.0 - 6.0',
    features: ['Basic grammar review', 'Introduction to all modules', 'Practice tests', 'Study materials', 'Weekly mock test'],
    popular: false,
  },
  {
    name: 'Advanced',
    duration: '6 Weeks',
    band: '6.0 - 7.0',
    features: ['Advanced strategies', 'All 4 modules intensive', 'One-on-one sessions', 'Speaking practice', 'Weekly mock tests', 'Writing correction'],
    popular: true,
  },
  {
    name: 'Premium',
    duration: '8 Weeks',
    band: '7.0 - 8.0+',
    features: ['Expert-level training', 'Daily practice sessions', 'Unlimited mock tests', 'Personal mentor', 'Interview preparation', 'Guaranteed improvement'],
    popular: false,
  },
]

export default function IELTSContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(212,175,55,0.12),transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container-wide relative z-10 text-center"
        >
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6">
              <BookOpen className="w-3 h-3 mr-1" />
              IELTS Academy
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Master IELTS with{' '}
            <span className="text-gradient">Expert Guidance</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8"
          >
            Achieve your target band score with our certified trainers,
            proven strategies, and comprehensive preparation programs.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              asChild
              className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-12 px-8"
            >
              <Link href="/free-assessment">Enroll Now</Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="bg-[#25D366] hover:bg-[#20BA56] text-white border-none rounded-xl h-12 px-8 shadow-lg shadow-green-500/20"
            >
              <a href={`https://wa.me/923000000000?text=Hi, I'm interested in IELTS preparation`}>
                <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                WhatsApp Us
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Modules */}
      <section className="section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Four Modules, One <span className="text-gold">Goal</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-sans">
              Comprehensive training across all IELTS modules with targeted strategies
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <motion.div key={idx} variants={fadeUp} {...hoverLift}>
                <Card className="h-full border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 group overflow-hidden">
                  <div className="h-1 bg-gradient-gold w-0 group-hover:w-full transition-all duration-500" />
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <mod.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-sans">
                      {mod.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-sans">
                      {mod.description}
                    </p>
                    <ul className="space-y-2">
                      {mod.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-foreground font-sans"
                        >
                          <CheckCircle className="w-3 h-3 text-gold shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Our Academy
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border/50 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 font-sans">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Packages */}
      <section className="section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-gold">Package</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, idx) => (
              <motion.div key={idx} variants={fadeUp} {...hoverLift}>
                <Card
                  className={`h-full relative overflow-hidden transition-all duration-500 ${
                    pkg.popular
                      ? 'border-gold shadow-gold scale-[1.02]'
                      : 'border-border/50 shadow-premium'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="bg-gold text-navy rounded-none rounded-bl-lg font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-1 font-sans">
                      {pkg.name}
                    </h3>
                    <p className="text-gold font-semibold mb-1 font-sans">{pkg.duration}</p>
                    <p className="text-muted-foreground text-sm mb-6 font-sans">
                      Target Band: {pkg.band}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm font-sans"
                        >
                          <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                          <span className="text-foreground">{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full rounded-xl h-11 font-semibold ${
                        pkg.popular
                          ? 'bg-gold hover:bg-gold-dark text-navy'
                          : 'bg-navy hover:bg-navy-light text-white'
                      }`}
                      asChild
                    >
                      <Link href="/free-assessment">Get Started</Link>
                    </Button>
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
