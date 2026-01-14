'use client'

import React, { useState } from 'react'
import { X, Image as ImageIcon, Video, MapPin, Globe, Lock, Users } from 'lucide-react'
import { postsApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const NewPost = ({ onPostCreated = () => {} }) => {
  const { user } = useAuth()
  const [postContent, setPostContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [location, setLocation] = useState('')

  const handlePost = async () => {
    if (!postContent.trim()) {
      setError('Please write something to post')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const newPost = await postsApi.createPost(
        postContent.trim(),
        visibility,
        location || null
      )
      setPostContent('')
      setLocation('')
      setVisibility('public')
      setIsModalOpen(false)
      onPostCreated(newPost)
    } catch (err) {
      console.error('Failed to create post:', err)
      setError(err.message || 'Failed to create post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
    setError('')
  }

  return (
    <>
      {/* Quick Post Input */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start gap-3">
          <img
            src={user?.profile_picture || '/img/avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="What's new..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onClick={openModal}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            <div className="flex items-center gap-4 mt-3 justify-end">
              <button
                onClick={openModal}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <ImageIcon size={20} className="text-gray-500" />
              </button>
              <button
                onClick={openModal}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Video size={20} className="text-gray-500" />
              </button>
              <button 
                onClick={openModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Post It!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Post</h2>
              <button
                onClick={() => !isLoading && setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.profile_picture || '/img/avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{user?.display_name || user?.username || 'User'}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {visibility === 'public' && <Globe size={12} />}
                    {visibility === 'followers' && <Users size={12} />}
                    {visibility === 'private' && <Lock size={12} />}
                    <span className="capitalize">{visibility}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full min-h-[150px] p-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
                autoFocus
                disabled={isLoading}
              />

              {/* Location Input */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                <MapPin size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Add location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Visibility Selector */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Who can see this?</p>
                <div className="flex gap-2">
                  {[
                    { value: 'public', label: 'Public', icon: Globe },
                    { value: 'followers', label: 'Followers', icon: Users },
                    { value: 'private', label: 'Only Me', icon: Lock },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setVisibility(value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
                        visibility === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      disabled={isLoading}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Media Upload Note */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-xs text-yellow-700">
                  📸 Media upload coming soon! For now, you can create text posts.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t">
              <button
                onClick={handlePost}
                disabled={isLoading || !postContent.trim()}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NewPost
