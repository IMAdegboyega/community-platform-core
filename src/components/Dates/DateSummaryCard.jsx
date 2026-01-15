import React from 'react'

const DateSummaryCard = ({ 
  time,
  location,
  name,
  status,
  tags = ['Lunch', 'Drinks', 'Freaky']
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{time}</h3>
      <p className="text-xs text-gray-500 mb-3">Location: {location}</p>
      
      <div className="mb-3">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          {status}
          <span className="text-pink-500">♀</span>
          <span className="text-orange-500">🔥</span>
        </p>
      </div>
      
      <div className="flex gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-white rounded-full text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default DateSummaryCard