'use client'

import React from 'react'
import Stories from '@/components/Stories'
import NewPost from '@/components/NewPost'
import Posts from '@/components/Posts'
import Recommendations from '@/components/Recommendations'

const HomePage = () => {
  const handlePost = (content) => {
    console.log('New post:', content)
  }

  const handleImageUpload = () => {
    console.log('Image upload clicked')
  }

  const handleCamera = () => {
    console.log('Camera clicked')
  }

  const handleUserClick = (user) => {
    console.log('User clicked:', user)
  }

  const handleSaveUser = (user) => {
    console.log('Save user:', user)
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
          <NewPost 
            onPost={handlePost}
            onImageClick={handleImageUpload}
            onCameraClick={handleCamera}
          />

          {/* Feed Area */}
          <Posts />
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