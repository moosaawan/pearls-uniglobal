'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, hoverLift } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Target, ArrowRight, Star, Quote, Shield, Sparkles, Heart, Users } from 'lucide-react'
import { STATS, BRAND_IDENTITY, MD_MESSAGE, TEAM_MEMBERS } from '@/lib/constants'


export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10">
          <div className="max-w-3xl">
            <motion.div variants={fadeUp}>
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans"><Star className="w-3 h-3 mr-1 fill-gold" /> About Us</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empowering Students to{' '}<span className="text-gradient">Achieve More</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl leading-relaxed font-sans">
              Since our founding in 2008, Pearls UniGlobal has been dedicated to transforming the study abroad experience for Pakistani students aspiring to study in the United Kingdom.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp}>
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">From Vision to <span className="text-gold">Impact</span></h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-sans">
                <p>Founded in 2008, Pearls UniGlobal Consultants is a premier and highly professional provider of education consultancy services based in Pearls Education City, Bhowana, Chiniot, Pakistan. What began as a vision to bridge the gap between talented Pakistani students and world-class UK education has since grown into a thriving consultancy trusted by thousands of families.</p>
                <p>Today, with over 1,500 enrolled students across three institutions under the Pearls family, we are dedicated to providing customer-oriented services that focus on individual care and personal attention to every student. Our team of professionals understands the challenges students face — from navigating complex visa requirements to choosing the right university.</p>
                <p>Our unwavering dedication to excellence has been the cornerstone of our journey, and we remain resolute in pursuing this vision with total devotion and unflinching integrity — making us one of Pakistan&apos;s most trusted study abroad consultancies for UK education.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {STATS.map((stat, idx) => (
                <Card key={idx} className="text-center border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-gold mb-1 font-sans">{stat.value}{stat.suffix}</p>
                    <p className="text-muted-foreground text-sm font-sans">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* MD Message */}
      <section className="section-padding bg-muted/30">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide">
          <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
            <Card className="border-gold/20 shadow-premium overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-gold" />
              <div className="absolute top-6 right-6 opacity-[0.06]">
                <Quote className="w-32 h-32 text-gold" />
              </div>
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-6 md:gap-10">
                  {/* MD Avatar */}
                  <div className="hidden sm:flex shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-gold/20 via-gold/10 to-navy/10 border-2 border-gold/20 items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-gold">MW</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
                      <Quote className="w-3 h-3 mr-1" /> Managing Director&apos;s Message
                    </Badge>
                    <blockquote className="text-muted-foreground leading-relaxed font-sans text-[15px] md:text-base italic mb-6">
                      &ldquo;{MD_MESSAGE.message}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                      <div>
                        <p className="font-bold text-foreground">{MD_MESSAGE.name}</p>
                        <p className="text-sm text-gold font-sans">{MD_MESSAGE.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={fadeUp}>
              <Card className="h-full border-gold/20 shadow-premium overflow-hidden">
                <div className="h-1.5 bg-gradient-gold" />
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed font-sans">{BRAND_IDENTITY.vision}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="h-full border-gold/20 shadow-premium overflow-hidden">
                <div className="h-1.5 bg-gradient-navy" />
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 dark:bg-navy-light/20 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-navy dark:text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed font-sans">{BRAND_IDENTITY.mission}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="container-wide">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Our Principles</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core <span className="text-gold">Values</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-sans">The three pillars that guide every decision we make and every student we serve.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Truth', desc: 'We are committed to honesty in every interaction — providing accurate information, realistic expectations, and genuine advice to each student.', gradient: 'from-gold/20 to-amber-500/10' },
              { icon: Sparkles, title: 'Transparency', desc: 'Our processes are open and clear. From fees to timelines, we ensure every student and parent understands each step of their journey.', gradient: 'from-blue-500/15 to-gold/10' },
              { icon: Heart, title: 'Trust', desc: 'Built over years of consistent results and unwavering dedication, our students and families trust us with their aspirations and dreams.', gradient: 'from-emerald-500/15 to-gold/10' },
            ].map((v, idx) => (
              <motion.div key={idx} variants={fadeUp} {...hoverLift}>
                <Card className="h-full border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 transition-colors duration-300 group-hover:scale-110 transform">
                      <v.icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-sans">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Team */}
      <section className="section-padding bg-muted/50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="container-wide">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans"><Users className="w-3 h-3 mr-1" /> Meet the Experts</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our <span className="text-gold">Team</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-sans">The dedicated professionals behind every successful student journey.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM_MEMBERS.slice(0, 5).map((member, idx) => (
              <motion.div key={idx} variants={fadeUp} {...hoverLift}>
                <Card className="h-full border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 group overflow-hidden">
                  {/* Photo / Avatar */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/90 to-navy-dark">
                        <span className="text-5xl font-bold text-gold/80">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <Badge className="bg-gold/90 text-navy border-0 text-xs font-sans font-semibold">{member.role}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-sans line-clamp-3">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="border-gold/30 text-gold hover:bg-gold/10 rounded-xl h-12 px-8 font-sans font-semibold">
              <Link href="/team">View Full Team <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-navy text-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin?</motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-8 text-lg font-sans">Schedule your free consultation and take the first step today.</motion.p>
          <motion.div variants={fadeUp}>
            <Button size="lg" asChild className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-12 px-8 font-sans">
              <Link href="/free-assessment">Get Started <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
