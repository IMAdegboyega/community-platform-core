import { Camera, Heart, MessageCircle, MoreVertical, Share2, Video, Loader2, Send, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { postsApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const MyWall = ({ userId, onPostCreated }) => {
    const { user: authUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const response = await postsApi.getUserPosts(userId);
                // Handle both array response and object with data property
                const postsData = Array.isArray(response) ? response : (response.data || response.posts || []);
                setPosts(postsData);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError('Failed to load posts');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        
        setIsPosting(true);
        try {
            const response = await postsApi.createTextPost(newPostContent);
            // Add new post to beginning of list with current user info
            const newPost = response.data || response;
            // Ensure the post has user info
            newPost.user = newPost.user || {
                id: authUser?.id,
                username: authUser?.username,
                display_name: authUser?.display_name || authUser?.username,
                profile_picture: authUser?.profile_picture
            };
            setPosts(prev => [newPost, ...prev]);
            setNewPostContent('');
            
            // Notify parent to refresh profile stats
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        try {
            if (post.is_liked) {
                await postsApi.unlikePost(postId);
            } else {
                await postsApi.likePost(postId);
            }
            
            setPosts(prev => prev.map(p => 
                p.id === postId 
                    ? { 
                        ...p, 
                        is_liked: !p.is_liked, 
                        likes_count: p.is_liked ? (p.likes_count || 1) - 1 : (p.likes_count || 0) + 1 
                    }
                    : p
            ));
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const toggleComments = async (postId) => {
        const isExpanded = expandedComments[postId];
        
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !isExpanded
        }));

        // Fetch comments if expanding and not already loaded
        if (!isExpanded && !comments[postId]) {
            setLoadingComments(prev => ({ ...prev, [postId]: true }));
            try {
                const response = await postsApi.getComments(postId, 20, 0);
                const commentsData = Array.isArray(response) ? response : (response.data || []);
                setComments(prev => ({ ...prev, [postId]: commentsData }));
            } catch (err) {
                console.error('Failed to fetch comments:', err);
                setComments(prev => ({ ...prev, [postId]: [] }));
            } finally {
                setLoadingComments(prev => ({ ...prev, [postId]: false }));
            }
        }
    };

    const handleSubmitComment = async (postId) => {
        const text = commentText[postId]?.trim();
        if (!text) return;

        setSubmittingComment(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await postsApi.addComment(postId, text);
            const newComment = response.data || response;
            // Add user info to the new comment
            newComment.user = newComment.user || {
                id: authUser?.id,
                username: authUser?.username,
                display_name: authUser?.display_name || authUser?.username,
                profile_picture: authUser?.profile_picture
            };
            
            setComments(prev => ({
                ...prev,
                [postId]: [newComment, ...(prev[postId] || [])]
            }));
            setCommentText(prev => ({ ...prev, [postId]: '' }));
            
            // Update comment count on the post
            setPosts(prev => prev.map(p => 
                p.id === postId 
                    ? { ...p, comments_count: (p.comments_count || 0) + 1 }
                    : p
            ));
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setSubmittingComment(prev => ({ ...prev, [postId]: false }));
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const userImage = authUser?.profile_picture || '/img/avatar.png';
    const userName = authUser?.display_name || authUser?.username || 'User';

    // Helper to get post author info (fallback to current user for own posts)
    const getPostAuthor = (post) => {
        return {
            username: post.user?.username || post.username || authUser?.username || 'Unknown',
            displayName: post.user?.display_name || post.user?.username || post.display_name || post.username || authUser?.display_name || authUser?.username || 'Unknown',
            profilePicture: post.user?.profile_picture || post.profile_picture || authUser?.profile_picture || '/img/avatar.png'
        };
    };

    return (
        <div className='space-y-4'>
            {/* Create Post */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  <img 
                    src={userImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's new..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
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
                    <button 
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPostContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Post it!
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg p-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-gray-500 mt-2">Loading posts...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && posts.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500">No posts yet. Create your first post!</p>
              </div>
            )}

            {/* Posts */}
            {!loading && posts.map((post) => {
              const author = getPostAuthor(post);
              const postComments = comments[post.id] || [];
              const isCommentsExpanded = expandedComments[post.id];
              const isLoadingComments = loadingComments[post.id];

              return (
                <div key={post.id} className="bg-white rounded-lg">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <Link href={`/profile/${author.username}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        <img
                          src={author.profilePicture} 
                          alt={author.username} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 hover:underline">{author.displayName}</h4>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  {post.caption && (
                    <div className="px-4 pb-3">
                      <p className="text-gray-800">{post.caption}</p>
                    </div>
                  )}

                  {/* Post Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="bg-gray-100">
                      <img
                        src={post.media[0].media_url}
                        alt="Post content"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="p-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${post.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes_count || 0}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments_count || 0}</span>
                        {isCommentsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button className="text-gray-500 hover:text-blue-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {isCommentsExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Comment Input */}
                      <div className="p-4 flex items-center gap-3">
                        <img
                          src={userImage}
                          alt="Your avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                          className="flex-1 text-sm outline-none bg-gray-100 rounded-full px-4 py-2"
                          disabled={submittingComment[post.id]}
                        />
                        <button
                          onClick={() => handleSubmitComment(post.id)}
                          disabled={!commentText[post.id]?.trim() || submittingComment[post.id]}
                          className="text-blue-600 disabled:opacity-50"
                        >
                          {submittingComment[post.id] ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Comments List */}
                      <div className="px-4 pb-4 space-y-3 max-h-64 overflow-y-auto">
                        {isLoadingComments ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                          </div>
                        ) : postComments.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                        ) : (
                          postComments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Link href={`/profile/${comment.user?.username || 'unknown'}`}>
                                <img
                                  src={comment.user?.profile_picture || '/img/avatar.png'}
                                  alt={comment.user?.username || 'User'}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              </Link>
                              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <Link 
                                    href={`/profile/${comment.user?.username || 'unknown'}`}
                                    className="font-medium text-sm text-gray-900 hover:underline"
                                  >
                                    {comment.user?.display_name || comment.user?.username || 'Unknown'}
                                  </Link>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
    )
}

export default MyWall;