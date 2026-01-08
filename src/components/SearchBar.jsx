import Image from 'next/image';
import React, { useState } from 'react';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleIconClick = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchValue) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Desktop version - always visible on md and up */}
      <div className="hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-2 text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Mobile version - visible only on small screens */}
      <div className="block md:hidden">
        {!isExpanded ? (
          /* Search icon */
          <button
            onClick={handleIconClick}
            className="p-3 text-gray-600 hover:text-blue-500 transition-colors duration-200"
          >
            <Image
                src="/icon/search.svg"
                alt="Search Icon"
                width={35}
                height={35}
                className='cursor-pointer'
            />
          </button>
        ) : (
          /* Expanded search bar */
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
              autoFocus
              className="w-full px-6 py-2 text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;