import { useState, useEffect } from 'react'

export default function PassengerForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: null,
    flightId: initial.flightId || '',
    name: initial.name || '',
    passportNumber: initial.passportNumber || '',
    address: initial.address || '',
    dateOfBirth: initial.dateOfBirth || '',
    services: initial.services || [],
    seat: initial.seat || '',
  })

  useEffect(() => {
    setForm({
      id: initial.id || null,
      flightId: initial.flightId || '',
      name: initial.name || '',
      passportNumber: initial.passportNumber || '',
      address: initial.address || '',
      dateOfBirth: initial.dateOfBirth || '',
      services: initial.services || [],
      seat: initial.seat || '',
    })
  }, [initial])

  function change(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function toggleService(s) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...prev.services, s],
    }))
  }

  function submit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="block">Name</label>
        <input value={form.name} onChange={e => change('name', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Flight ID</label>
        <input value={form.flightId} onChange={e => change('flightId', Number(e.target.value))} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Passport Number</label>
        <input value={form.passportNumber} onChange={e => change('passportNumber', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Date of Birth</label>
        <input type="date" value={form.dateOfBirth} onChange={e => change('dateOfBirth', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div className="col-span-2">
        <label className="block">Address</label>
        <input value={form.address} onChange={e => change('address', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Seat</label>
        <input value={form.seat} onChange={e => change('seat', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Services</label>
        <div className="flex gap-2 mt-1">
          {['Meal', 'Ancillary', 'Shopping'].map(s => (
            <label key={s} className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleService(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="col-span-2 flex gap-2 justify-end mt-2">
        <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}
