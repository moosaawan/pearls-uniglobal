'use client'

import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { BRAND, NAV_LINKS, SERVICES } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

const footerServices = SERVICES.slice(0, 6)

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Disclaimer', href: '/disclaimer' },
]

const socialLinks = [
  { icon: Globe, href: BRAND.social.facebook, label: 'Facebook' },
  { icon: Globe, href: BRAND.social.instagram, label: 'Instagram' },
  { icon: ExternalLink, href: BRAND.social.linkedin, label: 'LinkedIn' },
  { icon: Globe, href: BRAND.social.twitter, label: 'Twitter' },
  { icon: Globe, href: BRAND.social.youtube, label: 'YouTube' },
]


export default function Footer() {
  return (
    <footer className="relative bg-navy text-white/80 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/[0.02] blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Newsletter Section */}
      <div className="container-wide py-12 md:py-16">
        <div className="relative glass rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-white/60 text-sm md:text-base max-w-md">
              Subscribe to get the latest UK university news, scholarship opportunities, and visa updates.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 h-12 px-5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all text-sm"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-gradient-gold text-navy font-semibold text-sm hover:shadow-gold transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Main Footer Content */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo/uniglobal.png"
                  alt="Pearls UniGlobal Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">
                  Pearls <span className="text-gradient">UniGlobal</span>
                </span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {BRAND.description}
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-gold/20 text-white/60 hover:text-gold transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/free-assessment"
                  className="text-sm text-white/50 hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  Free Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-gold transition-colors group"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold/60 group-hover:text-gold transition-colors" />
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-green-400 transition-colors group"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 text-green-500/60 group-hover:text-green-400 transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-gold transition-colors group"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold/60 group-hover:text-gold transition-colors" />
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/60 flex-shrink-0" />
                {BRAND.address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Bottom Bar */}
      <div className="container-wide py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved. Made
            with <Heart className="w-3 h-3 inline text-red-400" /> in Pakistan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/40 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
