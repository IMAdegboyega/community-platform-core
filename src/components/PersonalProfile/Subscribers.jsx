import React, { useState } from 'react';
import { MoreVertical, UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { SubscribersPopup } from './FloatyModal';

const Subscribers = () => {
  const [Subscribers, setSubscribers] = useState([
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
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  const handleOptionsClick = (event, Subscriber) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
  
    // Calculate position relative to viewport
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 130, // Position it to the left of the button
      right: 'auto'
    });
  
    setSelectedSubscriber(Subscriber);
    setShowOptionsModal(true);
  };

  const handleFollowToggle = (SubscriberId) => {
    setSubscribers(Subscribers.map(Subscriber => 
      Subscriber.id === SubscriberId 
        ? { ...Subscriber, isFollowing: !Subscriber.isFollowing }
        : Subscriber
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Subscribers List */}
        <div className="divide-y divide-gray-100">
          {Subscribers.map((Subscriber) => (
            <div 
              key={Subscriber.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={Subscriber.avatar}
                    alt={Subscriber.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{Subscriber.name}</h3>
                  <p className="text-sm text-gray-500">{Subscriber.username}</p>
                </div>
              </div>

              {/* Options Button */}
              <button
                onClick={(e) => handleOptionsClick(e, Subscriber)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <SubscribersPopup
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        position={modalPosition}
      />
    </div>
  );
};

export default Subscribers;