import { useState, useEffect } from 'react'
import * as flightService from '../../services/flightService'

function RouteForm({ onSave, onCancel }) {
  const [r, setR] = useState({ departurePlace: '', arrivalPlace: '' })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(r) }} className="grid grid-cols-2 gap-2 mb-3">
      <input placeholder="Departure place" value={r.departurePlace} onChange={e => setR(prev => ({ ...prev, departurePlace: e.target.value }))} className="border p-2 rounded" />
      <input placeholder="Arrival place" value={r.arrivalPlace} onChange={e => setR(prev => ({ ...prev, arrivalPlace: e.target.value }))} className="border p-2 rounded" />
      <div className="col-span-2 flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">Add Route</button>
      </div>
    </form>
  )
}

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([])
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
      } catch (err) { console.error('Failed to load routes', err) }
    }
    load()
    return () => { mounted = false }
  }, [])
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')

  function updateRouteField(id, field, value) {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function addRoute({ departurePlace, arrivalPlace }) {
    const id = Math.max(0, ...routes.map(r => r.id)) + 1
    setRoutes(prev => [...prev, { id, departurePlace, arrivalPlace }])
    setAdding(false)
  }

  const displayed = routes.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (r.departurePlace?.toLowerCase().includes(q) || r.arrivalPlace?.toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Routes</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search routes by departure or arrival" className="border p-2 rounded w-80" />
        </div>
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => setAdding(true)}>Add Route</button>
      </div>

      {adding && <RouteForm onSave={addRoute} onCancel={() => setAdding(false)} />}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Departure</th>
              <th className="p-2">Arrival</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-2">
                  <input value={r.departurePlace} onChange={e => updateRouteField(r.id, 'departurePlace', e.target.value)} className="w-full border p-1 rounded" />
                </td>
                <td className="p-2">
                  <input value={r.arrivalPlace} onChange={e => updateRouteField(r.id, 'arrivalPlace', e.target.value)} className="w-full border p-1 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
