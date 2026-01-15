import Image from 'next/image';
import React from 'react';

const UserProfile = ({ 
  name = "Valerie Didi", 
  username = "@Valeriedidi", 
}) => {
  return (
    <aside>
      <div className="items-center gap-3 p-3 bg-white rounded-none shadow-none hidden md:flex md:px-8 w-12 lg:w-56 justify-center lg:justify-start">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src="/img/lady.png"
            alt="lady" 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
        
        {/* User Info - hidden on tablet, visible on desktop */}
        <div className="flex-col hidden lg:flex">
          <h3 className="text-sm font-semibold text-gray-900">
            {name}
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