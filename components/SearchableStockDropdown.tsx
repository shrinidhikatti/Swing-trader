'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { NSE_STOCKS } from '@/lib/nse-stocks'

interface SearchableStockDropdownProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export default function SearchableStockDropdown({
  value,
  onChange,
  required = false,
}: SearchableStockDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [stocks, setStocks] = useState<string[]>(NSE_STOCKS)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Fetch stocks from API on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/nse-stocks')
        const data = await response.json()

        if (data.success && data.stocks && data.stocks.length > 0) {
          setStocks(data.stocks)
          console.log(`Loaded ${data.count} stocks from ${data.source}`)
        }
      } catch (error) {
        console.error('Error fetching stocks, using cached list:', error)
        // Keep using the default NSE_STOCKS
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [])

  // Filter stocks based on search query
  const filteredStocks = stocks.filter((stock) =>
    stock.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0)
  }, [searchQuery])

  // Scroll to highlighted item
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (stock: string) => {
    onChange(stock)
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredStocks.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredStocks[highlightedIndex]) {
          handleSelect(filteredStocks[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        {/* Display selected value or open dropdown */}
        {value && !isOpen ? (
          <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
            <span className="flex-1 text-gray-900 font-medium">{value}</span>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="p-1 hover:bg-gray-100 rounded ml-1"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={isOpen ? searchQuery : value}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!isOpen) setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={loading ? "Loading NSE stocks..." : "Search NSE stocks (e.g., RELIANCE, TCS)"}
              required={required && !value}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredStocks.length > 0 ? (
            <div ref={listRef}>
              {filteredStocks.map((stock, index) => (
                <button
                  key={stock}
                  type="button"
                  onClick={() => handleSelect(stock)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                    index === highlightedIndex ? 'bg-blue-50' : ''
                  } ${value === stock ? 'bg-blue-100 font-medium' : ''}`}
                >
                  {stock}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No stocks found matching "{searchQuery}"
            </div>
          )}

          {searchQuery === '' && (
            <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-200 bg-gray-50">
              Showing {filteredStocks.length} NSE stocks
            </div>
          )}
        </div>
      )}
    </div>
  )
}
