import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as passengerService from '../../../services/passengerService'
import * as flightService from '../../../services/flightService'
import Layout from '../../../components/Layout'
import Button from '../../../components/ui/Button'
import Input, { SearchInput } from '../../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../../../components/ui/Card'
import Badge, { FlightStatusBadge } from '../../../components/ui/Badge'
import SeatMap from '../../../components/SeatMap'
import '../../../styles/demo.css'

export default function FlightDetails() {
  const { flightId } = useParams()
  const navigate = useNavigate()
  const [flight, setFlight] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [passengerFilter, setPassengerFilter] = useState('All')
  const [passengerList, setPassengerList] = useState([])
  const [seatMap, setSeatMap] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [unavailableSeats, setUnavailableSeats] = useState([])
  const [selectedPassenger, setSelectedPassenger] = useState(null)
  const [pendingSeatChanges, setPendingSeatChanges] = useState(new Map()) // Track unsaved seat changes
  const [savingSeats, setSavingSeats] = useState(false)

  // Mock staff user for layout
  const staffUser = {
    username: 'staff1',
    role: 'checkinStaff',
    name: 'Check-in Staff'
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const f = await flightService.findById(Number(flightId))
        if (!mounted) return
        setFlight(f)
        setSeatMap(f?.seatMap || [])
        const ps = await passengerService.listByFlight(Number(flightId))
        if (!mounted) return
        setPassengerList(ps)

        // Update unavailable seats based on passenger assignments
        const unavailable = ps
          .filter(p => p.seat && p.checkedIn)
          .map(p => p.seat)
          .filter(seat => seat)
        setUnavailableSeats(unavailable)
        setSelectedSeats(unavailable)
      } catch (err) {
        console.error('Failed to load flight or passengers', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [flightId])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setPassengerFilter(e.target.value)
  }

  const handleFilter = (type) => {
  setPassengerFilter(type)
  }

  const filteredPassengers = passengerList.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    let matchesFilter = false
    
    switch (passengerFilter) {
      case 'Checked In':
        matchesFilter = p.checkedIn
        break
      case 'Not Checked In':
        matchesFilter = !p.checkedIn
        break
      case 'Wheelchair':
        matchesFilter = p.wheelchair === 'Y' || p.wheelchair === true
        break
      case 'Infant':
        matchesFilter = p.infant === 'Y' || p.infant === true
        break
      case 'All':
      default:
        matchesFilter = true
        break
    }
    
    return matchesSearch && matchesFilter
  })

  const handleSeatChange = (passengerId, newSeat) => {
    // Deprecated: keep for compatibility
    setPassengerList((prev) => prev.map((p) => (p.id === passengerId ? { ...p, seat: newSeat } : p)))
  }

  const handleAssignSeat = (passengerId, newSeatId) => {
    // Update passenger list with new seat assignment (locally)
    const updatedPassengers = passengerList.map((p) =>
      p.id === passengerId ? { ...p, seat: newSeatId || '' } : p
    )

    setPassengerList(updatedPassengers)

    // Track pending changes for save functionality
    if (newSeatId) {
      setPendingSeatChanges(prev => new Map(prev).set(passengerId, newSeatId))
    } else {
      setPendingSeatChanges(prev => {
        const newMap = new Map(prev)
        newMap.delete(passengerId)
        return newMap
      })
    }

    // Update seat map data structure if it exists
    if (seatMap.length > 0) {
      const booked = new Set()
      updatedPassengers.forEach((p) => {
        if (p.seat && p.checkedIn) {
          // Extract row number from seat ID (e.g., "12A" -> 12)
          const rowMatch = p.seat.match(/^(\d+)/);
          if (rowMatch) {
            booked.add(parseInt(rowMatch[1], 10))
          }
        }
      })
      setSeatMap((prevMap) => prevMap.map((s) => ({ ...s, isBooked: booked.has(s.number) })))
    }

    // Update unavailable and selected seats for SeatMap component
    const assignedSeats = updatedPassengers
      .filter(p => p.seat && p.checkedIn)
      .map(p => p.seat)
      .filter(seat => seat)

    setUnavailableSeats(assignedSeats)
    setSelectedSeats(assignedSeats)
  }

  // Save all pending seat changes
  const handleSaveSeatChanges = async () => {
    if (pendingSeatChanges.size === 0) return

    setSavingSeats(true)
    try {
      // Save each seat assignment
      for (const [passengerId, seatId] of pendingSeatChanges) {
        await passengerService.assignSeat(flightId, {
          passengerId: passengerId,
          seat: seatId
        })
      }
      
      // Clear pending changes after successful save
      setPendingSeatChanges(new Map())
      alert('Seat assignments saved successfully!')
      
    } catch (error) {
      console.error('Error saving seat assignments:', error)
      alert('Failed to save seat assignments. Please try again.')
    } finally {
      setSavingSeats(false)
    }
  }

  const handleCheckin = async (passengerId) => {
    try {
      const passenger = passengerList.find(p => p.id === passengerId)
      if (!passenger) return

      // Call the backend checkin API
      await passengerService.checkin(passengerId, {
        seat: passenger.seat,
        wheelchair: passenger.wheelchair,
        infant: passenger.infant
      })

      // Update local state
      const updated = passengerList.map((p) => (p.id === passengerId ? { ...p, checkedIn: true } : p))
      setPassengerList(updated)
      
      // Remove from pending changes if it was there
      setPendingSeatChanges(prev => {
        const newMap = new Map(prev)
        newMap.delete(passengerId)
        return newMap
      })
      
    } catch (error) {
      console.error('Check-in failed:', error)
      alert('Check-in failed. Please try again.')
    }
  }

  const handleBack = () => {
    navigate('/staff/check-in')
  }

  const handleSeatSelect = (seatId, selectedSeats) => {
    setSelectedSeats(selectedSeats)
    console.log('Seat selected:', seatId)
    console.log('All selected seats:', selectedSeats)
  }

  // Generate seat map dynamically based on total seats
  const generateSeatMap = (totalSeats) => {
    const seatsPerRow = 6 // Standard configuration: A, B, C | D, E, F
    const rows = Math.ceil(totalSeats / seatsPerRow)
    return { rows, seatsPerRow }
  }

  // Get seat configuration
  const seatConfig = flight ? generateSeatMap(flight.totalSeats) : { rows: 10, seatsPerRow: 6 }

  // Convert seat assignments to seat map format
  const getUnavailableSeats = () => {
    return passengerList
      .filter(p => p.seat && p.checkedIn)
      .map(p => p.seat)
      .filter(seat => seat)
  }

  // Handle seat selection from seat map
  const handleSeatMapSelect = (seatId, selectedSeats) => {
    // For check-in, we only allow single seat selection
    setSelectedSeats(selectedSeats)

    // If a passenger is selected and the seat is available, assign it
    if (selectedPassenger && selectedPassenger.checkedIn) {
      const isOccupied = passengerList.some(p => p.seat === seatId && p.id !== selectedPassenger.id && p.checkedIn)

      if (!isOccupied) {
        handleAssignSeat(selectedPassenger.id, seatId)
        setSelectedPassenger(null) // Clear selection after assignment
        setSelectedSeats([]) // Clear seat selection
      } else {
        alert('This seat is already occupied by another passenger.')
      }
    } else if (!selectedPassenger) {
      alert('Please select a checked-in passenger first, then click on an available seat to assign it.')
    } else {
      alert('Please check in the passenger first before assigning a seat.')
    }
  }

  // Handle passenger selection for seat assignment
  const handlePassengerSelect = (passenger) => {
    if (passenger.checkedIn) {
      setSelectedPassenger(passenger)
    } else {
      alert('Please check in the passenger first before selecting them for seat assignment.')
    }
  }

  return (
    <Layout title="Flight Check-In Details" showNavigation={true} user={staffUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            ← Back to Check-In Management
          </Button>
        </div>

        {!flight ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-neutral-600">Loading flight information...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Flight Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Flight {flight.name || flight.id}</CardTitle>
                <CardDescription>
                  {flight.route} • {flight.date} • {flight.aircraftType}
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Flight Details</h3>
                    <p className="text-sm"><strong>Flight ID:</strong> {flight.id}</p>
                    <p className="text-sm"><strong>Aircraft Type:</strong> {flight.aircraftType}</p>
                    <p className="text-sm"><strong>Route:</strong> {flight.route}</p>
                    <p className="text-sm"><strong>Date:</strong> {flight.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Capacity</h3>
                    <p className="text-sm"><strong>Total Seats:</strong> {flight.totalSeats}</p>
                    <p className="text-sm"><strong>Available:</strong> {flight.availableSeats}</p>
                    <p className="text-sm"><strong>Passengers:</strong> {passengerList.length}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Status</h3>
                    <FlightStatusBadge status={flight.status || 'scheduled'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Available Services</h3>
                    {flight?.services && flight.services.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {flight.services.map((service) => (
                          <Badge key={service} variant="secondary" size="sm">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-sm">No services</span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Main Content: Passengers and Seat Map Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side: Passenger Management */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Passenger Management</CardTitle>
                      <CardDescription>
                        {filteredPassengers.length} passenger{filteredPassengers.length !== 1 ? 's' : ''}
                        {passengerList.length > 0 && ` (${passengerList.length} total)`}
                        {passengerList.length > 0 && (
                          <span className="ml-2">
                            • {passengerList.filter(p => p.checkedIn).length} checked in
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="mb-6 space-y-4">
                    <div className="flex gap-4">
                      <SearchInput
                        placeholder="Search passengers..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-1"
                      />
                      {pendingSeatChanges.size > 0 && (
                        <Button
                          onClick={handleSaveSeatChanges}
                          disabled={savingSeats}
                          variant="primary"
                          size="sm"
                        >
                          {savingSeats ? 'Saving...' : `Save Seats (${pendingSeatChanges.size})`}
                        </Button>
                      )}
                    </div>
                    <select
                      value={passengerFilter}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Passengers</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Not Checked In">Not Checked In</option>
                      <option value="Wheelchair">Wheelchair Assistance</option>
                      <option value="Infant">Traveling with Infant</option>
                    </select>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPassengers.map((passenger) => {
                      const isSelected = selectedPassenger?.id === passenger.id
                      return (
                        <div
                          key={passenger.id}
                          className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                          onClick={() => handlePassengerSelect(passenger)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-lg"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/staff/check-in/${flight.id}/${passenger.name}`)
                                }}
                              >
                                {passenger.name}
                              </button>
                              {isSelected && (
                                <Badge variant="primary" size="sm">Selected</Badge>
                              )}
                              {(passenger.wheelchair === 'Y' || passenger.wheelchair === true) && (
                                <Badge variant="warning" size="sm" title="Wheelchair Assistance Required">♿</Badge>
                              )}
                              {(passenger.infant === 'Y' || passenger.infant === true) && (
                                <Badge variant="info" size="sm" title="Traveling with Infant">👶</Badge>
                              )}
                            </div>
                            {passenger.checkedIn ? (
                              <Badge variant="success">Checked In</Badge>
                            ) : (
                              <Badge variant="warning">Pending</Badge>
                            )}
                          </div>

                        <div className="mb-3">
                          <div className="text-sm text-neutral-600 mb-1">Services & Special Needs:</div>
                          <div className="flex flex-wrap gap-1">
                            {(passenger.services || []).map((service, index) => (
                              <Badge key={index} variant="outline" size="sm">
                                {service}
                              </Badge>
                            ))}
                            {(passenger.wheelchair === 'Y' || passenger.wheelchair === true) && (
                              <Badge variant="warning" size="sm">Wheelchair</Badge>
                            )}
                            {(passenger.infant === 'Y' || passenger.infant === true) && (
                              <Badge variant="info" size="sm">Infant</Badge>
                            )}
                            {(!passenger.services || passenger.services.length === 0) && 
                             (passenger.wheelchair !== 'Y' && passenger.wheelchair !== true) &&
                             (passenger.infant !== 'Y' && passenger.infant !== true) && (
                              <span className="text-neutral-500 text-sm">None</span>
                            )}
                          </div>
                        </div>

                          <div className="flex items-center justify-between">
                          <div className="text-sm text-neutral-600">
                            Seat: {passenger.seat ? (
                              <span className="font-medium text-neutral-900">
                                {passenger.seat}
                                {pendingSeatChanges.has(passenger.id) && (
                                  <span className="ml-1 text-amber-600 text-xs">●</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-neutral-500">Unassigned</span>
                            )}
                          </div>                          {passenger.checkedIn ? (
                            <div className="flex gap-2">
                              <select
                                value={passenger.seat || ''}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleAssignSeat(passenger.id, e.target.value)
                                }}
                                className="px-3 py-1 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="">Select Seat</option>
                                {Array.from({ length: flight?.totalSeats || 60 }, (_, i) => {
                                  const seatNumber = i + 1
                                  const row = Math.ceil(seatNumber / 6)
                                  const seatLetter = String.fromCharCode(65 + ((seatNumber - 1) % 6))
                                  const seatId = `${row}${seatLetter}`
                                  const isOccupied = passengerList.some(p => p.seat === seatId && p.id !== passenger.id && p.checkedIn)

                                  return (
                                    <option key={seatId} value={seatId} disabled={isOccupied}>
                                      {seatId} {isOccupied ? '(Occupied)' : ''}
                                    </option>
                                  )
                                }).filter((_, i) => {
                                  // Filter to show only valid seat combinations
                                  const seatNumber = i + 1
                                  const row = Math.ceil(seatNumber / 6)
                                  return row <= Math.ceil((flight?.totalSeats || 60) / 6)
                                })}
                              </select>
                              {isSelected && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedPassenger(null)
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  Deselect
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCheckin(passenger.id)
                              }}
                              variant="primary"
                              size="sm"
                            >
                              Check In
                            </Button>
                          )}
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Right Side: Seat Map */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Aircraft Seat Map</CardTitle>
                  <CardDescription>
                    Interactive seat map • {flight?.totalSeats || 60} seats • {seatConfig.rows} rows
                  </CardDescription>
                  {selectedPassenger && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">Selected</Badge>
                        <span className="font-medium text-blue-900">{selectedPassenger.name}</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Click on an available seat to assign it to this passenger.
                      </p>
                    </div>
                  )}
                  {!selectedPassenger && (
                    <div className="mt-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <p className="text-sm text-neutral-600">
                        Select a checked-in passenger from the left panel, then click on an available seat to assign it.
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardBody>
                  <SeatMap
                    rows={seatConfig.rows}
                    seatsPerRow={seatConfig.seatsPerRow}
                    unavailableSeats={getUnavailableSeats()}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatMapSelect}
                    showLegend={true}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
