import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import AdminDashboard from '../features/admin/AdminDashboard'
import authService from '../services/authService'

export default function AdminHome() {
  const [user, setUser] = useState({
    name: "Loading...",
    role: "admin"
  });

  useEffect(() => {
    // Get user information from token or stored location state
    const getUserInfo = () => {
      const token = authService.getToken();
      
      // Try to get user info from navigation state first
      const storedState = window.history.state?.usr;
      if (storedState && storedState.name) {
        setUser({
          name: storedState.name,
          role: storedState.role || 'admin'
        });
        return;
      }

      // Try to get user info from JWT token
      if (token) {
        const tokenPayload = authService.parseJwt(token);
        if (tokenPayload) {
          setUser({
            name: tokenPayload.name || tokenPayload.sub || 'Admin User',
            role: tokenPayload.role || 'admin'
          });
          return;
        }
      }

      // Try to get stored user info from localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          setUser({
            name: userInfo.name || userInfo.username || 'Admin User',
            role: userInfo.role || 'admin'
          });
          return;
        } catch (e) {
          console.error('Failed to parse stored user info', e);
        }
      }

      // Fallback - try to authenticate with admin credentials
      const autoAuth = async () => {
        try {
          const result = await authService.login('admin1', 'adminpass');
          authService.setToken(result.token);
          setUser({
            name: result.user?.name || result.name || 'Alice',
            role: result.user?.role || result.role || 'admin'
          });
          // Store user info for future use
          localStorage.setItem('userInfo', JSON.stringify({
            name: result.user?.name || result.name || 'Alice',
            role: result.user?.role || result.role || 'admin',
            username: result.user?.username || result.username || 'admin1'
          }));
        } catch (err) {
          console.error('Auto-authentication failed:', err);
          setUser({
            name: "Admin User",
            role: "admin"
          });
        }
      };

      autoAuth();
    };

    getUserInfo();
  }, []);

  return (
    <Layout title="Admin Dashboard" showNavigation={true} user={user}>
      <AdminDashboard />
      <Outlet />
    </Layout>
  )
}
