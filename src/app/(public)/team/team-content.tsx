'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, hoverLift } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Mail, Phone } from 'lucide-react'
import { TEAM_MEMBERS, BRAND } from '@/lib/constants'

export default function TeamPageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container-wide relative z-10 text-center"
        >
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans">
              <Users className="w-3 h-3 mr-1" />
              Our Leadership & Consultants
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Meet Our <span className="text-gradient">Professional Team</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-sans"
          >
            Dedicated and certified professionals guiding you through every step of your UK study visa and university admission process.
          </motion.p>
        </motion.div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-background">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div key={idx} variants={fadeUp} {...hoverLift}>
                <Card className="h-full border-border/50 shadow-premium hover:shadow-premium-lg transition-all duration-500 overflow-hidden group flex flex-col">
                  {/* Photo / Avatar */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50 shrink-0">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/95 to-navy-dark">
                        <span className="text-6xl font-bold text-gold/80">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <Badge className="bg-gold text-navy border-0 text-xs font-sans font-bold shadow-md">
                        {member.role}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 font-sans group-hover:text-gold transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                        {member.bio}
                      </p>
                    </div>

                    {/* Team Member Contact / Details */}
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                      <span className="text-xs text-gold font-sans font-medium uppercase tracking-wider">
                        UK Specialist
                      </span>
                      <div className="flex gap-2.5">
                        <a
                          href={`mailto:${BRAND.email}`}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-gold/20 hover:text-gold flex items-center justify-center text-muted-foreground transition-all duration-300"
                          title="Email Admissions"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${BRAND.phone}`}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-gold/20 hover:text-gold flex items-center justify-center text-muted-foreground transition-all duration-300"
                          title="Call Hotline"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Join Team CTA */}
      <section className="section-padding bg-muted/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container-wide text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Need Expert Guidance?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg font-sans">
            Our certified study visa counselors are here to help you secure admission and visa approvals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#20BA56] transition-colors font-sans shadow-md"
            >
              Contact on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
