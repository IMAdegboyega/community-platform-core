'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Heart, MessageCircle, Share2, X, PenLine, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PostOptionsModal } from './FloatyModal';
import { postsApi } from '@/lib/api';

const Photos = ({ userId }) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await postsApi.getUserPosts(userId);
        const postsData = Array.isArray(response) ? response : (response.data || response.posts || []);
        
        // Filter posts that have image media
        const photoPosts = postsData.filter(post => 
          post.media && post.media.some(m => m.media_type === 'image')
        );
        
        setPhotos(photoPosts);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  const handleThreeDotsClick = (event, photoId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 130,
      right: 'auto'
    });
  
    setSelectedPhotoId(photoId);
    setShowOptionsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No photos yet</p>
          <p className="text-gray-400 text-sm mt-2">Photos from your posts will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
          {photos.map((post) => (
            <div 
              key={post.id} 
              className="relative group overflow-hidden rounded-lg bg-gray-200"
            >
              {/* Image */}
              <div className="aspect-square relative">
                <img
                  src={post.media?.[0]?.media_url || '/img/avatar.png'}
                  alt={`Photo ${post.id}`}
                  className="w-full h-full object-cover"
                />

                {/* Edit button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleThreeDotsClick(e, post.id)} 
                    className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white pointer-events-auto">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5" fill="white" />
                        <span className="font-semibold">{post.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" fill="white" />
                        <span className="font-semibold">{post.comments_count || 0}</span>
                      </div>
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