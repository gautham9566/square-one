import { useState, useEffect, useRef } from 'react'
import * as routeService from '../../services/routeService'

export default function AutocompleteLocationInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'departure', // 'departure' or 'arrival'
  className = '',
  ...props 
}) {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        console.log(`Fetching suggestions for "${value}" (${type})`)
        
        // Get all routes and filter based on input
        const routes = await routeService.list()
        console.log('Routes fetched:', routes)
        
        const uniqueLocations = new Set()
        const filteredSuggestions = []

        routes.forEach(route => {
          // For departure type, show departure cities and airports
          if (type === 'departure') {
            if (route.departureCity && route.departureCity.toLowerCase().includes(value.toLowerCase())) {
              uniqueLocations.add(route.departureCity)
            }
            if (route.departureAirport && route.departureAirport.toLowerCase().includes(value.toLowerCase())) {
              uniqueLocations.add(route.departureAirport)
            }
          }
          // For arrival type, show arrival cities and airports
          else if (type === 'arrival') {
            if (route.arrivalCity && route.arrivalCity.toLowerCase().includes(value.toLowerCase())) {
              uniqueLocations.add(route.arrivalCity)
            }
            if (route.arrivalAirport && route.arrivalAirport.toLowerCase().includes(value.toLowerCase())) {
              uniqueLocations.add(route.arrivalAirport)
            }
          }
        })

        const sortedSuggestions = Array.from(uniqueLocations).sort().slice(0, 10)
        console.log('Suggestions found:', sortedSuggestions)
        setSuggestions(sortedSuggestions)
        setShowSuggestions(sortedSuggestions.length > 0)
      } catch (error) {
        console.error('Error fetching route suggestions:', error)
        // Show a fallback message to help with debugging
        if (error.message.includes('fetch')) {
          console.error('Network error - make sure the backend is running on http://localhost:8090')
        }
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value, type])

  const handleInputChange = (e) => {
    onChange(e)
    setActiveSuggestion(-1)
  }

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion } })
    setShowSuggestions(false)
    setActiveSuggestion(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
        handleSuggestionClick(suggestions[activeSuggestion])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestion(-1)
    }
  }

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
      }
    }, 150)
  }

  const handleFocus = () => {
    if (suggestions.length > 0 && value.length >= 2) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="relative w-full">
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`
              block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-colors duration-200 text-gray-900 placeholder-gray-500
              ${className}
            `}
            {...props}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg 
                className="animate-spin w-5 h-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  className="opacity-25"
                />
                <path 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  className="opacity-75"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              className={`
                w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 
                transition-colors duration-150 border-none bg-transparent
                ${index === activeSuggestion ? 'bg-gray-100' : ''}
                ${index > 0 ? 'border-t border-gray-200' : ''}
              `}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              <div className="flex items-center">
                <svg 
                  className="w-4 h-4 text-gray-400 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <span className="text-gray-900">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
