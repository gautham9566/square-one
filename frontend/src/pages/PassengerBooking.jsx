import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { flights, users, passengers } from '../data/dummyData'

export default function PassengerBooking() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const flightId = state?.flightId
  const flight = flights.find((f) => f.id === flightId)
  const passengerUser = users.find((u) => u.role === 'passenger')

  const [form, setForm] = useState({
    name: passengerUser?.name || '',
    email: passengerUser?.email || '',
    phoneNumber: passengerUser?.phoneNumber || '',
    passportNumber: '',
    dateOfBirth: '',
  })

  if (!flight) return <div className="bg-white p-6 rounded">Flight not found.</div>

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleConfirm() {
    // create a simple passenger record (in-memory)
    const newId = Math.max(0, ...passengers.map((p) => p.id)) + 1
    const newPassenger = {
      id: newId,
      flightId: flight.id,
      name: form.name,
      phoneNumber: form.phoneNumber,
      address: '',
      passportNumber: form.passportNumber,
      dateOfBirth: form.dateOfBirth,
      from: flight.route.split('-')[0],
      to: flight.route.split('-')[1],
      services: [],
      seat: `S${newId}`,
      checkedIn: false,
      wheelchair: false,
      infant: false,
    }
    passengers.push(newPassenger)
    // decrement available seats
    const f = flights.find((x) => x.id === flight.id)
    if (f) f.availableSeats = Math.max(0, f.availableSeats - 1)

    navigate('/passenger/confirm', { state: { passenger: newPassenger, flight } })
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Booking: {flight.name} ({flight.route})</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Flight details</h3>
          <p className="text-sm text-gray-600">{flight.date} · {flight.departureTime} → {flight.arrivalTime}</p>
          <p className="text-sm">Aircraft: {flight.aircraftType}</p>
          <p className="text-sm">Available seats: {flight.availableSeats}</p>
        </div>
        <div>
          <h3 className="font-medium">Passenger details</h3>
          <label className="block text-sm mt-2">
            <div className="text-xs text-gray-500">Name</div>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 rounded border-gray-200" />
          </label>
          <label className="block text-sm mt-2">
            <div className="text-xs text-gray-500">Email</div>
            <input name="email" value={form.email} onChange={handleChange} className="mt-1 rounded border-gray-200" />
          </label>
          <label className="block text-sm mt-2">
            <div className="text-xs text-gray-500">Phone</div>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="mt-1 rounded border-gray-200" />
          </label>
          <label className="block text-sm mt-2">
            <div className="text-xs text-gray-500">Passport</div>
            <input name="passportNumber" value={form.passportNumber} onChange={handleChange} className="mt-1 rounded border-gray-200" />
          </label>
          <label className="block text-sm mt-2">
            <div className="text-xs text-gray-500">Date of birth</div>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="mt-1 rounded border-gray-200" />
          </label>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleConfirm} className="bg-indigo-600 text-white py-2 px-4 rounded">Confirm Booking</button>
        <button onClick={() => navigate(-1)} className="py-2 px-4 rounded border">Back</button>
      </div>
    </div>
  )
}
