'use client'

import React, { useEffect, useState } from 'react'
import { X, Sparkles, TrendingUp } from 'lucide-react'

interface LaunchCelebrationProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  isRegistration?: boolean
}

export default function LaunchCelebration({ isOpen, onClose, userName, isRegistration = false }: LaunchCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    if (isOpen) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }))
      setConfetti(pieces)

      // Auto close after 30 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute top-0 w-3 h-3 rounded-full animate-fall"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
            }}
          />
        ))}
      </div>

      {/* Celebration Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg mx-4 text-center animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sparkle Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-5 m-1">
            <TrendingUp className="w-14 h-14 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" fill="currentColor" />
          <Sparkles className="absolute -bottom-1 -left-2 w-6 h-6 text-yellow-400 animate-bounce" fill="currentColor" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Welcome Message */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {isRegistration ? '🎉 Welcome Aboard!' : '🎊 Welcome Back!'}
        </h2>

        {userName && (
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {userName}
          </p>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-6 mb-6 border-2 border-blue-200 dark:border-blue-700">
          <p className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
            🚀 Official Launch Day - December 25, 2025
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            You're part of our launch day celebration! Get ready for an exciting journey in swing trading with proven strategies and expert insights.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Access to all active trading calls</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Real-time price updates & alerts</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Expert technical analysis & insights</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Let's Get Started! 🎯
        </button>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
