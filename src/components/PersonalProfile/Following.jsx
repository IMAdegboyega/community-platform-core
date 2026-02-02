import React, { useState, useEffect } from 'react';
import { MoreVertical, UserMinus, MessageCircle, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { usersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Following = ({ userId }) => {
  const router = useRouter();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [unfollowingIds, setUnfollowingIds] = useState(new Set());

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await usersApi.getFollowing(userId, 50, 0);
        const followingData = Array.isArray(response) ? response : (response.data || response.following || []);
        setFollowing(followingData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch following:', err);
        setError('Failed to load following');
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  const handleOptionsClick = (event, user) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    setModalPosition({
      top: rect.bottom + 5,
      left: Math.max(10, rect.left - 130),
    });
  
    setSelectedUser(user);
    setShowOptionsModal(true);
  };

  const handleUnfollow = async (followingUserId) => {
    setUnfollowingIds(prev => new Set([...prev, followingUserId]));
    
    try {
      await usersApi.unfollow(followingUserId);
      // Remove from list after successful unfollow
      setFollowing(prev => prev.filter(f => f.id !== followingUserId));
    } catch (err) {
      console.error('Failed to unfollow:', err);
    } finally {
      setUnfollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(followingUserId);
        return newSet;
      });
    }
    
    setShowOptionsModal(false);
  };

  const handleMessage = (user) => {
    console.log('Message:', user);
    setShowOptionsModal(false);
  };

  const handleBlock = async (user) => {
    try {
      await usersApi.blockUser(user.id);
      // Remove from list
      setFollowing(prev => prev.filter(f => f.id !== user.id));
    } catch (err) {
      console.error('Failed to block user:', err);
    }
    setShowOptionsModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-2">Loading following...</p>
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

  if (following.length === 0) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Not following anyone yet</p>
          <p className="text-gray-400 text-sm">Find people to follow in the Community section</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="max-w-2xl mx-auto">
        {/* Following List */}
        <div className="divide-y divide-gray-100">
          {following.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              {/* User Info */}
              <Link 
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 flex-1"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={user.profile_picture || '/img/avatar.png'}
                    alt={user.display_name || user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 hover:underline">
                    {user.display_name || user.username}
                  </h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </Link>

              {/* Following Badge & Unfollow Button */}
              <button
                onClick={() => handleUnfollow(user.id)}
                disabled={unfollowingIds.has(user.id)}
                className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors mr-2 disabled:opacity-50"
              >
                {unfollowingIds.has(user.id) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Following'
                )}
              </button>

              {/* Options Button */}
              <button
                onClick={(e) => handleOptionsClick(e, user)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && selectedUser && (
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
              onClick={() => handleUnfollow(selectedUser.id)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              <UserMinus className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Unfollow</span>
            </button>
            <button
              onClick={() => handleMessage(selectedUser)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Send Message</span>
            </button>
            <button
              onClick={() => handleBlock(selectedUser)}
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

export default Following;