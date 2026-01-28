'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MyWall from '@/components/PersonalProfile/MyWall';
import Photos from '@/components/PersonalProfile/Photos';
import Videos from '@/components/PersonalProfile/Videos';
import Followers from '@/components/PersonalProfile/Followers';
import Following from '@/components/PersonalProfile/Following';
import Subscribers from '@/components/PersonalProfile/Subscribers';
import EditProfile from '@/components/PersonalProfile/EditProfile';
import { ArrowLeft, Share, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';

const PersonalProfile = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('My Wall');
  const [isOnline, setIsOnline] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const tabs = ['My Wall', 'Photos', 'Videos', 'Followers', 'Following', 'Subscribers'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Get fresh user data from API
        const userData = await authApi.getMe();
        setProfileData(userData);
        setIsOnline(userData.is_online || false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fall back to auth context user
        if (authUser) {
          setProfileData(authUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  // Use profile data or fall back to auth user
  const user = profileData || authUser || {};
  
  // Extract user info with fallbacks
  const displayName = user.display_name || user.username || 'User';
  const username = user.username || 'username';
  const profilePicture = user.profile_picture || '/img/avatar.png';
  const bio = user.bio || '';
  const postsCount = user.posts_count || 0;
  const followersCount = user.followers_count || 0;
  const followingCount = user.following_count || 0;

  // Profile stats from user data
  const profileStats = {
    profession: user.profession || 'Not set',
    language: user.language || 'Not set', 
    hobby: user.hobby || 'Not set',
    height: user.height || 'Not set',
    city: user.city || 'Not set',
    age: user.age ? String(user.age) : 'Not set'
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  const handleEditProfileClose = async () => {
    setShowEditProfile(false);
    // Refresh user data after editing
    try {
      const userData = await authApi.getMe();
      setProfileData(userData);
      if (refreshUser) {
        refreshUser();
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'My Wall':
        return <MyWall userId={user.id} />;
      case 'Photos':
        return <Photos userId={user.id} />;
      case 'Videos':
        return <Videos userId={user.id} />;
      case 'Followers':
        return <Followers userId={user.id} />;
      case 'Following':
        return <Following userId={user.id} />;
      case 'Subscribers':
        return <Subscribers userId={user.id} />;
      default:
        return <MyWall userId={user.id} />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showEditProfile) {
    return <EditProfile onBack={handleEditProfileClose} userData={user} />;
  }

  return (
    <div className="max-w-5xl mx-auto min-h-screen bg-gray-50">
      {/* Mobile Header - only on mobile */}
      <div className="flex items-center justify-between p-4 bg-white md:hidden">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <h1 className="font-semibold text-gray-900">Profile</h1>
        <Settings className="w-6 h-6 text-gray-700" />
      </div>

      {/* Profile Header */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Mobile Layout */}
          <div className="flex flex-col items-center text-center md:hidden">
            {/* Profile Picture */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src={profilePicture} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                />
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-3 border-white"></div>
              )}
            </div>

            {/* Name & Username */}
            <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
            <p className="text-gray-500 text-sm mb-2">@{username}</p>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{formatCount(postsCount)}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{formatCount(followersCount)}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{formatCount(followingCount)}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>

            {/* Bio - Collapsible on mobile */}
            {bio && (
              <div className="w-full px-2 mb-4">
                <p className={`text-gray-700 text-sm ${!showBio ? 'line-clamp-2' : ''}`}>
                  {bio}
                </p>
                {bio.length > 100 && (
                  <button 
                    onClick={() => setShowBio(!showBio)}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {showBio ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowEditProfile(true)} 
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
              <button className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Share Profile
              </button>
            </div>

            {/* Online Toggle - Mobile */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-gray-600">Online</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isOnline ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    isOnline ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tablet & Desktop Layout */}
          <div className="hidden md:flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-300 overflow-hidden">
                  <img 
                    src={profilePicture} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-3 border-white"></div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">{displayName}</h1>
                <p className="text-gray-500 text-sm">@{username}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mt-2">
                  <div>
                    <span className="font-semibold text-gray-900">{formatCount(postsCount)}</span>
                    <span className="text-gray-500 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{formatCount(followersCount)}</span>
                    <span className="text-gray-500 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{formatCount(followingCount)}</span>
                    <span className="text-gray-500 ml-1">following</span>
                  </div>
                </div>
                
                {bio && (
                  <p className="text-gray-700 mt-2 max-w-md">{bio}</p>
                )}
                
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setShowEditProfile(true)} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Online Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Online Mode</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isOnline ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    isOnline ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 mt-2">
        <div className="max-w-5xl mx-auto">
          {/* Mobile Tabs - Scrollable */}
          <div className="flex overflow-x-auto scrollbar-hide md:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tablet & Desktop Tabs */}
          <div className="hidden md:flex gap-2 lg:gap-4 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium border rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-gray-200 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-4 md:py-6 px-4 md:px-0">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar - Hidden on mobile, shown on tablet as collapsible, full on desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Bio</h3>
              <div className="space-y-3">
                {Object.entries(profileStats).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-500 text-sm capitalize">{key}</span>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Card - Tablet only (horizontal layout) */}
          <div className="hidden md:block lg:hidden col-span-12 mb-2">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Bio</h3>
                <button 
                  onClick={() => setShowBio(!showBio)}
                  className="text-blue-600 text-sm"
                >
                  {showBio ? 'Hide' : 'Show'}
                </button>
              </div>
              {showBio && (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(profileStats).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-500 text-xs capitalize">{key}</span>
                      <p className="text-gray-900 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Feed */}
          <div className="col-span-12 lg:col-span-9">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bio Sheet - Slide up from bottom */}
      <div className="md:hidden">
        <button
          onClick={() => setShowBio(!showBio)}
          className="fixed bottom-20 left-4 right-4 bg-white rounded-t-xl shadow-lg p-3 text-center text-sm font-medium text-gray-700 border border-gray-200"
          style={{ display: showBio ? 'none' : 'block' }}
        >
          View Bio Details
        </button>
        
        {showBio && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowBio(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-24">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Bio</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(profileStats).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 text-xs capitalize">{key}</span>
                    <p className="text-gray-900 font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowBio(false)}
                className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalProfile;
