import authService from './authService'

const API_BASE = 'http://localhost:8090'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = authService.getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || res.statusText)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function tryParseJson(s) {
  try { return JSON.parse(s) } catch { return null }
}

function normalizeUser(raw) {
  if (!raw) return raw
  return {
    id: raw.userId || raw.id,
    username: raw.username || raw.userName || raw.login || null,
    name: raw.name || raw.fullName || `${raw.firstName || ''} ${raw.lastName || ''}`.trim(),
    role: raw.role || raw.roles || null,
    email: raw.email || raw.contactEmail || null,
    phoneNumber: raw.phoneNumber || raw.phone || null,
    flightId: raw.flightId || raw.assignedFlightId || null,
    staff: raw.staff || raw.isStaff || false,
    enabled: raw.enabled !== undefined ? raw.enabled : (raw.active !== undefined ? raw.active : true),
    raw
  }
}

// CRUD
export async function list() {
  const data = await request('/users', { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizeUser) : []
}

export async function findById(id) {
  const data = await request(`/users/${id}`, { method: 'GET' })
  return data ? normalizeUser(data) : null
}

export async function create(user) {
  const res = await request('/users', { method: 'POST', body: JSON.stringify(user) })
  return res ? normalizeUser(res) : res
}

export async function update(id, user) {
  const res = await request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) })
  return res ? normalizeUser(res) : res
}

export async function remove(id) {
  return request(`/users/${id}`, { method: 'DELETE' })
}

// Lookup helpers
export async function findByUsername(username) {
  const data = await request(`/users/username/${encodeURIComponent(username)}`, { method: 'GET' })
  return data ? normalizeUser(data) : null
}

export async function listByRole(role) {
  const data = await request(`/users/role/${encodeURIComponent(role)}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizeUser) : []
}

export async function countByRole(role) {
  const data = await request(`/users/count/role/${encodeURIComponent(role)}`, { method: 'GET' })
  // backend likely returns a number or {count: n}
  if (typeof data === 'number') return data
  if (data && typeof data.count === 'number') return data.count
  return Number(data) || 0
}

export async function listByFlight(flightId) {
  const data = await request(`/users/flight/${flightId}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizeUser) : []
}

export async function listStaff() {
  const data = await request('/users/staff', { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizeUser) : []
}

export async function exists(username) {
  const data = await request(`/users/exists/${encodeURIComponent(username)}`, { method: 'GET' })
  // backend may return boolean or {exists: true}
  if (typeof data === 'boolean') return data
  if (data && typeof data.exists === 'boolean') return data.exists
  return Boolean(data)
}

// simple subscription no-op (for UI compatibility)
const listeners = new Set()
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }

export default {
  list,
  findById,
  create,
  update,
  remove,
  findByUsername,
  listByRole,
  countByRole,
  listByFlight,
  listStaff,
  exists,
  subscribe
}
