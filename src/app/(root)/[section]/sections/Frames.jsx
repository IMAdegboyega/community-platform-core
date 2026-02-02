'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Volume2,
  VolumeX,
  Loader2,
  Users,
  X
} from 'lucide-react'
import { postsApi, usersApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const Frames = () => {
  const { user: authUser } = useAuth()
  const [frames, setFrames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [activeFrameId, setActiveFrameId] = useState(null)

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        setLoading(true)
        // Get feed which includes photos and videos from followed users
        const response = await postsApi.getFeed('', 30, 0)
        const feedData = Array.isArray(response) ? response : (response.data || response.posts || [])
        
        // Filter to only posts with media
        const mediaFrames = feedData.filter(post => post.media && post.media.length > 0)
        setFrames(mediaFrames)
      } catch (err) {
        console.error('Failed to fetch frames:', err)
        setError('Failed to load frames')
        setFrames([])
      } finally {
        setLoading(false)
      }
    }

    fetchFrames()
  }, [])

  const handleLike = async (frameId) => {
    const frame = frames.find(f => f.id === frameId)
    if (!frame) return

    try {
      if (frame.is_liked) {
        await postsApi.unlikePost(frameId)
      } else {
        await postsApi.likePost(frameId)
      }
      
      setFrames(prev => prev.map(f => 
        f.id === frameId 
          ? { ...f, is_liked: !f.is_liked, likes_count: f.is_liked ? (f.likes_count || 1) - 1 : (f.likes_count || 0) + 1 }
          : f
      ))
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  const handleSave = async (frameId) => {
    const frame = frames.find(f => f.id === frameId)
    if (!frame) return

    try {
      if (frame.is_saved) {
        await postsApi.unsavePost(frameId)
      } else {
        await postsApi.savePost(frameId)
      }
      
      setFrames(prev => prev.map(f => 
        f.id === frameId 
          ? { ...f, is_saved: !f.is_saved }
          : f
      ))
    } catch (err) {
      console.error('Failed to toggle save:', err)
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const openComments = (frameId) => {
    setActiveFrameId(frameId)
    setShowComments(true)
  }

  const formatCount = (count) => {
    if (!count) return '0'
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
    return count.toString()
  }

  const isVideo = (mediaItem) => {
    if (!mediaItem) return false
    const url = mediaItem.media_url || ''
    const type = mediaItem.media_type || ''
    return type === 'video' || url.includes('.mp4') || url.includes('.mov') || url.includes('.webm')
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-2">Loading frames...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (frames.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Frames Yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Follow more people to see their photos and videos here.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Grid Layout */}
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Frames</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {frames.map((frame) => {
            const mediaItem = frame.media[0]
            const isVideoContent = isVideo(mediaItem)
            const author = frame.user || {}
            
            return (
              <Link 
                key={frame.id}
                href={`/post/${frame.id}`}
                className="relative aspect-square bg-black rounded-xl overflow-hidden cursor-pointer group"
              >
                {/* Thumbnail/Image */}
                <img
                  src={mediaItem?.media_url || '/img/avatar.png'}
                  alt="Frame"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className={`w-5 h-5 ${frame.is_liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                      <span className="text-white font-semibold text-sm">{formatCount(frame.likes_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold text-sm">{formatCount(frame.comments_count)}</span>
                    </div>
                  </div>
                </div>

                {/* Play Icon - ONLY for videos */}
                {isVideoContent && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-2">
                    <img
                      src={author.profile_picture || '/img/avatar.png'}
                      alt={author.username || 'User'}
                      className="rounded-full object-cover w-6 h-6"
                    />
                    <span className="text-white font-medium text-sm truncate">
                      {author.display_name || author.username || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Media Type Badge */}
                {isVideoContent && (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-white text-xs">Video</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowComments(false)} />
          <div className="relative bg-white w-full md:w-96 md:rounded-xl rounded-t-xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button onClick={() => setShowComments(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="font-semibold text-gray-900">Comments</h2>
              <div className="w-6" />
            </div>
            <div className="flex-1 p-4 text-center text-gray-500">
              <p>Comments coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Frames
