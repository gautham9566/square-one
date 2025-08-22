import { useParams, useNavigate } from 'react-router-dom'
import * as service from '../../services/passengerService'
import * as historyService from '../../services/historyService'
import * as flightService from '../../services/flightService'
import { useState, useEffect } from 'react'

export default function PassengerDetails() {
  const { name } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        // try to find by name via search endpoint, fallback to all
        const results = await service.searchByName(name)
        if (!mounted) return
        setP(results && results.length > 0 ? { ...results[0] } : null)
      } catch (err) {
        console.error('Failed to load passenger', err)
        if (mounted) setP(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [name])

  const [history, setHistory] = useState([])
  const [flightsMap, setFlightsMap] = useState(new Map())
  useEffect(() => {
    let mounted = true
    async function loadHistory() {
      if (!p) return
      try {
        // API returns an object DTO: { success, message, travelHistory: [...] }
        const res = await historyService.findByPassenger(p.id)
        if (!mounted) return
        let entries = []
        if (!res) entries = []
        else if (Array.isArray(res)) entries = res
        else if (Array.isArray(res.travelHistory)) entries = res.travelHistory
        else entries = []
        setHistory(entries)
        const flightIds = Array.from(new Set(entries.map(r => r.flightId).filter(Boolean)))
        const flightsArr = await Promise.all(flightIds.map(fid => flightService.findById(fid)))
        if (!mounted) return
        const m = new Map(); flightsArr.forEach(f => { if (f) m.set(f.id, f) })
        setFlightsMap(m)
      } catch (err) {
        console.error('Failed to load travel history', err)
      }
    }
    loadHistory()
    return () => { mounted = false }
  }, [p])

  if (loading) return <div className="p-4">Loading...</div>
  if (!p) return <div className="p-4 bg-white rounded">Passenger not found</div>

  async function save() {
    try {
      if (p.id) await service.update(p.id, p)
      else await service.create(p)
      nav('/admin/passengers')
    } catch (err) {
      console.error('Failed to save passenger', err)
    }
  }

  async function del() {
    try {
      if (p.id) await service.remove(p.id)
      nav('/admin/passengers')
    } catch (err) {
      console.error('Failed to delete passenger', err)
    }
  }

  return (
    <div className="bg-white p-4 rounded">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{p.name}</h2>
          <div className="text-sm text-gray-600">Seat: {p.seat || '-'}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => nav('/admin/passengers')} className="px-3 py-1 bg-gray-200 rounded">Back</button>
          <button onClick={save} className="px-3 py-1 bg-yellow-400 rounded">Save</button>
          <button onClick={del} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="font-medium">Passport</div>
          <input value={p.passportNumber || ''} onChange={e => setP(prev => ({ ...prev, passportNumber: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <div className="font-medium">Date of Birth</div>
          <input type="date" value={p.dateOfBirth || ''} onChange={e => setP(prev => ({ ...prev, dateOfBirth: e.target.value }))} className="w-full border p-2 rounded" />
        </div>

        <div className="col-span-2">
          <div className="font-medium">Address</div>
          <input value={p.address || ''} onChange={e => setP(prev => ({ ...prev, address: e.target.value }))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <div className="font-medium">Phone</div>
          <input value={p.phoneNumber || ''} onChange={e => setP(prev => ({ ...prev, phoneNumber: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <div className="font-medium">Seat</div>
          <input value={p.seat || ''} onChange={e => setP(prev => ({ ...prev, seat: e.target.value }))} className="w-full border p-2 rounded" />
        </div>

        <div className="col-span-2">
          <div className="font-medium">Ancillary Services</div>
          <div className="flex gap-2 mt-2">
            {['Meal', 'Ancillary', 'Shopping'].map(s => (
              <label key={s} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={(p.services || []).includes(s)} onChange={() => setP(prev => ({ ...prev, services: prev.services && prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...(prev.services||[]), s] }))} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Travel history</h3>
        <div className="overflow-x-auto bg-white rounded shadow mt-3">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Date</th>
                <th className="p-2">Flight</th>
                <th className="p-2">Route</th>
                <th className="p-2">Seat</th>
                <th className="p-2">Booking Ref</th>
                <th className="p-2">Status</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map(r => {
                const f = flightsMap.get(r.flightId)
                return (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">{r.date}</td>
                    <td className="p-2">{f ? f.name : 'Unknown'}</td>
                    <td className="p-2">{r.origin} 192 {r.destination}</td>
                    <td className="p-2">{r.seat || '-'}</td>
                    <td className="p-2">{r.bookingReference}</td>
                    <td className="p-2">{r.status}</td>
                    <td className="p-2">{r.notes || '-'}</td>
                  </tr>
                )
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-sm text-gray-600">No travel history for this passenger.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
