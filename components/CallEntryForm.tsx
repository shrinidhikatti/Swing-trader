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
  support: string
  resistance: string
  callDate: string
}

interface CallEntryFormProps {
  onSubmit: (data: CallFormData) => Promise<void>
}

const PATTERN_TYPES = ['TR', 'UB', 'BF', 'BO', 'H&S', 'DB', 'TB', 'Other']

export default function CallEntryForm({ onSubmit }: CallEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchingPrice, setFetchingPrice] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CallFormData>({
    scriptName: '',
    ltp: '',
    target1: '',
    target2: '',
    target3: '',
    stopLoss: '',
    patternType: 'TR',
    longTermOutlook: '',
    rank: '',
    support: '',
    resistance: '',
    callDate: new Date().toISOString().split('T')[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        scriptName: '',
        ltp: '',
        target1: '',
        target2: '',
        target3: '',
        stopLoss: '',
        patternType: 'TR',
        longTermOutlook: '',
        rank: '',
        support: '',
        resistance: '',
        callDate: new Date().toISOString().split('T')[0],
      })
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
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <PlusCircle className="w-5 h-5" />
        Add New Trading Call
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">New Trading Call</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Script Name <span className="text-red-500">*</span>
            </label>
            <SearchableStockDropdown
              value={formData.scriptName}
              onChange={handleScriptChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="callDate"
              value={formData.callDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Live Current Price Display */}
          {formData.scriptName && (
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Current Market Price
                      </p>
                      {fetchingPrice ? (
                        <div className="flex items-center gap-2 mt-1">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">Fetching live price...</span>
                        </div>
                      ) : currentPrice ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{currentPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleTimeString('en-IN')}
                          </span>
                        </div>
                      ) : priceError ? (
                        <p className="text-sm text-red-600 mt-1">{priceError}</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshPrice}
                    disabled={fetchingPrice}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${fetchingPrice ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LTP (Entry Price) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="ltp"
              value={formData.ltp}
              onChange={handleChange}
              required
              placeholder="Auto-filled from current price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled with current market price. You can edit if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pattern Type <span className="text-red-500">*</span>
            </label>
            <select
              name="patternType"
              value={formData.patternType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PATTERN_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target 3 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="target3"
              value={formData.target3}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Level
            </label>
            <input
              type="number"
              step="0.01"
              name="support"
              value={formData.support}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resistance Level
            </label>
            <input
              type="number"
              step="0.01"
              name="resistance"
              value={formData.resistance}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Term Outlook
            </label>
            <input
              type="text"
              name="longTermOutlook"
              value={formData.longTermOutlook}
              onChange={handleChange}
              placeholder="Bullish/Bearish/Neutral"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Call'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
