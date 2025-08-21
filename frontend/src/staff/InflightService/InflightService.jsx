import { useNavigate, useLocation } from 'react-router-dom'
import { passengers, flights } from '../../data/dummyData'
// Passenger details will live on a separate page; navigation will be used to open it
import { useState, useEffect } from 'react'

export default function InflightService() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPassengers, setFilteredPassengers] = useState([])
  const [selectedPassengerId, setSelectedPassengerId] = useState(null)
  const [selectedSubService, setSelectedSubService] = useState({})

  const flightId = state?.flightId || null

  // normalize passenger fields for this view
  useEffect(() => {
    const id = flightId ? Number(flightId) : null
    if (id) {
      const list = passengers
        .filter((passenger) => passenger.flightId === id)
        .map((p) => ({
          ...p,
          // unify possible shopping arrays
          shoppingRequests: p.shoppingRequests || p.shoppingItems || [],
          // unify ancillary services: prefer explicit ancillaryServices, otherwise fall back to services
          ancillaryServices: p.ancillaryServices || p.ancillary || p.services || [],
          // unify special meal display
          specialMeal: p.specialMeal || p.mealName || '',
          // normalize explicit meal type where available (e.g. 'Veg' / 'Non-Veg')
          mealType: p.mealType || p.mealPreference || '',
          // ensure seat exists
          seat: p.seat || '',
        }))

      setFilteredPassengers(list)
    }
  }, [flightId])

  // find the flight object for seat map rendering
  const flight = flights.find((f) => f.id === (flightId ? Number(flightId) : null))

  // build a quick lookup of passengers by numeric seat row (e.g. 12 from '12A')
  const seatPassengersMap = new Map()
  filteredPassengers.forEach((p) => {
    const row = parseInt((p.seat || '').toString().match(/^\d+/)?.[0], 10)
    if (!isNaN(row)) {
      if (!seatPassengersMap.has(row)) seatPassengersMap.set(row, [])
      seatPassengersMap.get(row).push(p)
    }
  })

  const handleBack = () => {
    // go back to staff landing
    navigate('/staff')
  }

  const handleAddAncillary = (passengerId) => {
    const item = window.prompt('Enter ancillary service to add (e.g. Extra Pillow)')
    if (!item) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, ancillaryServices: [...(p.ancillaryServices || []), item] } : p
      )
    )
  }

  const handleChangeMeal = (passengerId) => {
    const meal = window.prompt('Enter new meal name (e.g. Vegetarian Biryani)')
    if (meal === null) return
    setFilteredPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, specialMeal: meal } : p))
    )
  }

  const handleAddShopping = (passengerId) => {
    const item = window.prompt('Enter shopping item to add (e.g. Headphones)')
    if (!item) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, shoppingRequests: [...(p.shoppingRequests || []), item] } : p
      )
    )
  }

  const searchResults = filteredPassengers.filter((passenger) =>
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.seat.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleBack} className="text-indigo-600 hover:text-indigo-800">
          ←
        </button>
        <h1 className="text-2xl font-semibold">Inflight Service Page</h1>
      </div>

      <div className="p-6 w-full">
        {flight && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Seat Map ({flight.name})</h2>
            <div className="grid grid-cols-6 gap-2">
              {flight.seatMap.map((s) => {
                const assigned = seatPassengersMap.get(s.number) || []
                // pick first passenger to determine meal preference for this seat
                const first = assigned[0]
                let colorClass = ''
                if (assigned.length > 0 && first) {
                  const mt = (first.mealType || '').toString().toLowerCase()
                  if (mt.includes('veg')) colorClass = 'bg-green-400 text-white'
                  else if (mt.includes('non')) colorClass = 'bg-red-400 text-white'
                  else colorClass = 'bg-yellow-200'
                } else if (s.isBooked) {
                  colorClass = 'bg-gray-200'
                } else {
                  colorClass = 'bg-white'
                }

                const title = assigned.length > 0
                  ? `${assigned.map((a) => a.name).join(', ')} - ${assigned.map((a) => a.mealType || a.specialMeal || 'Unknown').join(', ')}`
                  : s.isBooked
                  ? 'Booked (no passenger data)'
                  : 'Available'

                const smallText = assigned.length > 0
                  ? (first.mealType || first.specialMeal || 'Unknown')
                  : s.isBooked
                  ? 'Booked'
                  : 'Free'

                return (
                  <div
                    key={s.number}
                    title={title}
                    className={`border border-gray-300 px-2 py-3 rounded text-center text-sm ${colorClass}`}
                  >
                    <div className="font-semibold">{s.number}</div>
                    <div className="text-xs">{smallText}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by passenger name or seat number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Passenger List</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Passenger Name</th>
              <th className="border border-gray-300 px-4 py-2">Seat</th>
              <th className="border border-gray-300 px-4 py-2">Special Meal</th>
              <th className="border border-gray-300 px-4 py-2">Ancillary Services</th>
              <th className="border border-gray-300 px-4 py-2">Shopping Requests</th>
              <th className="border border-gray-300 px-4 py-2">Services</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((passenger) => (
              <tr key={passenger.id} className={passenger.specialMeal ? 'bg-yellow-100' : ''}>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className="text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/inflight-service/passenger/${passenger.id}`, { state: { passenger, flightId: passenger.flightId } })}
                  >
                    {passenger.name}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{passenger.seat}</td>
                <td className="border border-gray-300 px-4 py-2">{passenger.specialMeal || 'None'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {passenger.ancillaryServices && passenger.ancillaryServices.length > 0
                    ? passenger.ancillaryServices.join(', ')
                    : 'None'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {passenger.shoppingRequests && passenger.shoppingRequests.length > 0
                    ? passenger.shoppingRequests.join(', ')
                    : 'None'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm">{passenger.ancillaryServices && passenger.ancillaryServices.length > 0 ? passenger.ancillaryServices.join(', ') : 'No ancillaries'}</div>
                    <div className="text-sm">{passenger.specialMeal || 'No meal'}</div>
                    <div className="text-sm">{passenger.shoppingRequests && passenger.shoppingRequests.length > 0 ? passenger.shoppingRequests.join(', ') : 'No shopping'}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  {/* Passenger details are now shown on their own page at /inflight-service/passenger/:id */}
      </div>
    </div>
  )
}
