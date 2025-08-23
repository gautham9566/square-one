import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import '../../styles/demo.css'
import Layout from '../../components/Layout'
import Button from '../../components/ui/Button'
import Input, { LocationInput, DateInput } from '../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function PassengerHome({ locationState }) {
  // locationState is optional; but when navigated after login we can pass user info
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [results, setResults] = useState([])

  function handleSearch(e) {
    e.preventDefault()
    // simple route match on from/to (route strings are e.g. 'NYC-LON')
    const routeQuery = `${from.toUpperCase()}-${to.toUpperCase()}`
    const matched = (allFlights || []).filter((f) => f.route === routeQuery && (!date || f.date === date))
    setResults(matched)
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
          <Card variant="flight">
            <CardHeader>
              <CardTitle>Search Flights</CardTitle>
              <CardDescription>Find and book your perfect flight</CardDescription>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LocationInput
                  label="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. NYC"
                />
                <LocationInput
                  label="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. LON"
                />
                <DateInput
                  label="Departure Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="flex items-end">
                  <Button type="submit" variant="primary" fullWidth>
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
