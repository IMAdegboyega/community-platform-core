'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RecommendationCard from './RecommendationCard'

const Recommendations = ({ 
  recommendations = [
    { id: 1, name: 'Elena', image: '/api/placeholder/150/150', isVerified: true, isSaved: true },
    { id: 2, name: 'Sofia', image: '/api/placeholder/150/150', isVerified: true, isSaved: false },
    { id: 3, name: 'Maria', image: '/api/placeholder/150/150', isVerified: false, isSaved: false },
    { id: 4, name: 'Anna', image: '/api/placeholder/150/150', isVerified: true, isSaved: false },
    { id: 5, name: 'Lisa', image: '/api/placeholder/150/150', isVerified: true, isSaved: false },
    { id: 6, name: 'Emma', image: '/api/placeholder/150/150', isVerified: false, isSaved: false },
    { id: 7, name: 'Olivia', image: '/api/placeholder/150/150', isVerified: true, isSaved: false },
    { id: 8, name: 'Mia', image: '/api/placeholder/150/150', isVerified: true, isSaved: false },
  ],
  onUserClick = () => {},
  onSaveUser = () => {}
}) => {
  const [showAll, setShowAll] = useState(false)
  
  // Show only first 6 on desktop unless "See All" is clicked
  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, 6)

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
                      src={user.image}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-sm font-medium text-gray-900 text-center truncate w-full">
                    {user.name}
                  </p>

                  {/* Follow Button */}
                  <button 
                    onClick={() => onSaveUser(user)}
                    className={`mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors w-full ${
                      user.isSaved 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
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
              image={user.image}
              name={user.name}
              isVerified={user.isVerified}
              isSaved={user.isSaved}
              onClick={() => onUserClick(user)}
              onSaveClick={() => onSaveUser(user)}
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