import { useLocation, Outlet } from 'react-router-dom'
import AdminDashboard from '../admin/AdminDashboard'

export default function AdminHome() {
  const { state } = useLocation()
  const name = state?.name || 'Admin'
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome admin {name}</h1>
        <AdminDashboard />
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
