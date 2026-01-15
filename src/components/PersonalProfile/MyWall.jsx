import { Camera, Heart, MessageCircle, MoreVertical, Share2, Video } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const MyWall = () => {

    const posts = [
        {
          id: 1,
          author: 'Elena',
          timeAgo: '2 days ago',
          content: 'I love how my tits look through this open top.',
          image: '/api/placeholder/400/500',
          likes: 0,
          comments: 0
        },
        {
          id: 2,
          author: 'Elena', 
          timeAgo: '2 days ago',
          content: 'I love how my tits look through this open top.',
          image: '/api/placeholder/400/500',
          likes: 0,
          comments: 0
        }
    ];

    return (
        <div className='space-y-4'>
            {/* Create Post */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  {/* <img 
                    src="/api/placeholder/40/40" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  /> */}

                  <Image
                    src="/img/lady.png" 
                    alt="Profile" 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's new..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end items-center space-x-6 mt-3">
                    <button className="text-gray-500 hover:text-gray-700"> 
                      <Camera className="w-5 h-5" />
                    </button>

                    <button className="text-gray-500 hover:text-gray-700">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Post it!
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      {/* <img 
                        src="/api/placeholder/40/40" 
                        alt={post.author} 
                        className="w-full h-full object-cover"
                      /> */}

                      <Image
                        src="/img/lady.png" 
                        alt="profile" 
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{post.author}</h4>
                      <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="bg-gray-100">
                    {/* <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-auto"
                    /> */}

                    <Image
                      src="/img/lady.png"
                      alt="Post content"
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
    )
}

export default MyWall;