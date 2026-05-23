'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { BRAND } from '@/lib/constants'


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    reset()
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(212,175,55,0.1),transparent_60%)]" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container-wide relative z-10 text-center">
          <motion.div variants={fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-6 font-sans"><Mail className="w-3 h-3 mr-1" /> Contact Us</Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-2xl mx-auto font-sans">
            Have questions? We&apos;re here to help. Reach out and our expert counselors will guide you.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-padding">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: Info */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
              {[
                { icon: Phone, title: 'Phone', lines: [BRAND.phone, BRAND.phone2] },
                { icon: Mail, title: 'Email', lines: [BRAND.email] },
                { icon: MapPin, title: 'Office', lines: ['Pearls Education City, Jhang Road', 'Bhowana, Chiniot, Pakistan'] },
                { icon: Clock, title: 'Hours', lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 2:00 PM'] },
              ].map((item, idx) => (
                <Card key={idx} className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 font-sans">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-muted-foreground text-sm font-sans">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button asChild className="w-full !bg-[#25D366] hover:!bg-[#20BA56] !text-white rounded-xl h-12 font-sans shadow-md border-none">
                <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </motion.div>

            {/* Right: Form */}
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <Card className="border-border/50 shadow-premium">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-sans">Full Name</Label>
                        <Input id="name" {...register('name')} placeholder="Your full name" className="mt-1.5 h-11 rounded-xl font-sans" />
                        {errors.name && <p className="text-destructive text-xs mt-1 font-sans">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-sans">Email</Label>
                        <Input id="email" type="email" {...register('email')} placeholder="your@email.com" className="mt-1.5 h-11 rounded-xl font-sans" />
                        {errors.email && <p className="text-destructive text-xs mt-1 font-sans">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="font-sans">Phone (Optional)</Label>
                        <Input id="phone" {...register('phone')} placeholder="+92 300 000 0000" className="mt-1.5 h-11 rounded-xl font-sans" />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="font-sans">Subject</Label>
                        <Input id="subject" {...register('subject')} placeholder="How can we help?" className="mt-1.5 h-11 rounded-xl font-sans" />
                        {errors.subject && <p className="text-destructive text-xs mt-1 font-sans">{errors.subject.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="font-sans">Message</Label>
                      <Textarea id="message" {...register('message')} rows={5} placeholder="Tell us about your query..." className="mt-1.5 rounded-xl font-sans resize-none" />
                      {errors.message && <p className="text-destructive text-xs mt-1 font-sans">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl h-12 font-sans">
                      {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Google Maps */}
      <section className="h-[400px] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.8!2d73.05!3d33.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQzJzEyLjAiTiA3M8KwMDMnMDAuMCJF!5e0!3m2!1sen!2spk!4v1600000000000!5m2!1sen!2spk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Pearls UniGlobal Office Location"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </section>
    </div>
  )
}
