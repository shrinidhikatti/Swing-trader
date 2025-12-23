'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TradingCall {
  id: string
  scriptName: string
  ltp: number
  currentPrice: number | null
  target1: number
  target2: number
  target3: number
  stopLoss: number
  status: string
  callDate: string
  target1Hit: boolean
  target2Hit: boolean
  target3Hit: boolean
  stopLossHit: boolean
  patternType: string
  tradeType: string
  isFlashCard: boolean
  topPick: number | null
}

interface Stats {
  total: number
  active: number
  target1Hit: number
  target2Hit: number
  target3Hit: number
  stopLossHit: number
}

export default function DatabaseViewer() {
  const router = useRouter()
  const [calls, setCalls] = useState<TradingCall[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/calls')
      const data = await response.json()

      // The API returns an array directly, not an object with calls property
      if (Array.isArray(data)) {
        setCalls(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (callsData: TradingCall[]) => {
    setStats({
      total: callsData.length,
      active: callsData.filter(c => c.status === 'ACTIVE').length,
      target1Hit: callsData.filter(c => c.target1Hit).length,
      target2Hit: callsData.filter(c => c.target2Hit).length,
      target3Hit: callsData.filter(c => c.target3Hit).length,
      stopLossHit: callsData.filter(c => c.stopLossHit).length,
    })
  }

  const filteredCalls = calls.filter(call => {
    if (filter === 'ALL') return true
    if (filter === 'ACTIVE') return call.status === 'ACTIVE'
    if (filter === 'TARGET_HIT') return call.target1Hit || call.target2Hit || call.target3Hit
    if (filter === 'SL_HIT') return call.stopLossHit
    return true
  })

  const exportToCSV = () => {
    const headers = ['Script', 'Entry', 'Current', 'T1', 'T2', 'T3', 'SL', 'Status', 'Date', 'Pattern']
    const rows = filteredCalls.map(call => [
      call.scriptName,
      call.ltp,
      call.currentPrice || '',
      call.target1,
      call.target2,
      call.target3,
      call.stopLoss,
      call.status,
      new Date(call.callDate).toLocaleDateString(),
      call.patternType
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trading-calls-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Database Viewer</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Calls</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.target1Hit}</p>
                <p className="text-sm text-gray-600">Target 1</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.target2Hit}</p>
                <p className="text-sm text-gray-600">Target 2</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.target3Hit}</p>
                <p className="text-sm text-gray-600">Target 3</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.stopLossHit}</p>
                <p className="text-sm text-gray-600">Stop Loss</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All ({calls.length})
              </button>
              <button
                onClick={() => setFilter('ACTIVE')}
                className={`px-4 py-2 rounded-md ${filter === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('TARGET_HIT')}
                className={`px-4 py-2 rounded-md ${filter === 'TARGET_HIT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Targets Hit
              </button>
              <button
                onClick={() => setFilter('SL_HIT')}
                className={`px-4 py-2 rounded-md ${filter === 'SL_HIT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                SL Hit
              </button>
            </div>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export to CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Script</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T3</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pattern</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                      {call.scriptName}
                      {call.isFlashCard && <span className="ml-2 text-yellow-500">⚡</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">₹{call.ltp.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {call.currentPrice ? `₹${call.currentPrice.toFixed(2)}` : '-'}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${call.target1Hit ? 'bg-green-100 font-bold' : ''}`}>
                      ₹{call.target1.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${call.target2Hit ? 'bg-green-100 font-bold' : ''}`}>
                      ₹{call.target2.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${call.target3Hit ? 'bg-green-100 font-bold' : ''}`}>
                      ₹{call.target3.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${call.stopLossHit ? 'bg-red-100 font-bold' : ''}`}>
                      ₹{call.stopLoss.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        call.stopLossHit ? 'bg-red-100 text-red-800' :
                        (call.target1Hit || call.target2Hit || call.target3Hit) ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(call.callDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {call.patternType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCalls.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No trading calls found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-8 mt-16 rounded-lg">
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
    </div>
  )
}
