'use client'

import React from 'react'
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react'

interface TradingCall {
  id: string
  scriptName: string
  ltp: number
  currentPrice: number | null
  target1: number
  target2: number
  target3: number | null
  stopLoss: number
  patternType: string
  longTermOutlook: string | null
  rank: number | null
  topPick: number | null
  support: number | null
  resistance: number | null
  status: string
  target1Hit: boolean
  target2Hit: boolean
  target3Hit: boolean
  stopLossHit: boolean
  callDate: string
  hitDate: string | null
  target1HitDate: string | null
  target2HitDate: string | null
  target3HitDate: string | null
  stopLossHitDate: string | null
  tradeType: string
  isFlashCard: boolean
  eventMarker: string | null
}

interface CallCardProps {
  call: TradingCall
  onDelete?: (id: string) => void
}

export default function CallCard({ call, onDelete }: CallCardProps) {
  // Get full pattern name
  const getPatternFullName = (pattern: string) => {
    const patternMap: Record<string, string> = {
      'TR': 'Triangle',
      'UB': 'Uptrend Breakout',
      'BF': 'Bull Flag',
      'BO': 'Breakout',
      'H&S': 'Head & Shoulders',
      'DB': 'Double Bottom',
      'TB': 'Triple Bottom',
      'Other': 'Other'
    }
    return patternMap[pattern] || pattern
  }

  // Calculate time duration from call date to a specific hit date
  const calculateDuration = (hitDateStr: string | null) => {
    if (!hitDateStr) return null

    const callTime = new Date(call.callDate).getTime()
    const hitTime = new Date(hitDateStr).getTime()
    const diffMs = hitTime - callTime

    // Convert to days, hours, minutes
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Calculate time duration from call date to hit date (for backward compatibility)
  const getTimeDuration = () => {
    return calculateDuration(call.hitDate)
  }

  const getStatusColor = () => {
    // Flash cards get golden background
    if (call.isFlashCard) return 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-400 dark:border-yellow-600 border-2 shadow-lg'
    if (call.stopLossHit) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    if (call.target1Hit || call.target2Hit || call.target3Hit) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  }

  const getStatusBadge = () => {
    if (call.stopLossHit) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Stop Loss Hit
        </span>
      )
    }
    if (call.target3Hit) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Target 3 Hit
        </span>
      )
    }
    if (call.target2Hit) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Target 2 Hit
        </span>
      )
    }
    if (call.target1Hit) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Target 1 Hit
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Active
      </span>
    )
  }

  const getPriceChange = () => {
    if (!call.currentPrice) return null
    const change = ((call.currentPrice - call.ltp) / call.ltp) * 100
    const isPositive = change >= 0

    return (
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {change.toFixed(2)}%
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{call.scriptName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(call.callDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          {call.rank && (
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              Rank {call.rank}
            </p>
          )}
          {call.topPick && (
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
              ⭐ Top Pick #{call.topPick}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge()}

          {/* Hit Status with Timings - Top Right */}
          {call.target1HitDate && (
            <div className="flex items-center justify-between text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded min-w-[140px]">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium text-[10px]">Target 1 Hit</span>
              </div>
              <div className="flex items-center ml-2">
                <Clock className="w-3 h-3 mr-0.5 flex-shrink-0" />
                <span className="font-semibold text-[10px]">{calculateDuration(call.target1HitDate)}</span>
              </div>
            </div>
          )}
          {call.target2HitDate && (
            <div className="flex items-center justify-between text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded min-w-[140px]">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium text-[10px]">Target 2 Hit</span>
              </div>
              <div className="flex items-center ml-2">
                <Clock className="w-3 h-3 mr-0.5 flex-shrink-0" />
                <span className="font-semibold text-[10px]">{calculateDuration(call.target2HitDate)}</span>
              </div>
            </div>
          )}
          {call.target3HitDate && (
            <div className="flex items-center justify-between text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded min-w-[140px]">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium text-[10px]">Target 3 Hit</span>
              </div>
              <div className="flex items-center ml-2">
                <Clock className="w-3 h-3 mr-0.5 flex-shrink-0" />
                <span className="font-semibold text-[10px]">{calculateDuration(call.target3HitDate)}</span>
              </div>
            </div>
          )}
          {call.stopLossHitDate && (
            <div className="flex items-center justify-between text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/50 px-2 py-1 rounded min-w-[140px]">
              <div className="flex items-center">
                <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium text-[10px]">Stop Loss Hit</span>
              </div>
              <div className="flex items-center ml-2">
                <Clock className="w-3 h-3 mr-0.5 flex-shrink-0" />
                <span className="font-semibold text-[10px]">{calculateDuration(call.stopLossHitDate)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Entry Price (LTP)</p>
          <p className="text-sm font-semibold dark:text-white">₹{call.ltp.toFixed(2)}</p>
        </div>
        {call.currentPrice && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Current Price</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold dark:text-white">₹{call.currentPrice.toFixed(2)}</p>
              {getPriceChange()}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Targets & Stop Loss</p>
        <div className={`grid ${call.target3 ? 'grid-cols-4' : 'grid-cols-3'} gap-2 text-xs`}>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Target 1</p>
            <p className="font-semibold text-green-700 dark:text-green-400">₹{call.target1.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Target 2</p>
            <p className="font-semibold text-green-700 dark:text-green-400">₹{call.target2.toFixed(2)}</p>
          </div>
          {call.target3 && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Target 3</p>
              <p className="font-semibold text-green-700 dark:text-green-400">₹{call.target3.toFixed(2)}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 dark:text-gray-400">Stop Loss</p>
            <p className="font-semibold text-red-700 dark:text-red-400">₹{call.stopLoss.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded">
          Pattern: <strong>{getPatternFullName(call.patternType)}</strong>
        </span>
        {call.support && (
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-200 rounded">
            Support: <strong>₹{call.support.toFixed(2)}</strong>
          </span>
        )}
        {call.resistance && (
          <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/50 dark:text-orange-200 rounded">
            Resistance: <strong>₹{call.resistance.toFixed(2)}</strong>
          </span>
        )}
        {call.longTermOutlook && (
          <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-200 rounded">
            Outlook: <strong>{call.longTermOutlook}</strong>
          </span>
        )}
      </div>

      {/* Event Marker */}
      {call.eventMarker && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 rounded-full text-xs font-bold text-purple-800 dark:text-purple-200">
            <span className="mr-1">📢</span>
            Event: {call.eventMarker}
          </div>
        </div>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(call.id)}
          className="mt-3 w-full text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
        >
          Delete Call
        </button>
      )}
    </div>
  )
}
