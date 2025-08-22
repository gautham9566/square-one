import { useState, useEffect } from 'react'
import * as historyService from '../../services/historyService'
import * as passengerService from '../../services/passengerService'
import * as flightService from '../../services/flightService'

export default function TravelHistory() {
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await historyService.list()
        if (!mounted) return
        setRecords(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load travel history', err)
        if (mounted) setRecords([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // preload passenger and flight maps for name resolution
  const [passengerMap, setPassengerMap] = useState(new Map())
  const [flightMap, setFlightMap] = useState(new Map())
  useEffect(() => {
    let mounted = true
    async function loadMaps() {
      try {
        const [plist, flist] = await Promise.all([passengerService.list(), flightService.list()])
        if (!mounted) return
        setPassengerMap(new Map((plist || []).map(p => [Number(p.id), p])))
        setFlightMap(new Map((flist || []).map(f => [Number(f.id), f])))
      } catch (err) {
        console.error('Failed to load passenger/flight maps', err)
      }
    }
    loadMaps()
    return () => { mounted = false }
  }, [])

  function passengerName(id) {
  const p = passengerMap.get(Number(id))
  return p ? p.name : 'Unknown'
  }

  function flightName(id) {
  const f = flightMap.get(Number(id))
  return f ? `${f.name} (${f.route})` : 'Unknown'
  }

  const filtered = records.filter(r => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      (passengerName(r.passengerId) || '').toLowerCase().includes(q) ||
      (flightName(r.flightId) || '').toLowerCase().includes(q) ||
      (r.bookingReference || '').toLowerCase().includes(q) ||
      (r.origin || '').toLowerCase().includes(q) ||
      (r.destination || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Travel history</h2>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search (passenger, flight, booking ref, origin/dest)" className="border p-2 rounded w-80" />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Passenger</th>
              <th className="p-2">Flight</th>
              <th className="p-2">Route</th>
              <th className="p-2">Seat</th>
              <th className="p-2">Booking Ref</th>
              <th className="p-2">Class</th>
              <th className="p-2">Status</th>
              <th className="p-2">Distance (km)</th>
              <th className="p-2">Duration (min)</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
        {loading ? <div className="p-4">Loading...</div> : filtered.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{passengerName(r.passengerId)}</td>
                <td className="p-2">{flightName(r.flightId)}</td>
                <td className="p-2">{r.origin} → {r.destination}</td>
                <td className="p-2">{r.seat || '-'}</td>
                <td className="p-2">{r.bookingReference}</td>
                <td className="p-2">{r.fareClass}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.distanceKm ?? '-'}</td>
                <td className="p-2">{r.durationMin ?? '-'}</td>
                <td className="p-2">{r.notes || '-'}</td>
              </tr>
          ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="p-4 text-sm text-gray-600">No records match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
