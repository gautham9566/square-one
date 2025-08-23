import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import * as service from '../../services/passengerService'

export default function ManagePassengers() {
  const [passengers, setPassengers] = useState([])
  const [search, setSearch] = useState('')
  const [flights, setFlights] = useState([])
  const params = useParams()
  const navigate = useNavigate()
  const routeFlightId = params.flightId ? Number(params.flightId) : null

  async function loadPassengers() {
    try {
      const data = routeFlightId ? await service.listByFlight(routeFlightId) : await service.list()
      setPassengers(data)
    } catch (err) {
      console.error('Failed to load passengers', err)
      setPassengers([])
    }
  }
  
  useEffect(() => {
    let mounted = true
    async function loadFlights() {
      try {
        const f = await flightService.list()
        if (!mounted) return
        setFlights(f)
      } catch (err) {
        console.error('Failed to load flights', err)
        setFlights([])
      }
    }
    loadFlights()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    loadPassengers()
  }, [routeFlightId])

  const displayed = passengers.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.passportNumber || '').toLowerCase().includes(q) ||
      (p.seat || '').toLowerCase().includes(q)
    )
  })

  const displayedForFlight = routeFlightId
    ? displayed.filter(p => p.flightId === routeFlightId)
    : []

  function clearSelection() {
    navigate('/admin/passengers')
  }

  return (
    <div>
      {!routeFlightId ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <h1 className="text-2xl font-bold text-gray-900">Passenger Management</h1>
              <p className="text-gray-600 mt-1">Select a flight to view passengers</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Flights</h2>
                <p className="text-gray-600">Select a flight to manage its passengers</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {flights.map(f => (
                  <div key={f.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          <Link 
                            to={`/admin/passengers/${f.id}/passengerlist`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {f.name} — {f.route}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {f.date} • {f.departureTime} → {f.arrivalTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          Available seats: {f.availableSeats}/{f.totalSeats}
                        </p>
                      </div>
                      <Link 
                        to={`/admin/passengers/${f.id}/passengerlist`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Passengers
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <button 
                    className="text-blue-600 hover:text-blue-800 mb-2"
                    onClick={clearSelection}
                  >
                    ← Back to flights
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Flight Passengers</h1>
                  <p className="text-gray-600 mt-1">Manage passengers for this flight</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Add Passenger
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <input
                type="text"
                placeholder="Search passengers by name, passport, or seat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Passengers Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Passengers</h2>
                <p className="text-gray-600">Flight passenger list</p>
              </div>
              
              {displayedForFlight.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-500 mb-3">No passengers found</div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Add First Passenger
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passport
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayedForFlight.map(passenger => (
                        <tr key={passenger.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {passenger.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {passenger.passportNumber || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {passenger.seat || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              passenger.checkedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {passenger.checkedIn ? 'Checked In' : 'Not Checked In'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
