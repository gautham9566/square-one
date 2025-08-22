import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'
import PassengerList from './PassengerList'
import PassengerForm from './PassengerForm'
import * as service from '../../services/passengerService'

export default function ManagePassengers() {
  const [passengers, setPassengers] = useState([])
  const [filterMissing, setFilterMissing] = useState(false)
  const [search, setSearch] = useState('')
  const [passengerFilter, setPassengerFilter] = useState('All')
  const [editing, setEditing] = useState(null)
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
  
  // load flights for the top-level list view
  const [flights, setFlights] = useState([])
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

  async function addOrUpdate(p) {
    try {
      if (p.id) {
        await service.update(p.id, p)
      } else {
        await service.create(p)
      }
      setEditing(null)
      await loadPassengers()
    } catch (err) {
      console.error('Failed to save passenger', err)
    }
  }

  async function removePassenger(id) {
    try {
      await service.remove(id)
      await loadPassengers()
    } catch (err) {
      console.error('Failed to remove passenger', err)
    }
  }

  useEffect(() => {
    loadPassengers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeFlightId])

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

  // when a flight is selected via URL param, only show passengers for that flight
  const displayedForFlight = routeFlightId
    ? displayed.filter(p => p.flightId === routeFlightId && (
        passengerFilter === 'All' ? true :
        passengerFilter === 'Checked-In' ? !!p.checkedIn :
        passengerFilter === 'Wheelchair' ? !!p.wheelchair :
        passengerFilter === 'Infant' ? !!p.infant : true
      ))
    : []

  function clearSelection() {
    // navigate back to the flights list route which clears the param
    navigate('/admin/passengers')
  }

  return (
    <div>
  {!routeFlightId ? (
        <div>
          <h2 className="text-xl font-semibold mb-3">Flights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flights.map(f => (
        <div key={f.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">
          <Link to={`/admin/passengers/${f.id}/passengerlist`} className="text-indigo-600">{f.name} — {f.route}</Link>
                    </div>
                    <div className="text-sm text-gray-600">{f.date} • {f.departureTime} → {f.arrivalTime}</div>
                    <div className="text-sm text-gray-600">Available seats: {f.availableSeats}/{f.totalSeats}</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      ) : (
        <div>
              <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="text-sm text-indigo-600" onClick={clearSelection}>&larr; Back to flights</button>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search passengers (name, passport, seat, phone)" className="border p-2 rounded w-80" />
              <label className="flex items-center gap-2">
                <span className="text-sm">Show</span>
                <select value={passengerFilter} onChange={e => setPassengerFilter(e.target.value)} className="border p-2 rounded">
                  <option>All</option>
                  <option>Checked-In</option>
                  <option>Wheelchair</option>
                  <option>Infant</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filterMissing} onChange={e => setFilterMissing(e.target.checked)} />
                <span>Show passengers missing mandatory info (passport / address / dob)</span>
              </label>
            </div>
            <div>
              <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => setEditing({ flightId: routeFlightId })}>Add Passenger</button>
            </div>
          </div>

          <PassengerList
            passengers={displayedForFlight}
            flights={flights}
          />

          {editing !== null && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <PassengerForm initial={editing} onCancel={() => setEditing(null)} onSave={addOrUpdate} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
