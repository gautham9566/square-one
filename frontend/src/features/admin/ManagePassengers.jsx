import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import * as service from '../../services/passengerService'
import PassengerForm from './PassengerForm'

export default function ManagePassengers() {
  const [passengers, setPassengers] = useState([])
  const [search, setSearch] = useState('')
  const [flights, setFlights] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPassenger, setEditingPassenger] = useState(null)
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

  // CRUD functions
  const handleAddPassenger = () => {
    const currentFlight = flights.find(f => f.id === routeFlightId)
    let origin = '', destination = ''
    
    // Parse route format "NYC-LON" to get origin and destination
    if (currentFlight?.route) {
      const parts = currentFlight.route.split('-')
      if (parts.length >= 2) {
        origin = parts[0]
        destination = parts[1]
      }
    }
    
    const initialData = { 
      flightId: routeFlightId,
      origin: origin,
      destination: destination
    }
    setEditingPassenger(initialData)
    setShowForm(true)
  }

  const handleEditPassenger = (passenger) => {
    setEditingPassenger(passenger)
    setShowForm(true)
  }

  const handleDeletePassenger = async (passenger) => {
    if (!confirm(`Are you sure you want to delete passenger ${passenger.name}?`)) {
      return
    }
    
    try {
      await service.remove(passenger.id)
      await loadPassengers() // Refresh the list
    } catch (err) {
      console.error('Failed to delete passenger', err)
      alert('Failed to delete passenger. Please try again.')
    }
  }

  const handleSavePassenger = async (passengerData) => {
    try {
      if (editingPassenger?.id) {
        await service.update(editingPassenger.id, passengerData)
      } else {
        await service.create(passengerData)
      }
      await loadPassengers() // Refresh the list
      setShowForm(false)
      setEditingPassenger(null)
    } catch (err) {
      console.error('Failed to save passenger', err)

      // Parse error message for better user feedback
      let errorMessage = 'Failed to save passenger. Please try again.'
      try {
        const errorData = JSON.parse(err.message)
        if (errorData.message && errorData.message.includes('Seat') && errorData.message.includes('not available')) {
          errorMessage = errorData.message + '. Please choose a different seat.'
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (parseErr) {
        // Use default message if parsing fails
      }

      alert(errorMessage)
    }
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingPassenger(null)
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
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={handleAddPassenger}
                >
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
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={handleAddPassenger}
                  >
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
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              onClick={() => handleEditPassenger(passenger)}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeletePassenger(passenger)}
                            >
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

      {/* Modal for Add/Edit Passenger */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPassenger?.id ? 'Edit Passenger' : 'Add New Passenger'}
              </h2>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <PassengerForm 
              initial={editingPassenger || {}}
              onSave={handleSavePassenger}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  )
}
