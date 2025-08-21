import { useParams, useNavigate } from 'react-router-dom'
import { findByName, findById, addOrUpdate, remove } from './passengerService'
import { useState } from 'react'

export default function PassengerDetails() {
  const { name } = useParams()
  const nav = useNavigate()
  const found = findByName(name)
  const [p, setP] = useState(found ? { ...found } : null)

  if (!p) return <div className="p-4 bg-white rounded">Passenger not found</div>

  function save() {
    addOrUpdate(p)
    nav('/admin/passengers')
  }

  function del() {
    remove(p.id)
    nav('/admin/passengers')
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
        <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
          {(p.travelHistory || []).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
