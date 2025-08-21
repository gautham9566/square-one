import { useState, useEffect } from 'react'

export default function PassengerDetails({ passenger, flight, onClose, onUpdate }) {
  const [selectedSubService, setSelectedSubService] = useState({})
  const [availableServices, setAvailableServices] = useState([])

  useEffect(() => {
    if (!passenger || !flight) return
    const avail = (flight.services || []).filter((service) => {
      if (service === 'Meal') return !passenger.specialMeal
      if (service === 'Ancillary') return !(passenger.ancillaryServices && passenger.ancillaryServices.length > 0)
      if (service === 'Shopping') return !(passenger.shoppingRequests && passenger.shoppingRequests.length > 0)
      return true
    })
    setAvailableServices(avail)
  }, [passenger, flight])

  if (!passenger) return null

  const handleAddService = (service) => {
    let updated = { ...passenger }
    if (service === 'Meal') {
      const mealName = selectedSubService.mealName || window.prompt('Enter meal name:') || 'N/A'
      updated = { ...updated, specialMeal: mealName }
    } else if (service === 'Ancillary') {
      const item = selectedSubService.extraBaggage || window.prompt('Enter ancillary item:')
      if (!item) return
      updated = { ...updated, ancillaryServices: [...(updated.ancillaryServices || []), item] }
    } else if (service === 'Shopping') {
      const items = selectedSubService.shoppingItems || window.prompt('Enter shopping items (comma-separated)')?.split(',') || []
      updated = { ...updated, shoppingRequests: [...(updated.shoppingRequests || []), ...items.map(i => i.trim()).filter(Boolean)] }
    }

    onUpdate && onUpdate(updated)
    setSelectedSubService({})
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
            {(passenger.ancillaryServices || []).map((a, i) => <li key={`a${i}`}>Ancillary: {a}</li>)}
            {passenger.specialMeal && <li>Meal: {passenger.specialMeal}</li>}
            {(passenger.shoppingRequests || []).map((s, i) => <li key={`s${i}`}>Shopping: {s}</li>)}
            {(!(passenger.ancillaryServices && passenger.ancillaryServices.length) && !passenger.specialMeal && !(passenger.shoppingRequests && passenger.shoppingRequests.length)) && <li>None</li>}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Add Service</h4>
        {availableServices.length === 0 && <div className="text-sm">No additional services available for this passenger.</div>}
        {availableServices.map((service) => (
          <div key={service} className="mb-3">
            <strong>{service}</strong>
            {service === 'Meal' && (
              <div className="mt-2">
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
            )}
            {service === 'Ancillary' && (
              <div className="mt-2">
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
            )}
            {service === 'Shopping' && (
              <div className="mt-2">
                <label className="block mb-2">
                  <span className="text-sm">Shopping Items (comma-separated)</span>
                  <input
                    type="text"
                    value={(selectedSubService.shoppingItems || '').toString()}
                    onChange={(e) => setSelectedSubService({ ...selectedSubService, shoppingItems: e.target.value.split(',') })}
                    className="px-3 py-2 border rounded w-full"
                  />
                </label>
              </div>
            )}
            <div className="mt-2">
              <button onClick={() => handleAddService(service)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add {service}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
