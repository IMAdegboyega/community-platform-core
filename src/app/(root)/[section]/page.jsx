import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

const sections = {
    PersonalProfile: dynamic(() => import('./sections/PersonalProfile')),
  Notification: dynamic(() => import('./sections/Notification')),
  community: dynamic(() => import('./sections/Community')),
  frames: dynamic(() => import('./sections/Frames')),
  dates: dynamic(() => import('./sections/Dates')),
  messages: dynamic(() => import('./sections/Messages')),
  wallet: dynamic(() => import('./sections/Wallet')),
  settings: dynamic(() => import('./sections/Settings')),
}

export default async function SectionPage({ params }) {
  const { section } = await params   

  const SectionComponent = sections[section]

  if (!SectionComponent) {
    notFound()
  }

  return <SectionComponent />
}
