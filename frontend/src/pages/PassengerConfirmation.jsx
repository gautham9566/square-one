import { useLocation, useNavigate } from 'react-router-dom'

export default function PassengerConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const passenger = state?.passenger
  const flight = state?.flight

  if (!passenger || !flight) return <div className="bg-white p-6 rounded">No confirmation data.</div>

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Booking Confirmed</h2>
      <p className="text-sm">Congratulations, your booking is confirmed.</p>
      <div className="mt-4">
        <h3 className="font-medium">Passenger</h3>
        <p>{passenger.name}</p>
        <p>{passenger.phoneNumber}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-medium">Flight</h3>
        <p>{flight.name} — {flight.route}</p>
        <p>{flight.date} · {flight.departureTime} → {flight.arrivalTime}</p>
      </div>
      <div className="mt-6">
        <button onClick={() => navigate('/passenger')} className="bg-indigo-600 text-white py-2 px-4 rounded">Back to Dashboard</button>
      </div>
    </div>
  )
}
