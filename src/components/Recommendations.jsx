'use client'

import React, { useState, useEffect } from 'react'
import { usersApi } from '@/lib/api'
import RecommendationCard from './RecommendationCard'

const Recommendations = ({ 
  onUserClick = () => {},
  onSaveUser = () => {}
}) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const suggestions = await usersApi.getSuggestions(12)
      setRecommendations((suggestions || []).map(user => ({
        id: user.id,
        name: user.display_name || user.username,
        username: user.username,
        image: user.profile_picture || '/img/avatar.png',
        isVerified: user.is_verified,
        isSaved: false,
      })))
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (user) => {
    try {
      if (user.isSaved) {
        await usersApi.unfollow(user.id)
      } else {
        await usersApi.follow(user.id)
      }
      setRecommendations(recommendations.map(r => 
        r.id === user.id ? { ...r, isSaved: !r.isSaved } : r
      ))
      onSaveUser({ ...user, isSaved: !user.isSaved })
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 6)

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 border border-gray-100 rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Suggestions for you</h3>
        <p className="text-sm text-gray-500 text-center py-8">No suggestions available</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile/Tablet */}
      <div className="lg:hidden bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Suggested for you</h3>
          <button className="text-sm text-blue-600 font-medium">See All</button>
        </div>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {recommendations.map((user) => (
              <div key={user.id} className="flex-shrink-0 w-28">
                <div className="flex flex-col items-center">
                  <div onClick={() => onUserClick(user)} className="relative cursor-pointer mb-2">
                    <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 text-center truncate w-full">{user.name}</p>
                  <button 
                    onClick={() => handleFollow(user)}
                    className={`mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors w-full ${
                      user.isSaved ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {user.isSaved ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-lg p-4 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Suggestions for you</h3>
          <button onClick={() => setShowAll(!showAll)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
            {showAll ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayedRecommendations.map((user) => (
            <RecommendationCard
              key={user.id}
              image={user.image}
              name={user.name}
              isVerified={user.isVerified}
              isSaved={user.isSaved}
              onClick={() => onUserClick(user)}
              onSaveClick={() => handleFollow(user)}
            />
          ))}
        </div>
        {!showAll && recommendations.length > 6 && (
          <button onClick={() => setShowAll(true)} className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            View {recommendations.length - 6} more
          </button>
        )}
      </div>
    </>
  )
}

export default Recommendations
