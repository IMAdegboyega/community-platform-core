'use client';

import React, { useState } from 'react';
import { Lock, Heart, MessageCircle, Share2, X, PenLine } from 'lucide-react';
import Image from 'next/image';
import { PostOptionsModal } from './FloatyModal';

const Photos = () => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

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

  // Sample photo data
  const photos = [
    { id: 1, url: '/api/placeholder/300/400', locked: false },
    { id: 2, url: '/api/placeholder/300/400', locked: false },
    { id: 3, url: '/api/placeholder/300/400', locked: false },
    { id: 4, url: '/api/placeholder/300/400', locked: false },
    { id: 5, url: '/api/placeholder/300/400', locked: false },
    { id: 6, url: '/api/placeholder/300/400', locked: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group overflow-hidden rounded-lg bg-gray-200"
            >
              {/* Image */}
              <div className="aspect-[3/4] relative">
                <Image
                  src="/img/lady.png"
                  alt={`Photo ${photo.id}`}
                  fill
                  className="object-cover"
                />
                
                {/* Lock overlay for locked content */}
                {photo.locked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-white mb-2 mx-auto" />
                      <p className="text-white text-sm">Premium Content</p>
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={(e) => handleThreeDotsClick(e, photo.id)} 
                    className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center text-white pointer-events-auto">
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
              </div>
            </div>
          ))}
        </div>

        {/* Post Options Modal */}
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

export default Photos;