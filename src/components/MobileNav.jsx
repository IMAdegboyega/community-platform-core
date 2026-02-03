'use client';

import { navItems } from '@/constants'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const MobileNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await logout()
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/sign-in')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <ul className="flex items-center justify-around h-14">
        {navItems.map(({ url, name, icon: Icon }) => {
          const isActive = pathname === url
          const isLogout = name === 'Logout'
          
          if (isLogout) {
            return (
              <li key={url}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-6 px-6 py-3 transition-all"
                >
                  <Icon className="w-5 h-5 text-red-500" />
                </button>
              </li>
            )
          }
          
          return (
            <li key={url}>
              <Link
                href={url}
                className={'flex items-center gap-6 px-6 py-3 transition-all'}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-700'}`} />
                
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileNav