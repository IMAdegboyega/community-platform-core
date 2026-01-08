'use client'

import Notification from '@/components/Settings/Notification';
import Password from '@/components/Settings/Password';
import ProfileVerification from '@/components/Settings/ProfileVerification';
import Subscriptions from '@/components/Settings/Subscriptions';
import React, { useState } from 'react';

// Password Tab Component


// Notification Tab Component


// Subscriptions Tab Component


// Profile Verification Tab Component


// Main Settings Component with Tabs
const Settings = () => {
  const [activeTab, setActiveTab] = useState('password');

  const tabs = [
    { id: 'password', label: 'Password' },
    { id: 'notification', label: 'Notification' },
    { id: 'subscriptions', label: 'Set Subscriptions' },
    { id: 'profile', label: 'Profile Verification' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'password':
        return <Password />;
      case 'notification':
        return <Notification/>;
      case 'subscriptions':
        return <Subscriptions/>;
      case 'profile':
        return <ProfileVerification/>;
      default:
        return <Password/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white">
          <div className="flex border-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-0'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;