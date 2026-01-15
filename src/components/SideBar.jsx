import { navItems } from '@/constants';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white rounded-none gap-6 shadow-none p-4 pl-0 pr-0 h-full hidden md:block w-16 lg:w-56">
      <nav>
        <ul className="space-y-2">
          {navItems.map(({ url, name, icon: Icon }) => {
            const isActive = pathname === url;

            return (
              <li key={url}>
                <Link
                  href={url}
                  className={`flex items-center gap-4 px-4 lg:px-6 py-3 transition-all justify-center lg:justify-start
                    ${isActive ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-gray-100'}
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-700'}`} />
                  <span
                    className={`text-sm font-medium hidden lg:block ${
                      isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;