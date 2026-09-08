import { useState } from 'react'
import { getInitials } from '../lib/user.js'

export default function DonorAvatar({ name, photo, size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false)
  const sizes = {
    sm: 'h-12 w-12 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-28 w-28 text-3xl sm:h-32 sm:w-32',
  }

  if (!photo || failed) {
    return (
      <div
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-rose-400 to-brand font-extrabold text-white ${sizes[size]} ${className}`}
        aria-hidden="true"
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={photo}
      alt=""
      className={`shrink-0 rounded-full object-cover ${sizes[size]} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
