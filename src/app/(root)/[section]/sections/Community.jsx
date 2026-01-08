'use client'

import React, { useState } from 'react'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import RecommendationCard from '@/components/RecommendationCard'
import FilterModal from '@/components/FilterModal'

const Community = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    gender: 'female',
    country: '',
    state: '',
    city: ''
  })

  // Sample data for hot picks
  const hotPicks = [
    { id: 1, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
    { id: 2, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
    { id: 3, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
    { id: 4, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
    { id: 5, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
    { id: 6, name: 'Elena', image: '/api/placeholder/150/200', isVerified: true, isSaved: false },
  ]

  // Sample data for members
  const members = [
    { id: 1, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 2, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 3, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 4, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 5, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 6, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 7, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 8, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 9, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 10, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 11, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
    { id: 12, name: 'Elena', image: '/api/placeholder/200/250', isVerified: false },
  ]

  const handleSaveUser = (user) => {
    console.log('Saving user:', user)
    // Add your save logic here
  }

  const handleUserClick = (user) => {
    console.log('User clicked:', user)
    // Add navigation logic here
  }

  const handleSaveFilters = (filters) => {
    setActiveFilters(filters)
    console.log('Filters saved:', filters)
    // Apply filtering logic to your members list here
  }

  const getActiveGenderDisplay = () => {
    if (activeFilters.gender) {
      return activeFilters.gender.charAt(0).toUpperCase() + activeFilters.gender.slice(1)
    }
    return 'All'
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Hot Picks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 mb:flex-row">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Hot Picks</h2>
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400">Gender:</span>
              <button className="text-gray-600">{getActiveGenderDisplay()} ×</button>
            </div>
          </div>
          <Link href="/community/hot-picks" className="text-blue-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {/* Hot Picks Grid - Using RecommendationCard with bookmark */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {hotPicks.map((user) => (
            <RecommendationCard
              key={user.id}
              image={user.image}
              name={user.name}
              isVerified={user.isVerified}
              isSaved={user.isSaved}
              showBookmark={true}  // Show bookmark for hot picks
              onClick={() => handleUserClick(user)}
              onSaveClick={() => handleSaveUser(user)}
            />
          ))}
        </div>
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Members</h2>
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400">Gender:</span>
              <button className="text-gray-600">Female ×</button>
            </div>
          </div>
          <div
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
          >
            <Filter size={16} />
            <span className="text-sm">Filter</span>
          </div>
        </div>

        {/* Members Grid - Using RecommendationCard without bookmark */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {members.map((member) => (
            <RecommendationCard
              key={member.id}
              image={member.image}
              name={member.name}
              isVerified={member.isVerified}
              showBookmark={false}  // Hide bookmark for members
              showLockOnHover={true}  // Show lock on hover for members
              size="large"  // Larger size for members section
              onClick={() => handleUserClick(member)}
            />
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onSave={handleSaveFilters}
        initialFilters={activeFilters}
      />

    </div>
  )
}

export default Community