'use client'

import { Plus, Search } from "lucide-react";
import { useState } from "react";

export const ChatList = ({ chats, selectedChat, onSelectChat }) => {
    const [searchQuery, setSearchQuery] = useState('');
  
    return (
      <div className="w-full md:w-20 lg:w-96 h-full bg-white border-r border-gray-200 flex flex-col relative">
        {/* Search Bar - visible on mobile and desktop, hidden on tablet */}
        <div className="p-4 block md:hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Plus Button - visible on tablet only */}
        <div className="p-4 hidden md:flex lg:hidden justify-center">
          <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
            <Plus className="w-5 h-5" />
          </button>
        </div>
  
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-4 lg:pb-20">
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(index)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-l-4 
                justify-start md:justify-center lg:justify-start
                ${selectedChat === index ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
            >
              {/* Avatar with badge */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">E</span>
                </div>
                
                {/* Green dot badge - only on tablet */}
                {chat.hasNewMessage && (
                  <div className="hidden md:block lg:hidden absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat details - visible on mobile and desktop, hidden on tablet */}
              <div className="flex-1 min-w-0 block md:hidden lg:block">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>

              {/* Blue dot indicator - visible on mobile and desktop, hidden on tablet */}
              {chat.hasNewMessage && (
                <div className="w-2 h-2 bg-blue-500 rounded-full block md:hidden lg:block"></div>
              )}
            </div>
          ))}
        </div>
  
        {/* Floating New Chat Button - hidden on tablet */}
        <button className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 md:hidden lg:flex">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    );
};