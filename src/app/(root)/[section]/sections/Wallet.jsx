'use client'

import React from 'react'
import { Wallet as WalletIcon, Clock, CreditCard } from 'lucide-react'

/**
 * DECOUPLED: Wallet/Payment features temporarily disabled
 * Original implementation preserved in Wallet.jsx.original
 * To re-enable: Rename Wallet.jsx.original back to Wallet.jsx
 */

const Wallet = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-green-50 to-white rounded-2xl border border-green-100">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
            <WalletIcon size={64} className="text-green-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
            <Clock size={20} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Wallet Coming Soon</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          We're building a secure payment system for you. Tokens, subscriptions, 
          and payouts will be available soon.
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <CreditCard size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">Secure Payments</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>In Development</span>
        </div>
      </div>
    </div>
  )
}

export default Wallet
