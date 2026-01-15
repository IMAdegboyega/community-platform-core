'use client'

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, ChevronDown, X } from 'lucide-react';

export const TopUpToken = ({ isOpen, onClose }) => {
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenValue] = useState('');

  const handleProceed = () => {
    console.log('Processing top up:', { tokenAmount, tokenValue });
    // You can pass the tokenAmount to parent component if needed
    setTokenAmount('');
    onClose();
  };

  const handleClose = () => {
    setTokenAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={handleClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md relative">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Top Up Token</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6">
            Please enter the token amount
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

          {/* Token Value Display */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Value
            </label>
            <input
              type="text"
              placeholder="Enter Token Value"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};


export const TransferToken = ({ isOpen, onClose }) => {
    const [tokenAmount, setTokenAmount] = useState('');
    const [tokenValue] = useState('');
  
    const handleProceed = () => {
      console.log('Processing top up:', { tokenAmount, tokenValue });
      // You can pass the tokenAmount to parent component if needed
      setTokenAmount('');
      onClose();
    };
  
    const handleClose = () => {
      setTokenAmount('');
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div onClick={handleClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        {/* Modal Content */}
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md relative">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Transfer Token</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
  
          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600 text-sm mb-6">
              Please enter the token amount
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
  
            {/* Token Value Display */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Value
                </label>
                <input
                    type="text"
                    placeholder="Enter Token Value"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2    focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
            </div>
  
            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
};


export const SubscriptionConfirm = ({ isOpen, onClose, onConfirm, forceStatus = null }) => {
  const [status, setStatus] = useState('confirm'); // 'confirm', 'success', or 'failed'

  // Reset status when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('confirm');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoBack = () => {
    onClose();
  };

  const handleSubscribe = () => {
    // Use forceStatus if provided, otherwise random
    let isSuccess;
    
    if (forceStatus !== null && forceStatus !== undefined) {
      isSuccess = forceStatus === 'success';
    } else {
      isSuccess = Math.random() > 0.5;
    }
    
    if (isSuccess) {
      setStatus('success');
      onConfirm();
    } else {
      setStatus('failed');
    }
    
    // Don't auto-close if forced status for demo
    if (!forceStatus) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'confirm':
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              You are about to
            </h2>
            <p className="text-xl font-semibold text-gray-800 mb-8">
              subscribe to this plan
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleGoBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleSubscribe}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </div>
          </>
        );
      
      case 'success':
        return (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Subscription Successful
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Back
            </button>
          </>
        );
      
      case 'failed':
        return (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Subscription Failed
              </h2>
              <p className="text-gray-600 text-sm">
                Your subscription could not be processed. Please try again.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setStatus('confirm')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md relative">
        {/* Content */}
        <div className="p-8 text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};


export const CancelSubscription = ({ isOpen, onClose, onConfirm }) => {
  const [status, setStatus] = useState('confirm'); // 'confirm' or 'success'

  // Reset status when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('confirm');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoBack = () => {
    onClose();
  };

  const handleProceed = () => {
    setStatus('success');
    onConfirm();
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const renderContent = () => {
    switch (status) {
      case 'confirm':
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              You are about to cancel your
            </h2>
            <p className="text-xl font-semibold text-gray-800 mb-8">
              current subscription plan
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleGoBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Proceed
              </button>
            </div>
          </>
        );
      
      case 'success':
        return (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Subscription Cancelled
              </h2>
              <p className="text-gray-600 text-sm">
                Your subscription has been successfully cancelled.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </>
        );
    }
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-lg w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};


export const IDUpload = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div 
      onClick={handleClose} 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-lg w-full max-w-lg relative"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Upload a photo of your National ID (front)
          </h2>
          
          <p className="text-gray-600 text-sm mb-6 text-center">
            Ensure all information is readable and not blurry. Make sure that all corners of the 
            document are visible. Your document may not be accepted if it cannot be read 
            properly or all four corners are not visible. Only front of the ID (with photograph) 
            required. The name of account should match name in ID.
          </p>

          {/* ID Card Preview/Upload Area */}
          <div className="mb-6">
            <label htmlFor="id-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="ID Preview" 
                    className="max-w-full h-auto mx-auto rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Sample ID Card Image */}
                    <div className="w-64 h-40 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
                      {/* Kenya ID Card Mock */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-50">
                        <div className="p-3">
                          <div className="text-xs font-bold text-center mb-2">JAMHURI YA KENYA - REPUBLIC OF KENYA</div>
                          <div className="flex gap-3">
                            <div className="w-16 h-20 bg-gray-300 rounded"></div>
                            <div className="flex-1 text-xs space-y-1">
                              <div className="bg-gray-200 h-3 w-20 rounded"></div>
                              <div className="bg-gray-200 h-3 w-24 rounded"></div>
                              <div className="bg-gray-200 h-3 w-16 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-8"></div>
                      </div>
                    </div>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload your ID</p>
                  </div>
                )}
              </div>
              <input
                id="id-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedFile 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};


export const BankAccountDetails = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    accountName: ''
  });
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  // Sample bank list - you can replace with your actual bank data
  const banks = [
    'Access Bank',
    'Zenith Bank',
    'First Bank',
    'GTBank',
    'UBA',
    'Sterling Bank',
    'Stanbic IBTC',
    'Fidelity Bank',
    'Union Bank',
    'Ecobank'
  ];

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankSelect = (bank) => {
    setFormData(prev => ({
      ...prev,
      bank: bank
    }));
    setShowBankDropdown(false);
  };

  const handleSave = () => {
    if (formData.bank && formData.accountNumber && formData.accountName) {
      onSave(formData);
      // Reset form
      setFormData({
        bank: '',
        accountNumber: '',
        accountName: ''
      });
      onClose();
    }
  };

  const handleDelete = () => {
    // Handle delete logic
    setFormData({
      bank: '',
      accountNumber: '',
      accountName: ''
    });
  };

  const handleClose = () => {
    setFormData({
      bank: '',
      accountNumber: '',
      accountName: ''
    });
    setShowBankDropdown(false);
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
            Bank Account Details
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Please fill this form to enter account details
          </p>

          {/* Bank Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="w-full px-4 py-3 bg-purple-50 border border-purple-100 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={formData.bank ? 'text-gray-700' : 'text-gray-400'}>
                  {formData.bank || 'Select one'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showBankDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {banks.map((bank, index) => (
                    <button
                      key={index}
                      onClick={() => handleBankSelect(bank)}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full px-4 py-3 bg-purple-50 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Account Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              className="w-full px-4 py-3 bg-purple-50 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="flex-1 py-3 border border-purple-300 text-blue-600 rounded-lg hover:bg-blue-50  transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.bank || !formData.accountNumber || !formData.accountName}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                formData.bank && formData.accountNumber && formData.accountName
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export const RequestPayout = ({ isOpen, onClose }) => {
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenValue] = useState('');

  const handleProceed = () => {
    console.log('Processing top up:', { tokenAmount, tokenValue });
    // You can pass the tokenAmount to parent component if needed
    setTokenAmount('');
    onClose();
  };

  const handleClose = () => {
    setTokenAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={handleClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md relative">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Request For Payout</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6">
            Please fill this form to request for payout
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

          {/* Token Value Display */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Value
            </label>
            <input
              type="text"
              placeholder="Enter Token Value"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
