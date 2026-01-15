import React from 'react'
import Image from 'next/image'

const DateCard = ({ 
  date, 
  showDecline = false, 
  onApply, 
  onDecline 
}) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      {/* Header with date/time */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-gray-900">{date.time}</h3>
        <p className="text-xs text-gray-500 mt-1">Time remaining expired</p>
      </div>
      
      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* <img
            src={date.image || '/api/placeholder/100/100'}
            alt={date.name}
            className="w-24 h-24 rounded-full object-cover"
          /> */}
            <Image
                src="/img/lady.png"
                alt='lady' 
                width={120}
                height={120}
                className='w-32 h-32 rounded-full object-cover'
            />
        </div>
      </div>
      
      {/* Name and Age */}
      <div className="text-center mb-3">
        <h4 className="font-semibold text-lg">
          {date.name} <span className="text-gray-400 font-normal">30</span>
        </h4>
      </div>
      
      {/* Status */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          {date.status}
          <span className="text-pink-500">♀</span>
          <span className="text-orange-500">🔥</span>
        </p>
      </div>
      
      {/* Tags */}
      <div className="flex justify-center gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
          Dinner
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
          Drinks
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
          Freaky
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        {showDecline && (
          <button
            onClick={() => onDecline(date.id)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
        )}
        <button
          onClick={() => onApply(date.id)}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default DateCard