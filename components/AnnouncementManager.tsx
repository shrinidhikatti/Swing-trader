'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, Bell } from 'lucide-react'

interface Announcement {
  id: string
  message: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllAnnouncements()
  }, [])

  const fetchAllAnnouncements = async () => {
    try {
      // Fetch all announcements including inactive ones for admin
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  const handleCreate = async () => {
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.trim() }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchAllAnnouncements()
      } else {
        alert('Failed to create announcement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert('Error creating announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, message: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, message }),
      })

      if (response.ok) {
        setEditingId(null)
        setEditMessage('')
        fetchAllAnnouncements()
      } else {
        alert('Failed to update announcement')
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      alert('Error updating announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isActive: !isActive }),
      })

      if (response.ok) {
        fetchAllAnnouncements()
      } else {
        alert('Failed to toggle announcement')
      }
    } catch (error) {
      console.error('Error toggling announcement:', error)
      alert('Error toggling announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAllAnnouncements()
      } else {
        alert('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Announcements</h2>
      </div>

      {/* Create New Announcement */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Create New Announcement
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter announcement message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
            }}
          />
          <button
            onClick={handleCreate}
            disabled={!newMessage.trim() || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No announcements yet. Create one to get started!
          </p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border ${
                announcement.isActive
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
              }`}
            >
              {editingId === announcement.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(announcement.id, editMessage)
                      if (e.key === 'Escape') {
                        setEditingId(null)
                        setEditMessage('')
                      }
                    }}
                  />
                  <button
                    onClick={() => handleUpdate(announcement.id, editMessage)}
                    disabled={!editMessage.trim() || loading}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditMessage('')
                    }}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {new Date(announcement.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(announcement.id, announcement.isActive)}
                      disabled={loading}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        announcement.isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(announcement.id)
                        setEditMessage(announcement.message)
                      }}
                      disabled={loading}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      disabled={loading}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
