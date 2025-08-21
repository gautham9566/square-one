import { useState } from 'react'
import { travelHistory, passengers, flights } from '../data/dummyData'

export default function TravelHistory() {
  const [query, setQuery] = useState('')

  function passengerName(id) {
    const p = passengers.find(x => x.id === id)
    return p ? p.name : 'Unknown'
  }

  function flightName(id) {
    const f = flights.find(x => x.id === id)
    return f ? `${f.name} (${f.route})` : 'Unknown'
  }

  const filtered = travelHistory.filter(r => {
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
            {filtered.map(r => (
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
