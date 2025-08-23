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

function normalizePassenger(raw) {
  if (!raw) return raw
  return {
    id: raw.passengerId || raw.id,
    flightId: raw.flightId || raw.flight || null,
    name: raw.name,
    phoneNumber: raw.phoneNumber || raw.phone || raw.contact,
    address: raw.address,
    passportNumber: raw.passportNumber || raw.passport || null,
    dateOfBirth: raw.dateOfBirth || raw.dob || null,
    origin: raw.origin,
    destination: raw.destination,
    from: raw.from || raw.origin, // For backward compatibility
    to: raw.to || raw.destination, // For backward compatibility
    services: raw.services || (raw.servicesJson ? tryParseJson(raw.servicesJson) : []),
    mealType: raw.mealType,
    extraBaggage: raw.extraBaggage,
    shoppingItems: raw.shoppingItems || (raw.shoppingItemsJson ? tryParseJson(raw.shoppingItemsJson) : []),
    seat: raw.seat || null,
    // Handle both boolean and Y/N string formats for backward compatibility
    checkedIn: raw.checkedIn === true || raw.checkedIn === 'Y',
    wheelchair: raw.wheelchair === true || raw.wheelchair === 'Y',
    infant: raw.infant === true || raw.infant === 'Y',
    email: raw.email,
  }
}

function tryParseJson(s) {
  try { return JSON.parse(s) } catch { return null }
}

function transformForBackend(passenger) {
  // Transform frontend passenger object to backend format
  const transformed = {
    ...passenger,
    // Keep boolean values as booleans - backend DTOs expect boolean types
    checkedIn: Boolean(passenger.checkedIn),
    wheelchair: Boolean(passenger.wheelchair),
    infant: Boolean(passenger.infant),
    // Ensure numeric fields have defaults
    extraBaggage: passenger.extraBaggage || 0,
    // Keep services and shoppingItems as arrays - backend handles JSON conversion
    services: Array.isArray(passenger.services) ? passenger.services : [],
    shoppingItems: Array.isArray(passenger.shoppingItems) ? passenger.shoppingItems : []
  }

  // Remove frontend-only fields if present
  delete transformed.from
  delete transformed.to

  return transformed
}

export async function list() {
  const data = await request('/passengers', { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizePassenger) : [normalizePassenger(data)]
}

export async function findById(id) {
  const data = await request(`/passengers/${id}`, { method: 'GET' })
  return data ? normalizePassenger(data) : null
}

export async function create(passenger) {
  const transformedPassenger = transformForBackend(passenger)
  const res = await request('/passengers', { method: 'POST', body: JSON.stringify(transformedPassenger) })
  return res ? normalizePassenger(res) : res
}

export async function update(id, passenger) {
  const transformedPassenger = transformForBackend(passenger)
  const res = await request(`/passengers/${id}`, { method: 'PUT', body: JSON.stringify(transformedPassenger) })
  return res ? normalizePassenger(res) : res
}

export async function remove(id) {
  return request(`/passengers/${id}`, { method: 'DELETE' })
}

// Flight-scoped queries
export async function listByFlight(flightId, opts = {}) {
  // opts may contain checkedIn, specialNeeds, missingInfo
  const params = new URLSearchParams()
  if (opts.checkedIn !== undefined) params.set('checkedIn', String(opts.checkedIn))
  if (opts.specialNeeds !== undefined) params.set('specialNeeds', String(opts.specialNeeds))
  if (opts.missingInfo !== undefined) params.set('missingInfo', String(opts.missingInfo))
  const q = params.toString() ? `?${params.toString()}` : ''
  const data = await request(`/passengers/flight/${flightId}${q}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizePassenger) : []
}

export async function listCheckedIn(flightId) {
  return listByFlight(flightId, { checkedIn: true })
}

export async function listNotCheckedIn(flightId) {
  return listByFlight(flightId, { checkedIn: false })
}

export async function listSpecialNeeds(flightId) {
  return listByFlight(flightId, { specialNeeds: true })
}

// Other actions
export async function searchByName(name) {
  const data = await request(`/passengers/search?name=${encodeURIComponent(name)}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizePassenger) : []
}

export async function checkin(passengerId, body = {}) {
  return request(`/passengers/checkin/${passengerId}`, { method: 'POST', body: JSON.stringify(body) })
}

export async function assignSeat(flightId, seatAssignment) {
  // POST or PUT depending on backend; spec said PUT /passengers/seat/{flightId}
  return request(`/passengers/seat/${flightId}`, { method: 'PUT', body: JSON.stringify(seatAssignment) })
}

// Simple subscription helper for compatibility with UI patterns (no-op server push)
const listeners = new Set()
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }

