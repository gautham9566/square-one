import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { flights, passengers } from '../../data/dummyData'

export default function FlightDetails() {
  const { flightId } = useParams()
  const navigate = useNavigate()
  const flight = flights.find((f) => f.id === parseInt(flightId))
  const [searchTerm, setSearchTerm] = useState('')
  const [passengerFilter, setPassengerFilter] = useState('All')
  const [passengerList, setPassengerList] = useState(passengers.filter((p) => p.flightId === parseInt(flightId)))
  const [seatMap, setSeatMap] = useState(flight.seatMap || [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilter = (type) => {
  setPassengerFilter(type)
  }

  const filteredPassengers = passengerList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      passengerFilter === 'Not Checked-In' ? !p.checkedIn :
      passengerFilter === 'Wheelchair Required' ? p.wheelchair :
      passengerFilter === 'Infant' ? p.infant : true
    return matchesSearch && matchesFilter
  })

  const handleSeatChange = (passengerId, newSeat) => {
    // Deprecated: keep for compatibility
    setPassengerList((prev) => prev.map((p) => (p.id === passengerId ? { ...p, seat: newSeat } : p)))
  }

  const handleAssignSeat = (passengerId, newSeatNumber) => {
    // Compute updated passenger list deterministically then update seatMap based on it
    const updatedPassengers = passengerList.map((p) =>
      p.id === passengerId ? { ...p, seat: newSeatNumber ? String(newSeatNumber) : '' } : p
    )

    setPassengerList(updatedPassengers)

    // compute booked seats from updated list
    const booked = new Set()
    updatedPassengers.forEach((p) => {
      const n = parseInt((p.seat || '').toString().match(/^\d+/)?.[0], 10)
      if (!isNaN(n)) booked.add(n)
    })

    setSeatMap((prevMap) => prevMap.map((s) => ({ ...s, isBooked: booked.has(s.number) })))
  }

  const handleCheckin = (passengerId) => {
    const updated = passengerList.map((p) => (p.id === passengerId ? { ...p, checkedIn: true } : p))
    setPassengerList(updated)
    // don't change seatMap yet; seats are still unassigned until staff picks one
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Flight Details</h1>
      <p><strong>Flight ID:</strong> {flight.id}</p>
      <p><strong>Aircraft Type:</strong> {flight.aircraftType}</p>
      <p><strong>Seats:</strong> {flight.totalSeats} (Available: {flight.availableSeats})</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <div className="flex gap-4">
          {flight.services.map((service) => (
            <div key={service} className="p-4 border rounded shadow bg-white">
              {service}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Passengers</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search passengers..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded"
          />
          <label className="w-48">
            <span className="block text-sm font-medium text-gray-700">Show</span>
            <select
              value={passengerFilter}
              onChange={(e) => setPassengerFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option>All</option>
              <option>Not Checked-In</option>
              <option>Wheelchair Required</option>
              <option>Infant</option>
            </select>
          </label>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Services Availed</th>
              <th className="border p-2">Seat</th>
            </tr>
          </thead>
          <tbody>
            {filteredPassengers.map((passenger) => (
              <tr key={passenger.id}>
                <td className="border p-2">
                  <span
                    className="text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/staff/check-in/${flight.id}/${passenger.name}`)}
                  >
                    {passenger.name}
                  </span>
                </td>
                <td className="border p-2">{passenger.services.join(', ')}</td>
                <td className="border p-2">
                  {passenger.checkedIn ? (
                    <select
                      value={passenger.seat || ''}
                      onChange={(e) => handleAssignSeat(passenger.id, e.target.value ? parseInt(e.target.value, 10) : '')}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">Unassigned</option>
                      {seatMap
                        .filter((s) => !s.isBooked || (passenger.seat && parseInt((passenger.seat || '').toString().match(/^\d+/)?.[0], 10) === s.number))
                        .map((s) => (
                          <option key={s.number} value={s.number}>
                            {s.number}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Unassigned</span>
                      <button
                        onClick={() => handleCheckin(passenger.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Check in
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Seat Map</h2>
        {/* Build a quick lookup of passengers by numeric seat row (e.g. '12A' -> 12) */}
        {(() => {
          const seatMapItems = seatMap || []
          const lookup = new Map()
          passengerList.forEach((p) => {
            const row = parseInt((p.seat || '').toString().match(/^\d+/)?.[0], 10)
            if (!isNaN(row)) {
              if (!lookup.has(row)) lookup.set(row, [])
              lookup.get(row).push(p)
            }
          })

          return (
            <>
              <div className="grid grid-cols-6 gap-2">
                {seatMapItems.map((seat) => {
                  const assigned = lookup.get(seat.number) || []
                  // Occupied seats should be shown in red and display passenger names
                  let colorClass = ''
                  if (assigned.length > 0) {
                    colorClass = 'bg-red-400 text-white'
                  } else if (seat.isBooked) {
                    colorClass = 'bg-gray-200'
                  } else {
                    colorClass = 'bg-white'
                  }

                  return (
                    <div key={seat.number} className={`border border-gray-300 rounded p-3 text-center text-sm ${colorClass}`}>
                      <div className="font-semibold">{seat.number}</div>
                      <div className="mt-2 text-xs">
                        {assigned.length > 0
                          ? assigned.map((a) => a.name).join(', ')
                          : seat.isBooked
                          ? 'Booked'
                          : 'Free'}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex gap-3 items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block bg-red-400" /> Occupied
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block bg-white border" /> Free
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block bg-gray-200" /> Booked (no data)
                </div>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
