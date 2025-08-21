import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PassengerDetails from './PassengerDetails'
import { passengers, flights } from '../../data/dummyData'

export default function PassengerDetailsPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  // try state first (faster navigation from list), otherwise lookup by id
  const initialPassenger = state?.passenger || passengers.find((p) => p.id === Number(id))
  const [passengerState, setPassengerState] = useState(initialPassenger)

  // keep local passenger in sync if navigation/state changes
  useEffect(() => {
    const next = state?.passenger || passengers.find((p) => p.id === Number(id))
    setPassengerState(next)
  }, [id, state])

  const flightId = state?.flightId || passengerState?.flightId
  const flight = flights.find((f) => f.id === Number(flightId))

  if (!passengerState) return <div className="p-6">Passenger not found.</div>

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline mb-4">← Back</button>
      <PassengerDetails
        passenger={passengerState}
        flight={flight}
        onClose={() => navigate(-1)}
        onUpdate={(updated) => {
          // update both local state and in-memory passengers array so UI updates immediately
          setPassengerState(updated)
          const idx = passengers.findIndex((p) => p.id === updated.id)
          if (idx >= 0) {
            passengers[idx] = updated
          } else {
            passengers.push(updated)
          }
        }}
      />
    </div>
  )
}
