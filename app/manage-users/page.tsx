'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, CheckCircle, XCircle, Calendar, Trash2, ArrowLeft, Key } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  phone: string | null
  status: string
  isActive: boolean
  subscriptionStart: string | null
  subscriptionEnd: string | null
  createdAt: string
  approvedBy: string | null
  approvedAt: string | null
  lastLogin: string | null
  notes: string | null
}

export default function ManageUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [resettingPassword, setResettingPassword] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [subscriptionData, setSubscriptionData] = useState<{
    [key: string]: { start: string; end: string; notes: string }
  }>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const approveUser = async (userId: string) => {
    try {
      const subscData = subscriptionData[userId]
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          isActive: true,
          subscriptionStart: subscData?.start || null,
          subscriptionEnd: subscData?.end || null,
          notes: subscData?.notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve user')
      }

      setEditingUser(null)
      setSubscriptionData((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      fetchUsers()
    } catch (err: any) {
      alert('Error approving user: ' + err.message)
    }
  }

  const rejectUser = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          isActive: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject user')
      }

      fetchUsers()
    } catch (err: any) {
      alert('Error rejecting user: ' + err.message)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      fetchUsers()
    } catch (err: any) {
      alert('Error deleting user: ' + err.message)
    }
  }

  const updateSubscription = async (userId: string) => {
    try {
      const subscData = subscriptionData[userId]
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionStart: subscData?.start || null,
          subscriptionEnd: subscData?.end || null,
          notes: subscData?.notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      setEditingUser(null)
      setSubscriptionData((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      fetchUsers()
    } catch (err: any) {
      alert('Error updating subscription: ' + err.message)
    }
  }

  const toggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle user active status')
      }

      fetchUsers()
    } catch (err: any) {
      alert('Error toggling user status: ' + err.message)
    }
  }

  const resetPassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      alert('Password reset successfully!')
      setResettingPassword(null)
      setNewPassword('')
    } catch (err: any) {
      alert('Error resetting password: ' + err.message)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set'
    return new Date(dateStr).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case 'APPROVED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
    }
  }

  const pendingUsers = users.filter(u => u.status === 'PENDING')
  const approvedUsers = users.filter(u => u.status === 'APPROVED')
  const rejectedUsers = users.filter(u => u.status === 'REJECTED')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Pending Users */}
        {pendingUsers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-800 text-sm font-bold">
                {pendingUsers.length}
              </span>
              Pending Approvals
            </h2>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                      <p className="text-xs text-gray-500 mt-2">Registered: {formatDate(user.createdAt)}</p>
                    </div>
                    <div>{getStatusBadge(user.status)}</div>
                  </div>

                  {editingUser === user.id ? (
                    <div className="bg-gray-50 p-4 rounded-md space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subscription Start
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={subscriptionData[user.id]?.start || ''}
                          onChange={(e) =>
                            setSubscriptionData({
                              ...subscriptionData,
                              [user.id]: { ...subscriptionData[user.id], start: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subscription End
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={subscriptionData[user.id]?.end || ''}
                          onChange={(e) =>
                            setSubscriptionData({
                              ...subscriptionData,
                              [user.id]: { ...subscriptionData[user.id], end: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={2}
                          value={subscriptionData[user.id]?.notes || ''}
                          onChange={(e) =>
                            setSubscriptionData({
                              ...subscriptionData,
                              [user.id]: { ...subscriptionData[user.id], notes: e.target.value },
                            })
                          }
                          placeholder="Add any notes about this user..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveUser(user.id)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve User
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(user.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectUser(user.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Users */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-sm font-bold">
              {approvedUsers.length}
            </span>
            Approved Users
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedUsers.map((user) => (
                  <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(user.id, user.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <input
                            type="date"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            value={subscriptionData[user.id]?.start || ''}
                            onChange={(e) =>
                              setSubscriptionData({
                                ...subscriptionData,
                                [user.id]: { ...subscriptionData[user.id], start: e.target.value },
                              })
                            }
                          />
                          <input
                            type="date"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            value={subscriptionData[user.id]?.end || ''}
                            onChange={(e) =>
                              setSubscriptionData({
                                ...subscriptionData,
                                [user.id]: { ...subscriptionData[user.id], end: e.target.value },
                              })
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <div>{formatDate(user.subscriptionStart)} - {formatDate(user.subscriptionEnd)}</div>
                          {user.notes && <div className="text-xs text-gray-500 mt-1">{user.notes}</div>}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {resettingPassword === user.id ? (
                        <div className="space-y-2">
                          <input
                            type="password"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            placeholder="New password (min 6 chars)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => resetPassword(user.id)}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setResettingPassword(null)
                                setNewPassword('')
                              }}
                              className="text-gray-600 hover:text-gray-900 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : editingUser === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateSubscription(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user.id)
                              setSubscriptionData({
                                ...subscriptionData,
                                [user.id]: {
                                  start: user.subscriptionStart ? user.subscriptionStart.split('T')[0] : '',
                                  end: user.subscriptionEnd ? user.subscriptionEnd.split('T')[0] : '',
                                  notes: user.notes || '',
                                },
                              })
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Calendar className="w-4 h-4" />
                            Edit Subscription
                          </button>
                          <button
                            onClick={() => setResettingPassword(user.id)}
                            className="text-orange-600 hover:text-orange-900 flex items-center gap-1"
                          >
                            <Key className="w-4 h-4" />
                            Reset Password
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejected Users */}
        {rejectedUsers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-800 text-sm font-bold">
                {rejectedUsers.length}
              </span>
              Rejected Users
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rejectedUsers.map((user) => (
                    <tr key={user.id} className="bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300 text-sm">
                © 2024 Swing Trade. All rights reserved.
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
