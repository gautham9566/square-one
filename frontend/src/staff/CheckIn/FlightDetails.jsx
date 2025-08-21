import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { flights, passengers } from '../../data/dummyData'

export default function FlightDetails() {
  const { flightId } = useParams()
  const navigate = useNavigate()
  const flight = flights.find((f) => f.id === parseInt(flightId))
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('')
  const [passengerList, setPassengerList] = useState(passengers.filter((p) => p.flightId === parseInt(flightId)))

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilter = (type) => {
    setFilter(type)
  }

  const filteredPassengers = passengerList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === 'notCheckedIn' ? !p.checkedIn :
      filter === 'wheelchair' ? p.wheelchair :
      filter === 'infant' ? p.infant : true
    return matchesSearch && matchesFilter
  })

  const handleSeatChange = (passengerId, newSeat) => {
    setPassengerList((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, seat: newSeat } : p))
    )
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
          <button onClick={() => handleFilter('notCheckedIn')} className="px-4 py-2 bg-indigo-600 text-white rounded">Not Checked-In</button>
          <button onClick={() => handleFilter('wheelchair')} className="px-4 py-2 bg-indigo-600 text-white rounded">Wheelchair Required</button>
          <button onClick={() => handleFilter('infant')} className="px-4 py-2 bg-indigo-600 text-white rounded">Infant</button>
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
                  <input
                    type="text"
                    value={passenger.seat}
                    onChange={(e) => handleSeatChange(passenger.id, e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
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
          const seatMapItems = flight.seatMap || []
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
                  const first = assigned[0]
                  let colorClass = ''
                  if (first) {
                    const mt = (first.mealType || first.mealPreference || '').toString().toLowerCase()
                    if (mt.includes('veg')) colorClass = 'bg-green-400 text-white'
                    else if (mt.includes('non')) colorClass = 'bg-red-400 text-white'
                    else colorClass = 'bg-yellow-200'
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
                          ? assigned.map((a) => a.seat || a.name).join(', ')
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
                  <span className="w-4 h-4 inline-block bg-green-400" /> Veg
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block bg-red-400" /> Non-Veg
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block bg-yellow-200" /> Unknown Meal
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
