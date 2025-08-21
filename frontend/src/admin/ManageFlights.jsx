import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as service from './flightService'
import { flights as initialFlights } from '../data/dummyData'

function FlightForm({ onSave, onCancel, initial = {}, routes = [] }) {
  const [f, setF] = useState({
    id: initial.id || null,
    name: initial.name || '',
    route: initial.route || '',
    date: initial.date || '',
  })

  function change(k, v) { setF(prev => ({ ...prev, [k]: v })) }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="grid grid-cols-2 gap-2 mb-3">
      <input placeholder="Name" value={f.name} onChange={e => change('name', e.target.value)} className="border p-2 rounded" />
      <select value={f.route} onChange={e => change('route', e.target.value)} className="border p-2 rounded">
        <option value="">Select route</option>
        {routes.map(r => <option key={r.id} value={r.route}>{r.route}</option>)}
      </select>
      <input placeholder="Date" type="date" value={f.date} onChange={e => change('date', e.target.value)} className="border p-2 rounded" />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">Save Flight</button>
      </div>
    </form>
  )
}

export default function ManageFlights() {
  const [flights, setFlights] = useState(() => service.list())
  const [search, setSearch] = useState('')
  const nav = useNavigate()

  useEffect(() => service.subscribe(list => setFlights(list)), [])

  const displayed = flights.filter(f => {
    if (!search) return true
    const q = search.toLowerCase()
    return (f.name?.toLowerCase().includes(q) || f.route?.toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Flights</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search flights by name or route" className="border p-2 rounded w-80" />
        </div>
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => nav('/admin/flights/new')}>Add Flight</button>
      </div>

      <div className="overflow-x-auto bg-white rounded p-2">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Route</th>
              <th className="p-2">Date</th>
              <th className="p-2">Services</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(f => (
              <tr key={f.id} className="border-b">
                <td className="p-2"><Link to={`/admin/flights/${f.id}`} className="text-indigo-600">{f.name}</Link></td>
                <td className="p-2">{f.route}</td>
                <td className="p-2">{f.date || '-'}</td>
                <td className="p-2">{(f.services || []).join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
