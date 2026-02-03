'use client'

import React, { useState, useEffect } from 'react';
import { ChatList } from '@/components/Messages/ChatList';
import { ChatView } from '@/components/Messages/ChatView';
import { messagingApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const Messages = ({ onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showChatView, setShowChatView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagingApi.getConversations(20, 0);
      const convList = Array.isArray(response) ? response : (response?.data || []);
      setConversations(convList);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const response = await messagingApi.getMessages(conversationId, 50, 0);
      const msgList = Array.isArray(response) ? response : (response?.data || []);
      setMessages(msgList);
      // Mark conversation as read
      await messagingApi.markAsRead(conversationId);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowChatView(true);
    fetchMessages(conversation.id);
  };

  const handleCloseChatView = () => {
    setShowChatView(false);
    setSelectedConversation(null);
    setMessages([]);
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;
    
    try {
      const newMessage = await messagingApi.sendMessage(selectedConversation.id, content);
      setMessages(prev => [...prev, newMessage]);
      // Update last message in conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message: newMessage, updated_at: new Date().toISOString() }
          : conv
      ));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      const conversation = await messagingApi.getOrCreateDirect(userId);
      // Add to conversations list if not already there
      setConversations(prev => {
        const exists = prev.find(c => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      handleSelectConversation(conversation);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* ChatList - hidden on mobile when chat is open, full width on mobile */}
      <div className={`w-full md:w-auto ${showChatView ? 'hidden md:block' : 'block'}`}>
        <ChatList 
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onStartConversation={handleStartConversation}
        />
      </div>
      
      {/* ChatView - full screen on mobile, side panel on tablet/desktop */}
      {showChatView && selectedConversation && (
        <div className="w-full md:flex-1">
          <ChatView 
            conversation={selectedConversation}
            messages={messages}
            messagesLoading={messagesLoading}
            onClose={handleCloseChatView}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}

      {/* Empty state when no conversation selected on desktop */}
      {!showChatView && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <p className="text-lg">Select a conversation to start messaging</p>
            <p className="text-sm mt-2">Or start a new conversation with the + button</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;