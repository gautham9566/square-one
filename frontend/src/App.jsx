import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Eager load only critical components (Login page)
import Login from './pages/Login'

// Lazy load all other components to reduce initial bundle size
const AdminHome = lazy(() => import('./pages/AdminHome'))
const ManagePassengers = lazy(() => import('./features/admin/ManagePassengers'))
const ManageFlights = lazy(() => import('./features/admin/ManageFlights'))
const ManageRoutes = lazy(() => import('./features/admin/ManageRoutes'))
const PassengerDetailsAdmin = lazy(() => import('./features/admin/PassengerDetails'))
const FlightDetails = lazy(() => import('./features/admin/FlightDetails'))
const TravelHistory = lazy(() => import('./features/admin/TravelHistory'))
const ManageUsers = lazy(() => import('./features/admin/ManageUsers'))
const UserDetails = lazy(() => import('./features/admin/UserDetails'))
const SystemMonitor = lazy(() => import('./features/admin/SystemMonitor'))
const StaffHome = lazy(() => import('./pages/StaffHome'))
const PassengerHome = lazy(() => import('./features/passenger/PassengerHome'))
const PassengerBooking = lazy(() => import('./features/passenger/PassengerBooking'))
const PassengerConfirmation = lazy(() => import('./features/passenger/PassengerConfirmation'))
const InflightService = lazy(() => import('./features/staff/InflightService/InflightService'))
const PassengerDetailsPage = lazy(() => import('./features/staff/InflightService/PassengerDetailsPage'))
const CheckIn = lazy(() => import('./features/staff/CheckIn/CheckIn'))
const StaffFlightDetails = lazy(() => import('./features/staff/CheckIn/FlightDetails'))
const PassengerDetails = lazy(() => import('./features/staff/CheckIn/PassengerDetails'))
const DemoPage = lazy(() => import('./pages/DemoPage'))
const UserManagementTest = lazy(() => import('./pages/UserManagementTest'))
const TestRoutesPage = lazy(() => import('./pages/TestRoutesPage'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
)

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </div>
  )
}
