import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { users } from '../data/dummyData'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const user = users.find((u) => u.username === username && u.password === password)
    if (!user) {
      setError('Invalid credentials')
      return
    }
    setError('')
    if (user.role === 'admin') {
      navigate('/admin', { state: { name: user.name, role: user.role } })
    } else if (user.role === 'passenger') {
      navigate('/passenger', { state: { name: user.name, role: user.role } })
    } else {
      navigate('/staff', { state: { name: user.name, role: user.role, flightId: user.flightId } })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Airline Management — Login</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="username"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="password"
          />
        </label>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Sign in</button>
      </form>
    </div>
  )
}
