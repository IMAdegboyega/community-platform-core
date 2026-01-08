import { navItems } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MobileNav = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <ul className="flex items-center justify-around h-14">
        {navItems.map(({ url, name, icon: Icon }) => {
          const isActive = pathname === url
          
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