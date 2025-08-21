import { useParams, useNavigate } from 'react-router-dom'
import { findById, addOrUpdate, remove } from './flightService'
import { useState } from 'react'
import { flights as initialFlights, users as allUsers } from '../data/dummyData'

export default function FlightDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const found = id === 'new' ? null : findById(id)
  // helper to normalize various time formats ("08:00 AM", "8:00", "20:00") to "HH:MM" for input[type=time]
  function to24(t) {
    if (!t) return ''
    const s = String(t).trim()
    const ampm = s.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/)
    if (ampm) {
      let h = Number(ampm[1])
      const m = ampm[2]
      const ap = ampm[3].toUpperCase()
      if (ap === 'PM' && h !== 12) h += 12
      if (ap === 'AM' && h === 12) h = 0
      return `${String(h).padStart(2, '0')}:${m}`
    }
    const simple = s.match(/^(\d{1,2}):(\d{2})$/)
    if (simple) return `${String(Number(simple[1])).padStart(2, '0')}:${simple[2]}`
    return ''
  }

  const initialState = found ? {
    ...found,
    departureTime: to24(found.departureTime),
    arrivalTime: to24(found.arrivalTime),
    inflightStaff: found && found.inflightStaff ? (Array.isArray(found.inflightStaff) ? found.inflightStaff : [found.inflightStaff]) : []
  } : { name: '', route: '', date: '', departureTime: '', arrivalTime: '', totalSeats: '', inflightStaff: [], services: [] }
  const [f, setF] = useState(initialState)

  function save() {
    addOrUpdate(f)
    nav('/admin/flights')
  }

  function del() { if (f.id) remove(f.id); nav('/admin/flights') }

  function toggleService(s) {
    setF(prev => ({ ...prev, services: prev.services && prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...(prev.services||[]), s] }))
  }

  // add-service UI state
  const [selectedService, setSelectedService] = useState('')
  const [mealType, setMealType] = useState('Veg')
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  // inflight staff add UI
  const [selectedStaff, setSelectedStaff] = useState('')

  function addService() {
    if (!selectedService) return
    let label = selectedService
    if (selectedService === 'Ancillary') {
      if (!serviceName) return
      label = `Ancillary: ${serviceName} ($${servicePrice || 0})`
    } else if (selectedService === 'Meal') {
      if (!serviceName) return
      label = `Meal (${mealType}): ${serviceName} ($${servicePrice || 0})`
    } else if (selectedService === 'Shopping') {
      if (!serviceName) return
      label = `Shopping: ${serviceName} ($${servicePrice || 0})`
    }
    setF(prev => ({ ...prev, services: [...(prev.services||[]), label] }))
    // reset add-service fields
    setSelectedService('')
    setMealType('Veg')
    setServiceName('')
    setServicePrice('')
  }

  function removeServiceAt(idx) {
    setF(prev => ({ ...prev, services: (prev.services||[]).filter((_, i) => i !== idx) }))
  }

  return (
    <div className="bg-white p-4 rounded">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{f.name || 'New Flight'}</h2>
          <div className="text-sm text-gray-600">Route: {f.route || '-'}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => nav('/admin/flights')} className="px-3 py-1 bg-gray-200 rounded">Back</button>
          <button onClick={save} className="px-3 py-1 bg-yellow-400 rounded">Save</button>
          {f.id && <button onClick={del} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block">Name</label>
          <input value={f.name} onChange={e => setF(prev => ({ ...prev, name: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block">Route</label>
            {/* use a dropdown populated from existing routes */}
            <select value={f.route} onChange={e => setF(prev => ({ ...prev, route: e.target.value }))} className="w-full border p-2 rounded">
              <option value="">Select route</option>
              {Array.from(new Set(initialFlights.map(x => x.route).filter(Boolean))).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
        </div>
        <div>
          <label className="block">Date</label>
          <input type="date" value={f.date || ''} onChange={e => setF(prev => ({ ...prev, date: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block">Departure Time</label>
          <input type="time" value={f.departureTime || ''} onChange={e => setF(prev => ({ ...prev, departureTime: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block">Arrival Time</label>
          <input type="time" value={f.arrivalTime || ''} onChange={e => setF(prev => ({ ...prev, arrivalTime: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block">Number of seats</label>
          <input type="number" min="0" value={f.totalSeats || ''} onChange={e => setF(prev => ({ ...prev, totalSeats: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block">Assign Inflight Staff</label>
          <div className="flex gap-2 items-center">
            <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select staff to add</option>
              {allUsers.filter(u => u.role === 'inflightStaff').map(u => (
                <option key={u.username} value={u.username}>{u.name}</option>
              ))}
            </select>
            <button type="button" onClick={() => {
              if (!selectedStaff) return
              if ((f.inflightStaff||[]).includes(selectedStaff)) return
              setF(prev => ({ ...prev, inflightStaff: [...(prev.inflightStaff||[]), selectedStaff] }))
              setSelectedStaff('')
            }} className="px-3 py-1 bg-blue-500 text-white rounded">Add</button>
          </div>
          {/* assigned staff list */}
          <div className="mt-2 space-y-2">
            {(f.inflightStaff || []).map((u, idx) => {
              const user = allUsers.find(x => x.username === u)
              return (
                <div key={u} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>{user ? user.name : u}</div>
                  <button type="button" onClick={() => setF(prev => ({ ...prev, inflightStaff: (prev.inflightStaff||[]).filter((_, i) => i !== idx) }))} className="text-red-500">Remove</button>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <label className="block">Services</label>
          <div className="flex gap-2 mt-2">
            {['Ancillary', 'Meal', 'Shopping'].map(s => (
              <label key={s} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={(f.services||[]).includes(s)} onChange={() => toggleService(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
          {/* Add service section */}
          <div className="mt-4 border-t pt-3">
            <label className="block font-medium">Add service</label>
            <div className="flex gap-2 items-center mt-2">
              <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="border p-2 rounded">
                <option value="">Select service</option>
                <option value="Ancillary">Ancillary</option>
                <option value="Meal">Meal</option>
                <option value="Shopping">Shopping</option>
              </select>
              {/* conditional fields */}
              {selectedService === 'Ancillary' && (
                <>
                  <input placeholder="Service name" value={serviceName} onChange={e => setServiceName(e.target.value)} className="border p-2 rounded" />
                  <input placeholder="Price" value={servicePrice} onChange={e => setServicePrice(e.target.value)} className="border p-2 rounded w-28" />
                </>
              )}
              {selectedService === 'Meal' && (
                <>
                  <select value={mealType} onChange={e => setMealType(e.target.value)} className="border p-2 rounded">
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non Veg</option>
                  </select>
                  <input placeholder="Dish name" value={serviceName} onChange={e => setServiceName(e.target.value)} className="border p-2 rounded" />
                  <input placeholder="Price" value={servicePrice} onChange={e => setServicePrice(e.target.value)} className="border p-2 rounded w-28" />
                </>
              )}
              {selectedService === 'Shopping' && (
                <>
                  <input placeholder="Product name" value={serviceName} onChange={e => setServiceName(e.target.value)} className="border p-2 rounded" />
                  <input placeholder="Price" value={servicePrice} onChange={e => setServicePrice(e.target.value)} className="border p-2 rounded w-28" />
                </>
              )}
              <button type="button" onClick={addService} className="px-3 py-1 bg-blue-500 text-white rounded">Add</button>
            </div>
          </div>
          {/* display added service subtypes */}
          <div className="mt-3">
            {(f.services || []).map((s, i) => {
              if (['Ancillary', 'Meal', 'Shopping'].includes(s)) return null
              return (
                <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-2">
                  <div className="text-sm">{s}</div>
                  <button type="button" onClick={() => removeServiceAt(i)} className="text-red-500">Remove</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
