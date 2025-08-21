import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { flights } from '../../data/dummyData'
export default function CheckIn() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [startLocation, setStartLocation] = useState('')
  const [destination, setDestination] = useState('')
  

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch = flight.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = dateFilter ? flight.date === dateFilter : true
    const matchesRoute =
      (startLocation ? flight.route.startsWith(startLocation) : true) &&
      (destination ? flight.route.endsWith(destination) : true)
    return matchesSearch && matchesDate && matchesRoute
  })

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleBack} className="text-indigo-600 hover:text-indigo-800">
          ←
        </button>
        <h1 className="text-2xl font-semibold">Check-In Page</h1>
      </div>
      <div className="flex flex-col gap-4 mb-6 w-full max-w-3xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search flights..."
          className="px-4 py-2 border rounded"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <div className="flex gap-4 items-center">
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700">Start Location</span>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Start location"
              className="w-full px-4 py-2 border rounded"
            />
          </label>
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700">Destination</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="w-full px-4 py-2 border rounded"
            />
          </label>
        </div>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className="p-4 border rounded shadow bg-white cursor-pointer"
            onClick={() => navigate(`/staff/check-in/${flight.id}`)}
          >
            <h2 className="text-lg font-semibold mb-2">{flight.name}</h2>
            <p className="text-sm text-gray-600">Date: {flight.date}</p>
            <p className="text-sm text-gray-600">Route: {flight.route}</p>
            <p className="text-sm text-gray-600">Departure: {flight.departureTime}</p>
            <p className="text-sm text-gray-600">Arrival: {flight.arrivalTime}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
