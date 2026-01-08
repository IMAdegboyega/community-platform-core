import React, { useState } from 'react'
import { X } from 'lucide-react'

const FilterModal = ({ 
  isOpen,
  onClose,
  onSave,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    gender: initialFilters.gender || '',
    country: initialFilters.country || '',
    state: initialFilters.state || '',
    city: initialFilters.city || ''
  })

  if (!isOpen) return null

  const handleSave = () => {
    onSave(filters)
    onClose()
  }

  const handleCancel = () => {
    // Reset to initial filters
    setFilters(initialFilters)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold">Member Search</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Gender Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Gender</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={filters.gender === 'male'}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={filters.gender === 'female'}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Female</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="both"
                  checked={filters.gender === 'both'}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Both</span>
              </label>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-sm font-medium mb-4">Location</h3>
            
            {/* Country */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Country</label>
              <input
                type="text"
                placeholder="Country"
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">State</label>
              <input
                type="text"
                placeholder="State"
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* City */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">City</label>
              <input
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterModal