'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, X, Loader2, Trash2 } from 'lucide-react';
import { usersApi } from '@/lib/api';

const EditProfile = ({ onBack, userData }) => {
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState(userData?.profile_picture || null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: userData?.display_name || userData?.username || '',
    bio: userData?.bio || '',
    location: userData?.location || '',
    website: userData?.website || '',
  });

  // Use either preview (new upload) or existing profile picture
  const displayImage = profilePicturePreview || (removeProfilePicture ? null : profilePicture);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setRemoveProfilePicture(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setProfilePicturePreview(null);
    setRemoveProfilePicture(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // Build update data
      const updateData = {
        display_name: profileData.displayName || null,
        bio: profileData.bio || null,
        location: profileData.location || null,
        website: profileData.website || null,
      };

      // If removing profile picture
      if (removeProfilePicture) {
        updateData.profile_picture = null;
      }

      // Update profile
      await usersApi.updateProfile(updateData);

      // If there's a new profile picture, upload it
      if (selectedFile) {
        const formData = new FormData();
        formData.append('picture', selectedFile);
        try {
          await usersApi.uploadProfilePicture(formData);
        } catch (err) {
          console.error('Failed to upload profile picture:', err);
          // Continue anyway since profile was saved
        }
      }

      // Close and refresh
      onBack();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900">Edit Profile</h2>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/img/avatar.png"
                    alt="Default avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />
              </label>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {displayImage ? 'Change Photo' : 'Upload Photo'}
              </button>
              {displayImage && (
                <button 
                  onClick={handleRemovePhoto}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Profile Details</h3>
            
            {/* Display Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Display Name</label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your city or country"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Website</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
