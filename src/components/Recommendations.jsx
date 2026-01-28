'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RecommendationCard from './RecommendationCard'
import { usersApi } from '@/lib/api'

const Recommendations = ({ 
  onUserClick = () => {},
  onSaveUser = () => {}
}) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [followingState, setFollowingState] = useState({}) // Track follow state locally

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        const response = await usersApi.getSuggestions(10)
        const users = Array.isArray(response) ? response : []
        setRecommendations(users)
        // Initialize following state
        const initialState = {}
        users.forEach(user => {
          initialState[user.id] = user.is_following || false
        })
        setFollowingState(initialState)
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const handleFollowToggle = async (user) => {
    const isCurrentlyFollowing = followingState[user.id]
    
    // Optimistic update
    setFollowingState(prev => ({
      ...prev,
      [user.id]: !isCurrentlyFollowing
    }))

    try {
      if (isCurrentlyFollowing) {
        await usersApi.unfollow(user.id)
      } else {
        await usersApi.follow(user.id)
      }
      onSaveUser(user)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // Revert on error
      setFollowingState(prev => ({
        ...prev,
        [user.id]: isCurrentlyFollowing
      }))
    }
  }

  // Show only first 6 on desktop unless "See All" is clicked
  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 6)

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Suggestions for you</h3>
        <p className="text-gray-500 text-sm text-center py-4">No suggestions available</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile/Tablet - Horizontal Scrollable */}
      <div className="lg:hidden bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Suggested for you</h3>
          <button className="text-sm text-blue-600 font-medium">See All</button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {recommendations.map((user) => (
              <div 
                key={user.id} 
                className="flex-shrink-0 w-28"
              >
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div 
                    onClick={() => onUserClick(user)}
                    className="relative cursor-pointer mb-2"
                  >
                    <img
                      src={user.profile_picture || '/img/avatar.png'}
                      alt={user.username || 'User'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    {user.is_verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-sm font-medium text-gray-900 text-center truncate w-full">
                    {user.display_name || user.username}
                  </p>

                  {/* Follow Button */}
                  <button 
                    onClick={() => handleFollowToggle(user)}
                    className={`mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors w-full ${
                      followingState[user.id]
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followingState[user.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop - Grid Layout in Sidebar */}
      <div className="hidden lg:block bg-white rounded-lg p-4 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Suggestions for you</h3>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            {showAll ? 'Show Less' : 'See All'}
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-3">
          {displayedRecommendations.map((user) => (
            <RecommendationCard
              key={user.id}
              image={user.profile_picture || '/img/avatar.png'}
              name={user.display_name || user.username}
              isVerified={user.is_verified}
              isSaved={followingState[user.id]}
              onClick={() => onUserClick(user)}
              onSaveClick={() => handleFollowToggle(user)}
            />
          ))}
        </div>

        {/* View More Button */}
        {!showAll && recommendations.length > 6 && (
          <button 
            onClick={() => setShowAll(true)}
            className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            View {recommendations.length - 6} more
          </button>
        )}
      </div>
    </>
  )
}

export default Recommendations