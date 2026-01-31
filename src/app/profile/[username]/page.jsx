'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Settings, 
  Grid3X3, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Loader2,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  MapPin,
  Calendar,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react'
import { usersApi, postsApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const ProfilePage = () => {
  const { username } = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowingYou, setIsFollowingYou] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  const isOwnProfile = currentUser && user && currentUser.id === user.id

  useEffect(() => {
    if (username) {
      fetchUserProfile()
    }
  }, [username])

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user, activeTab])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = await usersApi.getUserByUsername(username)
      setUser(userData)
      setIsFollowing(userData.is_following || false)
      setIsFollowingYou(userData.is_following_you || false)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setError(err.message || 'User not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    if (!user) return
    
    try {
      setPostsLoading(true)
      
      if (activeTab === 'posts') {
        const response = await postsApi.getUserPosts(user.id, 30, 0)
        const postsData = Array.isArray(response) ? response : (response?.data || [])
        setPosts(postsData)
      } else if (activeTab === 'saved' && isOwnProfile) {
        const response = await postsApi.getSavedPosts(30, 0)
        const postsData = Array.isArray(response) ? response : (response?.data || [])
        setPosts(postsData)
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleFollow = async () => {
    if (followLoading || !user) return
    setFollowLoading(true)
    
    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)
    
    try {
      if (wasFollowing) {
        await usersApi.unfollow(user.id)
      } else {
        await usersApi.follow(user.id)
      }
      // Refresh user data to get updated counts
      await fetchUserProfile()
    } catch (err) {
      console.error('Failed to toggle follow:', err)
      setIsFollowing(wasFollowing)
    } finally {
      setFollowLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
        <p className="text-gray-500 mb-4">{error || 'This profile does not exist.'}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 flex items-center gap-1">
                {user.display_name || user.username}
                {user.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
                )}
              </h1>
              <p className="text-xs text-gray-500">{formatNumber(user.posts_count || 0)} posts</p>
            </div>
          </div>
          
          {isOwnProfile ? (
            <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5" />
            </Link>
          ) : (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Profile Info */}
      <div className="max-w-2xl mx-auto bg-white">
        <div className="p-4">
          {/* Avatar and Stats Row */}
          <div className="flex items-start gap-6 mb-4">
            <img
              src={user.profile_picture || '/img/avatar.png'}
              alt={user.username}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-100"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{formatNumber(user.posts_count || 0)}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <Link href={`/profile/${username}/followers`} className="text-center hover:opacity-70">
                  <p className="font-bold text-gray-900">{formatNumber(user.followers_count || 0)}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </Link>
                <Link href={`/profile/${username}/following`} className="text-center hover:opacity-70">
                  <p className="font-bold text-gray-900">{formatNumber(user.following_count || 0)}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </Link>
              </div>
              
              {/* Follow/Edit Button */}
              {isOwnProfile ? (
                <Link 
                  href="/personal-profile"
                  className="block w-full py-2 px-4 text-center bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200"
                >
                  Edit Profile
                </Link>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {followLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Following
                      </>
                    ) : isFollowingYou ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow Back
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                  <Link
                    href="/messages"
                    className="py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200"
                  >
                    Message
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-1">
              {user.display_name || user.username}
              {user.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            
            {user.bio && (
              <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a 
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {user.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.created_at)}
                </span>
              )}
            </div>

            {/* Following You Badge */}
            {isFollowingYou && !isOwnProfile && (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                Follows you
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="hidden sm:inline">Posts</span>
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline">Saved</span>
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-2xl mx-auto bg-white min-h-[200px]">
        {postsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Grid3X3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Posts Yet</h3>
            <p className="text-gray-500 text-sm">
              {isOwnProfile 
                ? (activeTab === 'saved' 
                    ? "Posts you save will appear here." 
                    : "Share your first post!")
                : `${user.display_name || user.username} hasn't posted yet.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map((post) => {
              const mediaUrl = post.media?.[0]?.media_url || post.media?.[0]
              const caption = post.caption || post.content || ''
              
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="relative aspect-square bg-gray-100 group"
                >
                  {mediaUrl ? (
                    <img
                      src={mediaUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-purple-50 to-pink-50">
                      <p className="text-xs text-gray-600 line-clamp-3 text-center">
                        {caption}
                      </p>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <Heart className="w-5 h-5 fill-current" />
                      {post.likes_count || 0}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <MessageCircle className="w-5 h-5 fill-current" />
                      {post.comments_count || 0}
                    </span>
                  </div>
                  
                  {/* Multiple Media Indicator */}
                  {post.media?.length > 1 && (
                    <div className="absolute top-2 right-2">
                      <Grid3X3 className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
