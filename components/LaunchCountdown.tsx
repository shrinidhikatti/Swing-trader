'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Clock } from 'lucide-react'

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Launch date: December 25, 2025 at 1:00 PM IST
    const launchDate = new Date('2025-12-25T13:00:00+05:30').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = launchDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        // Launch time has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-4 md:mb-6 border-4 border-white/20">
            <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold text-white mb-3 md:mb-4 px-4">
            Swing Trader Sagar
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-blue-100 font-light px-4">
            Your Journey to Smart Trading Begins Soon
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-12 mb-6 md:mb-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
              Website Launching In
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <p className="text-sm sm:text-base md:text-xl font-semibold">
                December 25, 2025 at 1:00 PM IST
              </p>
            </div>
          </div>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-8 mb-6 md:mb-8">
            {/* Days */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg md:rounded-2xl p-3 sm:p-4 md:p-8 shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-1 md:mb-2">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
                  Days
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg md:rounded-2xl p-3 sm:p-4 md:p-8 shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-1 md:mb-2">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-purple-100 font-medium uppercase tracking-wider">
                  Hours
                </div>
              </div>
            </div>

            {/* Minutes */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-lg md:rounded-2xl p-3 sm:p-4 md:p-8 shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-1 md:mb-2">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-pink-100 font-medium uppercase tracking-wider">
                  Minutes
                </div>
              </div>
            </div>

            {/* Seconds */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg md:rounded-2xl p-3 sm:p-4 md:p-8 shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-1 md:mb-2">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-orange-100 font-medium uppercase tracking-wider">
                  Seconds
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 md:pt-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-4 md:mb-6">
              What's Coming?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-1 md:mb-2">
                  Expert Trading Calls
                </h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Daily swing trading opportunities with clear entry & exit points
                </p>
              </div>

              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-1 md:mb-2">
                  Real-Time Updates
                </h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Live price tracking and automatic target monitoring
                </p>
              </div>

              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white mb-1 md:mb-2">
                  Proven Track Record
                </h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Transparent performance history with verified results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4">
          <p className="text-white text-base sm:text-lg md:text-xl mb-3 md:mb-4">
            Get ready for an exciting journey in swing trading!
          </p>
          <p className="text-blue-200 text-sm md:text-base">
            Registration will open on launch day. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
