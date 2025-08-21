import { useNavigate, useLocation } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  // show the three buttons only when at the admin root (not on nested /admin/* pages)
  const atAdminRoot = location.pathname.replace(/\/$/, '') === '/admin'

  return (
    <div className="bg-white p-6 rounded shadow">
      {atAdminRoot ? (
        <div className="flex gap-4 mb-6">
          <button onClick={() => navigate('passengers')} className="px-4 py-2 rounded bg-gray-100">Manage Passengers</button>
          <button onClick={() => navigate('flights')} className="px-4 py-2 rounded bg-gray-100">Manage Flights</button>
          <button onClick={() => navigate('routes')} className="px-4 py-2 rounded bg-gray-100">Manage Routes</button>
        </div>
      ) : (
        <div className="mb-4">
          <button onClick={() => navigate('/admin')} className="px-3 py-1 rounded bg-gray-200">Back to Dashboard</button>
        </div>
      )}

      <div className="text-sm text-gray-600">{atAdminRoot ? 'Select an area to manage.' : 'Use the back button to return to the admin dashboard.'}</div>
    </div>
  )
}
