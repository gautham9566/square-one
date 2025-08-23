import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import ManagePassengers from './features/admin/ManagePassengers'
import ManageFlights from './features/admin/ManageFlights'
import ManageRoutes from './features/admin/ManageRoutes'
import PassengerDetailsAdmin from './features/admin/PassengerDetails'
import FlightDetails from './features/admin/FlightDetails'
import TravelHistory from './features/admin/TravelHistory'
import ManageUsers from './features/admin/ManageUsers'
import UserDetails from './features/admin/UserDetails'
import SystemMonitor from './features/admin/SystemMonitor'
import StaffHome from './pages/StaffHome'
import PassengerHome from './features/passenger/PassengerHome'
import PassengerBooking from './features/passenger/PassengerBooking'
import PassengerConfirmation from './features/passenger/PassengerConfirmation'
import InflightService from './features/staff/InflightService/InflightService'
import PassengerDetailsPage from './features/staff/InflightService/PassengerDetailsPage'
import CheckIn from './features/staff/CheckIn/CheckIn'
import StaffFlightDetails from './features/staff/CheckIn/FlightDetails'
import PassengerDetails from './features/staff/CheckIn/PassengerDetails'
import DemoPage from './pages/DemoPage'
import UserManagementTest from './pages/UserManagementTest'
import TestRoutesPage from './pages/TestRoutesPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/test-users" element={<UserManagementTest />} />
        <Route path="/test-routes" element={<TestRoutesPage />} />
        <Route path="/admin" element={<AdminHome />}>
          <Route path="passengers" element={<ManagePassengers />} />
          <Route path="passengers/:name" element={<PassengerDetailsAdmin />} />
          <Route path="passengers/:flightId/passengerlist" element={<ManagePassengers />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="flights/new" element={<FlightDetails />} />
          <Route path="flights/:id" element={<FlightDetails />} />
          <Route path="routes" element={<ManageRoutes />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="users/new" element={<UserDetails />} />
          <Route path="users/:username" element={<UserDetails />} />
          <Route path="travel-history" element={<TravelHistory />} />
          <Route path="system-monitor" element={<SystemMonitor />} />
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
    </div>
  )
}
