'use client'

import React, { useState, useEffect } from 'react';
import { Play, Lock, Heart, MessageCircle, Share2, PenLine, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PostOptionsModal } from './FloatyModal';
import { postsApi } from '@/lib/api';

const Videos = ({ userId }) => {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await postsApi.getUserPosts(userId);
        const postsData = Array.isArray(response) ? response : (response.data || response.posts || []);
        
        // Filter posts that have video media
        const videoPosts = postsData.filter(post => 
          post.media && post.media.some(m => m.media_type === 'video')
        );
        
        setVideos(videoPosts);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId]);

  const handleThreeDotsClick = (event, videoId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 130,
      right: 'auto'
    });
  
    setSelectedVideoId(videoId);
    setShowOptionsModal(true);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No videos yet</p>
          <p className="text-gray-400 text-sm mt-2">Videos from your posts will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
          {videos.map((post) => {
            const videoMedia = post.media?.find(m => m.media_type === 'video');
            return (
              <div 
                key={post.id} 
                className="relative group overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
              >
                {/* Video Thumbnail */}
                <div className="aspect-[9/16] relative">
                  <img
                    src={videoMedia?.thumbnail_url || videoMedia?.media_url || '/img/avatar.png'}
                    alt={`Video ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Edit button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleThreeDotsClick(e, post.id)}
                      className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    {/* Duration */}
                    <div className="flex items-center justify-between">
                      {videoMedia?.duration && (
                        <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded">
                          {formatDuration(videoMedia.duration)}
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <div className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Options Modal */}
        <PostOptionsModal
          isOpen={showOptionsModal}
          onClose={() => setShowOptionsModal(false)}
          onEdit={() => {
            console.log('Edit video:', selectedVideoId);
          }}
          onDelete={() => {
            console.log('Delete video:', selectedVideoId);
          }}
          onMakeProfilePicture={() => {
            console.log('Make thumbnail profile picture:', selectedVideoId);
          }}
          position={modalPosition}
        />
      </div>
    </div>
  );
};

export default Videos;