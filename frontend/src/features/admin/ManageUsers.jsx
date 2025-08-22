import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as service from '../../services/userService'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const data = await service.list()
      setUsers(data)
    } catch (err) {
      console.error('Failed to load users', err)
      setUsers([])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const displayed = roleFilter === 'All' ? users : users.filter(u => u.role === roleFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <div>
          <Link to="/admin/users/new" className="px-3 py-1 bg-green-600 text-white rounded">Add User</Link>
        </div>
      </div>

      <div className="mb-4 flex gap-3 items-center">
        <label>Role:</label>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border p-2 rounded">
          <option>All</option>
          <option>admin</option>
          <option>staff</option>
          <option>user</option>
        </select>
        <button onClick={load} className="px-3 py-1 bg-indigo-600 text-white rounded">Refresh</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Username</th>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Email</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="p-2"><Link to={`/admin/users/${u.username}`}>{u.username}</Link></td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{Array.isArray(u.role) ? u.role.join(', ') : u.role}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <Link to={`/admin/users/${u.username}`} className="text-indigo-600">Edit</Link>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr><td colSpan={5} className="p-4 text-sm text-gray-600">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
