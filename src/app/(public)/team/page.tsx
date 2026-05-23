import type { Metadata } from 'next'
import TeamPageContent from './team-content'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the expert counselors and team behind Pearls UniGlobal Consultants. UK-educated professionals dedicated to your study abroad success.',
}

export default function TeamPage() {
  return <TeamPageContent />
}
