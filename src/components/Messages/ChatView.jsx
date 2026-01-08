'use client'

import { Send, Smile, Wallet, X } from "lucide-react";
import { useState } from "react";
import { ChatWalletModal, RequestTokenModal, SendTokenModal } from "./FloatyModal";

export const ChatView = ({ chat, messages, onClose }) => {
    const [messageInput, setMessageInput] = useState('');
    const [showChatWalletModal, setShowChatWalletModal] = useState(false);
    const [showSendTokenModal, setShowSendTokenModal] = useState(false);
    const [showRequestTokenModal, setShowRequestTokenModal] = useState(false)
  
    const handleSendMessage = () => {
      if (messageInput.trim()) {
        console.log('Sending message:', messageInput);
        setMessageInput('');
      }
    };

    const handleSendClick = () => {
        // Show the token modal instead of sending message directly
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
  
    return (
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10">
          <h2 className="font-medium text-gray-900">Today</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
  
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md ${message.isMe ? 'order-2' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${message.isMe ? 'text-right' : ''}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
  
        {/* Fixed Message Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Smile className="w-6 h-6" />
            </button>
            <button onClick={handleSendClick} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Wallet className="w-6 h-6" />
            </button>
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Send className="w-5 h-5" />
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
            recipientName={chat?.name || "User"}
        />

        {/* Request Token Modal */}
        <RequestTokenModal
            isOpen={showRequestTokenModal}
            onClose={() => setShowRequestTokenModal(false)}
            senderName={chat?.name || "User"}
        />
      </div>
    );
};