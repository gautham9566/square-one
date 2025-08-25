import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as service from '../../services/userService'
import authService from '../../services/authService'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Ensure authentication is available
  useEffect(() => {
    async function ensureAuth() {
      const token = authService.getToken()
      if (!token) {
        // Auto-login with admin credentials for demo purposes
        try {
          const result = await authService.login('admin1', 'adminpass')
          authService.setToken(result.token)
          console.log('Auto-authenticated for user management')
        } catch (err) {
          console.error('Auto-authentication failed:', err)
        }
      }
      setAuthChecked(true)
    }
    ensureAuth()
  }, [])

  async function load() {
    if (!authChecked) return
    
    setLoading(true)
    try {
      console.log('Loading users...')
      const data = await service.list()
      console.log('Users loaded:', data)
      setUsers(data)
    } catch (err) {
      console.error('Failed to load users', err)
      setUsers([])
      alert('Failed to load users: ' + err.message)
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { 
    if (authChecked) {
      load() 
    }
  }, [authChecked])

  const displayed = roleFilter === 'All' ? users : users.filter(u => u.role === roleFilter)

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage staff accounts and permissions</p>
            </div>
            <Link 
              to="/admin/users/new" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add User
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Role:</label>
              <select 
                value={roleFilter} 
                onChange={e => setRoleFilter(e.target.value)} 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>admin</option>
                <option>inflightStaff</option>
                <option>checkinStaff</option>
                <option>passenger</option>
              </select>
            </div>
            <button 
              onClick={load} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="text-gray-600">System users and their roles</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 mb-3">No users found</div>
              <Link 
                to="/admin/users/new"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create First User
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayed.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/admin/users/${u.username}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {u.username}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {Array.isArray(u.role) ? u.role.join(', ') : u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/admin/users/${u.username}`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
