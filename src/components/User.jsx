'use client'

import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const UserProfile = () => {
  const { user } = useAuth();
  
  // Use real user data or fallbacks
  const displayName = user?.display_name || user?.username || 'Guest';
  const username = user?.username ? `@${user.username}` : '';
  const profilePicture = user?.profile_picture || '/img/avatar.png';

  return (
    <aside>
      <div className="items-center gap-3 p-3 bg-white rounded-none shadow-none hidden md:flex md:px-8 w-12 lg:w-56 justify-center lg:justify-start">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src={profilePicture}
            alt={displayName} 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
        
        {/* User Info - hidden on tablet, visible on desktop */}
        <div className="flex-col hidden lg:flex">
          <h3 className="text-sm font-semibold text-gray-900">
            {displayName}
          </h3>
          <p className="text-xs text-gray-500">
            {username}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default UserProfile;