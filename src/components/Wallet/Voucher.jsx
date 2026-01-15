import React, { useState } from 'react';

const Voucher = () => {
  const [voucherCode, setVoucherCode] = useState('');

  const handleActivate = () => {
    console.log('Activating voucher:', voucherCode);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto pt-8">
        {/* How do I get a Voucher Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            How do I get a Voucher?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You can receive a promo code on Kiekky social media platform, through our 
            newsletter or our customer service. Valid codes are visible on your Kiekky account 
            after activation.
          </p>
        </div>

        {/* How do I use my code Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            How do I use my code?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Here you can redeem your code. Enter it in the field below and your free credit will 
            be automatically added to your Kiekky account. Don't forget that codes can expire 
            or only be active for a short time, so it's best to use them right away.
          </p>
        </div>

        {/* Voucher Code Input Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Voucher Code
          </h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Insert Voucher Code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            
            <button
              onClick={handleActivate}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;