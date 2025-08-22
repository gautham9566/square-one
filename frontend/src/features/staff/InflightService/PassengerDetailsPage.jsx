import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import PassengerDetails from './PassengerDetails'
import * as passengerService from '../../../services/passengerService'
import * as flightService from '../../../services/flightService'

export default function PassengerDetailsPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  // try state first (faster navigation from list), otherwise lookup by id
  const [passengerState, setPassengerState] = useState(state?.passenger || null)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (state?.passenger) {
        setPassengerState(state.passenger)
        return
      }
      try {
        const p = await passengerService.findById(Number(id))
        if (!mounted) return
        setPassengerState(p)
      } catch (err) {
        console.error('Failed to load passenger', err)
        if (mounted) setPassengerState(null)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, state])

  const flightId = state?.flightId || passengerState?.flightId
  const [flight, setFlight] = useState(state?.flight || null)
  useEffect(() => {
    let mounted = true
    async function loadFlight() {
      if (!flightId) return
      try {
        const f = await flightService.findById(Number(flightId))
        if (!mounted) return
        setFlight(f)
      } catch (err) { console.error('Failed to load flight', err) }
    }
    loadFlight()
    return () => { mounted = false }
  }, [flightId, state])

  if (!passengerState) return <div className="p-6">Passenger not found.</div>

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline mb-4">← Back</button>
      <PassengerDetails
        passenger={passengerState}
        flight={flight}
        onClose={() => navigate(-1)}
        onUpdate={async (updated) => {
          setPassengerState(updated)
          try {
            if (updated.id) await passengerService.update(updated.id, updated)
          } catch (err) { console.error('Failed to persist passenger update', err) }
        }}
      />
    </div>
  )
}
