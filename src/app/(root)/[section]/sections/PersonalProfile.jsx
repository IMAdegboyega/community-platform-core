'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Settings, Share2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi, postsApi } from '@/lib/api';

const PersonalProfile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Posts')
  const [isOnline, setIsOnline] = useState(true)
  const [showBio, setShowBio] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Profile data
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = ['Posts', 'Photos', 'Videos', 'Followers', 'Following']

  useEffect(() => {
    if (user?.id) {
      fetchProfileData()
    }
  }, [user?.id])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      // Fetch user profile
      const profileData = await usersApi.getUser(user.id)
      setProfile(profileData)

      // Fetch user posts
      const { posts: userPosts } = await postsApi.getUserPosts(user.id, 20, 0)
      setPosts(userPosts || [])

      // Fetch followers
      const { users: followersList } = await usersApi.getFollowers(user.id, 20, 0)
      setFollowers(followersList || [])

      // Fetch following
      const { users: followingList } = await usersApi.getFollowing(user.id, 20, 0)
      setFollowing(followingList || [])
    } catch (error) {
      console.error('Failed to fetch profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/user/${user?.username || user?.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <div className="grid grid-cols-3 gap-1">
            {posts.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-500">
                No posts yet
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="aspect-square bg-gray-100 relative">
                  {post.media && post.media.length > 0 ? (
                    <Image
                      src={post.media[0].url}
                      alt="Post"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-2">
                      <p className="text-xs text-gray-600 line-clamp-3">{post.caption}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )
      case 'Photos':
        return (
          <div className="grid grid-cols-3 gap-1">
            {posts.filter(p => p.media?.some(m => m.type === 'image')).length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-500">
                No photos yet
              </div>
            ) : (
              posts
                .filter(p => p.media?.some(m => m.type === 'image'))
                .map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-100 relative">
                    <Image
                      src={post.media[0].url}
                      alt="Photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
            )}
          </div>
        )
      case 'Videos':
        return (
          <div className="grid grid-cols-3 gap-1">
            {posts.filter(p => p.media?.some(m => m.type === 'video')).length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-500">
                No videos yet
              </div>
            ) : (
              posts
                .filter(p => p.media?.some(m => m.type === 'video'))
                .map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-100 relative">
                    <video
                      src={post.media[0].url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
            )}
          </div>
        )
      case 'Followers':
        return (
          <div className="space-y-3">
            {followers.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No followers yet
              </div>
            ) : (
              followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={follower.profile_picture || '/img/avatar.png'}
                      alt={follower.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{follower.display_name || follower.username}</p>
                      <p className="text-sm text-gray-500">@{follower.username}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      case 'Following':
        return (
          <div className="space-y-3">
            {following.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Not following anyone yet
              </div>
            ) : (
              following.map((followed) => (
                <div key={followed.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={followed.profile_picture || '/img/avatar.png'}
                      alt={followed.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{followed.display_name || followed.username}</p>
                      <p className="text-sm text-gray-500">@{followed.username}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    Following
                  </button>
                </div>
              ))
            )}
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen bg-gray-50">
        <div className="bg-white p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayProfile = profile || user

  return (
    <div className="max-w-5xl mx-auto min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white md:hidden">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <h1 className="font-semibold text-gray-900">Profile</h1>
        <Settings className="w-6 h-6 text-gray-700" />
      </div>

      {/* Profile Header */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Mobile Layout */}
          <div className="flex flex-col items-center text-center md:hidden">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src={displayProfile?.profile_picture || '/img/avatar.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              {displayProfile?.display_name || displayProfile?.username}
            </h1>
            <p className="text-gray-500 text-sm mb-2">@{displayProfile?.username}</p>

            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{posts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{displayProfile?.followers_count || followers.length}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{displayProfile?.following_count || following.length}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>

            {displayProfile?.bio && (
              <p className="text-gray-700 text-sm px-2 mb-4">{displayProfile.bio}</p>
            )}

            <div className="flex items-center gap-3 w-full">
              <button className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden">
                  <img 
                    src={displayProfile?.profile_picture || '/img/avatar.png'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {displayProfile?.display_name || displayProfile?.username}
                </h1>
                <p className="text-gray-500">@{displayProfile?.username}</p>
                
                <div className="flex gap-6 my-4">
                  <div>
                    <span className="font-semibold">{posts.length}</span>
                    <span className="text-gray-500 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{displayProfile?.followers_count || followers.length}</span>
                    <span className="text-gray-500 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{displayProfile?.following_count || following.length}</span>
                    <span className="text-gray-500 ml-1">following</span>
                  </div>
                </div>

                {displayProfile?.bio && (
                  <p className="text-gray-700 max-w-md mb-4">{displayProfile.bio}</p>
                )}

                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit Profile
                  </button>
                  <button 
                    onClick={handleShare}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 mt-2">
        <div className="max-w-5xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-max px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-4 px-4">
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden" />
    </div>
  )
}

export default PersonalProfile
