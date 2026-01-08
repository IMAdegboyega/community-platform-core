import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CancelSubscription, SubscriptionConfirm } from './FloatyWindow';

const Subscription = ({ 
  hasActiveSubscription = false, 
  currentPlan = null,
  subscriptionHistory = [] 
}) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [showActiveSubscription, setShowActiveSubscription] = useState(hasActiveSubscription);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: '$5',
      annualPrice: '$50',
      features: [
        'Hot Picks Ranking',
        'Explore Community',
        'Limited Media Upload',
        'Limited Date Applications',
        '25 Tokens'
      ],
      popular: false
    },
    {
      name: 'Gold',
      monthlyPrice: '$10',
      annualPrice: '$100',
      features: [
        'Hot Picks Ranking',
        'Explore Community',
        'Limited Media Upload',
        'Limited Date Applications',
        '50 Tokens'
      ],
      popular: true,
      savings: 40
    },
    {
      name: 'Premium',
      monthlyPrice: '$15',
      annualPrice: '$150',
      features: [
        'Hot Picks Ranking',
        'Explore Community',
        'Limited Media Upload',
        'Limited Date Applications',
        '100 Tokens'
      ],
      popular: false,
      savings: 40
    }
  ];

  // Sample subscription history data
  const defaultHistory = [
    {
      date: '17/05/2022',
      details: 'Gold plan monthly',
      amount: '500',
      status: 'Pending'
    },
    {
      date: '17/05/2022',
      details: 'Gold plan monthly',
      amount: '500',
      status: 'Successful'
    },
    {
      date: '17/05/2022',
      details: 'Gold plan monthly',
      amount: '500',
      status: 'Successful'
    },
    {
      date: '17/05/2022',
      details: 'Classic Plan annually',
      amount: '500',
      status: 'Failed'
    }
  ];

  const historyData = subscriptionHistory.length > 0 ? subscriptionHistory : defaultHistory;

  const handleSubscribe = () => {
    // Your subscription logic here
    console.log('User confirmed subscription');
  };

  const handleCancelSubscription = () => {
    // Your cancellation logic here
    console.log('Subscription cancelled');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Current subscription view
  if (showActiveSubscription) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 bg-gray-50 min-h-screen">
        {/* State Switcher for Demo */}
        
        <div className='bg-white rounded-lg p-12'>
            
            {/* Current Plan Card */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
            <div className="w-90 bg-white rounded-lg p-6 mb-8 border-2 border-blue-200 relative">
              {/* Crown icon */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className='text-white'/>
              </div>


              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monthly</div>
                  <div className="text-sm text-gray-500">23 days remaining</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">$1000.00</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCancel(true)} className="px-6 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  Cancel Plan
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Upgrade Plan
                </button>
              </div>
            </div>
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowActiveSubscription(!showActiveSubscription)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Switch to {showActiveSubscription ? 'Pricing Plans' : 'Current Subscription'} View
              </button>
            </div>
            <CancelSubscription 
              isOpen={showCancel}
              onClose={() => setShowCancel(false)}
              onConfirm={handleCancelSubscription}
            />
        </div>

        {/* Auto Renew Toggle */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Auto Renew</h3>
              <p className="text-gray-600 text-sm">
                This action if checked would renew the subscription when it expires.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setAutoRenew(!autoRenew)}
                className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                  autoRenew ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    autoRenew ? 'translate-x-9' : 'translate-x-1'
                  } mt-1`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription History</h3>
          <div className="overflow-x-auto bg-white rounded-lg pl-8 p-4">
            <table className="w-full">
              <thead>
                <tr className="border-0 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">Details</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-gray-600">{transaction.date}</td>
                    <td className="py-4 text-sm text-gray-900">{transaction.details}</td>
                    <td className="py-4 text-sm text-gray-900">{transaction.amount}</td>
                    <td className={`py-4 text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // New subscription view (your original pricing component)
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white min-h-screen">
      {/* State Switcher for Demo */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowActiveSubscription(!showActiveSubscription)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Switch to {showActiveSubscription ? 'Pricing Plans' : 'Current Subscription'} View
        </button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Personalized Plans For You
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a plan that works best for you.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-12">
        <span className={`mr-4 font-semibold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
          Bill Monthly
        </span>
        <div className="relative">
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`w-16 h-8 rounded-full transition-colors duration-300 ${
              isAnnual ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isAnnual ? 'translate-x-9' : 'translate-x-1'
              } mt-1`}
            ></div>
          </button>
        </div>
        <span className={`ml-4 font-semibold ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
          Bill Annually
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative rounded-lg p-8 transition-all duration-300 ${
              plan.popular
                ? 'bg-blue-600 text-white transform scale-105 shadow-2xl'
                : 'bg-gray-100 text-gray-900 shadow-sm hover:shadow-xl'
            }`}
          >
            {/* Savings Badge */}
            {plan.savings && (
              <div className="absolute -top-3 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Save ₦{plan.savings}
              </div>
            )}

            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-2">
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </div>
              <div className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center">
                  <Check 
                    className={`w-5 h-5 mr-3 ${
                      plan.popular ? 'text-white' : 'text-green-500'
                    }`} 
                  />
                  <span className={`${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Choose Button */}
            <button
              onClick={() => setShowConfirm(true)}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 cursor-pointer ${
                plan.popular
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Choose
            </button>
          </div>
        ))}
      </div>

      <SubscriptionConfirm
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubscribe}
        forceStatus="failed"
      />
    </div>
  );
};

export default Subscription;