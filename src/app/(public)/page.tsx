'use client'

import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import {
  GraduationCap, ArrowRight, MessageCircle, Star, MapPin, Users,
  CheckCircle, Shield, BookOpen, FileText, Stethoscope, Award,
  Plane, ChevronDown, Phone, Mail, Clock, Globe,
} from 'lucide-react'
import { SERVICES, STATS, VISA_TIMELINE, BRAND } from '@/lib/constants'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

/* ========== ICON MAP ========== */
const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck: CheckCircle,
  GraduationCap,
  FileText,
  BookOpen,
  Shield,
  Stethoscope,
  Users,
  Award,
  Plane,
}

/* ========== ANIMATED COUNTER ========== */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 40, stiffness: 100 })
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.floor(latest) + suffix
    })
    return unsubscribe
  }, [spring, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ========== TESTIMONIALS DATA ========== */
const testimonials = [
  { name: 'Ayesha Tariq', uni: 'University of Manchester', text: 'Pearls UniGlobal made my dream of studying in the UK a reality. Their guidance was exceptional from start to finish!', rating: 5 },
  { name: 'Hassan Mehmood', uni: 'University of Birmingham', text: 'The team was incredibly supportive throughout my visa process. I got my visa approved on the first attempt!', rating: 5 },
  { name: 'Sana Fatima', uni: 'University of Leeds', text: 'From IELTS preparation to pre-departure briefing, Pearls UniGlobal handled everything professionally.', rating: 5 },
  { name: 'Usman Ali', uni: 'University of Edinburgh', text: 'I was confused about university selection, but their expert counselors helped me find the perfect match for my career goals.', rating: 5 },
  { name: 'Zainab Khan', uni: 'UCL London', text: 'The scholarship guidance saved me thousands of pounds. I highly recommend Pearls UniGlobal to every student!', rating: 5 },
]

const faqs = [
  { q: 'What services does Pearls UniGlobal offer?', a: 'We offer comprehensive study abroad services including profile assessment, university selection, SOP guidance, IELTS preparation, visa guidance, TB test booking, interview preparation, scholarship guidance, and pre-departure assistance.' },
  { q: 'Is the initial consultation free?', a: 'Yes! Your first consultation is completely free with no obligations. We assess your profile and provide honest guidance about your options.' },
  { q: 'What is your visa success rate?', a: 'We have a 98% visa success rate, one of the highest in Pakistan. Our meticulous documentation process and expert guidance ensure maximum chances of approval.' },
  { q: 'How long does the entire process take?', a: 'The entire process typically takes 3-6 months from initial consultation to enrollment, depending on the intake and university processing times.' },
  { q: 'Do you help with scholarships?', a: 'Absolutely! We actively identify and help you apply for scholarships, bursaries, and funding opportunities to make your UK education more affordable.' },
  { q: 'Can I study in the UK without IELTS?', a: 'Some UK universities accept alternative English tests or offer pre-sessional courses. Our counselors can guide you on the best options for your situation.' },
]

/* ========== MAIN HOMEPAGE ========== */
export default function HomePage() {
  const { user } = useAuthStore()

  const getPortalPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin'
    if (user.role === 'staff') return '/staff'
    return '/student'
  }

  const portalPath = getPortalPath()

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center bg-gradient-hero text-white overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.08),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070E18] to-transparent" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="container-wide relative z-10 py-32 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-gold" />
                  Pakistan&apos;s Premier UK Consultancy
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
              >
                Your Journey to{' '}
                <span className="text-gradient">UK Education</span>{' '}
                Starts Here
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-white/70 mb-8 max-w-lg leading-relaxed font-sans"
              >
                Expert guidance for university placement, visa applications,
                and IELTS preparation. Join 2,500+ successful students.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-4"
              >
                {user ? (
                  <Button
                    size="lg"
                    asChild
                    className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-13 px-8 shadow-gold text-base font-sans"
                  >
                    <Link href={portalPath}>
                      Go to Portal Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    asChild
                    className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-13 px-8 shadow-gold text-base font-sans"
                  >
                    <Link href="/free-assessment">
                      Book Free Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  asChild
                  className="!bg-[#25D366] hover:!bg-[#20BA56] !text-white border-none rounded-xl h-13 px-8 text-base font-sans shadow-lg shadow-green-500/20"
                >
                  <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                    WhatsApp Us
                  </a>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10"
              >
                <div className="flex -space-x-3">
                  {['AT', 'HM', 'SF', 'UA'].map((init, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-navy-light border-2 border-navy flex items-center justify-center text-xs font-bold text-gold font-sans">
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-white/50 text-sm mt-0.5 font-sans">
                    Trusted by 2,500+ students
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full h-[500px]">
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-8 left-8 glass-card rounded-2xl p-6 w-72"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm font-sans">Visa Approved!</p>
                      <p className="text-white/50 text-xs font-sans">University of Manchester</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs font-sans">Sarah just received her UK student visa 🎉</p>
                </motion.div>

                {/* Stats card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-44 right-0 glass-card rounded-2xl p-5 w-56"
                >
                  <p className="text-gold text-3xl font-bold font-sans">98%</p>
                  <p className="text-white/60 text-sm font-sans">Visa Success Rate</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-gradient-gold rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Universities card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 left-16 glass-card rounded-2xl p-5 w-64"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-gold" />
                    <p className="text-white font-semibold text-sm font-sans">150+ Partner Universities</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['Oxford', 'Cambridge', 'UCL', 'Manchester', 'Leeds'].map((u) => (
                      <span key={u} className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/70 font-sans">{u}</span>
                    ))}
                  </div>
                </motion.div>

                {/* Decorative gradient orbs */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative -mt-1 bg-navy py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold mb-2 font-sans">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/60 text-sm font-sans">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section-padding bg-background">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why <span className="text-gold">Pearls UniGlobal</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              We combine expertise, technology, and genuine care to deliver
              an unmatched study abroad experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '98% Visa Success', desc: 'Industry-leading visa approval rate with meticulous documentation and preparation.' },
              { icon: GraduationCap, title: 'UK-Educated Team', desc: 'Our counselors are UK graduates who understand the system firsthand.' },
              { icon: Users, title: 'Personalized Guidance', desc: 'One-on-one counseling tailored to your unique profile and goals.' },
              { icon: Globe, title: '150+ Universities', desc: 'Strong partnerships with top UK universities including Russell Group.' },
              { icon: Clock, title: 'End-to-End Support', desc: 'From profile assessment to pre-departure briefing — we handle everything.' },
              { icon: Award, title: 'Scholarship Experts', desc: 'We help identify and secure scholarships to reduce your financial burden.' },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="h-full border-border/50 shadow-premium hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
                  <div className="h-1 bg-gradient-gold w-0 group-hover:w-full transition-all duration-500" />
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-sans">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-sans">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SERVICES SHOWCASE ===== */}
      <section className="section-padding bg-muted/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Comprehensive <span className="text-gold">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              Everything you need for a successful study abroad journey, all under one roof.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = iconMap[service.icon] || CheckCircle
              return (
                <motion.div key={idx} variants={fadeUp}>
                  <Card className="h-full border-border/50 shadow-sm hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-lg bg-navy/5 dark:bg-navy-light/20 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                        <Icon className="w-5 h-5 text-navy dark:text-gold group-hover:text-gold transition-colors" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-2 font-sans">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-sans">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-12">
            <Button size="lg" asChild className="bg-navy hover:bg-navy-light text-white rounded-xl h-12 px-8 font-sans">
              <Link href="/services">
                View All Services <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== VISA TIMELINE ===== */}
      <section className="section-padding bg-background">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">The Process</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Your Path to the <span className="text-gold">UK</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              A simple, structured process that takes you from dream to reality.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {VISA_TIMELINE.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="flex gap-6 mb-8 last:mb-0"
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-navy font-bold text-sm shrink-0 shadow-gold font-sans">
                    {item.step}
                  </div>
                  {idx < VISA_TIMELINE.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gold/20 mt-2" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-foreground mb-1 font-sans">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-sans">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-navy text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4 font-sans">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="text-gradient">Students</span> Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="h-full bg-white/5 border-white/10 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6 font-sans">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gold/20 text-gold text-sm font-bold font-sans">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold text-sm font-sans">{t.name}</p>
                        <p className="text-white/50 text-xs font-sans">{t.uni}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="section-padding bg-background">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide max-w-3xl"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 font-sans">FAQs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Common <span className="text-gold">Questions</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Accordion className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-card border border-border/50 rounded-xl px-6 shadow-sm data-[state=open]:shadow-premium data-[state=open]:border-gold/30 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-gold transition-colors py-5 font-sans text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm font-sans">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center mt-8">
            <Button variant="outline" asChild className="rounded-xl font-sans">
              <Link href="/faqs">View All FAQs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section-padding bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container-wide text-center relative z-10"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your{' '}
            <span className="text-gradient">UK Journey</span>?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-white/70 mb-8 max-w-xl mx-auto font-sans">
            Take the first step towards your international education.
            Book a free consultation with our expert counselors today.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Button
                size="lg"
                asChild
                className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-13 px-8 shadow-gold text-base font-sans"
              >
                <Link href={portalPath}>
                  Go to Portal Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-13 px-8 shadow-gold text-base font-sans"
              >
                <Link href="/free-assessment">
                  Start Free Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
            <Button
              size="lg"
              asChild
              className="!bg-[#25D366] hover:!bg-[#20BA56] !text-white border-none rounded-xl h-13 px-8 text-base font-sans shadow-lg shadow-green-500/20"
            >
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                WhatsApp Us
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CONTACT STRIP ===== */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <p className="font-semibold text-foreground text-sm font-sans">Call Us</p>
              <p className="text-muted-foreground text-sm font-sans">{BRAND.phone}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <p className="font-semibold text-foreground text-sm font-sans">Email Us</p>
              <p className="text-muted-foreground text-sm font-sans">{BRAND.email}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <p className="font-semibold text-foreground text-sm font-sans">Visit Us</p>
              <p className="text-muted-foreground text-sm font-sans">{BRAND.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
