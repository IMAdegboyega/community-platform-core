'use client'

import NewPost from '@/components/NewPost'
import Posts from '@/components/Posts'
import Recommendations from '@/components/Recommendations'
import Stories from '@/components/stories'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()
  const [feedKey, setFeedKey] = useState(0)

  // Refresh the feed by changing the key (forces Posts component to remount)
  const handlePostCreated = useCallback((newPost) => {
    setFeedKey(prev => prev + 1)
  }, [])

  const handleUserClick = (user) => {
    // Navigate to user profile
    if (user.username) {
      router.push(`/profile/${user.username}`)
    }
  }

  const handleSaveUser = (user) => {
    // Follow action is handled inside Recommendations component
    console.log('User follow toggled:', user.username)
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Stories Section */}
      <Stories />

      {/* Mobile/Tablet Recommendations - Horizontal Scroll */}
      <div className="px-4 mt-4 lg:hidden">
        <Recommendations
          onUserClick={handleUserClick}
          onSaveUser={handleSaveUser}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 mt-4 lg:mt-6">
        {/* Left Content - Post Creation and Feed */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Create Post Section */}
          <NewPost onPostCreated={handlePostCreated} />

          {/* Feed Area - key prop forces remount when changed */}
          <Posts key={feedKey} />
        </div>

        {/* Right Sidebar - Desktop Recommendations */}
        <div className="hidden lg:block lg:col-span-1">
          <Recommendations 
            onUserClick={handleUserClick}
            onSaveUser={handleSaveUser}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
