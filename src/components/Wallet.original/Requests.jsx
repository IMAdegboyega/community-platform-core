'use client'

import React, { useState } from 'react';
import { ArrowUpRight, Edit2 } from 'lucide-react';
import { BankAccountDetails, RequestPayout } from './FloatyWindow';

const Requests = () => {

  const [showPayOut, setShowPayOut] = useState(false);
  const [showBank, setShowBank] = useState(false);

  const handleSaveBankDetails = (bankDetails) => {
    console.log('Bank details saved:', bankDetails);
    // Handle saving the bank details
    // bankDetails will contain: { bank, accountNumber, accountName }
  };

  const handlePayOut = (payOut) => {
    console.log('Payout requested for amount:', payOut);
  } 

  const handleRequestPayout = () => {
    console.log('Request payout clicked');
    setShowPayOut(true);
  }

  const handleAddBankDetails = () => {
    console.log('Add bank details clicked');
  };

  return (
    <div className="min-h-screen bg-white pt-6 p-6">
      <div className="max-w-4xl mx-auto p-6">
        {/* Request Payout Section */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">You can request for payout</p>
          
          <button
            onClick={handleRequestPayout}
            className="w-full max-w-xs border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-300 transition-colors bg-white group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <ArrowUpRight className="w-8 h-8 text-blue-500 mb-3 transform rotate-[-45deg]" />
              <span className="text-gray-800">Request Payout</span>
            </div>
          </button>
        </div>

        {/* Saved Account Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Saved Account</h2>
            <Edit2 className="w-4 h-4 text-gray-400" />
          </div>

          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-2">No new bank details saved</p>
            <button
              onClick={handleAddBankDetails}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span onClick={() => setShowBank(true)} className='cursor-pointer'>Click here</span>
              <span className="text-gray-400"> to add your bank details</span>
            </button>
          </div>
        </div>
      </div>

      <RequestPayout
        isOpen={showPayOut}
        onClose={() => setShowPayOut(false)}
        onSave={handlePayOut}
        forceStatus="success"
      />

      <BankAccountDetails
        isOpen={showBank}
        onClose={() => setShowBank(false)}
        onSave={handleSaveBankDetails}
        forceStatus="success"
      />
    </div>
  );
};

export default Requests;