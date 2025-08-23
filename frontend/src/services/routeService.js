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
  // return JSON if present
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function list() {
  const data = await request('/flights/routes', { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function listActive() {
  const data = await request('/flights/routes/active', { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function findById(id) {
  const data = await request(`/flights/routes/${id}`, { method: 'GET' })
  return data ? normalizeRoute(data) : null
}

export async function findByCode(routeCode) {
  const data = await request(`/flights/routes/code/${routeCode}`, { method: 'GET' })
  return data ? normalizeRoute(data) : null
}

export async function searchRoutes(departure, arrival) {
  const data = await request(`/flights/routes/search?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}`, { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function findByDepartureAirport(airport) {
  const data = await request(`/flights/routes/departure/${airport}`, { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function findByArrivalAirport(airport) {
  const data = await request(`/flights/routes/arrival/${airport}`, { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function findByDepartureCity(city) {
  const data = await request(`/flights/routes/departure-city/${city}`, { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function findByArrivalCity(city) {
  const data = await request(`/flights/routes/arrival-city/${city}`, { method: 'GET' })
  if (!data) return []
  return Array.isArray(data) ? data.map(normalizeRoute) : [normalizeRoute(data)]
}

export async function create(route) {
  const data = await request('/flights/routes', { method: 'POST', body: JSON.stringify(route) })
  return data ? normalizeRoute(data) : null
}

export async function update(id, route) {
  const data = await request(`/flights/routes/${id}`, { method: 'PUT', body: JSON.stringify(route) })
  return data ? normalizeRoute(data) : null
}

export async function remove(id) {
  return request(`/flights/routes/${id}`, { method: 'DELETE' })
}

export async function activate(id) {
  const data = await request(`/flights/routes/${id}/activate`, { method: 'PUT' })
  return data ? normalizeRoute(data) : null
}

export async function deactivate(id) {
  const data = await request(`/flights/routes/${id}/deactivate`, { method: 'PUT' })
  return data ? normalizeRoute(data) : null
}

export async function checkRouteCodeExists(routeCode) {
  return request(`/flights/routes/exists/${routeCode}`, { method: 'GET' })
}

function normalizeRoute(raw) {
  if (!raw) return raw
  return {
    id: raw.routeId || raw.id,
    routeCode: raw.routeCode,
    departureCity: raw.departureCity,
    departureAirport: raw.departureAirport,
    arrivalCity: raw.arrivalCity,
    arrivalAirport: raw.arrivalAirport,
    distanceKm: raw.distanceKm,
    estimatedDuration: raw.estimatedDuration,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    // Legacy support for the existing component
    departurePlace: raw.departureCity || raw.departurePlace,
    arrivalPlace: raw.arrivalCity || raw.arrivalPlace
  }
}
