import { useState, useEffect } from 'react'
import { flights } from '../data/dummyData'
import PassengerList from './PassengerList'
import PassengerForm from './PassengerForm'
import * as service from './passengerService'

export default function ManagePassengers() {
  const [passengers, setPassengers] = useState(() => service.list())
  const [filterMissing, setFilterMissing] = useState(false)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)

  function addOrUpdate(p) {
    service.addOrUpdate(p)
    setEditing(null)
  }

  function removePassenger(id) {
    service.remove(id)
  }

  useEffect(() => {
    const unsub = service.subscribe(list => setPassengers(list))
    return unsub
  }, [])

  const filtered = filterMissing
    ? passengers.filter(p => !p.passportNumber || !p.address || !p.dateOfBirth)
    : passengers

  const displayed = filtered.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.passportNumber || '').toLowerCase().includes(q) ||
      (p.seat || '').toLowerCase().includes(q) ||
      (p.phoneNumber || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search passengers (name, passport, seat, phone)" className="border p-2 rounded w-80" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filterMissing} onChange={e => setFilterMissing(e.target.checked)} />
            <span>Show passengers missing mandatory info (passport / address / dob)</span>
          </label>
        </div>
        <div>
          <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => setEditing({})}>Add Passenger</button>
        </div>
      </div>

      <PassengerList
        passengers={displayed}
        flights={flights}
      />

      {editing !== null && (
        <div className="mt-4 bg-gray-50 p-4 rounded">
          <PassengerForm initial={editing} onCancel={() => setEditing(null)} onSave={addOrUpdate} />
        </div>
      )}
    </div>
  )
}
