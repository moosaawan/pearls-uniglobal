import type { Metadata } from 'next'
import FAQPageContent from './faq-content'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about studying in the UK, visa applications, IELTS preparation, and our consultancy services at Pearls UniGlobal.',
}

export default function FAQsPage() {
  return <FAQPageContent />
}
