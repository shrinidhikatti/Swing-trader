'use client'

import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'

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
            <input
              type="text"
              name="scriptName"
              value={formData.scriptName}
              onChange={handleChange}
              required
              placeholder="e.g., RELIANCE, TCS, INFY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
