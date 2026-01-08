'use client'

import React, { useState } from 'react';
import { Play, Lock, Heart, MessageCircle, Share2, PenLine } from 'lucide-react';
import Image from 'next/image';
import { PostOptionsModal } from './FloatyModal';

const Videos = () => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  // Sample video data
  const videos = [
    { id: 1, thumbnail: '/img/lady.png', duration: '2:45', locked: false, views: 1234 },
    { id: 2, thumbnail: '/img/lady.png', duration: '1:30', locked: false, views: 567 },
    { id: 3, thumbnail: '/img/lady.png', duration: '3:15', locked: true, views: 890 },
    { id: 4, thumbnail: '/img/lady.png', duration: '0:45', locked: false, views: 2345 },
    { id: 5, thumbnail: '/img/lady.png', duration: '4:20', locked: true, views: 456 },
    { id: 6, thumbnail: '/img/lady.png', duration: '2:00', locked: false, views: 789 },
  ];

  const handleThreeDotsClick = (event, photoId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    // Calculate position relative to viewport
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 130, // Position it to the left of the button
      right: 'auto'
    });
  
    setSelectedPhotoId(photoId);
    setShowOptionsModal(true);
  };

  const handleVideoClick = (video) => {
    if (!video.locked) {
      console.log('Play video:', video.id);
      // Add your video player logic here
    }
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="relative group overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
            >
              {/* Video Thumbnail */}
              <div className="aspect-[3/4] relative">
                {/* <Image
                  src={video.thumbnail}
                  alt={`Video ${video.id}`}
                  fill
                  className="object-cover"
                /> */}
                <Image
                  src="/img/lady.png"
                  alt="lady"
                  fill
                  className="object-cover"
                />
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Play Button */}
                {!video.locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Lock overlay for premium content */}
                {video.locked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-10 h-10 text-white mb-2 mx-auto" />
                      <p className="text-white font-medium">Premium Video</p>
                      <p className="text-white/70 text-sm mt-1">Subscribe to watch</p>
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={(e) => handleThreeDotsClick(e, video.id)}
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>

                {/* Video Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {/* Duration */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                      {video.duration}
                    </span>
                    <span className="text-white text-sm">
                      {formatViews(video.views)} views
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center text-white">
                      <div className="flex gap-3">
                        <button className="hover:scale-110 transition-transform">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="hover:scale-110 transition-transform">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="hover:scale-110 transition-transform">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video number badge */}
                <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{video.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Options Modal - You can import and use your existing PostOptionsModal here */}
        <PostOptionsModal
          isOpen={showOptionsModal}
          onClose={() => setShowOptionsModal(false)}
          onEdit={() => {
            console.log('Edit photo:', selectedPhotoId);
          }}
          onDelete={() => {
            console.log('Delete photo:', selectedPhotoId);
          }}
          onMakeProfilePicture={() => {
            console.log('Make profile picture:', selectedPhotoId);
          }}
          position={modalPosition}
        />
      </div>
    </div>
  );
};

export default Videos;