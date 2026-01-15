import React from 'react'
import Image from 'next/image'

const RequestDateCard = ({ 
  request, 
  onDecline, 
  onOpenChat 
}) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        {/* <img
          src={request.image || '/api/placeholder/120/120'}
          alt={request.name}
          className="w-32 h-32 rounded-full object-cover"
        /> */}
        <Image
            src="/img/lady.png"
            alt='lady' 
            width={120}
            height={120}
            className='w-32 h-32 rounded-full object-cover'
        />
      </div>
      
      {/* Name and Age */}
      <div className="text-center mb-6">
        <h4 className="font-semibold text-lg">
          {request.name} <span className="text-gray-400 font-normal">30</span>
        </h4>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onDecline(request.id)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={() => onOpenChat(request.id)}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Open Chat
        </button>
      </div>
    </div>
  )
}

export default RequestDateCard