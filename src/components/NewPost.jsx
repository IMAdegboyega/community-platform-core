import React, { useState } from 'react'
import Image from 'next/image'
import PostModal from './PostModal'

const NewPost = ({ 
  userImage = '/api/placeholder/40/40',
  onPost = () => {}
}) => {
  const [postContent, setPostContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState('media')

  const handlePost = () => {
    if (postContent.trim()) {
      onPost({ content: postContent })
      setPostContent('')
    }
  }

  const handleModalSubmit = (formData) => {
    // Handle different modal configurations
    onPost({
      content: postContent,
      ...formData
    })
    setPostContent('')
  }

  const openModal = (config = 'media') => {
    // Remove the content check - allow modal to open even with empty input
    setModalConfig(config)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start gap-3">
          <img
            src={userImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="What's new..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-4 py-2 rounded-none text-sm focus:outline-none focus:ring-0"
            />
            <div className="flex items-center gap-4 mt-3 justify-end">
              <div 
                onClick={() => openModal('media')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icon/photo-camera.svg"
                  alt="camera"
                  width={20}
                  height={20}
                />
              </div>
              <div 
                onClick={() => openModal('media')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icon/video-camera.svg"
                  alt="video"
                  width={20}
                  height={20}
                />
              </div>
              <button 
                onClick={handlePost}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Post It!
              </button>
            </div>
          </div>
        </div>
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        config="subscription"
        initialData={{ postContent }}
      />
    </>
  )
}

export default NewPost