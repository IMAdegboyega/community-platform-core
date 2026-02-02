import React, { useState, useEffect } from 'react';
import { MoreVertical, UserPlus, UserMinus, MessageCircle, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { usersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Followers = ({ userId }) => {
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [followingState, setFollowingState] = useState({});

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await usersApi.getFollowers(userId, 50, 0);
        const followersData = Array.isArray(response) ? response : (response.data || response.followers || []);
        setFollowers(followersData);
        
        // Initialize following state from API response
        const initialState = {};
        followersData.forEach(f => {
          initialState[f.id] = f.is_following || false;
        });
        setFollowingState(initialState);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch followers:', err);
        setError('Failed to load followers');
        setFollowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  const handleOptionsClick = (event, follower) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    setModalPosition({
      top: rect.bottom + 5,
      left: Math.max(10, rect.left - 130),
    });
  
    setSelectedFollower(follower);
    setShowOptionsModal(true);
  };

  const handleFollowToggle = async (followerId) => {
    const isCurrentlyFollowing = followingState[followerId];
    
    // Optimistic update
    setFollowingState(prev => ({
      ...prev,
      [followerId]: !isCurrentlyFollowing
    }));

    try {
      if (isCurrentlyFollowing) {
        await usersApi.unfollow(followerId);
      } else {
        await usersApi.follow(followerId);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      // Revert on error
      setFollowingState(prev => ({
        ...prev,
        [followerId]: isCurrentlyFollowing
      }));
    }
    
    setShowOptionsModal(false);
  };

  const handleMessage = (follower) => {
    console.log('Message:', follower);
    setShowOptionsModal(false);
  };

  const handleBlock = async (follower) => {
    try {
      await usersApi.blockUser(follower.id);
      // Remove from list
      setFollowers(prev => prev.filter(f => f.id !== follower.id));
    } catch (err) {
      console.error('Failed to block user:', err);
    }
    setShowOptionsModal(false);
  };

  const handleUserClick = (username) => {
    router.push(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-2">Loading followers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No followers yet</p>
          <p className="text-gray-400 text-sm">When people follow you, they'll appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="max-w-2xl mx-auto">
        {/* Followers List */}
        <div className="divide-y divide-gray-100">
          {followers.map((follower) => (
            <div 
              key={follower.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              {/* User Info */}
              <Link 
                href={`/profile/${follower.username}`}
                className="flex items-center gap-3 flex-1"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={follower.profile_picture || '/img/avatar.png'}
                    alt={follower.display_name || follower.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 hover:underline">
                    {follower.display_name || follower.username}
                  </h3>
                  <p className="text-sm text-gray-500">@{follower.username}</p>
                </div>
              </Link>

              {/* Follow Back Button (shown if not following) */}
              {!followingState[follower.id] && (
                <button
                  onClick={() => handleFollowToggle(follower.id)}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mr-2"
                >
                  Follow Back
                </button>
              )}

              {/* Options Button */}
              <button
                onClick={(e) => handleOptionsClick(e, follower)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && selectedFollower && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowOptionsModal(false)}
          />
          <div 
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            <button
              onClick={() => handleFollowToggle(selectedFollower.id)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              {followingState[selectedFollower.id] ? (
                <>
                  <UserMinus className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Follow Back</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleMessage(selectedFollower)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Send Message</span>
            </button>
            <button
              onClick={() => handleBlock(selectedFollower)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left text-red-600"
            >
              <span>Block User</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Followers;