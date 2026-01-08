import React from 'react'
import SearchBar from './SearchBar'
import Image from 'next/image'
import Link from 'next/link'

const Header = ({ openSidebar }) => {
  return (
    <div className='flex bg-white'>
      <div className='flex items-center gap-2 p-4 relative'>
        <Image
          src="/icon/logo.svg"
          alt="Logo"
          width={50}
          height={100}
        />
        <h1 className='text-2xl font-bold text-black hidden md:block'>Kiekky</h1>
      </div>

      <div className="ml-auto flex items-center gap-6 p-6">
        <SearchBar />

        {/* Mobile profile picture - only shows on mobile */}
        <Link href="/PersonalProfile" className="md:hidden">

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            {/* <img
              src={profileImage}
              alt={`${name}'s profile`}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            /> */}
            <Image
              src="/img/lady.png"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover flex items-center justify-center w-full h-full"
            />
          </div>

        </Link>
      </div>
    </div>
  )
}

export default Header