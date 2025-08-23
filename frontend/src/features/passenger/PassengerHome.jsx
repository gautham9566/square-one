import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import * as routeService from '../../services/routeService'
import authService from '../../services/authService'
import '../../styles/demo.css'
import Layout from '../../components/Layout'
import Button from '../../components/ui/Button'
import Input, { LocationInput, DateInput } from '../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import AutocompleteLocationInput from '../../components/ui/AutocompleteLocationInput'
import MockLocationInput from '../../components/ui/MockLocationInput'

export default function PassengerHome({ locationState }) {
  // locationState is optional; but when navigated after login we can pass user info
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const token = authService.getToken()
    setIsAuthenticated(!!token)
    if (!token) {
      console.warn('No authentication token found. Please log in to search flights.')
    }
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!from || !to) {
      alert('Please enter both departure and destination locations')
      return
    }

    if (!isAuthenticated) {
      alert('Please log in first to search flights')
      navigate('/')
      return
    }

    setLoading(true)
    try {
      console.log('Searching for flights from', from, 'to', to, 'on', date)

      // Search for matching routes based on cities or airports
      const routes = await routeService.searchRoutes(from, to)
      console.log('Found routes:', routes)

      // Get all flights
      const allFlights = await flightService.list()
      console.log('All flights:', allFlights)

      // Filter flights based on matching routes
      const matchedFlights = allFlights.filter(flight => {
        console.log(`Checking flight: ${flight.name} (${flight.route}) on ${flight.date}`)

        // If no routes found, fall back to direct flight route matching
        let routeMatches = false

        if (routes.length === 0) {
          // Direct matching against flight route with more flexible matching
          const fromUpper = from.toUpperCase()
          const toUpper = to.toUpperCase()
          const flightRouteUpper = flight.route ? flight.route.toUpperCase() : ''

          routeMatches = flightRouteUpper && (
            flightRouteUpper.includes(fromUpper) && flightRouteUpper.includes(toUpper)
          )
          console.log(`  No routes found, using direct matching: flight="${flightRouteUpper}", from="${fromUpper}", to="${toUpper}", matches=${routeMatches}`)
        } else {
          // Match by route code or by comparing departure/arrival cities
          routeMatches = routes.some(route => {
            const exactMatch = flight.route === route.routeCode

            // Check various matching scenarios
            const flightRouteUpper = flight.route ? flight.route.toUpperCase() : ''
            const fromUpper = from.toUpperCase()
            const toUpper = to.toUpperCase()

            const cityMatch = flightRouteUpper && (
              flightRouteUpper.includes(fromUpper) && flightRouteUpper.includes(toUpper)
            )

            // Check if the route cities match the search terms (more flexible matching)
            const fromLower = from.toLowerCase()
            const toLower = to.toLowerCase()

            const cityToRouteMatch = (
              (route.departureCity && route.departureCity.toLowerCase().includes(fromLower)) ||
              (route.departureAirport && route.departureAirport.toLowerCase().includes(fromLower)) ||
              (fromLower.includes(route.departureCity ? route.departureCity.toLowerCase() : '')) ||
              (fromLower.includes(route.departureAirport ? route.departureAirport.toLowerCase() : ''))
            ) && (
              (route.arrivalCity && route.arrivalCity.toLowerCase().includes(toLower)) ||
              (route.arrivalAirport && route.arrivalAirport.toLowerCase().includes(toLower)) ||
              (toLower.includes(route.arrivalCity ? route.arrivalCity.toLowerCase() : '')) ||
              (toLower.includes(route.arrivalAirport ? route.arrivalAirport.toLowerCase() : ''))
            )

            console.log(`  Route check: flight.route="${flight.route}", route.routeCode="${route.routeCode}"`)
            console.log(`    exactMatch=${exactMatch}, cityMatch=${cityMatch}, cityToRouteMatch=${cityToRouteMatch}`)
            console.log(`    route cities: ${route.departureCity} -> ${route.arrivalCity}`)

            return exactMatch || cityMatch || cityToRouteMatch
          })
        }

        // Handle date comparison - convert HTML date input (YYYY-MM-DD) to display format (MM/DD/YYYY)
        let dateMatches = true
        if (date) {
          const [year, month, day] = date.split('-')
          const displayDate = `${month}/${day}/${year}`
          dateMatches = flight.date === displayDate
          console.log(`  Date comparison: flight.date="${flight.date}", input date="${date}", converted="${displayDate}", matches=${dateMatches}`)
        }

        const finalMatch = routeMatches && dateMatches
        console.log(`  Final match result: ${finalMatch} (routeMatches=${routeMatches}, dateMatches=${dateMatches})`)
        return finalMatch
      })

      console.log('Matched flights:', matchedFlights)
      setResults(matchedFlights)
    } catch (error) {
      console.error('Error searching flights:', error)
      alert(`Error searching flights: ${error.message}. Please make sure you are logged in.`)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Example passenger user - in real app this would come from auth context/state
  const passengerUser = {
    name: "Sarah Johnson",
    role: "Passenger"
  };

  return (
    <Layout title="Passenger Dashboard" showNavigation={true} user={passengerUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {!isAuthenticated && (
            <Card variant="warning">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                  You need to log in to search and book flights.
                  <Button
                    variant="link"
                    onClick={() => navigate('/')}
                    className="ml-2 p-0 h-auto text-blue-600 underline"
                  >
                    Click here to log in
                  </Button>
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          <Card variant="flight">
            <CardHeader>
              <CardTitle>Search Flights</CardTitle>
              <CardDescription>Find and book your perfect flight</CardDescription>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MockLocationInput
                  label="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  type="departure"
                  placeholder="Departure city or airport"
                />
                <MockLocationInput
                  label="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  type="arrival"
                  placeholder="Destination city or airport"
                />
                <DateInput
                  label="Departure Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="flex items-end">
                  <Button type="submit" variant="primary" fullWidth loading={loading}>
                    Search Flights
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {results.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>Found {results.length} flights for your search</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left p-4 font-medium text-neutral-700">Flight</th>
                        <th className="text-left p-4 font-medium text-neutral-700">Departure</th>
                        <th className="text-left p-4 font-medium text-neutral-700">Arrival</th>
                        <th className="text-left p-4 font-medium text-neutral-700">Duration</th>
                        <th className="text-left p-4 font-medium text-neutral-700">Available Seats</th>
                        <th className="text-left p-4 font-medium text-neutral-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((f) => (
                        <tr key={f.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="p-4">
                            <div className="font-medium">{f.name}</div>
                            <div className="text-sm text-neutral-600">({f.route})</div>
                          </td>
                          <td className="p-4 text-neutral-600">{f.date} {f.departureTime}</td>
                          <td className="p-4 text-neutral-600">{f.date} {f.arrivalTime}</td>
                          <td className="p-4 text-neutral-600">{calculateDuration(f.departureTime, f.arrivalTime)}</td>
                          <td className="p-4">
                            <Badge variant={f.availableSeats > 10 ? "success" : f.availableSeats > 0 ? "warning" : "danger"}>
                              {f.availableSeats} seats
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              onClick={() => navigate('/passenger/book', { state: { flightId: f.id } })}
                              variant="bookNow"
                              size="sm"
                              disabled={f.availableSeats <= 0}
                            >
                              {f.availableSeats <= 0 ? 'Sold Out' : 'Book Now'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="text-center py-12">
                <div className="text-neutral-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg">No flights found</p>
                  <p className="text-sm">Enter your departure and destination cities to search for available flights.</p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}

  // load flights on demand (separate effect to avoid changing the search flow)
  let allFlights = null
  ;(async function preloadFlights() {
    try {
      allFlights = await flightService.list()
    } catch (e) { console.error('Failed to preload flights', e) }
  })()

function calculateDuration(dep, arr) {
  // Very naive: expects times like '08:00 AM' and same date; returns placeholder
  try {
    const parse = (t) => {
      const [time, ampm] = t.split(' ')
      const [h, m] = time.split(':').map(Number)
      let hh = h % 12
      if (ampm === 'PM') hh += 12
      return hh * 60 + m
    }
    const start = parse(dep)
    const end = parse(arr)
    let diff = end - start
    if (diff < 0) diff += 24 * 60
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  } catch (e) {
    return '-'
  }
}
