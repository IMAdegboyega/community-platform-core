'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, MoreHorizontal, Send, ArrowLeft, Phone, Video, Image as ImageIcon } from 'lucide-react'
import { messagingApi, ChatSocket } from '@/lib/api'
import { authApi } from '@/lib/api'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showChatView, setShowChatView] = useState(false)
  const [socket, setSocket] = useState(null)
  const [typingUsers, setTypingUsers] = useState({})
  const messagesEndRef = useRef(null)

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
    setupWebSocket()
    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  const setupWebSocket = () => {
    const user = authApi.getStoredUser()
    const token = authApi.isAuthenticated() ? localStorage.getItem('access_token') : null
    if (user && token) {
      const ws = new ChatSocket(user.id, token)
      ws.connect()
      
      ws.on('new_message', (data) => {
        if (selectedConversation?.id === data.conversation_id) {
          setMessages(prev => [...prev, data.message])
        }
        // Update conversation list
        fetchConversations()
      })

      ws.on('typing', (data) => {
        setTypingUsers(prev => ({ ...prev, [data.conversation_id]: data.user_id }))
      })

      ws.on('stop_typing', (data) => {
        setTypingUsers(prev => {
          const updated = { ...prev }
          delete updated[data.conversation_id]
          return updated
        })
      })

      setSocket(ws)
    }
  }

  const fetchConversations = async () => {
    try {
      const { conversations: convos } = await messagingApi.getConversations(20, 0)
      setConversations(convos || [])
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const { messages: msgs } = await messagingApi.getMessages(conversationId, 50, 0)
      setMessages((msgs || []).reverse())
      // Mark as read
      if (msgs && msgs.length > 0) {
        await messagingApi.markAsRead(conversationId, msgs[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setShowChatView(true)
    await fetchMessages(conversation.id)
    if (socket) {
      socket.subscribeToConversation(conversation.id)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message = await messagingApi.sendMessage(
        selectedConversation.id,
        newMessage.trim(),
        'text'
      )
      setMessages(prev => [...prev, message])
      setNewMessage('')
      if (socket) socket.sendStopTyping(selectedConversation.id)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleTyping = () => {
    if (socket && selectedConversation) {
      socket.sendTyping(selectedConversation.id)
    }
  }

  const handleCloseChatView = () => {
    setShowChatView(false)
    if (socket && selectedConversation) {
      socket.unsubscribeFromConversation(selectedConversation.id)
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get display info for conversation
  const getConversationDisplay = (conv) => {
    const otherParticipant = conv.participants?.find(p => p.user?.id !== authApi.getStoredUser()?.id)
    return {
      name: conv.name || otherParticipant?.user?.display_name || otherParticipant?.user?.username || 'Chat',
      image: otherParticipant?.user?.profile_picture || '/img/avatar.png',
      isOnline: otherParticipant?.user?.is_online,
    }
  }

  if (loading) {
    return (
      <div className="flex h-full w-full bg-gray-50">
        <div className="w-full md:w-80 bg-white border-r">
          <div className="p-4 border-b">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Conversations List */}
      <div className={`w-full md:w-80 bg-white border-r ${showChatView ? 'hidden md:block' : 'block'}`}>
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a chat with someone!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const display = getConversationDisplay(conv)
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={display.image}
                      alt={display.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {display.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 truncate">{display.name}</p>
                      <span className="text-xs text-gray-500">
                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {typingUsers[conv.id] ? 'Typing...' : 'Tap to view messages'}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{conv.unread_count}</span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Chat View */}
      {showChatView && selectedConversation && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <button onClick={handleCloseChatView} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={getConversationDisplay(selectedConversation).image}
                alt={getConversationDisplay(selectedConversation).name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{getConversationDisplay(selectedConversation).name}</p>
                <p className="text-xs text-gray-500">
                  {typingUsers[selectedConversation.id] ? 'Typing...' : 
                    getConversationDisplay(selectedConversation).isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === authApi.getStoredUser()?.id
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Desktop */}
      {!showChatView && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
