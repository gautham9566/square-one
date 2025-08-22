const API_BASE = 'http://localhost:8090'

function _getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  const data = await res.json()
  // Support a few common shapes: { token }, { accessToken }, { jwt }, or { token, user }
  const token = data.token || data.accessToken || data.jwt
  // If the backend returns name/role/username at top-level, surface them as `user` for the frontend
  const user = data.user || (data.name || data.role || data.username ? {
    name: data.name,
    role: data.role,
    username: data.username
  } : null)
  return { token, user, raw: data }
}

export function setToken(token) {
  if (token) localStorage.setItem('authToken', token)
}

export function getToken() {
  return localStorage.getItem('authToken')
}

export async function validateToken() {
  const token = getToken()
  if (!token) return false
  const res = await fetch(`${API_BASE}/api/auth/validate-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ..._getAuthHeader() }
  })
  if (!res.ok) return false
  try {
    return await res.json()
  } catch {
    return true
  }
}

export async function getRoles() {
  const res = await fetch(`${API_BASE}/api/auth/roles`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ..._getAuthHeader() }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

// Helper to try to decode a JWT payload in-browser. Returns payload object or null.
export function parseJwt(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // atob returns binary string; decodeURIComponent(escape(...)) handles UTF-8
    const json = decodeURIComponent(escape(window.atob(payload)))
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export default { login, setToken, getToken, validateToken, getRoles, parseJwt }
