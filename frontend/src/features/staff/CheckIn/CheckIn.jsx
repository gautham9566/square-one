import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as flightService from '../../../services/flightService'
import authService from '../../../services/authService'
import '../../../styles/demo.css'
import Layout from '../../../components/Layout'
import Button from '../../../components/ui/Button'
import Input, { SearchInput, DateInput, LocationInput } from '../../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../../components/ui/Card'
import Badge, { FlightStatusBadge } from '../../../components/ui/Badge'

export default function CheckIn() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [startLocation, setStartLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Auto-authenticate for testing purposes
    const initAuth = async () => {
      const existingToken = authService.getToken()
      console.log('Checking existing token:', !!existingToken)
      
      if (!existingToken) {
        try {
          console.log('Auto-authenticating with admin credentials...')
          const result = await authService.login('admin1', 'adminpass')
          authService.setToken(result.token)
          console.log('Authentication successful')
        } catch (err) {
          console.error('Auto-authentication failed:', err)
          setError(`Authentication failed: ${err.message}`)
          return
        }
      }
      loadFlights()
    }
    initAuth()
  }, [])

  const loadFlights = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading flights...', { 
        hasToken: !!authService.getToken(),
        tokenValue: authService.getToken()?.substring(0, 50) + '...'
      })
      const flightData = await flightService.list()
      console.log('Flight data loaded:', flightData)
      setFlights(flightData || [])
    } catch (err) {
      console.error('Failed to load flights:', err)
      setError(`Failed to load flights: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredFlights = (flights || []).filter((flight) => {
    // Search filter - check flight name and route
    const matchesSearch = !searchTerm ||
      (flight.name && flight.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (flight.route && flight.route.toLowerCase().includes(searchTerm.toLowerCase()))

    // Date filter - compare with original date format (yyyy-MM-dd)
    const matchesDate = !dateFilter || flight.date === dateFilter

    // Route filter - more flexible matching
    const routeLower = (flight.route || '').toLowerCase()
    const matchesStartLocation = !startLocation || routeLower.includes(startLocation.toLowerCase())
    const matchesDestination = !destination || routeLower.includes(destination.toLowerCase())
    const matchesRoute = matchesStartLocation && matchesDestination

    return matchesSearch && matchesDate && matchesRoute
  })

  const handleBack = () => {
    navigate(-1)
  }

  // Example staff user - in real app this would come from auth context/state
  const staffUser = {
    name: "Mike Wilson",
    role: "Check-In Staff"
  };

  return (
    <Layout title="Check-In Management" showNavigation={true} user={staffUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            ← Back
          </Button>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flight Search & Filters</CardTitle>
                  <CardDescription>Find flights for check-in processing</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadFlights}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <SearchInput
                label="Search Flights"
                  placeholder="Search flights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <DateInput
                  label="Filter by Date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <LocationInput
                  label="Start Location"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Departure city"
                />
                <LocationInput
                  label="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Arrival city"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Flights</CardTitle>
              <CardDescription>
                {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} available for check-in
                {flights.length > 0 && ` (${flights.length} total flights loaded)`}
              </CardDescription>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-neutral-600">Loading flights...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 17.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-medium">Error Loading Flights</p>
                    <p className="text-sm text-neutral-600 mt-1">{error}</p>
                  </div>
                  <Button onClick={loadFlights} variant="primary" size="sm">
                    Try Again
                  </Button>
                </div>
              ) : filteredFlights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFlights.map((flight) => (
                    <Card 
                      key={flight.id} 
                      variant="elevated" 
                      hover
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                      onClick={() => navigate(`/staff/check-in/${flight.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle size="md">{flight.name}</CardTitle>
                          <FlightStatusBadge status="On Time" />
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Date:</span>
                            <span className="font-medium">{flight.displayDate || flight.date}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Route:</span>
                            <span className="font-medium">{flight.route}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Departure:</span>
                            <span className="font-medium">{flight.departureTime}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">Arrival:</span>
                            <span className="font-medium">{flight.arrivalTime}</span>
                          </div>
                        </div>
                      </CardBody>
                      <CardFooter>
                        <Button variant="primary" size="sm" fullWidth>
                          Manage Check-In
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-neutral-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <p className="text-lg">No flights found</p>
                    <p className="text-sm">Try adjusting your search criteria or date filters.</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
