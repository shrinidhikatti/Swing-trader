'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

interface Announcement {
  id: string
  message: string
  isActive: boolean
}

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  if (announcements.length === 0) {
    return null
  }

  // Combine all messages with separator
  const combinedMessages = announcements.map(a => a.message).join(' • ')

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 text-white overflow-hidden shadow-lg">
      <div className="flex items-center h-10 md:h-10">
        <div className="flex items-center px-2 sm:px-3 md:px-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 h-full shrink-0 shadow-md">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap tracking-wide">UPDATES</span>
        </div>
        <div className="flex-1 overflow-hidden relative bg-gradient-to-r from-transparent via-white/5 to-transparent">
          <div className="animate-scroll whitespace-nowrap inline-block">
            <span className="text-xs sm:text-sm font-semibold px-3 sm:px-6 py-2 inline-block">
              {combinedMessages}
            </span>
            <span className="text-xs sm:text-sm font-semibold px-3 sm:px-6 py-2 inline-block">
              {combinedMessages}
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 35s linear infinite;
        }
      `}</style>
    </div>
  )
}
