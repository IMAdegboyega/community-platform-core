'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search, X, UserPlus, Check } from 'lucide-react'
import { usersApi } from '@/lib/api'

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [followingStatus, setFollowingStatus] = useState({})
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchValue.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchValue.trim())
      }, 300)
    } else {
      setResults([])
      setShowResults(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue])

  const performSearch = async (query) => {
    setIsSearching(true)
    try {
      const users = await usersApi.searchUsers(query, 10, 0)
      setResults(users || [])
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleFollow = async (userId) => {
    try {
      const isFollowing = followingStatus[userId]
      if (isFollowing) {
        await usersApi.unfollow(userId)
      } else {
        await usersApi.follow(userId)
      }
      setFollowingStatus(prev => ({
        ...prev,
        [userId]: !isFollowing
      }))
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const clearSearch = () => {
    setSearchValue('')
    setResults([])
    setShowResults(false)
  }

  const handleIconClick = () => {
    setIsExpanded(true)
  }

  const handleBlur = () => {
    if (!searchValue) {
      setIsExpanded(false)
    }
  }

  return (
    <div className="w-full max-w-md relative" ref={searchRef}>
      {/* Desktop version */}
      <div className="hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => searchValue.trim().length >= 2 && setShowResults(true)}
            className="w-full pl-10 pr-10 py-2 text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile version */}
      <div className="block md:hidden">
        {!isExpanded ? (
          <button
            onClick={handleIconClick}
            className="p-3 text-gray-600 hover:text-blue-500 transition-colors duration-200"
          >
            <Search className="w-6 h-6" />
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-full pl-10 pr-10 py-2 text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No users found for "{searchValue}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profile_picture || '/img/avatar.png'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {user.display_name || user.username}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(user.id)
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      followingStatus[user.id]
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followingStatus[user.id] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
