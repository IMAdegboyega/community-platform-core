'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { postsApi } from '@/lib/api'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedType, setFeedType] = useState('following') // 'following' or 'explore'

  useEffect(() => {
    fetchPosts()
  }, [feedType])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const feed = await postsApi.getFeed(feedType, 20, 0)
      setPosts(feed || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await postsApi.unlikePost(postId)
      } else {
        await postsApi.likePost(postId)
      }
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked, 
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1 
            }
          : post
      ))
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleSave = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await postsApi.unsavePost(postId)
      } else {
        await postsApi.savePost(postId)
      }
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, is_saved: !isSaved } : post
      ))
    } catch (error) {
      console.error('Failed to toggle save:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg mb-4" />
            <div className="flex gap-4">
              <div className="h-6 w-6 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h2 className="text-gray-400 text-xl mb-2">No New Posts</h2>
        <p className="text-gray-500 text-sm">
          {feedType === 'following' ? (
            <>
              You need to follow users in{' '}
              <Link href="/community" className="text-blue-600 cursor-pointer hover:underline">
                Community
              </Link>{' '}
              to see recent posts.
            </>
          ) : (
            'Check back later for new content!'
          )}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setFeedType('following')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedType === 'following' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setFeedType('explore')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedType === 'explore' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Explore
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Feed Type Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFeedType('following')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            feedType === 'following' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setFeedType('explore')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            feedType === 'explore' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Explore
        </button>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.user?.profile_picture || '/img/avatar.png'}
                alt={post.user?.username || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {post.user?.display_name || post.user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {post.location || new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Post Media */}
          {post.media && post.media.length > 0 && (
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={post.media[0].url}
                alt="Post media"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLike(post.id, post.is_liked)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Heart 
                    size={24} 
                    className={post.is_liked ? 'fill-red-500 text-red-500' : 'text-gray-700'} 
                  />
                </button>
                <button className="hover:opacity-70 transition-opacity">
                  <MessageCircle size={24} className="text-gray-700" />
                </button>
                <button className="hover:opacity-70 transition-opacity">
                  <Share2 size={24} className="text-gray-700" />
                </button>
              </div>
              <button 
                onClick={() => handleSave(post.id, post.is_saved)}
                className="hover:opacity-70 transition-opacity"
              >
                <Bookmark 
                  size={24} 
                  className={post.is_saved ? 'fill-black text-black' : 'text-gray-700'} 
                />
              </button>
            </div>

            {/* Likes Count */}
            {post.likes_count > 0 && (
              <p className="font-semibold text-sm text-gray-900 mb-2">
                {post.likes_count.toLocaleString()} likes
              </p>
            )}

            {/* Caption */}
            {post.caption && (
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{post.user?.username}</span>{' '}
                {post.caption}
              </p>
            )}

            {/* Comments Count */}
            {post.comments_count > 0 && (
              <button className="text-sm text-gray-500 mt-2">
                View all {post.comments_count} comments
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

export default Posts
