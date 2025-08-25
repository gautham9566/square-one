import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import flightVideo from './mp4/flight.mp4';

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

      // Store user information for header display
      const userInfo = {
        name: name,
        role: chosenRole || 'user',
        username: backendUser.username || username
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

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
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source
          src={flightVideo}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-white opacity-40"></div>
      <div className="w-full max-w-md p-6 relative z-10">
        {/* Logo and Header */}
              <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-200 mt-2">Sign in to your airline management account</p>
              </div>

              <Card className="!shadow-xl !border-0 !bg-black/20 !backdrop-blur-lg !p-6">
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
                labelClassName="text-white"
                />
                
                <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                labelClassName="text-white"
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
                <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-transparent text-white">Quick access for testing</span>
                </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 ">
                <Button
              variant="outline"
              size="sm"
              onClick={() => {
                  setUsername('admin1');
                  setPassword('adminpass');
                }}
                disabled={loading}
                className="text-white"
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
                className="text-white"
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
                className="text-white"
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
                className="text-white"
              >
                Passenger
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
