'use client'

import Header from "@/components/Header"
import MobileNav from "@/components/MobileNav"
import SideBar from "@/components/SideBar"
import User from "@/components/User"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home({children}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }
 
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
 
  return (
    <main className="w-screen h-screen bg-gray-50 text-black relative flex flex-col">
      <Header openSidebar={() => setIsSidebarOpen(true)}/>
 
      <div className="flex flex-1 overflow-hidden">
        <section className="flex-col gap-4 hidden md:flex pl-4 lg:pl-16">
          <div className="pt-4">
            <Link href="/PersonalProfile">
              <div className="cursor-pointer">
                <User />
              </div>
            </Link>
          </div>
          <div>
            <SideBar/>
          </div>
        </section>

        <section className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </section>
      </div>
      <MobileNav/>
    </main>
  )
}