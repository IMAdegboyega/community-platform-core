'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';

export const ChatWalletModal = ({ isOpen, onClose, onSendToken, onRequestToken }) => {
    if (!isOpen) return null;

    return (
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-24 right-4 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          {/* Close Button */}
          {/* <div className="flex justify-end px-2 pt-2">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div> */}
  
          {/* Modal Content */}
          <div className="pb-2">
            {/* Send Token Option */}
            <button
              onClick={() => {
                onSendToken();
                onClose();
              }}
              className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors hover:text-blue-600"
            >
              <p className="text-gray-700 font-medium hover:text-blue-600">Send Token</p>
            </button>
  
            {/* Request Token Option */}
            <button
              onClick={() => {
                onRequestToken();
                onClose();
              }}
              className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors hover:text-blue-600"
            >
              <p className="text-gray-700 font-medium hover:text-blue-600">Request Token</p>
            </button>
          </div>
        </div>
      </div>
    );
};

export const SendTokenModal = ({ isOpen, onClose, recipientName = "Elena" }) => {
    const [tokenAmount, setTokenAmount] = useState('');
    const [message, setMessage] = useState('');
  
    if (!isOpen) return null;
  
    const handleSend = () => {
      console.log('Sending tokens:', { tokenAmount, message });
      setTokenAmount('');
      setMessage('');
      onClose();
    };
  
    return (
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg w-full max-w-md p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Send to {recipientName}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
  
          {/* Token Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Amount
            </label>
            <input
              type="text"
              placeholder="Enter Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
  
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSend}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Send
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
};
  
  // Request Token Modal Component
export const RequestTokenModal = ({ isOpen, onClose, senderName = "Paul" }) => {
    const [tokenAmount, setTokenAmount] = useState('');
  
    if (!isOpen) return null;
  
    const handleRequest = () => {
      console.log('Requesting tokens:', tokenAmount);
      setTokenAmount('');
      onClose();
    };
  
    return (
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg w-full max-w-md p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Request Token from {senderName}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
  
          {/* Token Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Amount
            </label>
            <input
              type="text"
              placeholder="Enter Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleRequest}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Request
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
};
