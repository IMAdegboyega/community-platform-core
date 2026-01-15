import React, { useState } from 'react';
import { X } from 'lucide-react';

export const EditPlanModal = ({ isOpen, onClose, onSave, planDuration }) => {
  const [tokenAmount, setTokenAmount] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (tokenAmount) {
      onSave({ duration: planDuration, tokenAmount });
      setTokenAmount('');
      onClose();
    }
  };

  const handleClose = () => {
    setTokenAmount('');
    onClose();
  };

  return (
    <div 
      onClick={handleClose} 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-lg w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Edit Plan
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Choose what to offer your subscribers
          </p>

          {/* Token Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Amount
            </label>
            <input
              type="text"
              placeholder="Enter Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handleSave}
            disabled={!tokenAmount}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${
              tokenAmount 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
