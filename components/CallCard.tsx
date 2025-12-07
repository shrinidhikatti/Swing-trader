'use client'

import React from 'react'
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface TradingCall {
  id: string
  scriptName: string
  ltp: number
  currentPrice: number | null
  target1: number
  target2: number
  target3: number
  stopLoss: number
  patternType: string
  longTermOutlook: string | null
  rank: number | null
  support: number | null
  resistance: number | null
  status: string
  target1Hit: boolean
  target2Hit: boolean
  target3Hit: boolean
  stopLossHit: boolean
  callDate: string
  hitDate: string | null
}

interface CallCardProps {
  call: TradingCall
  onDelete?: (id: string) => void
}

export default function CallCard({ call, onDelete }: CallCardProps) {
  const getStatusColor = () => {
    if (call.stopLossHit) return 'bg-red-50 border-red-200'
    if (call.target1Hit || call.target2Hit || call.target3Hit) return 'bg-green-50 border-green-200'
    return 'bg-white border-gray-200'
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
          <h3 className="text-lg font-bold text-gray-900">{call.scriptName}</h3>
          <p className="text-xs text-gray-500">
            {new Date(call.callDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {call.rank && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Rank {call.rank}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-600">Entry Price (LTP)</p>
          <p className="text-sm font-semibold">₹{call.ltp.toFixed(2)}</p>
        </div>
        {call.currentPrice && (
          <div>
            <p className="text-xs text-gray-600">Current Price</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">₹{call.currentPrice.toFixed(2)}</p>
              {getPriceChange()}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 mb-3">
        <p className="text-xs font-medium text-gray-700 mb-2">Targets & Stop Loss</p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <p className="text-gray-600">Target 1</p>
            <p className="font-semibold text-green-700 flex items-center">
              ₹{call.target1.toFixed(2)}
              {call.target1Hit && <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Target 2</p>
            <p className="font-semibold text-green-700 flex items-center">
              ₹{call.target2.toFixed(2)}
              {call.target2Hit && <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Target 3</p>
            <p className="font-semibold text-green-700 flex items-center">
              ₹{call.target3.toFixed(2)}
              {call.target3Hit && <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Stop Loss</p>
            <p className="font-semibold text-red-700 flex items-center">
              ₹{call.stopLoss.toFixed(2)}
              {call.stopLossHit && <XCircle className="w-3 h-3 ml-1 text-red-600" />}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded">
          Pattern: <strong>{call.patternType}</strong>
        </span>
        {call.support && (
          <span className="px-2 py-1 bg-blue-50 rounded">
            Support: <strong>₹{call.support.toFixed(2)}</strong>
          </span>
        )}
        {call.resistance && (
          <span className="px-2 py-1 bg-orange-50 rounded">
            Resistance: <strong>₹{call.resistance.toFixed(2)}</strong>
          </span>
        )}
        {call.longTermOutlook && (
          <span className="px-2 py-1 bg-indigo-50 rounded">
            Outlook: <strong>{call.longTermOutlook}</strong>
          </span>
        )}
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(call.id)}
          className="mt-3 w-full text-xs text-red-600 hover:text-red-800 font-medium"
        >
          Delete Call
        </button>
      )}
    </div>
  )
}
