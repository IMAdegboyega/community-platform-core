'use client';

import React from 'react';
import { Clock } from 'lucide-react';

const Subscribers = () => {
  return (
    <div className="min-h-[400px] bg-white rounded-lg flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-500 text-center max-w-sm">
        Subscribers feature is currently under development. Check back soon!
      </p>
    </div>
  );
};

export default Subscribers;
