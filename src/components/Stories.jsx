'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { storiesApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const Stories = ({ onStoryClick = () => {} }) => {
  const { user } = useAuth()
  const scrollContainer = useRef(null)
  const [storiesFeed, setStoriesFeed] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Create story modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [storyCaption, setStoryCaption] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  
  // Story viewer
  const [viewingStory, setViewingStory] = useState(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const feed = await storiesApi.getStoriesFeed()
      const transformedStories = [
        { id: 'own', name: 'Your Story', image: user?.profile_picture || '/img/avatar.png', isOwn: true },
        ...(feed || []).map(userStory => ({
          id: userStory.user?.id,
          name: userStory.user?.username || userStory.user?.display_name,
          image: userStory.user?.profile_picture || '/img/avatar.png',
          hasUnread: userStory.has_unread,
          stories: userStory.stories,
        }))
      ]
      setStoriesFeed(transformedStories)
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      setStoriesFeed([
        { id: 'own', name: 'Your Story', image: user?.profile_picture || '/img/avatar.png', isOwn: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 200
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleStoryClick = async (story) => {
    if (story.isOwn) {
      setShowCreateModal(true)
    } else {
      // View story
      setViewingStory(story)
      setCurrentStoryIndex(0)
      
      // Mark as viewed
      if (story.stories && story.stories.length > 0) {
        try {
          await storiesApi.viewStory(story.stories[0].id)
        } catch (e) {
          console.error('Failed to mark story as viewed:', e)
        }
      }
    }
  }

  const handleCreateStory = async () => {
    setIsCreating(true)
    setCreateError('')
    
    try {
      // For now, create a text-based story (media upload not implemented)
      // In a real app, you'd upload media first and get the URL
      const newStory = await storiesApi.createStory(
        '/img/avatar.png', // Placeholder media URL
        'image',
        storyCaption || null,
        5
      )
      
      setStoryCaption('')
      setShowCreateModal(false)
      fetchStories() // Refresh stories
    } catch (error) {
      console.error('Failed to create story:', error)
      setCreateError(error.message || 'Failed to create story')
    } finally {
      setIsCreating(false)
    }
  }

  const nextStory = async () => {
    if (viewingStory?.stories && currentStoryIndex < viewingStory.stories.length - 1) {
      const nextIndex = currentStoryIndex + 1
      setCurrentStoryIndex(nextIndex)
      try {
        await storiesApi.viewStory(viewingStory.stories[nextIndex].id)
      } catch (e) {
        console.error('Failed to mark story as viewed:', e)
      }
    } else {
      setViewingStory(null)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className='relative p-4'>
        <div className='flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide px-2 md:px-8'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-2 flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse' />
              <div className='w-12 h-3 bg-gray-200 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='relative p-4'>
        {/* Left Arrow */}
        <div
          onClick={() => scroll('left')}
          className='absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 hidden md:block hover:bg-gray-100 rounded-full'
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </div>

        {/* Stories Container */}
        <div
          ref={scrollContainer}
          className='flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide px-2 md:px-8'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {storiesFeed.map((story) => (
            <div
              key={story.id}
              className='flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0'
              onClick={() => handleStoryClick(story)}
            >
              <div className='relative'>
                <div
                  className={`w-16 h-16 rounded-full p-0.5 ${
                    story.isOwn
                      ? 'bg-gray-300'
                      : story.hasUnread
                      ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <div className='w-full h-full bg-white rounded-full p-0.5'>
                    <Image
                      src={story.image || '/img/avatar.png'}
                      alt={story.name}
                      width={60}
                      height={60}
                      className='w-full h-full rounded-full object-cover'
                    />
                  </div>
                </div>

                {story.isOwn && (
                  <div className='absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5'>
                    <Plus size={12} className='text-white' />
                  </div>
                )}
              </div>

              <span className='text-xs text-gray-700 text-center max-w-16 truncate'>
                {story.name}
              </span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <div
          onClick={() => scroll('right')}
          className='absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 hidden md:block hover:bg-gray-100 rounded-full'
        >
          <ChevronRight size={20} className="text-gray-600" />
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => !isCreating && setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Story</h2>
              <button
                onClick={() => !isCreating && setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isCreating}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {/* Preview Area */}
              <div className="aspect-[9/16] bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  {storyCaption ? (
                    <p className="text-xl font-medium">{storyCaption}</p>
                  ) : (
                    <p className="text-white/70">Your story preview</p>
                  )}
                </div>
              </div>

              {/* Caption Input */}
              <textarea
                placeholder="Add a caption to your story..."
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                disabled={isCreating}
              />

              {/* Note about media */}
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  📸 Photo/video upload coming soon! For now, create text-based stories.
                </p>
              </div>

              {createError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{createError}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleCreateStory}
                disabled={isCreating}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Share Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {viewingStory && viewingStory.stories && viewingStory.stories.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setViewingStory(null)}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <X size={24} />
          </button>

          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-16 flex gap-1">
            {viewingStory.stories.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 flex-1 rounded-full ${
                  idx <= currentStoryIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* User Info */}
          <div className="absolute top-12 left-4 flex items-center gap-3">
            <img
              src={viewingStory.image || '/img/avatar.png'}
              alt={viewingStory.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">{viewingStory.name}</p>
              <p className="text-white/70 text-xs">
                {new Date(viewingStory.stories[currentStoryIndex]?.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Story Content */}
          <div className="w-full max-w-md aspect-[9/16] relative">
            {viewingStory.stories[currentStoryIndex]?.media_type === 'image' ? (
              <Image
                src={viewingStory.stories[currentStoryIndex]?.media_url || '/img/avatar.png'}
                alt="Story"
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <p className="text-white text-xl font-medium text-center p-6">
                  {viewingStory.stories[currentStoryIndex]?.caption || 'Story'}
                </p>
              </div>
            )}

            {/* Caption Overlay */}
            {viewingStory.stories[currentStoryIndex]?.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-center">
                  {viewingStory.stories[currentStoryIndex].caption}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full"
            style={{ display: currentStoryIndex === 0 ? 'none' : 'block' }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <ChevronRight size={32} />
          </button>

          {/* Tap areas for mobile */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full" onClick={prevStory} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full" onClick={nextStory} />
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default Stories
