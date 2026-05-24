'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

import { REAL_FAQS } from '@/lib/constants'

const faqCategories = REAL_FAQS

export default function FAQPageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container-wide relative z-10 text-center"
        >
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6">
              <HelpCircle className="w-3 h-3 mr-1" />
              Help Center
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
          >
            Find answers to common questions about studying abroad, visa
            applications, and our consultancy services.
          </motion.p>
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="container-wide max-w-4xl"
        >
          {faqCategories.map((cat, catIdx) => (
            <motion.div key={catIdx} variants={fadeUp} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-gold rounded-full" />
                {cat.category}
              </h2>
              <Accordion className="space-y-3">
                {cat.questions.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${catIdx}-${idx}`}
                    className="bg-card border border-border rounded-xl px-6 shadow-premium data-[state=open]:shadow-gold/10 data-[state=open]:border-gold/30 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-gold transition-colors py-5 font-sans text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5 font-sans">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Still have questions CTA */}
      <section className="section-padding bg-gradient-navy text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container-wide text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Still Have Questions?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/70 mb-8 max-w-xl mx-auto text-lg"
          >
            Our expert counselors are here to help. Get in touch for a free consultation.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              asChild
              className="bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-12 px-8"
            >
              <Link href="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8"
            >
              <a href="tel:+923446614448">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
