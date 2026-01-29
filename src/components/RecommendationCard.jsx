import React from 'react'
import { Bookmark, Check } from 'lucide-react'

const RecommendationCard = ({ 
  image, 
  name, 
  isVerified = false, 
  isSaved = false,
  isFollowingYou = false, 
  onClick = () => {}, 
  onSaveClick = () => {} 
}) => {
  // Determine button text
  const getButtonText = () => {
    if (isSaved) return 'Following'
    if (isFollowingYou) return 'Follow Back'
    return 'Follow'
  }

  // Determine button style
  const getButtonStyle = () => {
    if (isSaved) {
      return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }
    if (isFollowingYou) {
      return 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-300'
    }
    return 'bg-blue-600 text-white hover:bg-blue-700'
  }

  return (
    <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
      {/* Avatar */}
      <div 
        onClick={onClick}
        className="relative cursor-pointer flex justify-center mb-2"
      >
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {isVerified && (
          <div className="absolute bottom-0 right-1/2 translate-x-5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </div>
        )}
        {/* Badge for users who follow you */}
        {isFollowingYou && !isSaved && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
        )}
      </div>

      {/* Name */}
      <p 
        onClick={onClick}
        className="text-sm font-medium text-gray-900 text-center truncate cursor-pointer hover:text-blue-600"
      >
        {name}
      </p>
      
      {/* "Follows you" label */}
      {isFollowingYou && !isSaved && (
        <p className="text-xs text-gray-500 text-center">Follows you</p>
      )}

      {/* Action Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation()
          onSaveClick()
        }}
        className={`w-full mt-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${getButtonStyle()}`}
      >
        {getButtonText()}
      </button>
    </div>
  )
}

export default RecommendationCard