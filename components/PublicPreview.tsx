'use client'

import React from 'react'
import { TrendingUp, ArrowUpRight, Calendar, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Disclaimer from './Disclaimer'

interface PreviewCall {
  id: string
  scriptName: string
  ltp: number
  currentPrice: number | null
  target1: number
  target2: number
  target3: number
  target1Hit: boolean
  target2Hit: boolean
  target3Hit: boolean
  status: string
  callDate: Date
  hitDate: Date | null
  patternType: string
  eventMarker: string | null
}

interface PublicPreviewProps {
  calls: PreviewCall[]
}

export default function PublicPreview({ calls }: PublicPreviewProps) {
  const router = useRouter()

  const calculateGainPercentage = (entry: number, current: number) => {
    return (((current - entry) / entry) * 100).toFixed(2)
  }

  const getHighestHitTarget = (call: PreviewCall) => {
    if (call.target3Hit) return { level: 'T3', price: call.target3 }
    if (call.target2Hit) return { level: 'T2', price: call.target2 }
    if (call.target1Hit) return { level: 'T1', price: call.target1 }
    return null
  }

  const getPatternFullName = (pattern: string) => {
    const patternMap: Record<string, string> = {
      'BO': 'Breakout (price and volume)',
      'TR': 'Trend Reversal BO',
      'UB': 'Uptrend BO',
      'RB': 'Rounding bottom BO',
      'BF': 'Bullish engulf BO',
      'FO': 'Flagout BO',
      'TB': 'Trend Broken',
      'CB': 'Cup and handle BO',
    }
    return patternMap[pattern] || pattern
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">Swing Trader Sagar</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors shadow-sm"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-emerald-600">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          {/* Icon with glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white opacity-40 blur-2xl rounded-full"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 shadow-2xl">
                <TrendingUp className="w-14 h-14 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-emerald-100">
              Swing Trader Sagar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-blue-50 font-light max-w-2xl mx-auto leading-relaxed">
            Educational trading calls with proven results
          </p>

          {/* Success badge */}
          <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-lg">
            <div className="relative">
              <Award className="w-6 h-6 md:w-7 md:h-7 text-yellow-300" fill="currentColor" />
              <div className="absolute inset-0 bg-yellow-300 blur-md opacity-50"></div>
            </div>
            <span className="text-lg md:text-xl font-bold text-white">
              {calls.length} Recent Successful Trades
            </span>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248, 250, 252)" fillOpacity="1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recent Target Hits
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            See our latest successful trading calls below
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {calls.map((call) => {
            const highestTarget = getHighestHitTarget(call)
            const gainPercentage = highestTarget
              ? calculateGainPercentage(call.ltp, highestTarget.price)
              : '0'

            return (
              <div
                key={call.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-green-200 dark:border-green-700 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                {/* Stock Name & Pattern */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {call.scriptName}
                    </h3>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded mt-1">
                      {getPatternFullName(call.patternType)}
                    </span>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-2">
                    <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                {/* Event Marker */}
                {call.eventMarker && (
                  <div className="mb-3">
                    <span className="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs font-semibold px-2 py-1 rounded">
                      Event: {call.eventMarker}
                    </span>
                  </div>
                )}

                {/* Entry Price */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Entry Price (LTP)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{call.ltp.toFixed(2)}
                  </p>
                </div>

                {/* Target Hit */}
                {highestTarget && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target {highestTarget.level} Hit
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ₹{highestTarget.price.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Gain Percentage */}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profit</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    +{gainPercentage}%
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Called: {new Date(call.callDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want Full Trading List of Today?
          </h2>
          <p className="text-xl md:text-2xl mb-6 text-orange-100">
            Register Now to Get Access to All Active Trading Calls!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg transform hover:scale-105"
            >
              Register Now
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Already a Member? Login
            </button>
          </div>
          <p className="text-sm text-orange-100 mt-6">
            Join our community of successful traders today!
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Professional Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Expert technical analysis with clear entry and exit points
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Proven Track Record
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Consistent results with transparent performance tracking
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Daily Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time price tracking and automatic target monitoring
            </p>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <Disclaimer />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300 text-sm">
                © 2025 Swing Trader Sagar. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Designed & Developed by</span>
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Shrinidhi Katti
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
