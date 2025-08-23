import { useNavigate, useLocation } from 'react-router-dom'
import * as passengerService from '../../../services/passengerService'
import * as flightService from '../../../services/flightService'
import { useState, useEffect } from 'react'
import '../../../styles/demo.css'
import Layout from '../../../components/Layout'
import Button from '../../../components/ui/Button'
import Input, { SearchInput } from '../../../components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../../components/ui/Card'
import Badge, { StatusBadge } from '../../../components/ui/Badge'

export default function InflightService() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPassengers, setFilteredPassengers] = useState([])
  const [selectedPassengerId, setSelectedPassengerId] = useState(null)
  const [selectedSubService, setSelectedSubService] = useState({})
  const [flight, setFlight] = useState(null)

  const flightId = state?.flightId || null

  // normalize passenger fields for this view
  useEffect(() => {
    let mounted = true
    async function load() {
      if (!flightId) return
      try {
        const [plist, f] = await Promise.all([
          passengerService.listByFlight(Number(flightId)),
          flightService.findById(Number(flightId))
        ])
        if (!mounted) return
        const list = plist.map((p) => ({
          ...p,
          shoppingRequests: p.shoppingRequests || p.shoppingItems || [],
          ancillaryServices: p.ancillaryServices || p.ancillary || p.services || [],
          specialMeal: p.specialMeal || p.mealName || '',
          mealType: p.mealType || p.mealPreference || '',
          seat: p.seat || ''
        }))
        setFilteredPassengers(list)
        setFlight(f)
      } catch (err) {
        console.error('Failed to load inflight data', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [flightId])

  // find the flight object for seat map rendering
  // flight is supplied from state after load

  // build a quick lookup of passengers by numeric seat row (e.g. 12 from '12A')
  const seatPassengersMap = new Map()
  filteredPassengers.forEach((p) => {
    const row = parseInt((p.seat || '').toString().match(/^\d+/)?.[0], 10)
    if (!isNaN(row)) {
      if (!seatPassengersMap.has(row)) seatPassengersMap.set(row, [])
      seatPassengersMap.get(row).push(p)
    }
  })

  const handleBack = () => {
    // go back to staff landing
    navigate('/staff')
  }

  const handleAddAncillary = (passengerId) => {
    const item = window.prompt('Enter ancillary service to add (e.g. Extra Pillow)')
    if (!item) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, ancillaryServices: [...(p.ancillaryServices || []), item] } : p
      )
    )
  }

  const handleChangeMeal = (passengerId) => {
    const meal = window.prompt('Enter new meal name (e.g. Vegetarian Biryani)')
    if (meal === null) return
    setFilteredPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, specialMeal: meal } : p))
    )
  }

  const handleAddShopping = (passengerId) => {
    const item = window.prompt('Enter shopping item to add (e.g. Headphones)')
    if (!item) return
    setFilteredPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, shoppingRequests: [...(p.shoppingRequests || []), item] } : p
      )
    )
  }

  const searchResults = filteredPassengers.filter((passenger) =>
    (passenger.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (passenger.seat || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Example staff user - in real app this would come from auth context/state
  const staffUser = {
    name: "Emma Davis",
    role: "Inflight Staff"
  };

  return (
    <Layout title="Inflight Service Management" showNavigation={true} user={staffUser}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            ← Back
          </Button>
        </div>
        <div className="space-y-6">
          {flight && (
            <Card>
              <CardHeader>
                <CardTitle>Seat Map - {flight.name}</CardTitle>
                <CardDescription>Visual overview of passenger seating and meal preferences</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {flight.seatMap?.map((s) => {
                    const assigned = seatPassengersMap.get(s.number) || []
                    const first = assigned[0]
                    let colorClass = ''
                    if (assigned.length > 0 && first) {
                      const mt = (first.mealType || '').toString().toLowerCase()
                      if (mt.includes('veg')) colorClass = 'bg-green-400 text-white'
                      else if (mt.includes('non')) colorClass = 'bg-red-400 text-white'
                      else colorClass = 'bg-yellow-200'
                    } else if (s.isBooked) {
                      colorClass = 'bg-gray-200'
                    } else {
                      colorClass = 'bg-white border-2 border-dashed border-gray-300'
                    }

                    const title = assigned.length > 0
                      ? `${assigned.map((a) => a.name).join(', ')} - ${assigned.map((a) => a.mealType || a.specialMeal || 'Unknown').join(', ')}`
                      : s.isBooked
                      ? 'Booked (no passenger data)'
                      : 'Available'

                    const smallText = assigned.length > 0
                      ? (first.mealType || first.specialMeal || 'Unknown')
                      : s.isBooked
                      ? 'Booked'
                      : 'Free'

                    return (
                      <div
                        key={s.number}
                        title={title}
                        className={`border border-neutral-300 px-2 py-3 rounded text-center text-sm cursor-pointer hover:shadow-md transition-shadow ${colorClass}`}
                      >
                        <div className="font-semibold">{s.number}</div>
                        <div className="text-xs">{smallText}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span>Vegetarian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span>Non-Vegetarian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded border"></div>
                    <span>Other/Unknown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-dashed border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Passenger Management</CardTitle>
              <CardDescription>Search and manage passenger services</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="mb-6">
                <SearchInput
                  placeholder="Search by passenger name or seat number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left p-4 font-medium text-neutral-700">Passenger</th>
                      <th className="text-left p-4 font-medium text-neutral-700">Seat</th>
                      <th className="text-left p-4 font-medium text-neutral-700">Special Meal</th>
                      <th className="text-left p-4 font-medium text-neutral-700">Ancillary Services</th>
                      <th className="text-left p-4 font-medium text-neutral-700">Shopping Requests</th>
                      <th className="text-left p-4 font-medium text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((passenger) => (
                      <tr key={passenger.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="p-4">
                          <button
                            className="text-flight-primary hover:underline font-medium"
                            onClick={() => navigate(`/inflight-service/passenger/${passenger.id}`, { state: { passenger, flightId: passenger.flightId } })}
                          >
                            {passenger.name}
                          </button>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" size="sm">{passenger.seat || 'No seat'}</Badge>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={passenger.specialMeal ? 'Completed' : 'Pending'}>
                            {passenger.specialMeal || 'Standard'}
                          </StatusBadge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-neutral-600">
                            {passenger.ancillaryServices && passenger.ancillaryServices.length > 0
                              ? passenger.ancillaryServices.join(', ')
                              : 'None'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-neutral-600">
                            {passenger.shoppingRequests && passenger.shoppingRequests.length > 0
                              ? passenger.shoppingRequests.join(', ')
                              : 'None'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              size="xs" 
                              variant="outline"
                              onClick={() => handleAddAncillary(passenger.id)}
                            >
                              Add Service
                            </Button>
                            <Button 
                              size="xs" 
                              variant="outline"
                              onClick={() => handleChangeMeal(passenger.id)}
                            >
                              Change Meal
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-neutral-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-lg">No passengers found</p>
                    <p className="text-sm">Try adjusting your search criteria.</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
