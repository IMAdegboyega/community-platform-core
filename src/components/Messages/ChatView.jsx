'use client'

import { Send, Smile, Wallet, X, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatWalletModal, RequestTokenModal, SendTokenModal } from "./FloatyModal";

export const ChatView = ({ conversation, messages, messagesLoading, onClose, onSendMessage }) => {
    const [messageInput, setMessageInput] = useState('');
    const [showChatWalletModal, setShowChatWalletModal] = useState(false);
    const [showSendTokenModal, setShowSendTokenModal] = useState(false);
    const [showRequestTokenModal, setShowRequestTokenModal] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    // Scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    const handleSendMessage = async () => {
      if (!messageInput.trim() || sending) return;
      
      setSending(true);
      try {
        await onSendMessage(messageInput.trim());
        setMessageInput('');
      } finally {
        setSending(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleWalletClick = () => {
        setShowChatWalletModal(true);
    };
    
    const handleSendToken = () => {
        setShowChatWalletModal(false);
        setShowSendTokenModal(true);
    };
    
    const handleRequestToken = () => {
        setShowChatWalletModal(false);
        setShowRequestTokenModal(true);
    };

    // Get the other participant
    const getOtherParticipant = () => {
      if (!conversation?.participants || !user) return null;
      return conversation.participants.find(p => p.id !== user.id) || conversation.participants[0];
    };

    // Get conversation display name
    const getConversationName = () => {
      if (conversation?.name) return conversation.name;
      const other = getOtherParticipant();
      return other?.display_name || other?.username || 'Unknown';
    };

    // Format message time
    const formatTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Check if message is from current user
    const isMyMessage = (message) => {
      return message.sender_id === user?.id;
    };

    // Group messages by date
    const groupMessagesByDate = (msgs) => {
      const groups = [];
      let currentDate = null;
      
      msgs.forEach((msg) => {
        const msgDate = new Date(msg.created_at).toDateString();
        if (msgDate !== currentDate) {
          currentDate = msgDate;
          groups.push({ type: 'date', date: msgDate });
        }
        groups.push({ type: 'message', data: msg });
      });
      
      return groups;
    };

    const formatDateHeader = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const groupedMessages = groupMessagesByDate(messages);
  
    return (
      <div className="flex-1 flex flex-col bg-white relative h-full">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white z-10">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Avatar */}
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            {getOtherParticipant()?.profile_picture ? (
              <img 
                src={getOtherParticipant().profile_picture} 
                alt={getConversationName()}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm">
                {getConversationName().charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{getConversationName()}</h2>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer hidden md:block"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
  
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messagesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
            </div>
          ) : (
            groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return (
                  <div key={`date-${index}`} className="flex justify-center">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                      {formatDateHeader(item.date)}
                    </span>
                  </div>
                );
              }
              
              const message = item.data;
              const isMe = isMyMessage(message);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isMe
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : ''}`}>
                      {formatTime(message.created_at)}
                      {isMe && message.is_read && (
                        <span className="ml-1 text-blue-500">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Fixed Message Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            />
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Smile className="w-6 h-6" />
            </button>
            <button onClick={handleWalletClick} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Wallet className="w-6 h-6" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sending}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <ChatWalletModal
            isOpen={showChatWalletModal}
            onClose={() => setShowChatWalletModal(false)}
            onSendToken={handleSendToken}
            onRequestToken={handleRequestToken}
        />

        <SendTokenModal
            isOpen={showSendTokenModal}
            onClose={() => setShowSendTokenModal(false)}
            recipientName={getConversationName()}
        />

        <RequestTokenModal
            isOpen={showRequestTokenModal}
            onClose={() => setShowRequestTokenModal(false)}
            senderName={getConversationName()}
        />
      </div>
    );
};