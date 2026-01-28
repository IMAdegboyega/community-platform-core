'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Loader2 } from 'lucide-react'
import { postsApi } from '@/lib/api'

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [isSaved, setIsSaved] = useState(post.is_saved || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    // Optimistic update
    const wasLiked = isLiked
    setIsLiked(!wasLiked)
    setLikesCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1)
    
    try {
      if (wasLiked) {
        await postsApi.unlikePost(post.id)
      } else {
        await postsApi.likePost(post.id)
      }
    } catch (error) {
      // Revert on error
      console.error('Failed to toggle like:', error)
      setIsLiked(wasLiked)
      setLikesCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    // Optimistic update
    const wasSaved = isSaved
    setIsSaved(!wasSaved)
    
    try {
      if (wasSaved) {
        await postsApi.unsavePost(post.id)
      } else {
        await postsApi.savePost(post.id)
      }
    } catch (error) {
      // Revert on error
      console.error('Failed to toggle save:', error)
      setIsSaved(wasSaved)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Handle both user object and direct properties
  const username = post.user?.username || post.username || 'Unknown'
  const displayName = post.user?.display_name || post.user?.username || post.display_name || username
  const profilePicture = post.user?.profile_picture || post.profile_picture || '/img/avatar.png'
  const mediaUrls = post.media_urls || post.media || []

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <Link href={`/profile/${username}`} className="flex items-center gap-3">
          <img
            src={profilePicture}
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-900 hover:underline">
              {displayName}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Post Media */}
      {mediaUrls.length > 0 && (
        <div className={`relative ${mediaUrls.length === 1 ? 'aspect-square' : 'grid grid-cols-2 gap-0.5'} bg-gray-100`}>
          {mediaUrls.slice(0, 4).map((url, index) => (
            <div 
              key={index} 
              className={`relative ${mediaUrls.length === 1 ? 'w-full h-full' : 'aspect-square'} overflow-hidden`}
            >
              <img
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {mediaUrls.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{mediaUrls.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center gap-1 hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
              />
            </button>
            <Link href={`/post/${post.id}`} className="flex items-center gap-1 hover:opacity-70">
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </Link>
            <button className="flex items-center gap-1 hover:opacity-70">
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <Bookmark 
              className={`w-6 h-6 transition-colors ${isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-700'}`} 
            />
          </button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Comments Count */}
        {post.comments_count > 0 && (
          <Link href={`/post/${post.id}`} className="text-sm text-gray-500 hover:text-gray-700">
            View all {post.comments_count} comments
          </Link>
        )}
      </div>
    </div>
  )
}

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const fetchPosts = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true)
      }
      
      const currentOffset = isLoadMore ? offset : 0
      const response = await postsApi.getFeed('', limit, currentOffset)
      
      // Handle different response formats
      const newPosts = Array.isArray(response) ? response : (response?.data || [])
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }
      
      setHasMore(newPosts.length === limit)
      setOffset(currentOffset + newPosts.length)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      setError(err.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(true)
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Loader2 className="w-8 h-8 text-purple-500 mx-auto animate-spin" />
        <p className="text-gray-500 mt-4">Loading posts...</p>
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h2 className="text-gray-400 text-xl mb-2">Unable to load posts</h2>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button 
          onClick={() => fetchPosts()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h2 className="text-gray-400 text-xl mb-2">No Posts Yet</h2>
        <p className="text-gray-500 text-sm">
          Follow users in{' '}
          <Link href="/community" className="text-blue-600 cursor-pointer hover:underline">
            Community
          </Link>{' '}
          to see their posts, or create your own!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default Posts
