'use client'
import react, { useState } from 'react';

const Password = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    console.log('Saving password changes:', passwords);
  };

  return (
    <div className="p-12 border-0 rounded-b-lg">
      <p className="text-gray-600 mb-6">
        You can change your password by filling the form
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Old Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={passwords.oldPassword}
          onChange={(e) => handleInputChange('oldPassword', e.target.value)}
          className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter confirm password"
          value={passwords.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Enter confirm password"
          value={passwords.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        />
      </div>

      <button
        onClick={handleSaveChanges}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Password