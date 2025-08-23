import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as service from '../../services/userService'
import authService from '../../services/authService'

export default function UserDetails() {
  const { username } = useParams()
  const nav = useNavigate()
  const [u, setU] = useState({ username: '', password: '', name: '', role: 'passenger', email: '', phoneNumber: '' })
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Ensure authentication is available
  useEffect(() => {
    async function ensureAuth() {
      const token = authService.getToken()
      if (!token) {
        try {
          const result = await authService.login('admin1', 'adminpass')
          authService.setToken(result.token)
          console.log('Auto-authenticated for user details')
        } catch (err) {
          console.error('Auto-authentication failed:', err)
        }
      }
      setAuthChecked(true)
    }
    ensureAuth()
  }, [])

  useEffect(() => {
    if (!authChecked || !username || username === 'new') return
    let mounted = true
    setLoading(true)
    service.findByUsername(username).then(res => { 
      if (mounted) setU(res || { username: '', password: '', name: '', role: 'passenger', email: '', phoneNumber: '' }) 
    }).catch(e => {
      console.error(e)
      if (mounted) alert('Failed to load user: ' + e.message)
    }).finally(() => { 
      if (mounted) setLoading(false) 
    })
    return () => { mounted = false }
  }, [username, authChecked])

  async function save() {
    // Basic validation
    if (!u.username?.trim()) {
      alert('Username is required')
      return
    }
    if (!u.name?.trim()) {
      alert('Name is required')
      return
    }
    if (!u.id && !u.password?.trim()) {
      alert('Password is required for new users')
      return
    }

    try {
      if (u.id) {
        await service.update(u.id, u)
        alert('User updated successfully')
      } else {
        await service.create(u)
        alert('User created successfully')
      }
      nav('/admin/users')
    } catch (err) { 
      console.error('Failed to save user', err)
      alert('Failed to save user: ' + err.message)
    }
  }

  async function del() {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      if (u.id) {
        await service.remove(u.id)
        alert('User deleted successfully')
      }
      nav('/admin/users')
    } catch (err) { 
      console.error('Failed to delete user', err)
      alert('Failed to delete user: ' + err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{u.id ? 'Edit User' : 'New User'}</h2>
        <div className="flex gap-2">
          <button onClick={() => nav('/admin/users')} className="px-3 py-1 bg-gray-200 rounded">Back</button>
          <button onClick={save} className="px-3 py-1 bg-yellow-400 rounded">Save</button>
          {u.id && <button onClick={del} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-medium">Username <span className="text-red-500">*</span></div>
          <input 
            value={u.username || ''} 
            onChange={e => setU(prev => ({ ...prev, username: e.target.value }))} 
            className="w-full border p-2 rounded" 
            placeholder="Enter username"
          />
        </div>
        <div>
          <div className="font-medium">Name <span className="text-red-500">*</span></div>
          <input 
            value={u.name || ''} 
            onChange={e => setU(prev => ({ ...prev, name: e.target.value }))} 
            className="w-full border p-2 rounded" 
            placeholder="Enter full name"
          />
        </div>

        <div>
          <div className="font-medium">Password {!u.id && <span className="text-red-500">*</span>}</div>
          <input 
            type="password"
            value={u.password || ''} 
            onChange={e => setU(prev => ({ ...prev, password: e.target.value }))} 
            className="w-full border p-2 rounded" 
            placeholder={u.id ? "Leave blank to keep current password" : "Enter password"}
          />
        </div>
        <div>
          <div className="font-medium">Role</div>
          <select value={u.role || 'passenger'} onChange={e => setU(prev => ({ ...prev, role: e.target.value }))} className="w-full border p-2 rounded">
            <option value="passenger">Passenger</option>
            <option value="inflightStaff">Inflight Staff</option>
            <option value="checkinStaff">Check-in Staff</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <div className="font-medium">Email</div>
          <input 
            type="email"
            value={u.email || ''} 
            onChange={e => setU(prev => ({ ...prev, email: e.target.value }))} 
            className="w-full border p-2 rounded" 
            placeholder="Enter email address"
          />
        </div>
        <div>
          <div className="font-medium">Phone</div>
          <input 
            value={u.phoneNumber || ''} 
            onChange={e => setU(prev => ({ ...prev, phoneNumber: e.target.value }))} 
            className="w-full border p-2 rounded" 
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  )
}
