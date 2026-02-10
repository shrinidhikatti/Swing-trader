'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, ArrowUpRight, Calendar, Award, Sparkles, Target, TrendingDown, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Disclaimer from './Disclaimer'

interface PreviewCall {
  id: string
  scriptName: string
  ltp: number
  currentPrice: number | null
  target1: number
  target2: number
  target3: number
  target1Hit: boolean
  target2Hit: boolean
  target3Hit: boolean
  status: string
  callDate: Date
  hitDate: Date | null
  patternType: string
  eventMarker: string | null
}

interface PublicPreviewProps {
  calls: PreviewCall[]
}

export default function PublicPreview({ calls }: PublicPreviewProps) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const calculateGainPercentage = (entry: number, current: number) => {
    return (((current - entry) / entry) * 100).toFixed(2)
  }

  const getHighestHitTarget = (call: PreviewCall) => {
    if (call.target3Hit) return { level: 'T3', price: call.target3 }
    if (call.target2Hit) return { level: 'T2', price: call.target2 }
    if (call.target1Hit) return { level: 'T1', price: call.target1 }
    return null
  }

  const getPatternFullName = (pattern: string) => {
    const patternMap: Record<string, string> = {
      'BO': 'Breakout (price and volume)',
      'TR': 'Trend Reversal BO',
      'UB': 'Uptrend BO',
      'RB': 'Rounding bottom BO',
      'BF': 'Bullish engulf BO',
      'FO': 'Flagout BO',
      'TB': 'Trend Broken',
      'CB': 'Cup and handle BO',
    }
    return patternMap[pattern] || pattern
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0A0E27 0%, #1a1f3a 25%, #0f1922 50%, #1a2332 75%, #0A0E27 100%)'
    }}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 184, 0, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 184, 0, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 4s ease-in-out infinite'
      }} />

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl" style={{
        background: 'radial-gradient(circle, rgba(255,184,0,0.4) 0%, rgba(255,140,0,0.2) 40%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl" style={{
        background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,78,59,0.2) 40%, transparent 70%)',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />

      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 184, 0, 0.3), 0 0 40px rgba(255, 184, 0, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 184, 0, 0.5), 0 0 60px rgba(255, 184, 0, 0.2); }
        }
        .card-enter {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-b border-amber-500/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <TrendingUp className="w-7 h-7 text-amber-400 relative" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent" style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Swing Trader Sagar
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-amber-300 hover:text-amber-200 hover:bg-white/5 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-500/20"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-5 py-2.5 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
                style={{ animation: 'glow 2s ease-in-out infinite' }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Icon with premium glow */}
          <div
            className="flex justify-center mb-8"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="relative group">
              {/* Glow layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

              {/* Glass container */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
                <TrendingUp className="w-16 h-16 md:w-20 md:h-20 text-amber-400" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Main heading with stagger animation */}
          <h1
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.04em',
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
            }}
          >
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Swing Trader
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200 bg-clip-text text-transparent">
              Sagar
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl mb-12 text-gray-300 font-light max-w-3xl mx-auto leading-relaxed"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Educational trading calls with{' '}
            <span className="text-amber-400 font-semibold">proven results</span> and{' '}
            <span className="text-emerald-400 font-semibold">transparent tracking</span>
          </p>

          {/* Success badge with glass morphism */}
          <div
            className="inline-flex items-center gap-4 backdrop-blur-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 px-8 py-4 rounded-2xl border border-amber-500/30 shadow-2xl group hover:scale-105 transition-transform duration-300"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
              animation: 'glow 3s ease-in-out infinite'
            }}
          >
            <div className="relative">
              <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-400" fill="currentColor" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-3xl md:text-4xl font-black text-white" style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em'
              }}>
                {calls.length}
              </div>
              <div className="text-sm md:text-base font-medium text-amber-200">
                Recent Successful Trades
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Target Hits Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-white/5 px-4 py-2 rounded-full border border-amber-500/20 mb-6">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.03em'
          }}>
            Recent Target Hits
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See our latest successful trading calls below
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {calls.map((call, index) => {
            const highestTarget = getHighestHitTarget(call)
            const gainPercentage = highestTarget
              ? calculateGainPercentage(call.ltp, highestTarget.price)
              : '0'

            return (
              <div
                key={call.id}
                className="card-enter group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0
                }}
              >
                {/* Glass morphism card */}
                <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-emerald-500/20 overflow-hidden hover:border-emerald-500/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 2s ease-in-out infinite'
                  }} />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                  <div className="relative p-6">
                    {/* Header: Stock name & Icon */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2" style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                          {call.scriptName}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 backdrop-blur-xl bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-400/30">
                          <BarChart3 className="w-3 h-3" />
                          {call.patternType}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50" />
                        <div className="relative backdrop-blur-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-2xl p-3 border border-emerald-400/30">
                          <ArrowUpRight className="w-6 h-6 text-emerald-300" strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    {/* Event Marker */}
                    {call.eventMarker && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 backdrop-blur-xl bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-400/30">
                          <Sparkles className="w-3 h-3" />
                          {call.eventMarker}
                        </span>
                      </div>
                    )}

                    {/* Price Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      {/* Entry Price */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Entry (LTP)</p>
                        <p className="text-lg font-bold text-white" style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                          ₹{call.ltp.toFixed(2)}
                        </p>
                      </div>

                      {/* Target Hit */}
                      {highestTarget && (
                        <div className="backdrop-blur-xl bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/30">
                          <p className="text-xs text-emerald-300 mb-1 uppercase tracking-wider font-semibold">
                            Target {highestTarget.level}
                          </p>
                          <p className="text-lg font-bold text-emerald-300" style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}>
                            ₹{highestTarget.price.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Profit Badge - Highlight */}
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-emerald-500/20 blur-xl" />
                      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 p-5 border border-emerald-400/40">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-200 font-semibold uppercase tracking-wider">Profit</span>
                          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                        </div>
                        <p className="text-4xl font-black text-emerald-300 mt-1" style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                          +{gainPercentage}%
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Called: {new Date(call.callDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Premium CTA Section */}
        <div className="relative overflow-hidden rounded-3xl group">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Glow effect */}
          <div className="absolute inset-0 opacity-50 blur-2xl bg-gradient-to-r from-amber-500 to-orange-500" />

          <div className="relative backdrop-blur-xl bg-black/20 p-10 md:p-16 text-center border border-amber-500/30">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white blur-2xl opacity-30" />
                <div className="relative backdrop-blur-xl bg-white/10 p-5 rounded-2xl border border-white/30">
                  <TrendingUp className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.03em'
            }}>
              Want Full Trading List of Today?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-amber-50 max-w-3xl mx-auto font-light">
              Register Now to Get Access to All Active Trading Calls!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8">
              <button
                onClick={() => router.push('/register')}
                className="group/btn relative overflow-hidden bg-white text-black px-10 py-5 rounded-xl font-black text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Register Now
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </button>
              <button
                onClick={() => router.push('/login')}
                className="backdrop-blur-xl bg-white/10 border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105"
              >
                Already a Member? Login
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-100">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <p className="text-base font-medium">
                Join our community of successful traders today!
              </p>
            </div>
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: TrendingUp,
              title: 'Professional Analysis',
              description: 'Expert technical analysis with clear entry and exit points',
              color: 'blue',
              gradient: 'from-blue-500/20 to-cyan-500/20',
              borderColor: 'border-blue-400/30',
              iconBg: 'from-blue-500/30 to-cyan-500/30'
            },
            {
              icon: Award,
              title: 'Proven Track Record',
              description: 'Consistent results with transparent performance tracking',
              color: 'emerald',
              gradient: 'from-emerald-500/20 to-green-500/20',
              borderColor: 'border-emerald-400/30',
              iconBg: 'from-emerald-500/30 to-green-500/30'
            },
            {
              icon: Calendar,
              title: 'Daily Updates',
              description: 'Real-time price tracking and automatic target monitoring',
              color: 'purple',
              gradient: 'from-purple-500/20 to-pink-500/20',
              borderColor: 'border-purple-400/30',
              iconBg: 'from-purple-500/30 to-pink-500/30'
            }
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative card-enter"
                style={{
                  animationDelay: `${1 + index * 0.1}s`,
                  opacity: 0
                }}
              >
                <div className={`relative h-full backdrop-blur-2xl bg-gradient-to-br ${feature.gradient} rounded-2xl border ${feature.borderColor} p-8 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl`}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} blur-xl opacity-50`} />
                      <div className={`relative backdrop-blur-xl bg-gradient-to-br ${feature.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center border ${feature.borderColor}`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3" style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '-0.02em'
                  }}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Disclaimer Section */}
        <div className="mt-16 backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 p-8">
          <Disclaimer />
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-lg opacity-30" />
                <TrendingUp className="w-6 h-6 text-amber-400 relative" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2025 Swing Trader Sagar. All rights reserved.
                </p>
              </div>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Designed & Developed by</span>
              <a
                href="https://www.prashanvitech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent hover:from-amber-300 hover:via-amber-200 hover:to-orange-300 transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                Shrinidhi Katti
              </a>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>
      </footer>
    </div>
  )
}
