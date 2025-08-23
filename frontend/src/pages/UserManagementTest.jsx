import React, { useState, useEffect } from 'react'
import * as userService from '../services/userService'
import authService from '../services/authService'

export default function UserManagementTest() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [authData, setAuthData] = useState(null)

  // Auto login with admin credentials for testing
  useEffect(() => {
    async function autoLogin() {
      try {
        const result = await authService.login('admin1', 'adminpass')
        authService.setToken(result.token)
        setToken(result.token)
        setAuthData(result)
        console.log('Auto-login successful:', result)
      } catch (err) {
        console.error('Auto-login failed:', err)
        setError('Auto-login failed: ' + err.message)
      }
    }
    autoLogin()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setError('')
    try {
      console.log('Loading users...')
      const data = await userService.list()
      console.log('Users loaded:', data)
      setUsers(data || [])
    } catch (err) {
      console.error('Failed to load users:', err)
      setError('Failed to load users: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadUsers()
    }
  }, [token])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management Test</h1>
      
      {/* Authentication Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
        {authData && (
          <div>
            <p><strong>Username:</strong> {authData.user?.username || authData.username}</p>
            <p><strong>Role:</strong> {authData.user?.role || authData.role}</p>
            <p><strong>Name:</strong> {authData.user?.name || authData.name}</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Users List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Users ({users.length})</h2>
            <p className="text-gray-600">System users and their roles</p>
          </div>
          <button 
            onClick={loadUsers}
            disabled={loading || !token}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 mb-3">No users found</div>
            <button 
              onClick={loadUsers}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {Array.isArray(user.role) ? user.role.join(', ') : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.flightId || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Information</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify({ 
            tokenPresent: !!token,
            userCount: users.length,
            firstUser: users[0] || null,
            authData: authData 
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
