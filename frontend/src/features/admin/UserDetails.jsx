import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as service from '../../services/userService'

export default function UserDetails() {
  const { username } = useParams()
  const nav = useNavigate()
  const [u, setU] = useState({ username: '', name: '', role: 'user', email: '', phoneNumber: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!username || username === 'new') return
    let mounted = true
    setLoading(true)
    service.findByUsername(username).then(res => { if (mounted) setU(res || u) }).catch(e => console.error(e)).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  async function save() {
    try {
      if (u.id) await service.update(u.id, u)
      else await service.create(u)
      nav('/admin/users')
    } catch (err) { console.error('Failed to save user', err) }
  }

  async function del() {
    try {
      if (u.id) await service.remove(u.id)
      nav('/admin/users')
    } catch (err) { console.error('Failed to delete user', err) }
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
          <div className="font-medium">Username</div>
          <input value={u.username || ''} onChange={e => setU(prev => ({ ...prev, username: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
        <div>
          <div className="font-medium">Name</div>
          <input value={u.name || ''} onChange={e => setU(prev => ({ ...prev, name: e.target.value }))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <div className="font-medium">Role</div>
          <select value={u.role || 'user'} onChange={e => setU(prev => ({ ...prev, role: e.target.value }))} className="w-full border p-2 rounded">
            <option value="user">user</option>
            <option value="staff">staff</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <div className="font-medium">Email</div>
          <input value={u.email || ''} onChange={e => setU(prev => ({ ...prev, email: e.target.value }))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <div className="font-medium">Phone</div>
          <input value={u.phoneNumber || ''} onChange={e => setU(prev => ({ ...prev, phoneNumber: e.target.value }))} className="w-full border p-2 rounded" />
        </div>
      </div>
    </div>
  )
}
