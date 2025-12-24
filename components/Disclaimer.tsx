'use client'

import React, { useState } from 'react'

export default function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4 shadow-md">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <p>
              The content published on this website is provided solely for <strong>educational and informational purposes</strong>.
            </p>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                <p>
                  The website owner is <strong>not a SEBI Registered Investment Advisor (RIA) or Research Analyst</strong>. Any analysis, charts, observations, or views shared are based on personal research and technical analysis and are intended only for learning and study purposes.
                </p>
                <p>
                  <strong>Nothing on this website should be construed as investment advice, stock recommendation, or solicitation to buy or sell any securities.</strong>
                </p>
                <p>
                  Investments in the securities market are subject to market risks. Users are advised to conduct their own due diligence and consult a SEBI registered financial advisor before making any investment or trading decisions.
                </p>
                <p>
                  The website owner shall not be responsible for any financial losses or decisions taken by users based on the information provided on this website.
                </p>
                <p className="font-semibold text-amber-900 dark:text-amber-200 mt-3">
                  By accessing this website, you acknowledge and agree to the terms of this disclaimer.
                </p>
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm mt-2 underline"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
