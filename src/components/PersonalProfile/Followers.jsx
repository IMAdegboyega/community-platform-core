import React, { useState } from 'react';
import { MoreVertical, UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { FollowersPopup } from './FloatyModal';

const Followers = () => {
  const [followers, setFollowers] = useState([
    { id: 1, name: 'Elena', username: '@elena', avatar: '/img/lady.png', isFollowing: false },
    { id: 2, name: 'Elena', username: '@elena2', avatar: '/img/lady.png', isFollowing: true },
    { id: 3, name: 'Elena', username: '@elena3', avatar: '/img/lady.png', isFollowing: false },
    { id: 4, name: 'Elena', username: '@elena4', avatar: '/img/lady.png', isFollowing: true },
    { id: 5, name: 'Elena', username: '@elena5', avatar: '/img/lady.png', isFollowing: false },
    { id: 6, name: 'Elena', username: '@elena6', avatar: '/img/lady.png', isFollowing: false },
    { id: 7, name: 'Elena', username: '@elena7', avatar: '/img/lady.png', isFollowing: true },
    { id: 8, name: 'Elena', username: '@elena8', avatar: '/img/lady.png', isFollowing: false },
  ]);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  const handleOptionsClick = (event, follower) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    // Calculate position relative to viewport
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 130, // Position it to the left of the button
      right: 'auto'
    });
  
    setSelectedFollower(follower);
    setShowOptionsModal(true);
  };

  const handleFollowToggle = (followerId) => {
    setFollowers(followers.map(follower => 
      follower.id === followerId 
        ? { ...follower, isFollowing: !follower.isFollowing }
        : follower
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Followers List */}
        <div className="divide-y divide-gray-100">
          {followers.map((follower) => (
            <div 
              key={follower.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={follower.avatar}
                    alt={follower.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{follower.name}</h3>
                  <p className="text-sm text-gray-500">{follower.username}</p>
                </div>
              </div>

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

        {/* Options Modal */}
        {/* {showOptionsModal && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowOptionsModal(false)}
            />
            <div 
              className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]"
              style={{
                top: `${modalPosition.top}px`,
                right: `${modalPosition.right}px`,
              }}
            >
              <button
                onClick={() => {
                  handleFollowToggle(selectedFollower.id);
                  setShowOptionsModal(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                {selectedFollower?.isFollowing ? (
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
                onClick={() => {
                  console.log('Message:', selectedFollower);
                  setShowOptionsModal(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Send Message</span>
              </button>
              <button
                onClick={() => {
                  console.log('Block:', selectedFollower);
                  setShowOptionsModal(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left text-red-600"
              >
                <span>Block User</span>
              </button>
            </div>
          </>
        )} */}
      </div>

      <FollowersPopup
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
  );
};

export default Followers;