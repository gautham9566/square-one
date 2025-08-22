import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as passengerService from '../../../services/passengerService'
import * as flightService from '../../../services/flightService'

export default function PassengerDetails() {
  const { flightId, username } = useParams()
  const [passenger, setPassenger] = useState(null)
  const [flight, setFlight] = useState(null)
  const [passengerServices, setPassengerServices] = useState([])
  const [availableServices, setAvailableServices] = useState([])
  const [selectedSubService, setSelectedSubService] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const results = await passengerService.searchByName(username)
        const p = results && results.length > 0 ? results[0] : null
        if (!mounted) return
        setPassenger(p)
        if (p && p.flightId) {
          const f = await flightService.findById(p.flightId)
          if (!mounted) return
          setFlight(f)
          const initialServices = (p?.services || []).map(s => typeof s === 'string' ? { type: s } : s)
          setPassengerServices(initialServices)
          setAvailableServices((f?.services || []).filter((service) => !initialServices.some((s) => s.type === service)))
        }
      } catch (err) {
        console.error('Failed to load passenger/flight', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [flightId, username])

  const predefinedPrices = {
    Meal: 15,
    Ancillary: 25,
    Shopping: 50,
  }

  const handleAddService = (service) => {
    if (service === 'Meal') {
      const newSvc = {
        type: 'Meal',
        mealType: selectedSubService.mealType || 'N/A',
        mealName: selectedSubService.mealName || 'N/A',
        price: predefinedPrices.Meal,
      }
      setPassengerServices((prev) => [...prev, newSvc])
    } else if (service === 'Ancillary') {
      const newSvc = {
        type: 'Ancillary',
        extraBaggage: selectedSubService.extraBaggage || 0,
        price: predefinedPrices.Ancillary,
      }
      setPassengerServices((prev) => [...prev, newSvc])
    } else if (service === 'Shopping') {
      const newSvc = {
        type: 'Shopping',
        shoppingItems: selectedSubService.shoppingItems || [],
        price: predefinedPrices.Shopping,
      }
      setPassengerServices((prev) => [...prev, newSvc])
    }
    setAvailableServices((prev) => prev.filter((s) => s !== service))
    setSelectedSubService({})
  }

  if (!passenger) {
    return <div className="p-6">Passenger not found.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Passenger Details</h1>
      <p><strong>Name:</strong> {passenger.name}</p>
      <p><strong>Phone Number:</strong> {passenger.phoneNumber || 'N/A'}</p>
      <p><strong>Address:</strong> {passenger.address || 'N/A'}</p>
      <p><strong>Traveling From:</strong> {passenger.from || 'N/A'}</p>
      <p><strong>Traveling To:</strong> {passenger.to || 'N/A'}</p>
      <p><strong>Seat Assigned:</strong> {passenger.seat}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Services Availed</h2>
        <ul className="list-disc pl-6">
      {passengerServices.map((service, index) => (
            <li key={index} className="mb-2">
        <strong>{service.type || service}</strong>
              {service.type === 'Meal' && (
                <ul className="list-disc pl-6">
                  <li><strong>Type:</strong> {service.mealType}</li>
                  <li><strong>Meal Name:</strong> {service.mealName}</li>
                  <li><strong>Price:</strong> ${service.price}</li>
                </ul>
              )}
              {service.type === 'Ancillary' && (
                <ul className="list-disc pl-6">
                  <li><strong>Extra Baggage:</strong> {service.extraBaggage} kg</li>
                  <li><strong>Price:</strong> ${service.price}</li>
                </ul>
              )}
              {service.type === 'Shopping' && (
                <ul className="list-disc pl-6">
                  <li><strong>Items:</strong> {service.shoppingItems.length > 0 ? service.shoppingItems.join(', ') : 'None'}</li>
                  <li><strong>Price:</strong> ${service.price}</li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Add Service</h2>
        <ul className="list-disc pl-6">
          {availableServices.map((service) => (
            <li key={service} className="mb-4">
              <strong>{service}</strong>
              {service === 'Meal' && (
                <div className="mt-2">
                  <label className="block mb-2">
                    <span className="text-sm">Meal Type</span>
                    <select
                      value={selectedSubService.mealType || ''}
                      onChange={(e) => setSelectedSubService({ ...selectedSubService, mealType: e.target.value })}
                      className="px-4 py-2 border rounded w-full"
                    >
                      <option value="">Select</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </label>
                  <label className="block mb-2">
                    <span className="text-sm">Meal Name</span>
                    <input
                      type="text"
                      value={selectedSubService.mealName || ''}
                      onChange={(e) => setSelectedSubService({ ...selectedSubService, mealName: e.target.value })}
                      className="px-4 py-2 border rounded w-full"
                    />
                  </label>
                </div>
              )}
              {service === 'Ancillary' && (
                <div className="mt-2">
                  <label className="block mb-2">
                    <span className="text-sm">Extra Baggage (kg)</span>
                    <input
                      type="number"
                      value={selectedSubService.extraBaggage || ''}
                      onChange={(e) => setSelectedSubService({ ...selectedSubService, extraBaggage: e.target.value })}
                      className="px-4 py-2 border rounded w-full"
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
                      value={selectedSubService.shoppingItems || ''}
                      onChange={(e) => setSelectedSubService({ ...selectedSubService, shoppingItems: e.target.value.split(',') })}
                      className="px-4 py-2 border rounded w-full"
                    />
                  </label>
                </div>
              )}
              <button
                onClick={() => handleAddService(service)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add {service}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
