'use client'

import { Plus, Search, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { NewChatModal } from "./FloatyModal";

export const ChatList = ({ conversations, selectedConversation, onSelectConversation, onStartConversation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const { user } = useAuth();
    
    // Filter conversations based on search
    const filteredConversations = conversations.filter(conv => {
      if (!searchQuery) return true;
      const otherParticipant = getOtherParticipant(conv);
      const name = otherParticipant?.user?.display_name || otherParticipant?.user?.username || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Get the other participant in a direct conversation
    const getOtherParticipant = (conversation) => {
      if (!conversation.participants || !user) return null;
      // participants have user_id, not id at top level
      return conversation.participants.find(p => p.user_id !== user.id) || conversation.participants[0];
    };

    // Format timestamp
    const formatTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get display name for conversation
    const getConversationName = (conversation) => {
      if (conversation.name) return conversation.name;
      const other = getOtherParticipant(conversation);
      // User details are nested in participant.user
      return other?.user?.display_name || other?.user?.username || 'Unknown';
    };

    // Get last message preview
    const getLastMessage = (conversation) => {
      if (!conversation.last_message) return 'No messages yet';
      return conversation.last_message.content || '';
    };

    // Get avatar initial
    const getAvatarInitial = (conversation) => {
      const name = getConversationName(conversation);
      return name.charAt(0).toUpperCase();
    };

    // Get avatar image
    const getAvatarImage = (conversation) => {
      const other = getOtherParticipant(conversation);
      // User details are nested in participant.user
      return other?.user?.profile_picture;
    };
  
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
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
  
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-4 lg:pb-20">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-gray-400 text-sm mt-1">Start a new conversation</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Message
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const hasUnread = conversation.unread_count > 0;
              const isSelected = selectedConversation?.id === conversation.id;
              const avatarImage = getAvatarImage(conversation);
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-l-4 
                    justify-start md:justify-center lg:justify-start
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
                >
                  {/* Avatar with badge */}
                  <div className="relative flex-shrink-0">
                    {avatarImage ? (
                      <img 
                        src={avatarImage} 
                        alt={getConversationName(conversation)}
                        className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{getAvatarInitial(conversation)}</span>
                      </div>
                    )}
                    
                    {/* Green dot badge - only on tablet */}
                    {hasUnread && (
                      <div className="hidden md:block lg:hidden absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Conversation details - visible on mobile and desktop, hidden on tablet */}
                  <div className="flex-1 min-w-0 block md:hidden lg:block">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium text-gray-900 ${hasUnread ? 'font-semibold' : ''}`}>
                        {getConversationName(conversation)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.last_message?.created_at || conversation.updated_at)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {getLastMessage(conversation)}
                    </p>
                  </div>

                  {/* Blue dot indicator - visible on mobile and desktop, hidden on tablet */}
                  {hasUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full block md:hidden lg:block"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
  
        {/* Floating New Chat Button - hidden on tablet */}
        <button 
          onClick={() => setShowNewChatModal(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 md:hidden lg:flex"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* New Chat Modal */}
        <NewChatModal
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          onStartConversation={onStartConversation}
        />
      </div>
    );
};