import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as flightService from '../../services/flightService'

export default function PassengerHome({ locationState }) {
  // locationState is optional; but when navigated after login we can pass user info
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [results, setResults] = useState([])

  function handleSearch(e) {
    e.preventDefault()
    // simple route match on from/to (route strings are e.g. 'NYC-LON')
  const routeQuery = `${from.toUpperCase()}-${to.toUpperCase()}`
  const matched = (allFlights || []).filter((f) => f.route === routeQuery && (!date || f.date === date))
  setResults(matched)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Passenger Dashboard</h2>
      <form onSubmit={handleSearch} className="grid grid-cols-4 gap-4 items-end mb-4">
        <label>
          <div className="text-sm text-gray-600">From</div>
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 rounded border-gray-200" placeholder="e.g. NYC" />
        </label>
        <label>
          <div className="text-sm text-gray-600">To</div>
          <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 rounded border-gray-200" placeholder="e.g. LON" />
        </label>
        <label>
          <div className="text-sm text-gray-600">Departure Date</div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 rounded border-gray-200" />
        </label>
        <div>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">Search</button>
        </div>
      </form>

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Flight</th>
                <th className="text-left p-2">Departure</th>
                <th className="text-left p-2">Arrival</th>
                <th className="text-left p-2">Duration</th>
                <th className="text-left p-2">Available Seats</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-2">{f.name} ({f.route})</td>
                  <td className="p-2">{f.date} {f.departureTime}</td>
                  <td className="p-2">{f.date} {f.arrivalTime}</td>
                  <td className="p-2">{/* naive duration placeholder */}{calculateDuration(f.departureTime, f.arrivalTime)}</td>
                  <td className="p-2">{f.availableSeats}</td>
                  <td className="p-2">
                    <button
                      onClick={() => navigate('/passenger/book', { state: { flightId: f.id } })}
                      className="bg-green-600 text-white py-1 px-3 rounded"
                      disabled={f.availableSeats <= 0}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No results. Enter a route and click Search.</div>
      )}
    </div>
  )
}

  // load flights on demand (separate effect to avoid changing the search flow)
  let allFlights = null
  ;(async function preloadFlights() {
    try {
      allFlights = await flightService.list()
    } catch (e) { console.error('Failed to preload flights', e) }
  })()

function calculateDuration(dep, arr) {
  // Very naive: expects times like '08:00 AM' and same date; returns placeholder
  try {
    const parse = (t) => {
      const [time, ampm] = t.split(' ')
      const [h, m] = time.split(':').map(Number)
      let hh = h % 12
      if (ampm === 'PM') hh += 12
      return hh * 60 + m
    }
    const start = parse(dep)
    const end = parse(arr)
    let diff = end - start
    if (diff < 0) diff += 24 * 60
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  } catch (e) {
    return '-'
  }
}
