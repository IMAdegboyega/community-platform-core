'use client'

import React, { useState } from 'react'
import { Heart, MapPin, Plus } from 'lucide-react'
import Image from 'next/image'
import DateCard from '@/components/Dates/DateCard'
import RequestDateCard from '@/components/Dates/RequestDateCard'
import DateSummaryCard from '@/components/Dates/DateSummaryCard'
import DateRequestForm from '@/components/Dates/DateRequestForm'

const Dates = () => {
  const [activeTab, setActiveTab] = useState('apply') // 'apply' or 'request'
  const [showDateRequestForm, setShowDateRequestForm] = useState(false)
  
  // Sample data - you can replace with actual data
  const availableDates = [
    { id: 1, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
    { id: 2, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
    { id: 3, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
    { id: 4, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
    { id: 5, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
    { id: 6, name: 'Makayla', image: '/api/placeholder/80/80', status: 'I am looking for...', time: 'Today at 9PM(GMT+1)' },
  ]

  const dateRequests = [
    { id: 1, name: 'Makayla', image: '/api/placeholder/80/80', time: 'Today at 9PM(GMT+1)', status: 'I am looking for...' },
    { id: 2, name: 'Makayla', image: '/api/placeholder/80/80', time: 'Today at 9PM(GMT+1)', status: 'I am looking for...' },
    { id: 3, name: 'Makayla', image: '/api/placeholder/80/80', time: 'Today at 9PM(GMT+1)', status: 'I am looking for...' },
  ]

  const activeDates = [
    { time: 'Today at 9PM(GMT+1)', location: '144kb, Lagos', name: 'Makayla', status: 'I am looking for...' },
    { time: 'Today at 9PM(GMT+1)', location: '144kb, Lagos', name: 'Makayla', status: 'I am looking for...' },
    { time: 'Today at 9PM(GMT+1)', location: '144kb, Lagos', name: 'Makayla', status: 'I am looking for...' },
  ]

  // Toggle these to test different states
  const hasAvailableDates = true // Set to false to see empty state
  const hasDateRequests = true // Set to false to see empty state

  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 mb-6 flex items-center justify-center">
        <Heart size={80} className="text-red-500 fill-red-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">
        {type === 'dates' ? 'No available Dates' : 'You have no Date Request'}
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        {type === 'dates' ? 'Please check back later' : 'No members now'}
      </p>
      {type === 'request' && (
        <button 
          onClick={() => setShowDateRequestForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Date Request
        </button>
      )}
    </div>
  )

  const handleApply = (dateId) => {
    console.log('Applying for date:', dateId)
  }

  const handleDecline = (id) => {
    console.log('Declining:', id)
  }

  const handleOpenChat = (id) => {
    console.log('Opening chat:', id)
  }

  const handleDateRequestSubmit = (formData) => {
    console.log('Date request submitted:', formData)
    setShowDateRequestForm(false)
    // Handle form submission here
  }

  // If showing date request form, render it instead of the regular content
  if (showDateRequestForm) {
    return (
      <DateRequestForm
        isOpen={true}
        onClose={() => setShowDateRequestForm(false)}
        onSubmit={handleDateRequestSubmit}
        isInline={true}
      />
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-0 bg-white">
      {/* Tab Headers */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('apply')}
          className={`w-full px-full py-full text-sm font-medium transition-colors ${
            activeTab === 'apply'
              ? 'text-blue-600 bg-white border-blue-600'
              : 'text-gray-500 bg-gray-50'
          }`}
        >
          Apply for Dates
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`w-full px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'request'
              ? 'text-blue-600 bg-white border-blue-600'
              : 'text-gray-500 bg-gray-50'
          }`}
        >
          Date Request
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'apply' ? (
        hasAvailableDates ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {availableDates.map((date) => (
              <DateCard
                key={date.id}
                date={date}
                showDecline={true}
                onApply={handleApply}
                onDecline={handleDecline}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="dates" />
        )
      ) : (
        hasDateRequests ? (
          <>
            {/* New Date Request Button */}
            <div className="flex justify-end px-6 mb-4">
              <button
                onClick={() => setShowDateRequestForm(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Date Request
              </button>
            </div>

            {/* Active Dates Summary */}
            <div className="grid grid-cols-4 gap-6 mb-6 px-6">
              {activeDates.map((date, index) => (
                <DateSummaryCard
                  key={index}
                  time={date.time}
                  location={date.location}
                  name={date.name}
                  status={date.status}
                />
              ))}
            </div>

            {/* Request Cards */}
            <div className="mb-4 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dateRequests.map((request) => (
                  <RequestDateCard
                    key={request.id}
                    request={request}
                    onDecline={handleDecline}
                    onOpenChat={handleOpenChat}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyState type="request" />
        )
      )}
    </div>
  )
}

export default Dates