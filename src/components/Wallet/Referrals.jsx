import React, { useState } from 'react';
import { Send, FileText, Wallet, Facebook, Instagram, Twitter } from 'lucide-react';

const Referrals = () => {
  const [referralLink] = useState('Kiekky.com/referr...');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: <Send className="w-6 h-6 text-blue-600" />,
      title: 'Send Invitation',
      description: 'Send your referral code to your friends and tell them about Kiekky.'
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: 'Registration',
      description: 'They get registered on the Kiekky platform using your referral link.'
    },
    {
      icon: <Wallet className="w-6 h-6 text-blue-600" />,
      title: 'Receive free tokens',
      description: 'You and your friends will receive free tokens after transactions.'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-6">
        {/* Header */}
        <p className="text-gray-600 text-center mb-12">
          Invite your friends Kiekky. Get them to signup and get 5% of what they spend.
        </p>

        {/* Three Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Share Referral Link Section */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Share your referral link
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            You can share your referral link by copying and pasting the link or by sharing it on social media platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Facebook className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Instagram className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Twitter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;