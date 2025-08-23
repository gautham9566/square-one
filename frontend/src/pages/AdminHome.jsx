import { Outlet } from 'react-router-dom'
import Layout from '../components/Layout'
import AdminDashboard from '../features/admin/AdminDashboard'

export default function AdminHome() {
  // Example admin user - in real app this would come from auth context/state
  const adminUser = {
    name: "John Smith",
    role: "Administrator"
  };

  return (
    <Layout title="Admin Dashboard" showNavigation={true} user={adminUser}>
      <AdminDashboard />
      <Outlet />
    </Layout>
  )
}
