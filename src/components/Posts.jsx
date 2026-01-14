'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, X, Send, Copy, Check } from 'lucide-react'
import { postsApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const Posts = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedType, setFeedType] = useState('following')
  
  // Comments state
  const [showComments, setShowComments] = useState(null)
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)
  
  // Share state
  const [showShareModal, setShowShareModal] = useState(null)
  const [copied, setCopied] = useState(false)

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
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, is_saved: !isSaved } : post
      ))
    } catch (error) {
      console.error('Failed to toggle save:', error)
    }
  }

  // Comments functions
  const openComments = async (postId) => {
    setShowComments(postId)
    setLoadingComments(true)
    try {
      const { comments: postComments } = await postsApi.getComments(postId, 20, 0)
      setComments(prev => ({ ...prev, [postId]: postComments || [] }))
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handlePostComment = async (postId) => {
    if (!newComment.trim()) return
    
    setPostingComment(true)
    try {
      const comment = await postsApi.createComment(postId, newComment.trim())
      setComments(prev => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] || [])]
      }))
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments_count: (post.comments_count || 0) + 1 }
          : post
      ))
      setNewComment('')
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setPostingComment(false)
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await postsApi.deleteComment(commentId)
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
      }))
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments_count: Math.max(0, (post.comments_count || 1) - 1) }
          : post
      ))
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  // Share functions
  const handleShare = (postId) => {
    setShowShareModal(postId)
    setCopied(false)
  }

  const copyLink = (postId) => {
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              <Link href="/Community" className="text-blue-600 cursor-pointer hover:underline">
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

          {/* Post Caption (if no media) */}
          {(!post.media || post.media.length === 0) && post.caption && (
            <div className="px-4 py-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <p className="text-lg text-gray-800">{post.caption}</p>
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
                <button 
                  onClick={() => openComments(post.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <MessageCircle size={24} className="text-gray-700" />
                </button>
                <button 
                  onClick={() => handleShare(post.id)}
                  className="hover:opacity-70 transition-opacity"
                >
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

            {/* Caption (with media) */}
            {post.media && post.media.length > 0 && post.caption && (
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{post.user?.username}</span>{' '}
                {post.caption}
              </p>
            )}

            {/* Comments Count */}
            {post.comments_count > 0 && (
              <button 
                onClick={() => openComments(post.id)}
                className="text-sm text-gray-500 mt-2"
              >
                View all {post.comments_count} comments
              </button>
            )}
          </div>
        </article>
      ))}

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowComments(null)}
          />
          <div className="relative bg-white w-full md:max-w-lg md:rounded-xl rounded-t-xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Comments</h3>
              <button onClick={() => setShowComments(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (comments[showComments] || []).length === 0 ? (
                <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
              ) : (
                (comments[showComments] || []).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.user?.profile_picture || '/img/avatar.png'}
                      alt={comment.user?.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="font-semibold text-sm">{comment.user?.username}</p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        {comment.user?.id === user?.id && (
                          <button 
                            onClick={() => handleDeleteComment(showComments, comment.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <img
                  src={user?.profile_picture || '/img/avatar.png'}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment(showComments)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={postingComment}
                />
                <button
                  onClick={() => handlePostComment(showComments)}
                  disabled={!newComment.trim() || postingComment}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowShareModal(null)}
          />
          <div className="relative bg-white rounded-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Share Post</h3>
            
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg mb-4">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${showShareModal}`}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none"
              />
              <button
                onClick={() => copyLink(showShareModal)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-600" />}
              </button>
            </div>

            {copied && (
              <p className="text-sm text-green-600 text-center mb-4">Link copied to clipboard!</p>
            )}

            <button
              onClick={() => setShowShareModal(null)}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Posts
