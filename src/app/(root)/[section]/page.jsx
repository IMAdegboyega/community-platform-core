import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

const sections = {
  Notification: dynamic(() => import('./sections/Notification')),
  PersonalProfile: dynamic(() => import('./sections/PersonalProfile')),
  community: dynamic(() => import('./sections/Community')),
  frames: dynamic(() => import('./sections/Frames')),
  dates: dynamic(() => import('./sections/Dates')),
  messages: dynamic(() => import('./sections/Messages')),
  wallet: dynamic(() => import('./sections/Wallet')),
  settings: dynamic(() => import('./sections/Settings')),
}

export default function SectionPage({ params }) {
  const { section } = params
  const SectionComponent = sections[section]
  
  if (!SectionComponent) {
    notFound()
  }
  
  return <SectionComponent />
}