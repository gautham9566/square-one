import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PassengerDetails from './PassengerDetails'
import { passengers, flights } from '../../data/dummyData'

export default function PassengerDetailsPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  // try state first (faster navigation from list), otherwise lookup by id
  const passenger = state?.passenger || passengers.find((p) => p.id === Number(id))
  const flightId = state?.flightId || passenger?.flightId
  const flight = flights.find((f) => f.id === Number(flightId))

  if (!passenger) return <div className="p-6">Passenger not found.</div>

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline mb-4">← Back</button>
      <PassengerDetails passenger={passenger} flight={flight} onClose={() => navigate(-1)} onUpdate={(updated) => {
        // update local copy and navigate back
        // here we just navigate back after update since data is in-memory
        navigate(-1)
      }} />
    </div>
  )
}
