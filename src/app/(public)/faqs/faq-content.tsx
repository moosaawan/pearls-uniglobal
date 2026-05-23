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

const faqCategories = [
  {
    category: 'Study in UK',
    questions: [
      {
        q: 'What are the basic requirements to study in the UK?',
        a: 'To study in the UK, you typically need: a valid passport, academic transcripts and certificates, English language proficiency (IELTS/PTE), a Statement of Purpose (SOP), reference letters, proof of financial capability, and a valid TB test certificate. Requirements may vary by university and program level.',
      },
      {
        q: 'How long does it take to get a UK student visa?',
        a: 'The standard UK student visa processing time is approximately 3-4 weeks from the date of your biometrics appointment. However, we recommend applying at least 6-8 weeks before your course start date. Priority visa services are also available for faster processing at an additional cost.',
      },
      {
        q: 'Can I work while studying in the UK?',
        a: 'Yes! International students on a Tier 4/Student visa can work up to 20 hours per week during term time and full-time during holidays. After completing your degree, you may be eligible for the Graduate Route visa, allowing you to work for 2 years (3 years for PhD graduates).',
      },
      {
        q: 'What is the average cost of studying in the UK?',
        a: 'Tuition fees vary by university and program. Undergraduate programs typically range from £10,000 to £38,000 per year, while postgraduate programs range from £11,000 to £35,000 per year. Living costs are estimated at £9,207 to £12,006 per year outside/inside London respectively.',
      },
    ],
  },
  {
    category: 'IELTS & English',
    questions: [
      {
        q: 'What IELTS score do I need for UK universities?',
        a: 'Most UK universities require an overall IELTS score of 6.0 to 7.0 for undergraduate programs and 6.5 to 7.5 for postgraduate programs. Some universities accept lower scores with pre-sessional English courses. We can help you find universities that match your current score.',
      },
      {
        q: 'Do you offer IELTS preparation classes?',
        a: 'Yes! Our IELTS Academy offers comprehensive preparation courses including one-on-one coaching, group classes, mock tests, and study materials. Our experienced trainers help students achieve their target band scores with personalized strategies.',
      },
      {
        q: 'Are there alternatives to IELTS?',
        a: 'Yes, many UK universities also accept PTE Academic, TOEFL iBT, Cambridge English, and Duolingo English Test. Some universities offer their own English proficiency tests. We can guide you on which test is best for your target universities.',
      },
    ],
  },
  {
    category: 'Visa Process',
    questions: [
      {
        q: 'What documents are needed for a UK student visa?',
        a: 'Key documents include: CAS (Confirmation of Acceptance for Studies) from your university, valid passport, proof of financial funds, TB test certificate, academic transcripts, IELTS/English test results, passport-size photographs, and visa application form. Our team will guide you through each document requirement.',
      },
      {
        q: 'What is a CAS number and how do I get one?',
        a: 'CAS (Confirmation of Acceptance for Studies) is a unique reference number issued by your UK university after you accept their offer and pay the required deposit. It contains information about your course, fees, and personal details. Your university issues it electronically — you cannot apply for a student visa without it.',
      },
      {
        q: 'What if my visa gets rejected?',
        a: 'While visa rejections are uncommon with proper preparation (our success rate is 98%), if it happens, we analyze the rejection reason, help you address the issues, and reapply. Common reasons include insufficient funds, incomplete documentation, or credibility concerns — all of which we proactively address.',
      },
    ],
  },
  {
    category: 'Our Services',
    questions: [
      {
        q: 'Is the initial consultation really free?',
        a: 'Absolutely! Your first consultation is completely free with no obligations. During this session, we assess your profile, discuss your goals, and provide an honest evaluation of your options for studying in the UK.',
      },
      {
        q: 'How long does the entire process take from start to enrollment?',
        a: 'The entire process typically takes 3-6 months, depending on the intake. This includes university selection (1-2 weeks), application preparation (2-3 weeks), university response (2-8 weeks), visa application (3-4 weeks), and pre-departure preparation (2-3 weeks).',
      },
      {
        q: 'Do you guarantee university admission?',
        a: 'While we cannot guarantee admission as it depends on the university\'s decision, our expert counselors have a proven track record of successful placements. We carefully match your profile with suitable universities to maximize your chances of acceptance.',
      },
      {
        q: 'What makes Pearls UniGlobal different from other consultancies?',
        a: 'We pride ourselves on personalized attention, transparent processes, a 98% visa success rate, end-to-end support from profile assessment to pre-departure briefing, expert IELTS training, and strong relationships with top UK universities. Our counselors are UK-educated professionals who understand the system firsthand.',
      },
    ],
  },
]

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
              <a href="tel:+923000000000">
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
