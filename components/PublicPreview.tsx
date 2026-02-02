'use client'

import React from 'react'
import { TrendingUp, ArrowUpRight, Calendar, Award, BarChart3, Shield, Clock } from 'lucide-react'
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
      'BO': 'Breakout',
      'TR': 'Trend Reversal',
      'UB': 'Uptrend Breakout',
      'RB': 'Rounding Bottom',
      'BF': 'Bullish Engulfing',
      'FO': 'Flag Out',
      'TB': 'Trend Broken',
      'CB': 'Cup & Handle',
    }
    return patternMap[pattern] || pattern
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-navy-50 to-gold-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
      {/* Premium Navigation Bar */}
      <nav className="grain-texture bg-white/80 dark:bg-navy-950/90 backdrop-blur-md border-b border-navy-200/50 dark:border-gold-600/20 sticky top-0 z-50 shadow-editorial">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gold-400 opacity-20 blur-lg rounded-full"></div>
                <TrendingUp className="relative w-7 h-7 text-navy-900 dark:text-gold-400" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-playfair font-bold text-navy-950 dark:text-white tracking-tight">
                  Swing Trader Sagar
                </h1>
                <p className="text-xs text-navy-600 dark:text-navy-300 font-light tracking-wide">
                  PREMIUM TRADING INTELLIGENCE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 text-sm font-medium text-navy-900 dark:text-navy-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors elegant-underline"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-900 to-navy-800 dark:from-gold-600 dark:to-gold-700 hover:from-navy-800 hover:to-navy-700 dark:hover:from-gold-500 dark:hover:to-gold-600 rounded-md transition-all shadow-editorial hover:shadow-editorial-lg transform hover:-translate-y-0.5"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Magazine Style */}
      <section className="relative overflow-hidden grain-texture">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(10,22,40,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(10,22,40,0.03)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Typography */}
            <div className="space-y-8">
              {/* Overline */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950/5 dark:bg-gold-400/10 rounded-full border border-navy-200 dark:border-gold-600/30">
                  <div className="w-2 h-2 bg-emerald-700 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-navy-900 dark:text-gold-400">
                    Est. 2025 • Proven Performance
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="animate-fade-in-up animate-delay-100">
                <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-navy-950 dark:text-white leading-[1.1] mb-6">
                  Precision Trading.
                  <span className="block gold-shimmer mt-2">
                    Premium Results.
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-navy-700 dark:text-navy-300 font-light leading-relaxed max-w-xl">
                  Curated swing trading calls backed by rigorous technical analysis.
                  Join India's most sophisticated trading intelligence platform.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="animate-fade-in-up animate-delay-200 grid grid-cols-2 gap-6 pt-4">
                <div className="border-l-2 border-gold-600 pl-4">
                  <div className="text-4xl font-playfair font-bold text-navy-950 dark:text-white mb-1">
                    {calls.length}+
                  </div>
                  <div className="text-sm text-navy-600 dark:text-navy-400 uppercase tracking-wide">
                    Successful Trades
                  </div>
                </div>
                <div className="border-l-2 border-emerald-700 pl-4">
                  <div className="text-4xl font-playfair font-bold text-emerald-700 dark:text-emerald-500 mb-1">
                    {calls.length > 0 ? calculateGainPercentage(
                      calls.reduce((sum, c) => sum + c.ltp, 0) / calls.length,
                      calls.reduce((sum, c) => {
                        const target = getHighestHitTarget(c);
                        return sum + (target?.price || c.ltp);
                      }, 0) / calls.length
                    ) : '0'}%
                  </div>
                  <div className="text-sm text-navy-600 dark:text-navy-400 uppercase tracking-wide">
                    Avg. Return
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => router.push('/register')}
                  className="group px-8 py-4 bg-navy-950 dark:bg-gold-600 text-white rounded-md font-semibold text-base hover:bg-navy-800 dark:hover:bg-gold-500 transition-all shadow-editorial-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Trading Today
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('recent-trades');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white dark:bg-navy-800 text-navy-950 dark:text-white rounded-md font-semibold text-base hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors border-2 border-navy-200 dark:border-navy-600"
                >
                  View Track Record
                </button>
              </div>
            </div>

            {/* Right Column - Featured Success Card */}
            <div className="animate-fade-in-up animate-delay-400">
              {calls.length > 0 && (
                <div className="relative">
                  {/* Decorative corner accent */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-gold-400 opacity-30"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-emerald-700 opacity-30"></div>

                  <div className="relative glass-premium rounded-2xl p-8 shadow-editorial-lg border-t-4 border-gold-600">
                    <div className="absolute top-0 right-8 -translate-y-1/2">
                      <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        Featured Success
                      </div>
                    </div>

                    <div className="mt-4 space-y-6">
                      <div>
                        <div className="text-sm text-navy-600 dark:text-navy-400 uppercase tracking-wider mb-2">
                          Stock
                        </div>
                        <h3 className="font-playfair text-4xl font-bold text-navy-950 dark:text-white">
                          {calls[0].scriptName}
                        </h3>
                        <div className="mt-2 inline-block px-3 py-1 bg-navy-100 dark:bg-navy-700 rounded-full">
                          <span className="text-xs font-semibold text-navy-900 dark:text-navy-100">
                            {getPatternFullName(calls[0].patternType)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 py-6 border-y border-navy-200 dark:border-navy-700">
                        <div>
                          <div className="text-sm text-navy-600 dark:text-navy-400 uppercase tracking-wider mb-1">
                            Entry
                          </div>
                          <div className="font-playfair text-2xl font-bold text-navy-950 dark:text-white">
                            ₹{calls[0].ltp.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-navy-600 dark:text-navy-400 uppercase tracking-wider mb-1">
                            Target Hit
                          </div>
                          <div className="font-playfair text-2xl font-bold text-emerald-700 dark:text-emerald-500">
                            ₹{getHighestHitTarget(calls[0])?.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-xl p-6 emerald-glow">
                        <div className="relative z-10">
                          <div className="text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-2">
                            Profit Realized
                          </div>
                          <div className="font-playfair text-5xl font-bold text-white flex items-baseline gap-2">
                            <span>+</span>
                            <span>
                              {getHighestHitTarget(calls[0])
                                ? calculateGainPercentage(calls[0].ltp, getHighestHitTarget(calls[0])!.price)
                                : '0.00'}
                            </span>
                            <span className="text-3xl">%</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 opacity-10">
                          <BarChart3 className="w-32 h-32" strokeWidth={1} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Called on {new Date(calls[0].callDate).toLocaleDateString('en-IN', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trades Section - Editorial Grid */}
      <section id="recent-trades" className="relative py-20 bg-white/50 dark:bg-navy-900/50 grain-texture">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-gold-100 dark:bg-gold-900/30 rounded-full mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-800 dark:text-gold-400">
                Verified Performance
              </span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-950 dark:text-white mb-4">
              Recent Target Hits
            </h2>
            <p className="text-lg text-navy-600 dark:text-navy-300 max-w-2xl mx-auto">
              Every call is tracked, verified, and transparently reported.
              See the results that set us apart.
            </p>
          </div>

          {/* Trades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calls.map((call, index) => {
              const highestTarget = getHighestHitTarget(call)
              const gainPercentage = highestTarget
                ? calculateGainPercentage(call.ltp, highestTarget.price)
                : '0'

              return (
                <article
                  key={call.id}
                  className="group glass-premium rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-navy-200 dark:border-navy-700">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-playfair text-2xl font-bold text-navy-950 dark:text-white">
                        {call.scriptName}
                      </h3>
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-700 dark:text-emerald-500" strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-navy-100 text-xs font-semibold rounded-full">
                        {getPatternFullName(call.patternType)}
                      </span>
                      {call.eventMarker && (
                        <span className="inline-block px-3 py-1 bg-gold-100 dark:bg-gold-900/30 text-gold-800 dark:text-gold-400 text-xs font-semibold rounded-full">
                          {call.eventMarker}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-navy-600 dark:text-navy-400 uppercase tracking-wider mb-1">
                          Entry (LTP)
                        </div>
                        <div className="font-playfair text-xl font-bold text-navy-950 dark:text-white">
                          ₹{call.ltp.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-navy-600 dark:text-navy-400 uppercase tracking-wider mb-1">
                          {highestTarget?.level} Hit
                        </div>
                        <div className="font-playfair text-xl font-bold text-emerald-700 dark:text-emerald-500">
                          ₹{highestTarget?.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Profit Badge */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border-l-4 border-emerald-700">
                      <div className="relative z-10">
                        <div className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                          Profit
                        </div>
                        <div className="font-playfair text-3xl font-bold text-emerald-700 dark:text-emerald-500">
                          +{gainPercentage}%
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-400 pt-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(call.callDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-24 overflow-hidden grain-texture">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-700 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-block p-4 bg-gold-400/10 rounded-2xl mb-6">
              <Shield className="w-12 h-12 text-gold-400" strokeWidth={1.5} />
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Elevate Your
              <span className="block gold-shimmer mt-2">Trading Portfolio?</span>
            </h2>
            <p className="text-xl text-navy-300 max-w-2xl mx-auto mb-8">
              Join our exclusive community and gain access to premium trading calls,
              real-time updates, and proven strategies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push('/register')}
              className="group px-10 py-5 bg-gold-600 hover:bg-gold-500 text-white rounded-lg font-bold text-lg transition-all shadow-editorial-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-10 py-5 bg-transparent border-2 border-white/30 hover:border-white/50 text-white rounded-lg font-bold text-lg transition-all hover:bg-white/5"
            >
              Member Login
            </button>
          </div>

          <p className="text-sm text-navy-400">
            Trusted by traders across India • Transparent reporting • Educational focus
          </p>
        </div>
      </section>

      {/* Features Section - Three Column */}
      <section className="py-20 bg-gradient-to-br from-white to-navy-50 dark:from-navy-900 dark:to-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-700 rounded-2xl mb-6 shadow-editorial">
                <BarChart3 className="w-8 h-8 text-navy-900 dark:text-gold-400" strokeWidth={2} />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy-950 dark:text-white mb-3">
                Technical Precision
              </h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                Every call is backed by rigorous chart analysis, volume confirmation,
                and risk management protocols.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl mb-6 shadow-editorial">
                <Award className="w-8 h-8 text-emerald-700 dark:text-emerald-500" strokeWidth={2} />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy-950 dark:text-white mb-3">
                Proven Track Record
              </h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                Transparent performance tracking with verified results.
                See exactly how each call performs over time.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/30 dark:to-gold-800/30 rounded-2xl mb-6 shadow-editorial">
                <Clock className="w-8 h-8 text-gold-700 dark:text-gold-400" strokeWidth={2} />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy-950 dark:text-white mb-3">
                Real-Time Updates
              </h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                Automated price tracking with instant notifications when targets are hit or stop losses triggered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Disclaimer />
      </div>

      {/* Premium Footer */}
      <footer className="relative grain-texture bg-navy-950 dark:bg-black text-white py-12 border-t border-gold-600/20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <TrendingUp className="w-6 h-6 text-gold-400" strokeWidth={2.5} />
                <span className="font-playfair text-lg font-bold">Swing Trader Sagar</span>
              </div>
              <p className="text-sm text-navy-400">
                © 2025 Swing Trader Sagar. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-navy-400">Designed & Developed by</span>
              <span className="font-semibold gold-shimmer">
                Shrinidhi Katti
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
