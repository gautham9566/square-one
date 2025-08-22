import { Outlet } from 'react-router-dom'
import Layout from '../components/Layout'
import AdminDashboard from '../features/admin/AdminDashboard'

export default function AdminHome() {
  return (
    <Layout title="Admin Dashboard" showNavigation={true}>
      <AdminDashboard />
      <Outlet />
    </Layout>
  )
}
