'use client'

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

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
    <div className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white overflow-hidden border-y border-blue-700 shadow-md">
      <div className="flex items-center h-8">
        <div className="flex items-center px-3 bg-blue-700 h-full shrink-0">
          <Bell className="w-4 h-4 mr-1.5 animate-pulse" />
          <span className="text-xs font-bold whitespace-nowrap">ANNOUNCEMENT</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-scroll whitespace-nowrap inline-block">
            <span className="text-sm font-medium px-4">
              {combinedMessages}
            </span>
            <span className="text-sm font-medium px-4">
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
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
