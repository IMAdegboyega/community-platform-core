'use client'

import React, { useState, useEffect } from 'react'
import { Filter, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RecommendationCard from '@/components/RecommendationCard'
import FilterModal from '@/components/FilterModal'
import { usersApi } from '@/lib/api'

const Community = () => {
  const router = useRouter()
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    gender: '',
    country: '',
    state: '',
    city: ''
  })

  // State for users
  const [hotPicks, setHotPicks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [followingState, setFollowingState] = useState({})

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        
        // Fetch suggested users (hot picks)
        const suggestionsResponse = await usersApi.getSuggestions(12)
        const suggestions = Array.isArray(suggestionsResponse) ? suggestionsResponse : []
        
        // Split into hot picks (first 6) and members (rest or search for more)
        setHotPicks(suggestions.slice(0, 6))
        setMembers(suggestions.slice(0, 12))
        
        // Initialize following state
        const initialFollowing = {}
        suggestions.forEach(user => {
          initialFollowing[user.id] = user.is_following || false
        })
        setFollowingState(initialFollowing)
        
        setError(null)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError(err.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // Revert on error
      setFollowingState(prev => ({
        ...prev,
        [user.id]: isCurrentlyFollowing
      }))
    }
  }

  const handleUserClick = (user) => {
    if (user.username) {
      router.push(`/profile/${user.username}`)
    }
  }

  const handleSaveFilters = (filters) => {
    setActiveFilters(filters)
    console.log('Filters saved:', filters)
    // TODO: Apply filtering logic when backend supports it
  }

  const getActiveGenderDisplay = () => {
    if (activeFilters.gender) {
      return activeFilters.gender.charAt(0).toUpperCase() + activeFilters.gender.slice(1)
    }
    return 'All'
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <span className="ml-3 text-gray-500">Loading community...</span>
        </div>
      </div>
    )
  }

  if (error && hotPicks.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="text-center py-20">
          <h2 className="text-gray-400 text-xl mb-2">Unable to load community</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Hot Picks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 mb:flex-row">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Hot Picks</h2>
            {activeFilters.gender && (
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400">Gender:</span>
                <button 
                  onClick={() => setActiveFilters(prev => ({ ...prev, gender: '' }))}
                  className="text-gray-600"
                >
                  {getActiveGenderDisplay()} ×
                </button>
              </div>
            )}
          </div>
          <Link href="/community/hot-picks" className="text-blue-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {hotPicks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users to show. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {hotPicks.map((user) => (
              <RecommendationCard
                key={user.id}
                image={user.profile_picture || '/img/avatar.png'}
                name={user.display_name || user.username}
                isVerified={user.is_verified}
                isSaved={followingState[user.id]}
                showBookmark={true}
                onClick={() => handleUserClick(user)}
                onSaveClick={() => handleFollowToggle(user)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Members</h2>
            {activeFilters.gender && (
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400">Gender:</span>
                <button 
                  onClick={() => setActiveFilters(prev => ({ ...prev, gender: '' }))}
                  className="text-gray-600"
                >
                  {getActiveGenderDisplay()} ×
                </button>
              </div>
            )}
          </div>
          <div
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded-lg"
          >
            <Filter size={16} />
            <span className="text-sm">Filter</span>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No members to show. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {members.map((member) => (
              <RecommendationCard
                key={member.id}
                image={member.profile_picture || '/img/avatar.png'}
                name={member.display_name || member.username}
                isVerified={member.is_verified}
                showBookmark={false}
                showLockOnHover={true}
                size="large"
                onClick={() => handleUserClick(member)}
              />
            ))}
          </div>
        )}
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
