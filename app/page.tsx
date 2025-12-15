'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CallCard from '@/components/CallCard'
import CallEntryForm from '@/components/CallEntryForm'
import { Calendar, RefreshCw, Settings, TrendingUp, LogIn, LogOut, Shield, Users, User } from 'lucide-react'

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
  target1HitDate: string | null
  target2HitDate: string | null
  target3HitDate: string | null
  stopLossHitDate: string | null
  tradeType: string
  isFlashCard: boolean
  eventMarker: string | null
}

export default function Home() {
  const router = useRouter()
  const [calls, setCalls] = useState<TradingCall[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [checkingEvents, setCheckingEvents] = useState(false)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [lastChecked, setLastChecked] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [nextRefresh, setNextRefresh] = useState<number>(15 * 60) // 15 minutes in seconds
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const CALLS_PER_PAGE = 15

  // Scroll to top when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    checkAuth()
    fetchCalls()
    fetchLastChecked()
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [fromDate, toDate, filterStatus])

  // Auto-refresh countdown timer (every second)
  useEffect(() => {
    if (!autoRefreshEnabled) return

    const countdown = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) {
          // Time to refresh!
          handleAutoRefresh()
          return 15 * 60 // Reset to 15 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [autoRefreshEnabled])

  // Auto-refresh prices function (works for everyone, not just admin)
  const handleAutoRefresh = async () => {
    console.log('Auto-refreshing prices...')
    try {
      // Check if user is admin before making POST request
      if (!isAdmin) {
        console.log('Not admin, skipping price update API call')
        // Just refresh the displayed data
        await fetchCalls()
        await fetchLastChecked()
        return
      }

      const response = await fetch('/api/check-prices', {
        method: 'POST',
      })

      if (response.ok) {
        await fetchCalls()
        await fetchLastChecked()
        console.log('Auto-refresh complete')
      }
    } catch (error) {
      console.error('Auto-refresh error:', error)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      setIsAdmin(data.authenticated && data.user?.isAdmin)
      setIsUser(data.authenticated && !data.user?.isAdmin)
      setUsername(data.user?.username || null)
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }

  const fetchCalls = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (fromDate) params.append('fromDate', fromDate)
      if (toDate) params.append('toDate', toDate)
      if (filterStatus !== 'all') params.append('status', filterStatus)

      const response = await fetch(`/api/calls?${params.toString()}`)
      const data = await response.json()

      // Ensure data is an array
      if (Array.isArray(data)) {
        setCalls(data)
      } else {
        console.error('Received non-array data:', data)
        setCalls([])
      }
    } catch (error) {
      console.error('Error fetching calls:', error)
      setCalls([])
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
    if (!isAdmin) {
      alert('Please login as admin to check prices')
      return
    }

    try {
      setChecking(true)
      const response = await fetch('/api/check-prices', {
        method: 'POST',
      })

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      const result = await response.json()
      alert(`Price check complete! Updated ${result.updated} calls.`)
      await fetchCalls()
      await fetchLastChecked()
      // Reset countdown timer after manual refresh
      setNextRefresh(15 * 60)
    } catch (error) {
      console.error('Error checking prices:', error)
      alert('Failed to check prices')
    } finally {
      setChecking(false)
    }
  }

  const handleCheckEvents = async () => {
    if (!isAdmin) {
      alert('Please login as admin to check events')
      return
    }

    try {
      setCheckingEvents(true)
      const response = await fetch('/api/check-events', {
        method: 'POST',
      })

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      const result = await response.json()
      alert(`Event check complete! Updated ${result.updated} calls with events.`)
      await fetchCalls()
    } catch (error) {
      console.error('Error checking events:', error)
      alert('Failed to check events')
    } finally {
      setCheckingEvents(false)
    }
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDeleteCall = async (id: string) => {
    if (!isAdmin) {
      alert('Please login as admin to delete calls')
      return
    }

    if (!confirm('Are you sure you want to delete this call?')) return

    try {
      const response = await fetch(`/api/calls/${id}`, {
        method: 'DELETE',
      })

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }

      await fetchCalls()
    } catch (error) {
      console.error('Error deleting call:', error)
      alert('Failed to delete call')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAdmin(false)
      setIsUser(false)
      setUsername(null)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(calls.length / CALLS_PER_PAGE)
  const startIndex = (currentPage - 1) * CALLS_PER_PAGE
  const endIndex = startIndex + CALLS_PER_PAGE
  const currentCalls = calls.slice(startIndex, endIndex)

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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Swing Trader Sagar</h1>
              </div>
              <p className="text-gray-600">Trading Calls Management System</p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      Admin: {username}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push('/manage-users')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    Manage Users
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : isUser ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/user-login')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    User Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    Register
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </button>
                </>
              )}
            </div>
          </div>
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
                <label className="text-sm text-gray-700 font-medium">From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="From Date"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="To Date"
                />
                {(fromDate || toDate) && (
                  <button
                    onClick={() => {
                      setFromDate('')
                      setToDate('')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
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

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleCheckPrices}
                  disabled={checking}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                  {checking ? 'Checking...' : 'Check Prices'}
                </button>
                <button
                  onClick={handleCheckEvents}
                  disabled={checkingEvents}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Calendar className={`w-4 h-4 ${checkingEvents ? 'animate-spin' : ''}`} />
                  {checkingEvents ? 'Checking...' : 'Check Events'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mt-3 pt-3 border-t border-gray-200">
            {lastChecked && (
              <p className="text-xs text-gray-500">
                Last checked: {new Date(lastChecked).toLocaleString('en-IN')}
              </p>
            )}

            {autoRefreshEnabled && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                  <RefreshCw className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">
                    {isAdmin ? 'Auto-refresh' : 'Auto-reload'} in {formatTime(nextRefresh)}
                  </span>
                </div>
                <button
                  onClick={() => setAutoRefreshEnabled(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                  title={isAdmin ? 'Will fetch new prices every 15 min' : 'Will reload data every 15 min'}
                >
                  Disable
                </button>
              </div>
            )}

            {!autoRefreshEnabled && (
              <button
                onClick={() => {
                  setAutoRefreshEnabled(true)
                  setNextRefresh(15 * 60)
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                title={isAdmin ? 'Automatically fetch new prices every 15 min' : 'Automatically reload data every 15 min'}
              >
                {isAdmin ? 'Enable auto-refresh' : 'Enable auto-reload'} (every 15 min)
              </button>
            )}
          </div>
        </div>

        {/* Call Entry Form - Admin Only */}
        {isAdmin ? (
          <div className="mb-6">
            <CallEntryForm onSubmit={handleCreateCall} />
          </div>
        ) : (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <LogIn className="w-4 h-4 inline mr-2" />
              <a href="/login" className="font-medium underline hover:text-blue-900">
                Login as admin
              </a>
              {' '}to add new trading calls
            </p>
          </div>
        )}

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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCalls.map((call) => (
                <CallCard key={call.id} call={call} onDelete={isAdmin ? handleDeleteCall : undefined} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} - {Math.min(endIndex, calls.length)} of {calls.length} calls
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>

                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-500">...</span>
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
