'use client'

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Check, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api';

const Notification = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const filters = ['All', 'Unread', 'Likes', 'Comments', 'Follows'];

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getNotifications(50, 0);
      // Handle both array response and object with data property
      const notificationList = Array.isArray(response) ? response : (response?.data || []);
      setNotifications(notificationList);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      setUnreadCount(response.unread_count || response?.data?.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsApi.deleteNotification(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.is_read;
    if (activeFilter === 'Likes') return n.type === 'like';
    if (activeFilter === 'Comments') return n.type === 'comment';
    if (activeFilter === 'Follows') return n.type === 'follow';
    return true;
  });

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading notifications...</p>
        </div>
      </div>
    );
  }

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
          disabled={unreadCount === 0}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="bg-white md:my-4 md:rounded-lg">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">
              {activeFilter === 'All' ? 'No notifications yet' : `No ${activeFilter.toLowerCase()} notifications`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`flex items-start gap-3 p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                !notification.is_read 
                  ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={notification.actor?.profile_picture || notification.avatar || '/img/avatar.png'}
                  alt="User avatar"
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover"
                />
                {!notification.is_read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white md:hidden"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${
                  !notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-700'
                }`}>
                  {notification.message || notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(notification.created_at)}
                </p>
              </div>

              {/* Actions - Desktop only */}
              <div className="hidden md:flex items-center gap-2">
                {!notification.is_read && (
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
