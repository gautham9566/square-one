import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as flightService from '../../../services/flightService'
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
  

  const filteredFlights = (flights || []).filter((flight) => {
    const matchesSearch = flight.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = dateFilter ? flight.date === dateFilter : true
    const matchesRoute =
      (startLocation ? flight.route.startsWith(startLocation) : true) &&
      (destination ? flight.route.endsWith(destination) : true)
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
              <CardTitle>Flight Search & Filters</CardTitle>
              <CardDescription>Find flights for check-in processing</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <SearchInput
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
              </CardDescription>
            </CardHeader>
            <CardBody>
              {filteredFlights.length > 0 ? (
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
                            <span className="font-medium">{flight.date}</span>
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

// preload flights
let flights = []
;(async () => {
  try { flights = await flightService.list() } catch (e) { console.error('Failed to load flights', e) }
})()
