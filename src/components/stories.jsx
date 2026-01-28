'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { storiesApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const Stories = ({
  onStoryClick = () => {},
  onAddStory = () => {},
}) => {
  const { user } = useAuth()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollContainer = useRef(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await storiesApi.getStoriesFeed()
        const storyData = Array.isArray(response) ? response : []
        
        // Add "Your Story" at the beginning
        const yourStory = {
          id: 'your-story',
          name: 'Your Story',
          image: user?.profile_picture || '/img/avatar.png',
          isOwn: true,
        }
        
        // Transform API data to component format
        const transformedStories = storyData.map(story => ({
          id: story.id,
          name: story.user?.display_name || story.user?.username || 'User',
          image: story.user?.profile_picture || '/img/avatar.png',
          isOwn: false,
          hasUnviewed: !story.is_viewed,
          storyData: story,
        }))

        setStories([yourStory, ...transformedStories])
      } catch (error) {
        console.error('Failed to fetch stories:', error)
        // Show only "Your Story" on error
        setStories([{
          id: 'your-story',
          name: 'Your Story',
          image: user?.profile_picture || '/img/avatar.png',
          isOwn: true,
        }])
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [user])

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
      onAddStory()
      return
    }

    // Mark as viewed
    try {
      await storiesApi.viewStory(story.id)
    } catch (error) {
      console.error('Failed to mark story as viewed:', error)
    }

    onStoryClick(story.storyData || story)
  }

  if (loading) {
    return (
      <div className="relative p-4">
        <div className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide px-2 md:px-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='relative p-4'>
      {/* Left Arrow - Hidden on mobile */}
      <div
        onClick={() => scroll('left')}
        className='absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 hidden md:block'
      >
        <Image
          src="/icon/story-arrow-left.svg"
          alt="Left Arrow"
          width={16}
          height={16}
        />
      </div>

      {/* Stories Container */}
      <div
        ref={scrollContainer}
        className='flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide px-2 md:px-8'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stories.map((story) => (
          <div
            key={story.id}
            className='flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0'
            onClick={() => handleStoryClick(story)}
          >
            {/* Profile Image with Ring */}
            <div className='relative'>
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isOwn
                    ? 'bg-gray-300'
                    : story.hasUnviewed
                    ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500'
                    : 'bg-gray-300'
                }`}
              >
                <div className='w-full h-full bg-white rounded-full p-0.5'>
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={60}
                    height={60}
                    className='w-full h-full rounded-full object-cover'
                  />
                </div>
              </div>

              {/* Plus Icon for Your Story */}
              {story.isOwn && (
                <div className='absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5'>
                  <Plus size={12} className='text-white' />
                </div>
              )}
            </div>

            {/* Name Label */}
            <span className='text-xs text-gray-700 text-center max-w-16 truncate'>
              {story.name}
            </span>
          </div>
        ))}
      </div>

      {/* Right Arrow - Hidden on mobile */}
      <div
        onClick={() => scroll('right')}
        className='absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 hidden md:block'
      >
        <Image
          src="/icon/story-arrow-right.svg"
          alt="Right Arrow"
          width={16}
          height={16}
        />
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Stories