import React, { useState } from 'react';

const Notification = () => {
    const [emailNotification, setEmailNotification] = useState(true);
    const [systemNotification, setSystemNotification] = useState(true);

  return (
    <div className="p-8">
      <p className="text-gray-600 mb-8">
        You can turn on and off your notification settings
      </p>

      {/* Email Notification */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <span className="text-gray-800 font-medium">Email Notification</span>
        <button
          onClick={() => setEmailNotification(!emailNotification)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            emailNotification ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              emailNotification ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* System Notification */}
      <div className="flex items-center justify-between py-4">
        <span className="text-gray-800 font-medium">System Notification</span>
        <button
          onClick={() => setSystemNotification(!systemNotification)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            systemNotification ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              systemNotification ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
export default Notification;