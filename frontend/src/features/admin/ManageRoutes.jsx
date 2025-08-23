import { useState, useEffect } from 'react'
import * as routeService from '../../services/routeService'

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([])
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [newRoute, setNewRoute] = useState({ 
    routeCode: '', 
    departureCity: '', 
    departureAirport: '', 
    arrivalCity: '', 
    arrivalAirport: '',
    distanceKm: '',
    estimatedDuration: ''
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const routeData = await routeService.list()
        if (!mounted) return
        setRoutes(routeData || [])
      } catch (err) { 
        console.error('Failed to load routes', err) 
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function updateRouteField(id, field, value) {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  async function addRoute() {
    try {
      const routeData = {
        routeCode: `${newRoute.departureAirport}-${newRoute.arrivalAirport}`,
        departureCity: newRoute.departureCity,
        departureAirport: newRoute.departureAirport,
        arrivalCity: newRoute.arrivalCity,
        arrivalAirport: newRoute.arrivalAirport,
        distanceKm: newRoute.distanceKm ? parseInt(newRoute.distanceKm) : null,
        estimatedDuration: newRoute.estimatedDuration ? parseInt(newRoute.estimatedDuration) : null,
        status: 'ACTIVE'
      }
      
      const createdRoute = await routeService.create(routeData)
      setRoutes(prev => [...prev, createdRoute])
      setNewRoute({ 
        routeCode: '', 
        departureCity: '', 
        departureAirport: '', 
        arrivalCity: '', 
        arrivalAirport: '',
        distanceKm: '',
        estimatedDuration: ''
      })
      setAdding(false)
    } catch (err) {
      console.error('Failed to create route', err)
      alert('Failed to create route: ' + err.message)
    }
  }

  async function deleteRoute(id) {
    try {
      await routeService.remove(id)
      setRoutes(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Failed to delete route', err)
      alert('Failed to delete route: ' + err.message)
    }
  }

  const displayed = routes.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (r.departureCity?.toLowerCase().includes(q) || 
            r.arrivalCity?.toLowerCase().includes(q) ||
            r.departureAirport?.toLowerCase().includes(q) ||
            r.arrivalAirport?.toLowerCase().includes(q) ||
            r.routeCode?.toLowerCase().includes(q))
  })

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
              <p className="text-gray-600 mt-1">Manage flight routes</p>
            </div>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => setAdding(true)}
            >
              Add Route
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <input
            type="text"
            placeholder="Search routes by departure or arrival..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Route Form */}
        {adding && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Route</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Departure City (e.g., New York)"
                value={newRoute.departureCity}
                onChange={e => setNewRoute(prev => ({ ...prev, departureCity: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Departure Airport (e.g., JFK)"
                value={newRoute.departureAirport}
                onChange={e => setNewRoute(prev => ({ ...prev, departureAirport: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Arrival City (e.g., London)"
                value={newRoute.arrivalCity}
                onChange={e => setNewRoute(prev => ({ ...prev, arrivalCity: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Arrival Airport (e.g., LHR)"
                value={newRoute.arrivalAirport}
                onChange={e => setNewRoute(prev => ({ ...prev, arrivalAirport: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Distance (km)"
                value={newRoute.distanceKm}
                onChange={e => setNewRoute(prev => ({ ...prev, distanceKm: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newRoute.estimatedDuration}
                onChange={e => setNewRoute(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={addRoute}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Route
              </button>
            </div>
          </div>
        )}

        {/* Routes Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Routes</h2>
            <p className="text-gray-600">Manage flight routes</p>
          </div>
          
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 mb-3">No routes found</div>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => setAdding(true)}
              >
                Create First Route
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance (km)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration (min)
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
                  {displayed.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{r.routeCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.departureCity}</div>
                        <div className="text-sm text-gray-500">{r.departureAirport}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.arrivalCity}</div>
                        <div className="text-sm text-gray-500">{r.arrivalAirport}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {r.distanceKm || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {r.estimatedDuration || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          r.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteRoute(r.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
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
    </div>
  )
}
