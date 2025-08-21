import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function StaffHome() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const userType = state?.userType || state?.role || 'staff'

  useEffect(() => {
    if (userType === 'admin') {
  // pass state through so admin page can use it if needed
  navigate('/admin', { state })
    } else if (userType === 'inflightStaff') {
  // route to the inflight service page and preserve flightId in state
  navigate('/inflight-service', { state })
    } else if (userType === 'checkinStaff') {
  // route to the check-in page under /staff and preserve state
  navigate('/staff/check-in', { state })
    } else {
      navigate('/') // Default route for passengers or unknown user types
    }
  }, [userType, navigate])

  return null
}
