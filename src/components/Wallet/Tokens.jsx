'use client';

import { Send, Plus } from "lucide-react";
import TransactionsTable from "./Transactions";
import React, { useState } from "react";
import { TopUpToken, TransferToken } from "./FloatyWindow";

const sampleTransactions = [
  {
    date: '17/05/2022',
    description: 'Token Topup',
    recipient: 'Self',
    amount: '500',
    status: 'Pending'
  },
  {
    date: '17/05/2022',
    description: 'Token Transfer',
    recipient: '@Elena',
    amount: '500',
    status: 'Successful'
  },
  {
    date: '17/05/2022',
    description: 'Token Topup',
    recipient: 'Self',
    amount: '500',
    status: 'Successful'
  },
  {
    date: '17/05/2022',
    description: 'Token Transfer',
    recipient: '@Elena',
    amount: '500',
    status: 'Successful'
  },
  {
    date: '17/05/2022',
    description: 'Token Topup',
    recipient: 'Self',
    amount: '500',
    status: 'Failed'
  },
  {
    date: '17/05/2022',
    description: 'Token Transfer',
    recipient: '@Elena',
    amount: '500',
    status: 'Successful'
  },
  {
    date: '17/05/2022',
    description: 'Token Topup',
    recipient: 'Self',
    amount: '500',
    status: 'Successful'
  }
];

const Tokens = () => {
    const [showData, setShowData] = React.useState(true);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div className="space-y-10">
      {/* Token Cards Section */}
      <div className="grid grid-cols-1 bg-white md:grid-cols-3 p-10 gap-4">
        {/* Token Balance Card */}
        <div className="bg-gray-800 text-white p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="text-3xl font-bold mb-1">5000</div>
            <div className="text-gray-300 text-sm flex items-center">
              Token Balance 
              <div className="w-3 h-3 bg-white rounded-sm ml-2 opacity-60"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        </div>

        {/* Top Up Token Card */}
        <div onClick={() => setShowTopUp(true)} className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-gray-700 font-medium">Top Up Token</span>
        </div>

        {/* Transfer Token Card */}
        <div onClick={() => setShowTransfer(true)} className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Send className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-gray-700 font-medium">Transfer Token</span>
        </div>
      </div>

      {/* My Transactions Section */}
      <div className="pt-8">
        <div className="w-full mx-auto bg-gray-50 min-h-screen">
          <div className="bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Transactions</h2>
              <button 
                onClick={() => setShowData(!showData)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                {showData ? 'Show Empty State' : 'Show With Data'}
              </button>
            </div>

            <TransactionsTable transactions={showData ? sampleTransactions : []} />
          </div>
        </div>
      </div>

      <TopUpToken 
        isOpen={showTopUp} 
        onClose={() => setShowTopUp(false)} 
      />

      <TransferToken
        isOpen={showTransfer} 
        onClose={() => setShowTransfer(false)} 
      />


    </div>
  );
};

export default Tokens;