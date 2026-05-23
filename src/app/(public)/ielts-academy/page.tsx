import type { Metadata } from 'next'
import IELTSContent from './ielts-content'

export const metadata: Metadata = {
  title: 'IELTS Academy',
  description: 'Expert IELTS preparation at Pearls UniGlobal Academy. Achieve your target band score with personalized coaching, mock tests, and proven strategies.',
}

export default function IELTSPage() {
  return <IELTSContent />
}
