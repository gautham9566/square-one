import { useState, useEffect } from 'react'

export default function PassengerForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: null,
    flightId: initial.flightId || '',
    name: initial.name || '',
    passportNumber: initial.passportNumber || '',
    address: initial.address || '',
    dateOfBirth: initial.dateOfBirth || '',
    origin: initial.origin || initial.from || '',
    destination: initial.destination || initial.to || '',
    services: initial.services || [],
    seat: initial.seat || '',
    phoneNumber: initial.phoneNumber || '',
    checkedIn: initial.checkedIn || false,
    wheelchair: initial.wheelchair || false,
    infant: initial.infant || false,
    extraBaggage: initial.extraBaggage || 0,
    shoppingItems: initial.shoppingItems || [],
  })

  useEffect(() => {
    setForm({
      id: initial.id || null,
      flightId: initial.flightId || '',
      name: initial.name || '',
      passportNumber: initial.passportNumber || '',
      address: initial.address || '',
      dateOfBirth: initial.dateOfBirth || '',
      origin: initial.origin || initial.from || '',
      destination: initial.destination || initial.to || '',
      services: initial.services || [],
      seat: initial.seat || '',
      phoneNumber: initial.phoneNumber || '',
      checkedIn: initial.checkedIn || false,
      wheelchair: initial.wheelchair || false,
      infant: initial.infant || false,
      extraBaggage: initial.extraBaggage || 0,
      shoppingItems: initial.shoppingItems || [],
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
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Fields marked with * are required
      </div>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="block">Name *</label>
        <input 
          value={form.name} 
          onChange={e => change('name', e.target.value)} 
          className="w-full border p-2 rounded" 
          required
        />
      </div>

      <div>
        <label className="block">Flight ID *</label>
        <input 
          value={form.flightId} 
          onChange={e => change('flightId', Number(e.target.value))} 
          className="w-full border p-2 rounded" 
          type="number"
          required
        />
      </div>

      <div>
        <label className="block">Passport Number</label>
        <input value={form.passportNumber} onChange={e => change('passportNumber', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Phone Number</label>
        <input value={form.phoneNumber} onChange={e => change('phoneNumber', e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block">Origin *</label>
        <input 
          value={form.origin} 
          onChange={e => change('origin', e.target.value)} 
          className="w-full border p-2 rounded" 
          maxLength="10"
          required
        />
      </div>

      <div>
        <label className="block">Destination *</label>
        <input 
          value={form.destination} 
          onChange={e => change('destination', e.target.value)} 
          className="w-full border p-2 rounded" 
          maxLength="10"
          required
        />
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
        <input
          value={form.seat}
          onChange={e => change('seat', e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="e.g., 1A, 2B, 3C (leave empty for auto-assignment)"
        />
        <div className="text-xs text-gray-500 mt-1">
          Note: Seats 12A, 14B, 15C are already taken on this flight
        </div>
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

      <div>
        <label className="block">Special Requirements</label>
        <div className="flex flex-col gap-2 mt-1">
          <label className="inline-flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.wheelchair} 
              onChange={e => change('wheelchair', e.target.checked)} 
            />
            <span>Wheelchair Assistance</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.infant} 
              onChange={e => change('infant', e.target.checked)} 
            />
            <span>Traveling with Infant</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.checkedIn} 
              onChange={e => change('checkedIn', e.target.checked)} 
            />
            <span>Already Checked In</span>
          </label>
        </div>
      </div>

      <div className="col-span-2 flex gap-2 justify-end mt-2">
        <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </form>
    </div>
  )
}
