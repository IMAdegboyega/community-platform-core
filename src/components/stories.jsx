import React from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Image from 'next/image'

const Stories = ({
  stories = [
    { id: 1, name: 'Your Story', image: '/api/placeholder/60/60', isOwn: true },
    { id: 2, name: 'Extacy', image: '/api/placeholder/60/60' },
    { id: 3, name: 'Valerie', image: '/api/placeholder/60/60' },
    { id: 4, name: 'Celine', image: '/api/placeholder/60/60' },
    { id: 5, name: 'Roman', image: '/api/placeholder/60/60' },
    { id: 6, name: 'Roman', image: '/api/placeholder/60/60' },
    { id: 7, name: 'Nice', image: '/api/placeholder/60/60' },
    { id: 8, name: 'May', image: '/api/placeholder/60/60' },
  ],
  onStoryClick = () => {},
  onAddStory = () => {},
}) => {
  const scrollContainer = React.useRef(null)

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 200
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
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
            onClick={() => (story.isOwn ? onAddStory() : onStoryClick(story))}
          >
            {/* Profile Image with Ring */}
            <div className='relative'>
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isOwn
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500'
                }`}
              >
                <div className='w-full h-full bg-white rounded-full p-0.5'>
                  {/* <img
                    src={story.image}
                    alt={story.name}
                    className='w-full h-full rounded-full object-cover'
                  /> */}
                  <Image
                    src='/img/avatar.png'
                    alt='avatar'
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