'use client'

import React, { useState } from 'react';
import { ArrowLeft, Settings, Check, Trash2, MoreHorizontal } from 'lucide-react';

const Notification = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      message: "You have received a welcome gift of 100 Token.",
      timestamp: "May 17, 2022 at 10AM",
      isRead: false,
      type: 'reward'
    },
    {
      id: 2,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      message: "John liked your photo.",
      timestamp: "May 17, 2022 at 9AM",
      isRead: false,
      type: 'like'
    },
    {
      id: 3,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      message: "Sarah started following you.",
      timestamp: "May 16, 2022 at 8PM",
      isRead: true,
      type: 'follow'
    },
    {
      id: 4,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      message: "Mike commented on your post: \"This is amazing!\"",
      timestamp: "May 16, 2022 at 5PM",
      isRead: true,
      type: 'comment'
    },
    {
      id: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      message: "You have received a tip of 50 Token from a subscriber.",
      timestamp: "May 16, 2022 at 2PM",
      isRead: true,
      type: 'reward'
    },
    {
      id: 6,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      message: "Emma mentioned you in a comment.",
      timestamp: "May 15, 2022 at 11AM",
      isRead: true,
      type: 'mention'
    }
  ]);

  const filters = ['All', 'Unread', 'Likes', 'Comments', 'Follows'];

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.isRead;
    if (activeFilter === 'Likes') return n.type === 'like';
    if (activeFilter === 'Comments') return n.type === 'comment';
    if (activeFilter === 'Follows') return n.type === 'follow';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-5xl mx-auto min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <h1 className="font-semibold text-gray-900">Notifications</h1>
        <Settings className="w-6 h-6 text-gray-700" />
      </div>

      {/* Desktop/Tablet Header */}
      <div className="hidden md:flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {/* Mobile - Scrollable */}
        <div className="flex overflow-x-auto scrollbar-hide md:hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeFilter === filter
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {filter}
              {filter === 'Unread' && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tablet/Desktop - Regular tabs */}
        <div className="hidden md:flex gap-2 p-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter}
              {filter === 'Unread' && unreadCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === filter 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="p-3 bg-blue-50 md:hidden">
          <button 
            onClick={markAllAsRead}
            className="w-full py-2 text-sm text-blue-600 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="bg-white md:my-4 md:rounded-lg ">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              onClick={() => markAsRead(notification.id)}
              className={`flex items-start gap-3 p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                !notification.isRead 
                  ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={notification.avatar}
                  alt="User avatar"
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover"
                />
                {!notification.isRead && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white md:hidden"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${
                  !notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'
                }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.timestamp}
                </p>
              </div>

              {/* Actions - Desktop only */}
              <div className="hidden md:flex items-center gap-2">
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile More Button */}
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 md:hidden"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Mobile Bottom Padding for Nav */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default Notification;