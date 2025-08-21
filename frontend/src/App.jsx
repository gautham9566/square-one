import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import ManagePassengers from './admin/ManagePassengers'
import ManageFlights from './admin/ManageFlights'
import ManageRoutes from './admin/ManageRoutes'
import PassengerDetailsAdmin from './admin/PassengerDetails'
import FlightDetails from './admin/FlightDetails'
import StaffHome from './pages/StaffHome'
import PassengerHome from './pages/PassengerHome'
import PassengerBooking from './pages/PassengerBooking'
import PassengerConfirmation from './pages/PassengerConfirmation'
import InflightService from './staff/InflightService/InflightService'
import PassengerDetailsPage from './staff/InflightService/PassengerDetailsPage'
import CheckIn from './staff/CheckIn/CheckIn'
import StaffFlightDetails from './staff/CheckIn/FlightDetails'
import PassengerDetails from './staff/CheckIn/PassengerDetails'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-4 bg-white shadow">
        <div className="container mx-auto flex gap-4">
          <Link to="/" className="text-indigo-600 font-medium">Login</Link>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminHome />}>
            <Route index element={<div className="p-4 bg-white rounded">Select an admin area from above.</div>} />
            <Route path="passengers" element={<ManagePassengers />} />
            <Route path="passengers/:name" element={<PassengerDetailsAdmin />} />
            <Route path="flights" element={<ManageFlights />} />
            <Route path="flights/new" element={<FlightDetails />} />
            <Route path="flights/:id" element={<FlightDetails />} />
            <Route path="routes" element={<ManageRoutes />} />
          </Route>
          <Route path="/staff" element={<StaffHome />} />
          {/* Passenger routes */}
          <Route path="/passenger" element={<PassengerHome />} />
          <Route path="/passenger/book" element={<PassengerBooking />} />
          <Route path="/passenger/confirm" element={<PassengerConfirmation />} />
          {/* Staff check-in routes used by CheckIn and FlightDetails components */}
          <Route path="/staff/check-in" element={<CheckIn />} />
          <Route path="/staff/check-in/:flightId" element={<StaffFlightDetails />} />
          <Route path="/staff/check-in/:flightId/:username" element={<PassengerDetails />} />
          <Route path="/inflight-service" element={<InflightService />} />
          <Route path="/inflight-service/passenger/:id" element={<PassengerDetailsPage />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/checkin/:flightId" element={<StaffFlightDetails />} />
          <Route path="/checkin/:flightId/:username" element={<PassengerDetails />} />
        </Routes>
      </main>
    </div>
  )
}
