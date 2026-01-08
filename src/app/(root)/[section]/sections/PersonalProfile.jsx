'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import MyWall from '@/components/PersonalProfile/MyWall';
import Photos from '@/components/PersonalProfile/Photos';
import Videos from '@/components/PersonalProfile/Videos';
import Followers from '@/components/PersonalProfile/Followers';
import Following from '@/components/PersonalProfile/Following';
import Subscribers from '@/components/PersonalProfile/Subscribers';
import EditProfile from '@/components/PersonalProfile/EditProfile';
import { ArrowLeft, Share, Settings } from 'lucide-react';

const PersonalProfile = () => {
  const [activeTab, setActiveTab] = useState('My Wall');
  const [isOnline, setIsOnline] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBio, setShowBio] = useState(false);

  const tabs = ['My Wall', 'Photos', 'Videos', 'Followers', 'Following', 'Subscribers'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'My Wall':
        return <MyWall/>;
      case 'Photos':
        return <Photos/>;
      case 'Videos':
        return <Videos/>;
      case 'Followers':
        return <Followers/>;
      case 'Following':
        return <Following/>;
      case 'Subscribers':
        return <Subscribers/>;
      default:
        return <MyWall/>;
    }
  };
  
  const profileStats = {
    profession: 'Data Analyst',
    language: 'English', 
    hobby: 'Music',
    height: '5\'3"',
    city: 'Lagos',
    age: '20'
  };

  if (showEditProfile) {
    return <EditProfile onBack={() => setShowEditProfile(false)} />;
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
                <Image 
                  src="/img/lady.png" 
                  alt="Profile" 
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-3 border-white"></div>
              )}
            </div>

            {/* Name & Username */}
            <h1 className="text-xl font-semibold text-gray-900">Elena Paul</h1>
            <p className="text-gray-500 text-sm mb-2">@elena</p>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">128</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">14.2k</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">326</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>

            {/* Bio - Collapsible on mobile */}
            <div className="w-full px-2 mb-4">
              <p className={`text-gray-700 text-sm ${!showBio ? 'line-clamp-2' : ''}`}>
                Hello bro! DM nudies for you, DM if you wanna talk, selling contents, custom videos, Feeds, Bisexual, FreeEnds
              </p>
              <button 
                onClick={() => setShowBio(!showBio)}
                className="text-blue-600 text-sm mt-1"
              >
                {showBio ? 'Show less' : 'Show more'}
              </button>
            </div>

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
                  <Image 
                    src="/img/lady.png" 
                    alt="Profile" 
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-3 border-white"></div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">Elena Paul</h1>
                <p className="text-gray-500 text-sm">@elena</p>
                <p className="text-gray-700 mt-2 max-w-md">
                  Hello bro! DM nudies for you, DM if you wanna talk, selling contents, custom videos, Feeds, Bisexual, FreeEnds
                </p>
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