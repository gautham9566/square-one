import { useState, useEffect } from 'react'
import * as flightService from '../../services/flightService'

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([])
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [newRoute, setNewRoute] = useState({ departurePlace: '', arrivalPlace: '' })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const fl = await flightService.list()
        if (!mounted) return
        setRoutes((fl || []).map(f => {
          const parts = (f.route || '').split('-')
          return { id: f.id, departurePlace: parts[0] || '', arrivalPlace: parts[1] || '' }
        }))
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

  function addRoute() {
    const id = Math.max(0, ...routes.map(r => r.id)) + 1
    setRoutes(prev => [...prev, { id, ...newRoute }])
    setNewRoute({ departurePlace: '', arrivalPlace: '' })
    setAdding(false)
  }

  const displayed = routes.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (r.departurePlace?.toLowerCase().includes(q) || r.arrivalPlace?.toLowerCase().includes(q))
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Departure place"
                value={newRoute.departurePlace}
                onChange={e => setNewRoute(prev => ({ ...prev, departurePlace: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Arrival place"
                value={newRoute.arrivalPlace}
                onChange={e => setNewRoute(prev => ({ ...prev, arrivalPlace: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 justify-end mt-4">
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
                      Departure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayed.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={r.departurePlace}
                          onChange={e => updateRouteField(r.id, 'departurePlace', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={r.arrivalPlace}
                          onChange={e => updateRouteField(r.id, 'arrivalPlace', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
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
