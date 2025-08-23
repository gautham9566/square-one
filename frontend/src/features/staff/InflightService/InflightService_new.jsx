import { useNavigate, useLocation } from 'react-router-dom'
import * as passengerService from '../../../services/passengerService'
import * as flightService from '../../../services/flightService'
import { useState, useEffect } from 'react'
import '../../../styles/demo.css'
import Layout from '../../../components/Layout'
import Button from '../../../components/ui/Button'
import Input, { SearchInput } from '../../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../../components/ui/Card'
import Badge, { StatusBadge } from '../../../components/ui/Badge'

// Helper function to get staff member's assigned flight
function getStaffFlightAssignment(username) {
  const staffFlightMapping = {
    'inflight1': 1,    // Charlie Inflight assigned to Flight 101
    'inflight2': 2,    // Any other inflight staff to Flight 202
    'inflight3': 3,    // Any other inflight staff to Flight 303
    // Add more mappings as needed
  }
  return staffFlightMapping[username] || null
}

export default function InflightService() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPassengers, setFilteredPassengers] = useState([])
  const [selectedPassengerId, setSelectedPassengerId] = useState(null)
  const [selectedSubService, setSelectedSubService] = useState({})
  const [flight, setFlight] = useState(null)
  const [availableFlights, setAvailableFlights] = useState([])
  const [selectedFlightId, setSelectedFlightId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Try to get flightId from state first, fallback to selected
  const flightId = state?.flightId || selectedFlightId

  // Get current user info and automatically load their assigned flight
  useEffect(() => {
    let mounted = true
    async function loadUserFlight() {
      if (flightId) return // Already have a flight selected from state
      
      setLoading(true)
      setError(null)
      
      try {
        // Get current user info from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const username = userInfo.username
        
        if (!username) {
          setError('Please log in to access inflight services')
          return
        }

        // Get the staff member's assigned flight ID
        const assignedFlightId = getStaffFlightAssignment(username)
        
        if (assignedFlightId) {
          // Staff member has a specific flight assignment
          setSelectedFlightId(assignedFlightId)
        } else {
          // No specific assignment, load all flights for manual selection
          const flights = await flightService.list()
          if (!mounted) return
          setAvailableFlights(flights)
          
          // Auto-select the first flight as a fallback
          if (flights.length > 0) {
            setSelectedFlightId(flights[0].id)
          } else {
            setError('No flights available')
          }
        }
      } catch (err) {
        console.error('Failed to load user flight assignment', err)
        if (mounted) {
          setError(`Failed to load flight assignment: ${err.message}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    loadUserFlight()
    return () => { mounted = false }
  }, [flightId, selectedFlightId])

  // normalize passenger fields for this view
  useEffect(() => {
    let mounted = true
    async function load() {
      if (!flightId) return
      setLoading(true)
      setError(null)
      try {
        const [plist, f] = await Promise.all([
          passengerService.listByFlight(Number(flightId)),
          flightService.findById(Number(flightId))
        ])
        if (!mounted) return
        const list = plist.map((p) => ({
          ...p,
          shoppingRequests: p.shoppingRequests || p.shoppingItems || [],
          ancillaryServices: p.ancillaryServices || p.ancillary || p.services || [],
          specialMeal: p.specialMeal || p.mealName || '',
          mealType: p.mealType || p.mealPreference || '',
          seat: p.seat || ''
        }))
        setFilteredPassengers(list)
        setFlight(f)
      } catch (err) {
        console.error('Failed to load inflight data', err)
        if (mounted) {
          setError(`Failed to load flight data: ${err.message}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    load()
    return () => { mounted = false }
  }, [flightId])

  // build a quick lookup of passengers by numeric seat row (e.g. 12 from '12A')
  const seatPassengersMap = new Map()
  filteredPassengers.forEach((p) => {
    const row = parseInt((p.seat || '').toString().match(/^\d+/)?.[0], 10)
    if (!isNaN(row)) {
      if (!seatPassengersMap.has(row)) seatPassengersMap.set(row, [])
      seatPassengersMap.get(row).push(p)
    }
  })

  const handleBack = () => {
    navigate('/staff')
  }

  const handleAddAncillary = (passengerId, service) => {
    if (!service) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, ancillaryServices: [...(p.ancillaryServices || []), service] } : p
      )
    )
  }

  const handleChangeMeal = (passengerId, meal) => {
    setFilteredPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, specialMeal: meal } : p))
    )
  }

  const handleAddShopping = (passengerId, item) => {
    if (!item) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, shoppingRequests: [...(p.shoppingRequests || []), item] } : p
      )
    )
  }

  const searchResults = filteredPassengers.filter((passenger) =>
    (passenger.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (passenger.seat || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Example staff user - get from localStorage if available
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const staffUser = {
    name: userInfo.name || "Staff Member",
    role: userInfo.role || "Inflight Staff",
    username: userInfo.username
  };

  return (
    <Layout title="Inflight Service Management" showNavigation={true} user={staffUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            ← Back
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6">
            <CardBody>
              <div className="text-red-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="mb-6">
            <CardBody>
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Loading flight data...
              </div>
            </CardBody>
          </Card>
        )}

        {/* Flight Selection - only show for debugging/admin purposes */}
        {!state?.flightId && availableFlights.length > 0 && !selectedFlightId && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Flight</CardTitle>
              <CardDescription>No flight automatically assigned. Please select manually:</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="flex gap-4 items-center">
                <label htmlFor="flight-select" className="font-medium text-neutral-700">Flight:</label>
                <select
                  id="flight-select"
                  value={selectedFlightId || ''}
                  onChange={(e) => setSelectedFlightId(Number(e.target.value))}
                  className="border border-neutral-300 rounded px-3 py-2 min-w-[200px]"
                >
                  <option value="">Select a flight</option>
                  {availableFlights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} - {f.route} ({f.date})
                    </option>
                  ))}
                </select>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="space-y-6">
          {/* Current Assignment Info */}
          {flightId && flight && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Your Flight Assignment</CardTitle>
                <CardDescription className="text-blue-600">
                  You are currently managing: <strong>{flight.name}</strong> ({flight.route}) on {flight.date}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {flight && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side - Passenger List (3/4 width) */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Management</CardTitle>
                    <CardDescription>Search and manage passenger services</CardDescription>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-6">
                      <SearchInput
                        placeholder="Search by passenger name or seat number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left p-4 font-medium text-neutral-700">Passenger</th>
                            <th className="text-left p-4 font-medium text-neutral-700">Seat</th>
                            <th className="text-left p-4 font-medium text-neutral-700">Meal</th>
                            <th className="text-left p-4 font-medium text-neutral-700">Services</th>
                            <th className="text-left p-4 font-medium text-neutral-700">Shopping</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((passenger) => (
                            <tr key={passenger.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                              <td className="p-4">
                                <button
                                  className="text-flight-primary hover:underline font-medium"
                                  onClick={() => navigate(`/inflight-service/passenger/${passenger.id}`, { state: { passenger, flightId: passenger.flightId } })}
                                >
                                  {passenger.name}
                                </button>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" size="sm">{passenger.seat || 'No seat'}</Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-2">
                                  <StatusBadge status={passenger.specialMeal ? 'Completed' : 'Pending'}>
                                    {passenger.specialMeal || 'Standard'}
                                  </StatusBadge>
                                  <select
                                    value={passenger.specialMeal || ''}
                                    onChange={(e) => handleChangeMeal(passenger.id, e.target.value)}
                                    className="text-xs border border-neutral-300 rounded px-2 py-1"
                                  >
                                    <option value="">Standard</option>
                                    {flight.serviceSubtypes?.Meal?.map((meal, idx) => (
                                      <option key={idx} value={meal}>{meal}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-2">
                                  <div className="text-sm text-neutral-600 min-h-[1.25rem]">
                                    {passenger.ancillaryServices && passenger.ancillaryServices.length > 0
                                      ? passenger.ancillaryServices.join(', ')
                                      : 'None'}
                                  </div>
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddAncillary(passenger.id, e.target.value)
                                        e.target.value = '' // Reset selection
                                      }
                                    }}
                                    className="text-xs border border-neutral-300 rounded px-2 py-1"
                                  >
                                    <option value="">Add Service</option>
                                    {flight.serviceSubtypes?.Ancillary?.map((service, idx) => (
                                      <option key={idx} value={service}>{service}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-2">
                                  <div className="text-sm text-neutral-600 min-h-[1.25rem]">
                                    {passenger.shoppingRequests && passenger.shoppingRequests.length > 0
                                      ? passenger.shoppingRequests.join(', ')
                                      : 'None'}
                                  </div>
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddShopping(passenger.id, e.target.value)
                                        e.target.value = '' // Reset selection
                                      }
                                    }}
                                    className="text-xs border border-neutral-300 rounded px-2 py-1"
                                  >
                                    <option value="">Add Item</option>
                                    {flight.serviceSubtypes?.Shopping?.map((item, idx) => (
                                      <option key={idx} value={item}>{item}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {searchResults.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-neutral-500 mb-4">
                          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0z" />
                          </svg>
                          <p className="text-lg">No passengers found</p>
                          <p className="text-sm">Try adjusting your search criteria.</p>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Right Side - Compact Seat Map (1/4 width) */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Seat Map</CardTitle>
                    <CardDescription className="text-xs">{flight.name}</CardDescription>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-4 gap-1 mb-4">
                      {flight.seatMap?.map((s) => {
                        const assigned = seatPassengersMap.get(s.number) || []
                        const first = assigned[0]
                        let colorClass = ''
                        if (assigned.length > 0 && first) {
                          const mt = (first.mealType || '').toString().toLowerCase()
                          if (mt.includes('veg')) colorClass = 'bg-green-400 text-white'
                          else if (mt.includes('non')) colorClass = 'bg-red-400 text-white'
                          else colorClass = 'bg-yellow-200'
                        } else if (s.isBooked) {
                          colorClass = 'bg-gray-200'
                        } else {
                          colorClass = 'bg-white border-2 border-dashed border-gray-300'
                        }

                        const title = assigned.length > 0
                          ? `${assigned.map((a) => a.name).join(', ')} - ${assigned.map((a) => a.mealType || a.specialMeal || 'Unknown').join(', ')}`
                          : s.isBooked
                          ? 'Booked (no passenger data)'
                          : 'Available'

                        return (
                          <div
                            key={s.number}
                            title={title}
                            className={`border border-neutral-300 px-1 py-2 rounded text-center cursor-pointer hover:shadow-md transition-shadow ${colorClass}`}
                          >
                            <div className="font-semibold text-xs">{s.number}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-400 rounded"></div>
                        <span>Veg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-400 rounded"></div>
                        <span>Non-Veg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-200 rounded border"></div>
                        <span>Other</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <span>Booked</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
