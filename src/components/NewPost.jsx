'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { X, ImageIcon, Video, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { postsApi } from '@/lib/api'

const NewPost = ({ onPostCreated = () => {} }) => {
  const { user } = useAuth()
  const [postContent, setPostContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const userImage = user?.profile_picture || '/img/avatar.png'

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Limit to 4 files
    const newFiles = files.slice(0, 4 - selectedFiles.length)
    
    // Create previews
    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }))

    setSelectedFiles(prev => [...prev, ...newFiles])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url)
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handlePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) {
      setError('Please add some content or media to your post')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      let response

      if (selectedFiles.length > 0) {
        // Create post with media - NOT SUPPORTED YET
        // The backend doesn't have file upload capability
        // For now, just create a text post
        setError('Media upload is not supported yet. Creating text post only.')
        response = await postsApi.createTextPost(postContent)
      } else {
        // Create text-only post (backend expects 'caption' field)
        response = await postsApi.createTextPost(postContent)
      }

      // Clear form
      setPostContent('')
      setSelectedFiles([])
      setPreviews([])
      
      // Notify parent
      onPostCreated(response)
    } catch (err) {
      console.error('Failed to create post:', err)
      setError(err.message || 'Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3">
        <img
          src={userImage}
          alt={user?.username || 'Profile'}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <textarea
            placeholder="What's new..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full px-2 py-2 rounded-none text-sm focus:outline-none focus:ring-0 resize-none min-h-[60px]"
            rows={2}
          />

          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {preview.type === 'video' ? (
                    <video 
                      src={preview.url} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={preview.url} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3 justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFiles.length >= 4 || isSubmitting}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              <ImageIcon size={20} className="text-gray-500" />
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFiles.length >= 4 || isSubmitting}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              <Video size={20} className="text-gray-500" />
            </button>
            
            <button 
              onClick={handlePost}
              disabled={isSubmitting || (!postContent.trim() && selectedFiles.length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                'Post It!'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost
