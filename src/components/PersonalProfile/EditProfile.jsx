import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import Image from 'next/image';

const EditProfile = ({ onBack }) => {
  const [profileData, setProfileData] = useState({
    fullName: 'Etuka Ayo',
    age: '31',
    country: 'Nigeria',
    city: 'Lagos',
    height: '150 cm',
    profession: 'Product Designer',
    whoAreYouLookingFor: 'I am looking for a Man',
    hobbies: {
      men: false,
      women: false
    },
    bio: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHobbyChange = (hobby) => {
    setProfileData(prev => ({
      ...prev,
      hobbies: {
        ...prev.hobbies,
        [hobby]: !prev.hobbies[hobby]
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo uploaded:', file);
      // Handle photo upload logic
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving profile data:', profileData);
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 ">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/img/lady.png"
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Edit Photo
            </button>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Profile Details</h2>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Age</label>
              <input
                type="text"
                value={profileData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <input
                type="text"
                value={profileData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height</label>
              <input
                type="text"
                value={profileData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Profession</label>
              <input
                type="text"
                value={profileData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Who are you looking for */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who are you looking for?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lookingFor"
                    value="man"
                    checked={profileData.whoAreYouLookingFor === 'I am looking for a Man'}
                    onChange={() => handleInputChange('whoAreYouLookingFor', 'I am looking for a Man')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm">I am looking for a Man</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lookingFor"
                    value="woman"
                    checked={profileData.whoAreYouLookingFor === 'I am looking for a Woman'}
                    onChange={() => handleInputChange('whoAreYouLookingFor', 'I am looking for a Woman')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm">I am looking for a Woman</span>
                </label>
              </div>
            </div>

            {/* Hobbies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobbies
              </label>
              <input
                type="text"
                placeholder="Type something............"
                value={profileData.hobbiesText || ''}
                onChange={(e) => handleInputChange('hobbiesText', e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none             focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Type something............"
                rows={4}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;