'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Volume2,
  VolumeX,
  Music,
  X,
  Link,
  Flag,
  UserX,
  EyeOff,
  Download,
  Copy
} from 'lucide-react'

// Comment Modal Component
const CommentModal = ({ isOpen, onClose, frame }) => {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        username: 'pandaenggi',
        avatar: '/img/lady.png'
      },
      text: 'It says "STOP!!"',
      time: '1d',
      likes: 33539,
      isLiked: false,
      replies: 10
    },
    {
      id: 2,
      user: {
        username: 'g.h.o.s.t_242',
        avatar: '/img/lady.png'
      },
      text: "That's a DONT FUCKING MOVE sign 😭",
      time: '1d',
      likes: 12420,
      isLiked: false,
      replies: 3
    },
    {
      id: 3,
      user: {
        username: 'vibes_only',
        avatar: '/img/lady.png'
      },
      text: 'This is hilarious 😂😂',
      time: '2d',
      likes: 892,
      isLiked: true,
      replies: 0
    }
  ])

  const handleLikeComment = (id) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 
          }
        : comment
    ))
  }

  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
    return count.toString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full md:w-96 md:rounded-xl rounded-t-xl max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="font-semibold text-gray-900">Comments</h2>
          <div className="w-6" />
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <Image
                src={comment.user.avatar}
                alt={comment.user.username}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{comment.user.username}</span>
                      <span className="text-gray-500 ml-2 text-xs">{comment.time}</span>
                    </p>
                    <p className="text-sm text-gray-800 mt-0.5">{comment.text}</p>
                  </div>
                  
                  {/* Like Button */}
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className="p-1"
                  >
                    <Heart 
                      className={`w-4 h-4 ${comment.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">{formatCount(comment.likes)} likes</span>
                  <button className="text-xs text-gray-500 font-medium">Reply</button>
                </div>

                {/* View Replies */}
                {comment.replies > 0 && (
                  <button className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-px bg-gray-300" />
                    <span className="text-xs text-gray-500 font-medium">
                      View all {comment.replies} replies
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-200 p-3 flex items-center gap-3">
          <Image
            src="/img/lady.png"
            alt="Your avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">😊</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Share Modal Component
const ShareModal = ({ isOpen, onClose }) => {
  const shareOptions = [
    { icon: Link, label: 'Copy Link' },
    { icon: Send, label: 'Send via DM' },
    { icon: Download, label: 'Save Video' },
    { icon: Copy, label: 'Share to Story' }
  ]

  const quickShare = [
    { username: 'john_doe', avatar: '/img/lady.png' },
    { username: 'jane_smith', avatar: '/img/lady.png' },
    { username: 'cool_user', avatar: '/img/lady.png' },
    { username: 'friend_123', avatar: '/img/lady.png' },
    { username: 'bestie', avatar: '/img/lady.png' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full md:w-96 md:rounded-xl rounded-t-xl max-h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="font-semibold text-gray-900">Share</h2>
          <div className="w-6" />
        </div>

        {/* Quick Share - Horizontal Scroll */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Quick Share</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {quickShare.map((user, index) => (
              <button key={index} className="flex flex-col items-center gap-1 flex-shrink-0">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <span className="text-xs text-gray-700 truncate w-16 text-center">{user.username}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Share Options */}
        <div className="p-2">
          {shareOptions.map((option, index) => (
            <button 
              key={index}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <option.icon className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Options Modal Component
const OptionsModal = ({ isOpen, onClose, onReport }) => {
  const options = [
    { icon: Flag, label: 'Report', danger: true },
    { icon: UserX, label: 'Not Interested' },
    { icon: EyeOff, label: 'Hide' },
    { icon: Link, label: 'Copy Link' },
    { icon: Download, label: 'Save' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full md:w-80 md:rounded-xl rounded-t-xl">
        {/* Options */}
        <div className="py-2">
          {options.map((option, index) => (
            <button 
              key={index}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                option.danger ? 'text-red-500' : 'text-gray-900'
              }`}
            >
              <option.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="border-t border-gray-200 p-2">
          <button 
            onClick={onClose}
            className="w-full p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Frames Component
const Frames = () => {
  const [frames, setFrames] = useState([
    {
      id: 1,
      user: {
        username: 'ojayy_y',
        avatar: '/img/lady.png',
        isFollowing: true
      },
      video: '/videos/sample1.mp4',
      thumbnail: '/img/lady.png',
      caption: 'baddie ojayy 😊💀🎉',
      audio: 'ojayy_y · Original audio',
      likes: 403,
      comments: 60,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      user: {
        username: 'dance_queen',
        avatar: '/img/lady.png',
        isFollowing: false
      },
      video: '/videos/sample2.mp4',
      thumbnail: '/img/lady.png',
      caption: 'New dance challenge 🔥💃',
      audio: 'Trending Sound · 1.2M uses',
      likes: 1200,
      comments: 89,
      isLiked: true,
      isSaved: false
    },
    {
      id: 3,
      user: {
        username: 'funny_clips',
        avatar: '/img/lady.png',
        isFollowing: false
      },
      video: '/videos/sample3.mp4',
      thumbnail: '/img/lady.png',
      caption: 'Wait for it... 😂😂😂',
      audio: 'funny_clips · Original audio',
      likes: 5600,
      comments: 234,
      isLiked: false,
      isSaved: true
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [activeFrameId, setActiveFrameId] = useState(null)

  const handleLike = (id) => {
    setFrames(frames.map(frame => 
      frame.id === id 
        ? { ...frame, isLiked: !frame.isLiked, likes: frame.isLiked ? frame.likes - 1 : frame.likes + 1 }
        : frame
    ))
  }

  const handleSave = (id) => {
    setFrames(frames.map(frame => 
      frame.id === id 
        ? { ...frame, isSaved: !frame.isSaved }
        : frame
    ))
  }

  const handleFollow = (id) => {
    setFrames(frames.map(frame => 
      frame.id === id 
        ? { ...frame, user: { ...frame.user, isFollowing: !frame.user.isFollowing } }
        : frame
    ))
  }

  const openComments = (id) => {
    setActiveFrameId(id)
    setShowComments(true)
  }

  const openShare = (id) => {
    setActiveFrameId(id)
    setShowShare(true)
  }

  const openOptions = (id) => {
    setActiveFrameId(id)
    setShowOptions(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
    return count.toString()
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Mobile Layout - Full Screen Vertical Scroll */}
      <div className="md:hidden">
        <div className="snap-y snap-mandatory h-[calc(100vh-60px)] overflow-y-scroll scrollbar-hide">
          {frames.map((frame, index) => (
            <div 
              key={frame.id}
              className="snap-start h-[calc(100vh-60px)] relative bg-black"
            >
              {/* Video/Image Container */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                onClick={togglePlay}
              >
                <Image
                  src={frame.thumbnail}
                  alt="Frame"
                  fill
                  className="object-cover"
                />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}

                {/* Text Overlay */}
                <div className="absolute top-1/3 left-4 right-20">
                  <p className="text-white text-lg font-bold drop-shadow-lg">ME TO THIS</p>
                </div>
              </div>

              {/* Mute Button */}
              <button 
                onClick={toggleMute}
                className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center z-10"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Right Side Actions - Positioned Lower */}
              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4">
                {/* Like */}
                <button 
                  onClick={() => handleLike(frame.id)}
                  className="flex flex-col items-center"
                >
                  <Heart 
                    className={`w-7 h-7 ${frame.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
                  />
                  <span className="text-white text-xs mt-1">{formatCount(frame.likes)}</span>
                </button>

                {/* Comment */}
                <button 
                  onClick={() => openComments(frame.id)}
                  className="flex flex-col items-center"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                  <span className="text-white text-xs mt-1">{formatCount(frame.comments)}</span>
                </button>

                {/* Share */}
                <button 
                  onClick={() => openShare(frame.id)}
                  className="flex flex-col items-center"
                >
                  <Send className="w-7 h-7 text-white" />
                </button>

                {/* Save */}
                <button 
                  onClick={() => handleSave(frame.id)}
                  className="flex flex-col items-center"
                >
                  <Bookmark 
                    className={`w-7 h-7 ${frame.isSaved ? 'text-white fill-white' : 'text-white'}`}
                  />
                </button>

                {/* More Options */}
                <button 
                  onClick={() => openOptions(frame.id)}
                  className="flex flex-col items-center"
                >
                  <MoreHorizontal className="w-7 h-7 text-white" />
                </button>

                {/* Audio Disc */}
                <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30 mt-2 animate-pulse">
                  <Image
                    src={frame.user.avatar}
                    alt="Audio"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-6 left-4 right-20">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    src={frame.user.avatar}
                    alt={frame.user.username}
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-9 h-9"
                  />
                  <span className="text-white font-semibold text-sm">{frame.user.username}</span>
                  <span className="text-white/60">•</span>
                  <button 
                    onClick={() => handleFollow(frame.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md ${
                      frame.user.isFollowing 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'bg-white text-black'
                    }`}
                  >
                    {frame.user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Caption */}
                <div className="mb-3">
                  <p className="text-white text-sm leading-relaxed">
                    {showMore ? frame.caption : frame.caption.slice(0, 60)}
                    {frame.caption.length > 60 && (
                      <button 
                        onClick={() => setShowMore(!showMore)}
                        className="text-white/60 ml-1"
                      >
                        {showMore ? ' less' : '... more'}
                      </button>
                    )}
                  </p>
                </div>

                {/* Audio */}
                <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5 w-fit">
                  <Music className="w-3 h-3 text-white" />
                  <p className="text-white text-xs">{frame.audio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet/Desktop Layout - Grid Style */}
      <div className="hidden md:block px-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Frames</h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {frames.map((frame) => (
            <div 
              key={frame.id}
              className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden cursor-pointer group"
            >
              {/* Thumbnail */}
              <Image
                src={frame.thumbnail}
                alt="Frame"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-6">
                  <button 
                    onClick={() => handleLike(frame.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-7 h-7 ${frame.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    <span className="text-white font-semibold">{formatCount(frame.likes)}</span>
                  </button>
                  <button 
                    onClick={() => openComments(frame.id)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-7 h-7 text-white" />
                    <span className="text-white font-semibold">{formatCount(frame.comments)}</span>
                  </button>
                </div>
              </div>

              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={frame.user.avatar}
                    alt={frame.user.username}
                    width={24}
                    height={24}
                    className="rounded-full object-cover w-6 h-6"
                  />
                  <span className="text-white font-medium text-sm">{frame.user.username}</span>
                </div>
                <p className="text-white/80 text-xs truncate">{frame.caption}</p>
              </div>

              {/* Audio Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Music className="w-3 h-3 text-white" />
                <span className="text-white text-xs">Audio</span>
              </div>

              {/* Options Button */}
              <button 
                onClick={() => openOptions(frame.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CommentModal 
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        frame={frames.find(f => f.id === activeFrameId)}
      />

      <ShareModal 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      <OptionsModal 
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      />
    </div>
  )
}

export default Frames