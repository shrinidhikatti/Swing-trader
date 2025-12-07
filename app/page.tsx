'use client'

import React, { useState, useEffect } from 'react'
import CallCard from '@/components/CallCard'
import CallEntryForm from '@/components/CallEntryForm'
import { Calendar, RefreshCw, Settings, TrendingUp } from 'lucide-react'

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

export default function Home() {
  const [calls, setCalls] = useState<TradingCall[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  useEffect(() => {
    fetchCalls()
    fetchLastChecked()
  }, [selectedDate, filterStatus])

  const fetchCalls = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedDate) params.append('date', selectedDate)
      if (filterStatus !== 'all') params.append('status', filterStatus)

      const response = await fetch(`/api/calls?${params.toString()}`)
      const data = await response.json()
      setCalls(data)
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLastChecked = async () => {
    try {
      const response = await fetch('/api/check-prices')
      const data = await response.json()
      setLastChecked(data.lastChecked)
    } catch (error) {
      console.error('Error fetching last checked:', error)
    }
  }

  const handleCreateCall = async (formData: any) => {
    const response = await fetch('/api/calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error('Failed to create call')
    }

    await fetchCalls()
  }

  const handleCheckPrices = async () => {
    try {
      setChecking(true)
      const response = await fetch('/api/check-prices', {
        method: 'POST',
      })
      const result = await response.json()
      alert(`Price check complete! Updated ${result.updated} calls.`)
      await fetchCalls()
      await fetchLastChecked()
    } catch (error) {
      console.error('Error checking prices:', error)
      alert('Failed to check prices')
    } finally {
      setChecking(false)
    }
  }

  const handleDeleteCall = async (id: string) => {
    if (!confirm('Are you sure you want to delete this call?')) return

    try {
      await fetch(`/api/calls/${id}`, {
        method: 'DELETE',
      })
      await fetchCalls()
    } catch (error) {
      console.error('Error deleting call:', error)
      alert('Failed to delete call')
    }
  }

  const stats = {
    total: calls.length,
    active: calls.filter(c => c.status === 'ACTIVE').length,
    targets: calls.filter(c => c.target1Hit || c.target2Hit || c.target3Hit).length,
    stopLoss: calls.filter(c => c.stopLossHit).length,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Swing Trader Sagar</h1>
          </div>
          <p className="text-gray-600">Trading Calls Management System</p>
          <p className="text-sm text-gray-500">1453 WhatsApp Group Members</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Calls</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
            <p className="text-sm text-blue-600">Active</p>
            <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200">
            <p className="text-sm text-green-600">Targets Hit</p>
            <p className="text-2xl font-bold text-green-900">{stats.targets}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-200">
            <p className="text-sm text-red-600">Stop Loss</p>
            <p className="text-2xl font-bold text-red-900">{stats.stopLoss}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TARGET1_HIT">Target 1 Hit</option>
                <option value="TARGET2_HIT">Target 2 Hit</option>
                <option value="TARGET3_HIT">Target 3 Hit</option>
                <option value="SL_HIT">Stop Loss Hit</option>
              </select>
            </div>

            <button
              onClick={handleCheckPrices}
              disabled={checking}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Check Prices Now'}
            </button>
          </div>

          {lastChecked && (
            <p className="text-xs text-gray-500 mt-2">
              Last checked: {new Date(lastChecked).toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Call Entry Form */}
        <div className="mb-6">
          <CallEntryForm onSubmit={handleCreateCall} />
        </div>

        {/* Calls List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-gray-600">Loading calls...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-1">No trading calls found</p>
            <p className="text-sm text-gray-500">
              {selectedDate || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first trading call to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calls.map((call) => (
              <CallCard key={call.id} call={call} onDelete={handleDeleteCall} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
