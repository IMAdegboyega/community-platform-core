import React from 'react'
import Link from 'next/link'

const Posts = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <h2 className="text-gray-400 text-xl mb-2">No New Post</h2>
      <p className="text-gray-500 text-sm">
        You need to follow users in{' '}
        <Link href="/community" className="text-blue-600 cursor-pointer hover:underline">
          Community
        </Link>{' '}
        to see recent post.
      </p>
    </div>
  )
}

export default Posts