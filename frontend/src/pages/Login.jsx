import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { token, user, raw } = await authService.login(username, password)
      if (!token) throw new Error('No token returned')
      // store token first
      authService.setToken(token)

      // Prefer top-level user info (name/role) returned by backend
      const backendUser = user || raw || {}
      const name = backendUser.name || backendUser.username || username
      const roleField = backendUser.role || backendUser.roles || backendUser.authorities

      let chosenRole = null
      if (Array.isArray(roleField)) chosenRole = roleField[0]
      else if (typeof roleField === 'string') chosenRole = roleField

      // fallback to token payload
      if (!chosenRole) {
        const payload = authService.parseJwt(token) || {}
        const roleFromToken = payload.role || payload.roles || payload.authorities
        if (Array.isArray(roleFromToken)) chosenRole = roleFromToken[0]
        else if (typeof roleFromToken === 'string') chosenRole = roleFromToken
      }

      if (chosenRole && chosenRole.toLowerCase().includes('admin')) {
        navigate('/admin', { state: { name, role: chosenRole } })
      } else if (chosenRole && chosenRole.toLowerCase().includes('passenger')) {
        navigate('/passenger', { state: { name, role: chosenRole } })
      } else {
        navigate('/staff', { state: { name, role: chosenRole || 'staff' } })
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md p-6">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">✈</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your airline management account</p>
        </div>

        <Card className="shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick access for testing</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername('admin1');
                  setPassword('adminpass');
                }}
                disabled={loading}
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername('checkin1');
                  setPassword('checkinpass');
                }}
                disabled={loading}
              >
                CheckinStaff
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername('inflight1');
                  setPassword('inflightpass');
                }}
                disabled={loading}
              > inflightStaff
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername('passenger1');
                  setPassword('passpass');
                }}
                disabled={loading}
              >
                Passenger
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help? Contact{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              support@airline.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
