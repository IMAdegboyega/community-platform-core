'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Loader2, 
  Send,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { postsApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const SinglePostPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user: authUser, isAuthenticated } = useAuth()
  const postId = params.id

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in')
      return
    }
    
    if (postId) {
      fetchPost()
      fetchComments()
    }
  }, [postId, isAuthenticated])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await postsApi.getPost(postId)
      const postData = response.data || response
      setPost(postData)
      setIsLiked(postData.is_liked || false)
      setIsSaved(postData.is_saved || false)
      setLikesCount(postData.likes_count || 0)
      setCommentsCount(postData.comments_count || 0)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch post:', err)
      setError(err.message || 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      setLoadingComments(true)
      const response = await postsApi.getComments(postId, 50, 0)
      const commentsData = Array.isArray(response) ? response : (response.data || [])
      setComments(commentsData)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    const wasLiked = isLiked
    setIsLiked(!wasLiked)
    setLikesCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1)
    
    try {
      if (wasLiked) {
        await postsApi.unlikePost(postId)
      } else {
        await postsApi.likePost(postId)
      }
    } catch (error) {
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
    
    const wasSaved = isSaved
    setIsSaved(!wasSaved)
    
    try {
      if (wasSaved) {
        await postsApi.unsavePost(postId)
      } else {
        await postsApi.savePost(postId)
      }
    } catch (error) {
      console.error('Failed to toggle save:', error)
      setIsSaved(wasSaved)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    try {
      const response = await postsApi.addComment(postId, commentText.trim())
      const newComment = response.data || response
      setComments(prev => [newComment, ...prev])
      setCommentText('')
      setCommentsCount(prev => prev + 1)
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmittingComment(false)
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

  const nextMedia = () => {
    const mediaUrls = getMediaUrls()
    setCurrentMediaIndex(prev => (prev + 1) % mediaUrls.length)
  }

  const prevMedia = () => {
    const mediaUrls = getMediaUrls()
    setCurrentMediaIndex(prev => (prev - 1 + mediaUrls.length) % mediaUrls.length)
  }

  const getMediaUrls = () => {
    if (!post) return []
    const mediaItems = post.media || []
    return mediaItems.map(m => typeof m === 'string' ? m : m.media_url).filter(Boolean)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 mx-auto animate-spin" />
          <p className="text-gray-500 mt-4">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-gray-800 text-xl font-semibold mb-2">Post Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'This post may have been deleted or is unavailable.'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const username = post.user?.username || post.username || 'Unknown'
  const displayName = post.user?.display_name || post.user?.username || post.display_name || username
  const profilePicture = post.user?.profile_picture || post.profile_picture || '/img/avatar.png'
  const caption = post.caption || post.content || ''
  const mediaUrls = getMediaUrls()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Post</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Desktop: Side by side layout */}
        <div className="md:flex md:bg-white md:my-6 md:rounded-lg md:shadow-sm md:overflow-hidden">
          {/* Media Section */}
          {mediaUrls.length > 0 && (
            <div className="relative md:w-1/2 bg-black flex items-center justify-center">
              <div className="relative w-full aspect-square">
                <img
                  src={mediaUrls[currentMediaIndex]}
                  alt={`Post media ${currentMediaIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation arrows */}
                {mediaUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextMedia}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {mediaUrls.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMediaIndex(idx)}
                          className={`w-2 h-2 rounded-full ${idx === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className={`bg-white flex flex-col ${mediaUrls.length > 0 ? 'md:w-1/2' : 'w-full'}`}>
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 border-b">
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
                  <p className="text-xs text-gray-500">@{username}</p>
                </div>
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Caption */}
            {caption && (
              <div className="p-4 border-b">
                <div className="flex gap-3">
                  <Link href={`/profile/${username}`}>
                    <img
                      src={profilePicture}
                      alt={username}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  </Link>
                  <div>
                    <p className="text-sm">
                      <Link href={`/profile/${username}`} className="font-semibold hover:underline">
                        {username}
                      </Link>{' '}
                      <span className="text-gray-800">{caption}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(post.created_at)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto max-h-80 md:max-h-96 p-4 space-y-4">
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No comments yet</p>
                  <p className="text-sm">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Link href={`/profile/${comment.user?.username || 'unknown'}`}>
                      <img
                        src={comment.user?.profile_picture || '/img/avatar.png'}
                        alt={comment.user?.username || 'User'}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    </Link>
                    <div className="flex-1">
                      <p className="text-sm">
                        <Link 
                          href={`/profile/${comment.user?.username || 'unknown'}`}
                          className="font-semibold hover:underline"
                        >
                          {comment.user?.username || 'Unknown'}
                        </Link>{' '}
                        <span className="text-gray-800">{comment.content}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="border-t p-4">
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
                  <button className="flex items-center gap-1 hover:opacity-70">
                    <MessageCircle className="w-6 h-6 text-gray-700" />
                  </button>
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
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
                </p>
              )}

              {/* Time */}
              <p className="text-xs text-gray-500 uppercase">{formatDate(post.created_at)}</p>
            </div>

            {/* Comment Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
                <img
                  src={authUser?.profile_picture || '/img/avatar.png'}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                  disabled={isSubmittingComment}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="text-blue-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Post'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePostPage
