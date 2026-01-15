import React, { useState } from 'react'
import { X, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react'

const DateRequestForm = ({ 
  isOpen,
  onClose,
  onSubmit,
  isInline = false
}) => {
  const [formData, setFormData] = useState({
    dateType: [],
    gender: [],
    location: '',
    preferredDay: '',
    preferredTime: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      dateType: [],
      gender: [],
      location: '',
      preferredDay: '',
      preferredTime: ''
    })
    onClose()
  }

  const dateTypes = ['Lunch', 'Dinner', 'Drinks', 'Party', 'Freaky']
  const genders = ['Male', 'Female']

  const handleCheckboxChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const formContent = (
    <div className="w-full max-w-3xl mx-auto">
      {/* Blue bordered container */}
      <div className="border-0 rounded-md p-12 bg-white pl-20 pr-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Date Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-8">
          Kindly provide the required details to set up your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question 1: Date Type */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              1. What kind of date do you have in mind?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              You can select one or more options
            </p>
            <div className="space-y-3">
              {dateTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dateType.includes(type)}
                    onChange={() => handleCheckboxChange(type, 'dateType')}
                    className="w-4 h-4 text-blue-600 bg-red-400 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Gender */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              2. What's your preferred gender?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              You can select one or more options
            </p>
            <div className="space-y-3">
              {genders.map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.gender.includes(gender)}
                    onChange={() => handleCheckboxChange(gender, 'gender')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3: Location */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              3. Date location?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Select country and city
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Lagos, Nigeria"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded flex items-center justify-center"
              >
                <ChevronRight className="text-white" size={16} />
              </button>
            </div>
          </div>

          {/* Question 4: Preferred Day */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              4. What day would you like to meet?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Kindly choose your preferred date
            </p>
            <div className="relative">
              <input
                type="date"
                value={formData.preferredDay}
                onChange={(e) => setFormData({...formData, preferredDay: e.target.value})}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded flex items-center justify-center"
              >
                <Calendar className="text-white" size={16} />
              </button>
            </div>
          </div>

          {/* Question 5: Preferred Time */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              5. When should your date begin?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Kindly choose your preferred time
            </p>
            <div className="relative">
              <input
                type="time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded flex items-center justify-center"
              >
                <Clock className="text-white" size={16} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )

  // If inline, render without the fixed positioning
  if (isInline) {
    return (
      <div className="w-full bg-gray-100 min-h-screen py-8">
        {formContent}
      </div>
    )
  }

  // Original modal version
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        {formContent}
      </div>
    </div>
  )
}

export default DateRequestForm