'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First try admin login
      const adminResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (adminResponse.ok) {
        // Admin login successful
        router.push('/')
        router.refresh()
        return
      }

      // If admin login fails, try user login
      const userResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const userData = await userResponse.json()

      if (userResponse.ok) {
        // User login successful
        router.push('/')
        router.refresh()
      } else {
        // Both failed - show error
        setError(userData.error || 'Invalid username or password')
      }
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Swing Trader Sagar
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Sign In to Continue
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username or email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View as Visitor (Read Only)
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Trading Calls Management System
        </p>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="text-center md:text-left">
              <p className="text-slate-300 text-xs">
                © 2024 Swing Trade. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
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
