import { useState, useEffect } from 'react'

export default function PassengerDetails({ passenger, flight, onClose, onUpdate }) {
  const [selectedSubService, setSelectedSubService] = useState({})
  const [availableServices, setAvailableServices] = useState([])

  useEffect(() => {
  if (!passenger || !flight) return
  // show all services for the flight
  const avail = (flight.services || [])
  setAvailableServices(avail)

  // pre-populate selected subservice values from passenger data
  const pre = {}
  if (passenger.specialMeal) pre.mealName = passenger.specialMeal
  if (passenger.ancillaryServices && passenger.ancillaryServices.length) pre.ancillaryItem = passenger.ancillaryServices[0]
  if (passenger.shoppingRequests && passenger.shoppingRequests.length) pre.shoppingItems = passenger.shoppingRequests
  setSelectedSubService(pre)
  }, [passenger, flight])

  if (!passenger) return null

  const handleAddService = (service) => {
    let updated = { ...passenger }
    if (service === 'Meal') {
      const mealName = selectedSubService.mealName || window.prompt('Enter meal name:') || 'N/A'
      updated = { ...updated, specialMeal: mealName }
    } else if (service === 'Ancillary') {
      // support selected subtype key 'ancillaryItem' or fallback to text input
      const item = selectedSubService.ancillaryItem || selectedSubService.extraBaggage || window.prompt('Enter ancillary item:')
      if (!item) return
      updated = { ...updated, ancillaryServices: [...(updated.ancillaryServices || []), item] }
    } else if (service === 'Shopping') {
      // shoppingItems can be an array (from multi-select) or string (from input)
      let items = []
      if (Array.isArray(selectedSubService.shoppingItems)) {
        items = selectedSubService.shoppingItems
      } else if (typeof selectedSubService.shoppingItems === 'string' && selectedSubService.shoppingItems.length) {
        items = selectedSubService.shoppingItems.split(',')
      } else {
        items = window.prompt('Enter shopping items (comma-separated)')?.split(',') || []
      }
      updated = { ...updated, shoppingRequests: [...(updated.shoppingRequests || []), ...items.map(i => i.trim()).filter(Boolean)] }
    }

    onUpdate && onUpdate(updated)
    setSelectedSubService({})
  }

  const handleDeleteService = (service, value) => {
    let updated = { ...passenger }
    if (service === 'Meal') {
      updated.specialMeal = null
    } else if (service === 'Ancillary') {
      updated.ancillaryServices = (updated.ancillaryServices || []).filter(a => a !== value)
    } else if (service === 'Shopping') {
      updated.shoppingRequests = (updated.shoppingRequests || []).filter(s => s !== value)
    }
    onUpdate && onUpdate(updated)
  }

  const handleEditService = (service, value) => {
    if (service === 'Meal') setSelectedSubService({ ...selectedSubService, mealName: value })
    if (service === 'Ancillary') setSelectedSubService({ ...selectedSubService, ancillaryItem: value })
    if (service === 'Shopping') setSelectedSubService({ ...selectedSubService, shoppingItems: [value] })
  }

  return (
    <div className="mt-6 p-4 border rounded bg-white">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Passenger Details — {passenger.name}</h3>
        <div>
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Phone:</strong> {passenger.phoneNumber || 'N/A'}</p>
          <p><strong>Seat:</strong> {passenger.seat || 'N/A'}</p>
          <p><strong>From:</strong> {passenger.from || 'N/A'}</p>
          <p><strong>To:</strong> {passenger.to || 'N/A'}</p>
        </div>
        <div>
          <h4 className="font-medium">Services Availed</h4>
          <ul className="list-disc pl-6">
            {(passenger.ancillaryServices || []).map((a, i) => (
              <li key={`a${i}`} className="flex items-center gap-2">Ancillary: {a}
                <button onClick={() => handleEditService('Ancillary', a)} className="ml-2 text-sm text-indigo-600">Edit</button>
                <button onClick={() => handleDeleteService('Ancillary', a)} className="ml-2 text-sm text-red-600">Delete</button>
              </li>
            ))}
            {passenger.specialMeal && (
              <li className="flex items-center gap-2">Meal: {passenger.specialMeal}
                <button onClick={() => handleEditService('Meal', passenger.specialMeal)} className="ml-2 text-sm text-indigo-600">Edit</button>
                <button onClick={() => handleDeleteService('Meal')} className="ml-2 text-sm text-red-600">Delete</button>
              </li>
            )}
            {(passenger.shoppingRequests || []).map((s, i) => (
              <li key={`s${i}`} className="flex items-center gap-2">Shopping: {s}
                <button onClick={() => handleEditService('Shopping', s)} className="ml-2 text-sm text-indigo-600">Edit</button>
                <button onClick={() => handleDeleteService('Shopping', s)} className="ml-2 text-sm text-red-600">Delete</button>
              </li>
            ))}
            {(!(passenger.ancillaryServices && passenger.ancillaryServices.length) && !passenger.specialMeal && !(passenger.shoppingRequests && passenger.shoppingRequests.length)) && <li>None</li>}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Add Service</h4>
        {availableServices.length === 0 && <div className="text-sm">No additional services available for this passenger.</div>}
        {availableServices.map((service) => (
          <div key={service} className="mb-3 p-3 border rounded bg-slate-50">
            <div className="flex items-start gap-4">
              <div className="w-1/3">
                <strong className="block">{service}</strong>
                <div className="text-sm text-slate-600 mt-1">
                  {service === 'Meal' && (passenger.specialMeal ? `Availed: ${passenger.specialMeal}` : 'Not availed')}
                  {service === 'Ancillary' && ((passenger.ancillaryServices && passenger.ancillaryServices.length) ? `Availed: ${passenger.ancillaryServices.join(', ')}` : 'Not availed')}
                  {service === 'Shopping' && ((passenger.shoppingRequests && passenger.shoppingRequests.length) ? `Availed: ${passenger.shoppingRequests.join(', ')}` : 'Not availed')}
                </div>
              </div>
              <div className="w-2/3">
                {(() => {
                  const subtypes = (flight && flight.serviceSubtypes && flight.serviceSubtypes[service]) || []
                  const key = service === 'Meal' ? 'mealName' : service === 'Ancillary' ? 'ancillaryItem' : 'shoppingItems'

                  if (subtypes.length > 0) {
                    if (service === 'Shopping') {
                      return (
                        <div className="mt-0">
                          <label className="block mb-2">
                            <span className="text-sm">Choose shopping items</span>
                            <select
                              multiple
                              value={selectedSubService.shoppingItems || []}
                              onChange={(e) => {
                                const opts = Array.from(e.target.selectedOptions).map(o => o.value)
                                setSelectedSubService({ ...selectedSubService, shoppingItems: opts })
                              }}
                              className="px-3 py-2 border rounded w-full"
                              style={{ maxHeight: '160px' }}
                            >
                              {subtypes.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </label>
                        </div>
                      )
                    }

                    return (
                      <div className="mt-0">
                        <label className="block mb-2">
                          <span className="text-sm">Choose {service} subtype</span>
                          <select
                            value={selectedSubService[key] || ''}
                            onChange={(e) => setSelectedSubService({ ...selectedSubService, [key]: e.target.value })}
                            className="px-3 py-2 border rounded w-full"
                          >
                            <option value="">-- select --</option>
                            {subtypes.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </label>
                      </div>
                    )
                  }

                  // fallback inputs
                  if (service === 'Meal') {
                    return (
                      <div className="mt-0">
                        <label className="block mb-2">
                          <span className="text-sm">Meal Name</span>
                          <input
                            type="text"
                            value={selectedSubService.mealName || ''}
                            onChange={(e) => setSelectedSubService({ ...selectedSubService, mealName: e.target.value })}
                            className="px-3 py-2 border rounded w-full"
                          />
                        </label>
                      </div>
                    )
                  }

                  if (service === 'Ancillary') {
                    return (
                      <div className="mt-0">
                        <label className="block mb-2">
                          <span className="text-sm">Ancillary Item</span>
                          <input
                            type="text"
                            value={selectedSubService.extraBaggage || ''}
                            onChange={(e) => setSelectedSubService({ ...selectedSubService, extraBaggage: e.target.value })}
                            className="px-3 py-2 border rounded w-full"
                          />
                        </label>
                      </div>
                    )
                  }

                  return (
                    <div className="mt-0">
                      <label className="block mb-2">
                        <span className="text-sm">Shopping Items (comma-separated)</span>
                        <input
                          type="text"
                          value={(selectedSubService.shoppingItems || '').toString()}
                          onChange={(e) => setSelectedSubService({ ...selectedSubService, shoppingItems: e.target.value })}
                          className="px-3 py-2 border rounded w-full"
                        />
                      </label>
                    </div>
                  )
                })()}
                <div className="mt-2 flex justify-end">
                  <button onClick={() => handleAddService(service)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add {service}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
