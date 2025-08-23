import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as service from '../../services/flightService'

export default function ManageFlights() {
  const [flights, setFlights] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    service.list()
      .then(list => {
        if (mounted) {
          setFlights(list || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setFlights([])
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  const displayed = flights.filter(f => {
    if (!search) return true
    const q = search.toLowerCase()
    return (f.name?.toLowerCase().includes(q) || f.route?.toLowerCase().includes(q))
  })

  const getFlightStatus = (flight) => {
    if (!flight.date) return 'Draft'
    const flightDate = new Date(flight.date)
    const today = new Date()
    if (flightDate < today) return 'Completed'
    if (flightDate.toDateString() === today.toDateString()) return 'Active'
    return 'Scheduled'
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Flight Management</h1>
              <p className="text-gray-600 mt-1">Manage all flights and schedules</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Export Flights
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => nav('/admin/flights/new')}
              >
                Add New Flight
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search flights by name or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                {displayed.length} flights
              </span>
            </div>
          </div>
        </div>

        {/* Flights Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Flights</h2>
            <p className="text-gray-600">Manage your flight schedules and details</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading flights...</div>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 mb-3">No flights found</div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => nav('/admin/flights/new')}
              >
                Create First Flight
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {displayed.map(flight => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/flights/${flight.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {flight.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {flight.route || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.date ? (
                          <span className="text-gray-900">
                            {new Date(flight.date).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getFlightStatus(flight) === 'Active' ? 'bg-green-100 text-green-800' :
                          getFlightStatus(flight) === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          getFlightStatus(flight) === 'Completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getFlightStatus(flight)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => nav(`/admin/flights/${flight.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
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
    </div>
  )
}
