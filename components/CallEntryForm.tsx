'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, RefreshCw, TrendingUp } from 'lucide-react'
import SearchableStockDropdown from './SearchableStockDropdown'

interface CallFormData {
  scriptName: string
  ltp: string
  target1: string
  target2: string
  target3: string
  stopLoss: string
  patternType: string
  longTermOutlook: string
  rank: string
  topPick: string
  support: string
  resistance: string
  callDate: string
  tradeType: string
  isFlashCard: boolean
  eventMarker: string
}

interface CallEntryFormProps {
  onSubmit: (data: CallFormData) => Promise<void>
}

const PATTERN_TYPES = [
  { value: 'BO', label: 'BO - Breakout (price and volume)' },
  { value: 'FO', label: 'FO - Flagout BO' },
  { value: 'TR', label: 'TR - Trend Reversal BO' },
  { value: 'TB', label: 'TB - Trend Broken' },
  { value: 'UB', label: 'UB - Uptrend BO' },
  { value: 'CB', label: 'CB - Cup and handle BO' },
  { value: 'RB', label: 'RB - Rounding bottom BO' },
  { value: 'BF', label: 'BF - Bullish engulf BO' },
]

export default function CallEntryForm({ onSubmit }: CallEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchingPrice, setFetchingPrice] = useState(false)
  const [fetchingEvents, setFetchingEvents] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [formData, setFormData] = useState<CallFormData>({
    scriptName: '',
    ltp: '',
    target1: '',
    target2: '',
    target3: '',
    stopLoss: '',
    patternType: '',
    longTermOutlook: '',
    rank: '',
    topPick: '',
    support: '',
    resistance: '',
    callDate: new Date().toISOString().split('T')[0],
    tradeType: 'SWING',
    isFlashCard: false,
    eventMarker: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePatternToggle = (patternValue: string) => {
    setSelectedPatterns(prev => {
      if (prev.includes(patternValue)) {
        // Remove pattern
        return prev.filter(p => p !== patternValue)
      } else {
        // Add pattern
        return [...prev, patternValue]
      }
    })
  }

  const fetchStockEvents = async (symbol: string) => {
    if (!symbol) return

    setFetchingEvents(true)

    try {
      const response = await fetch(`/api/stock-events?symbol=${symbol}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          eventMarker: data.eventMarker || '',
        }))
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setFetchingEvents(false)
    }
  }

  const fetchLivePrice = async (symbol: string) => {
    if (!symbol) return

    setFetchingPrice(true)
    setPriceError(null)
    setCurrentPrice(null)

    try {
      const response = await fetch(`/api/stock-price?symbol=${symbol}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setCurrentPrice(data.price)
        // Auto-fill LTP with current price
        setFormData((prev) => ({
          ...prev,
          ltp: data.price.toFixed(2),
        }))
      } else {
        setPriceError(data.error || 'Failed to fetch price')
      }
    } catch (error) {
      console.error('Error fetching price:', error)
      setPriceError('Failed to fetch price')
    } finally {
      setFetchingPrice(false)
    }
  }

  const handleScriptChange = (value: string) => {
    setFormData({
      ...formData,
      scriptName: value,
    })

    // Fetch live price when stock is selected
    if (value) {
      fetchLivePrice(value)
    } else {
      setCurrentPrice(null)
      setPriceError(null)
    }
  }

  const handleRefreshPrice = () => {
    if (formData.scriptName) {
      fetchLivePrice(formData.scriptName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least one pattern is selected
    if (selectedPatterns.length === 0) {
      alert('Please select at least one pattern type')
      return
    }

    setIsSubmitting(true)

    try {
      // Join selected patterns with "+" separator
      const patternTypeValue = selectedPatterns.join('+')

      await onSubmit({
        ...formData,
        patternType: patternTypeValue
      })

      // Reset form
      setFormData({
        scriptName: '',
        ltp: '',
        target1: '',
        target2: '',
        target3: '',
        stopLoss: '',
        patternType: '',
        longTermOutlook: '',
        rank: '',
        topPick: '',
        support: '',
        resistance: '',
        callDate: new Date().toISOString().split('T')[0],
        tradeType: 'SWING',
        isFlashCard: false,
        eventMarker: '',
      })
      setSelectedPatterns([])
      setCurrentPrice(null)
      setPriceError(null)
      setIsOpen(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create trading call')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
      >
        <PlusCircle className="w-5 h-5" />
        Add New Trading Call
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Trading Call</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Script Name <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <SearchableStockDropdown
              value={formData.scriptName}
              onChange={handleScriptChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Call Date <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="date"
              name="callDate"
              value={formData.callDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Live Current Price Display */}
          {formData.scriptName && (
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Current Market Price
                      </p>
                      {fetchingPrice ? (
                        <div className="flex items-center gap-2 mt-1">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Fetching live price...</span>
                        </div>
                      ) : currentPrice ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹{currentPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date().toLocaleTimeString('en-IN')}
                          </span>
                        </div>
                      ) : priceError ? (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{priceError}</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshPrice}
                    disabled={fetchingPrice}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${fetchingPrice ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              LTP (Entry Price) <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="ltp"
              value={formData.ltp}
              onChange={handleChange}
              required
              placeholder="Auto-filled from current price"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Auto-filled with current market price. You can edit if needed.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Pattern Type <span className="text-red-500 dark:text-red-400">*</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Select one or more)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
              {PATTERN_TYPES.map(type => (
                <div key={type.value} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`pattern-${type.value}`}
                    checked={selectedPatterns.includes(type.value)}
                    onChange={() => handlePatternToggle(type.value)}
                    className="mt-1 w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`pattern-${type.value}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
            {selectedPatterns.length > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Selected: {selectedPatterns.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Trade Type <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              name="tradeType"
              value={formData.tradeType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SWING">Swing Trade</option>
              <option value="LONG_TERM">Long Term</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Swing trades auto-expire after 30 days if no target/SL hit
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Target 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="target1"
              value={formData.target1}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Target 2 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="target2"
              value={formData.target2}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Target 3 <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="target3"
              value={formData.target3}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Stop Loss <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Support Level
            </label>
            <input
              type="number"
              step="0.01"
              name="support"
              value={formData.support}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Resistance Level
            </label>
            <input
              type="number"
              step="0.01"
              name="resistance"
              value={formData.resistance}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Rank
            </label>
            <input
              type="number"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              placeholder="Optional (1-10)"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Top Pick
            </label>
            <input
              type="number"
              name="topPick"
              value={formData.topPick}
              onChange={handleChange}
              placeholder="Optional (1, 2, 3...)"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Long Term Outlook
            </label>
            <input
              type="text"
              name="longTermOutlook"
              value={formData.longTermOutlook}
              onChange={handleChange}
              placeholder="Bullish/Bearish/Neutral"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Flash Card (Internal News)
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                name="isFlashCard"
                checked={formData.isFlashCard}
                onChange={(e) => setFormData({ ...formData, isFlashCard: e.target.checked })}
                className="w-4 h-4 text-yellow-600 dark:text-yellow-400 border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Mark as flash card (Golden card shown first)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Event Marker (Auto-detected)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="eventMarker"
                value={formData.eventMarker}
                readOnly
                placeholder="Click 'Check Events' to auto-detect"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => fetchStockEvents(formData.scriptName)}
                disabled={!formData.scriptName || fetchingEvents}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${fetchingEvents ? 'animate-spin' : ''}`} />
                {fetchingEvents ? 'Checking...' : 'Check Events'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Automatically detects bonus, split, dividend, and earnings events
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Call'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
