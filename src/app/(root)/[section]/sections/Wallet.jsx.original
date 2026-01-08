'use client';

import React, { useState } from 'react';
import Tokens from '@/components/Wallet/Tokens';
import Subscriptions from '@/components/Wallet/Subscriptions';
import KYC from '@/components/Wallet/KYC';
import Requests from '@/components/Wallet/Requests';
import Referrals from '@/components/Wallet/Referrals';
import Voucher from '@/components/Wallet/Voucher';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('Tokens');
  
  const tabs = ['Token', 'Subscription', 'KYC', 'Request Payout', 'Referrals', 'Voucher'];


  // Function to render the current page
  const renderCurrentPage = () => {
    switch(activeTab) {
      case 'Token':
        return <Tokens />;
      case 'Subscription':
        return <Subscriptions />;
      case 'KYC':
        return <KYC />;
      case 'Request Payout':
        return <Requests />;
      case 'Referrals':
        return <Referrals />;
      case 'Voucher':
        return <Voucher />;
      default:
        return <Tokens />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-full">
      {/* Navigation Tabs */}
      <div className="bg-gray-50">
        <div className="flex space-x-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full py-3 px-1 text-sm font-semibold font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600 bg-white'
                  : 'text-gray-500 border-transparent bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {renderCurrentPage()}
      </div>
    </div>

  );
};

export default Wallet;