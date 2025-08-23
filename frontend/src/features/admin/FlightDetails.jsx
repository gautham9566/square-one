import { useParams, useNavigate } from 'react-router-dom'
import { findById, create, update, remove } from '../../services/flightService'
import { listActive as listActiveRoutes } from '../../services/routeService'
import { useState, useEffect } from 'react'
import * as userService from '../../services/userService'

export default function FlightDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const [found, setFound] = useState(null)
  const [allRoutes, setAllRoutes] = useState([])

  useEffect(() => {
    let mounted = true
    if (id && id !== 'new') {
      findById(id).then(f => { if (mounted) setFound(f) }).catch(() => { if (mounted) setFound(null) })
    }
    return () => { mounted = false }
  }, [id])
  // helper to normalize various time formats ("08:00 AM", "8:00", "20:00") to "HH:MM" for input[type=time]
  function to24(t) {
    if (!t) return ''
    const s = String(t).trim()
    const ampm = s.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/)
    if (ampm) {
      let h = Number(ampm[1])
      const m = ampm[2]
      const ap = ampm[3].toUpperCase()
      if (ap === 'PM' && h !== 12) h += 12
      if (ap === 'AM' && h === 12) h = 0
      return `${String(h).padStart(2, '0')}:${m}`
    }
    const simple = s.match(/^(\d{1,2}):(\d{2})$/)
    if (simple) return `${String(Number(simple[1])).padStart(2, '0')}:${simple[2]}`
    return ''
  }

  const initialState = found ? {
    ...found,
    departureTime: to24(found.departureTime),
    arrivalTime: to24(found.arrivalTime),
    inflightStaff: found && found.inflightStaff ? (Array.isArray(found.inflightStaff) ? found.inflightStaff : [found.inflightStaff]) : []
  } : { name: '', route: '', date: '', departureTime: '', arrivalTime: '', totalSeats: '', availableSeats: '', inflightStaff: [], services: [] }
  const [f, setF] = useState(initialState)

  useEffect(() => {
    // when found changes (after async fetch), update form state
    setF(found ? {
      ...found,
      departureTime: to24(found.departureTime),
      arrivalTime: to24(found.arrivalTime),
      inflightStaff: found && found.inflightStaff ? (Array.isArray(found.inflightStaff) ? found.inflightStaff : [found.inflightStaff]) : []
    } : { name: '', route: '', date: '', departureTime: '', arrivalTime: '', totalSeats: '', availableSeats: '', inflightStaff: [], services: [] })
  }, [found])

  // load all routes from routes table
  useEffect(() => {
    let mounted = true
    async function loadRoutes() {
      try {
        console.log('Loading routes...')
        const routes = await listActiveRoutes()
        console.log('Loaded routes:', routes)
        if (!mounted) return
        setAllRoutes(routes || [])
      } catch (err) {
        console.error('Failed to load routes', err)
        if (mounted) setAllRoutes([])
      }
    }
    loadRoutes()
    return () => { mounted = false }
  }, [])

  async function save() {
    // Basic validation
    if (!f.name || !f.name.trim()) {
      alert('Flight name is required')
      return
    }
    if (!f.date) {
      alert('Flight date is required')
      return
    }
    if (!f.totalSeats || parseInt(f.totalSeats) <= 0) {
      alert('Total seats must be a positive number')
      return
    }
    if (!f.availableSeats || parseInt(f.availableSeats) < 0) {
      alert('Available seats must be a non-negative number')
      return
    }
    if (parseInt(f.availableSeats) > parseInt(f.totalSeats)) {
      alert('Available seats cannot exceed total seats')
      return
    }

    try {
      if (f.id) {
        await update(f.id, f)
      } else {
        await create(f)
      }
      nav('/admin/flights')
    } catch (e) {
      console.error('Save failed', e)

      // Parse error message for better user feedback
      let errorMessage = 'Failed to save flight. Please try again.'
      try {
        const errorData = JSON.parse(e.message)
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (parseErr) {
        // Use default message if parsing fails
      }

      alert(errorMessage)
    }
  }

  async function del() { if (f.id) await remove(f.id); nav('/admin/flights') }

  function toggleService(s) {
    setF(prev => ({ ...prev, services: prev.services && prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...(prev.services||[]), s] }))
  }

  // add-service UI state
  const [selectedService, setSelectedService] = useState('')
  const [mealType, setMealType] = useState('Veg')
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  // inflight staff add UI
  const [selectedStaff, setSelectedStaff] = useState('')
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    let mounted = true
    async function loadUsers() {
      try {
        const users = await userService.listStaff()
        if (!mounted) return
        setAllUsers(users || [])
      } catch (err) { console.error('Failed to load users', err) }
    }
    loadUsers()
    return () => { mounted = false }
  }, [])

  function addService() {
    if (!selectedService) return
    let label = selectedService
    if (selectedService === 'Ancillary') {
      if (!serviceName) return
      label = `Ancillary: ${serviceName} ($${servicePrice || 0})`
    } else if (selectedService === 'Meal') {
      if (!serviceName) return
      label = `Meal (${mealType}): ${serviceName} ($${servicePrice || 0})`
    } else if (selectedService === 'Shopping') {
      if (!serviceName) return
      label = `Shopping: ${serviceName} ($${servicePrice || 0})`
    }
    setF(prev => ({ ...prev, services: [...(prev.services||[]), label] }))
    // reset add-service fields
    setSelectedService('')
    setMealType('Veg')
    setServiceName('')
    setServicePrice('')
  }

  function removeServiceAt(idx) {
    setF(prev => ({ ...prev, services: (prev.services||[]).filter((_, i) => i !== idx) }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {f.id ? 'Edit Flight' : 'Add New Flight'}
              </h1>
              <p className="text-gray-600 mt-1">
                {f.id ? `Flight: ${f.name || 'Unnamed'}` : 'Create a new flight schedule'}
              </p>
              {f.route && (
                <p className="text-sm text-blue-600 mt-1">Route: {f.route}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => nav('/admin/flights')} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={save} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {f.id ? 'Update Flight' : 'Create Flight'}
              </button>
              {f.id && (
                <button 
                  onClick={del} 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Flight Information Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flight Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Name *
              </label>
              <input 
                type="text"
                value={f.name} 
                onChange={e => setF(prev => ({ ...prev, name: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Enter flight name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route *
              </label>
              <select
                value={f.route}
                onChange={e => setF(prev => ({ ...prev, route: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select route</option>
                {allRoutes.map(route => (
                  <option key={route.routeCode} value={route.routeCode}>
                    {route.routeCode} - {route.departureCity} ({route.departureAirport}) → {route.arrivalCity} ({route.arrivalAirport})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Date *
              </label>
              <input 
                type="date" 
                value={f.date || ''} 
                onChange={e => setF(prev => ({ ...prev, date: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Seats *
              </label>
              <input
                type="number"
                min="0"
                value={f.totalSeats || ''}
                onChange={e => setF(prev => ({ ...prev, totalSeats: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter total seats"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Seats *
              </label>
              <input
                type="number"
                min="0"
                value={f.availableSeats || ''}
                onChange={e => setF(prev => ({ ...prev, availableSeats: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter available seats"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Time
              </label>
              <input 
                type="time" 
                value={f.departureTime || ''} 
                onChange={e => setF(prev => ({ ...prev, departureTime: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Time
              </label>
              <input 
                type="time" 
                value={f.arrivalTime || ''} 
                onChange={e => setF(prev => ({ ...prev, arrivalTime: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>
        </div>
        {/* Staff Assignment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inflight Staff Assignment</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Staff Member
                </label>
                <select 
                  value={selectedStaff} 
                  onChange={e => setSelectedStaff(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select staff to add</option>
                  {allUsers.filter(u => u.role === 'inflightStaff').map(u => (
                    <option key={u.username} value={u.username}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  type="button" 
                  onClick={() => {
                    if (!selectedStaff) return
                    if ((f.inflightStaff||[]).includes(selectedStaff)) return
                    setF(prev => ({ ...prev, inflightStaff: [...(prev.inflightStaff||[]), selectedStaff] }))
                    setSelectedStaff('')
                  }} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Staff
                </button>
              </div>
            </div>
            
            {/* Assigned staff list */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Assigned Staff</h3>
              {(f.inflightStaff || []).length === 0 ? (
                <p className="text-sm text-gray-500 italic">No staff assigned yet</p>
              ) : (
                (f.inflightStaff || []).map((u, idx) => {
                  const user = allUsers.find(x => x.username === u)
                  return (
                    <div key={u} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {user?.name ? user.name.charAt(0).toUpperCase() : u.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user ? user.name : u}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setF(prev => ({ ...prev, inflightStaff: (prev.inflightStaff||[]).filter((_, i) => i !== idx) }))} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        {/* Services */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flight Services</h2>
          
          {/* Basic services checkboxes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Services</h3>
            <div className="flex flex-wrap gap-4">
              {['Ancillary', 'Meal', 'Shopping'].map(s => (
                <label key={s} className="inline-flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={(f.services||[]).includes(s)} 
                    onChange={() => toggleService(s)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Add custom service section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Custom Service</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select 
                    value={selectedService} 
                    onChange={e => setSelectedService(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select service</option>
                    <option value="Ancillary">Ancillary</option>
                    <option value="Meal">Meal</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
                
                {/* Conditional fields based on service type */}
                {selectedService === 'Meal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Type
                    </label>
                    <select 
                      value={mealType} 
                      onChange={e => setMealType(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                    </select>
                  </div>
                )}
                
                {selectedService && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {selectedService === 'Meal' ? 'Dish Name' : 
                         selectedService === 'Shopping' ? 'Product Name' : 'Service Name'}
                      </label>
                      <input 
                        type="text"
                        placeholder={selectedService === 'Meal' ? 'Enter dish name' : 
                                   selectedService === 'Shopping' ? 'Enter product name' : 'Enter service name'}
                        value={serviceName} 
                        onChange={e => setServiceName(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price" 
                        value={servicePrice} 
                        onChange={e => setServicePrice(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                      />
                    </div>
                  </>
                )}
              </div>
              
              {selectedService && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={addService} 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Service
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Display added custom services */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Services Added</h3>
            {(f.services || []).filter(s => !['Ancillary', 'Meal', 'Shopping'].includes(s)).length === 0 ? (
              <p className="text-sm text-gray-500 italic">No custom services added yet</p>
            ) : (
              <div className="space-y-2">
                {(f.services || []).map((s, i) => {
                  if (['Ancillary', 'Meal', 'Shopping'].includes(s)) return null
                  return (
                    <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="text-sm font-medium text-gray-900">{s}</div>
                      <button 
                        type="button" 
                        onClick={() => removeServiceAt(i)} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
