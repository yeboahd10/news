import React from 'react'

export default function Skeleton({ variant = 'card' }) {
  if (variant === 'card') {
    return (
      <div className="flex items-center gap-4 bg-transparent rounded-lg overflow-hidden">
        <div className="w-36 h-24 rounded skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2 py-2">
          <div className="h-4 w-3/4 rounded skeleton" />
          <div className="h-3 w-1/2 rounded skeleton" />
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-2/3 rounded skeleton" />
          <div className="h-3 w-1/3 rounded skeleton" />
        </div>
        <div className="w-20 h-10 rounded skeleton" />
      </div>
    )
  }

  // default block
  return <div className="h-6 w-full rounded skeleton" />
}
