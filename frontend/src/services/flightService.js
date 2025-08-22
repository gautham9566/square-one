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
  const data = await request('/flights', { method: 'GET' })
  if (!data) return []
  // backend returns array of flights with fields like flightId, flightName, flightDate
  return Array.isArray(data) ? data.map(normalizeFlight) : [normalizeFlight(data)]
}

export async function findById(id) {
  const data = await request(`/flights/${id}`, { method: 'GET' })
  return data ? normalizeFlight(data) : null
}

export async function create(flight) {
  return request('/flights', { method: 'POST', body: JSON.stringify(flight) })
}

export async function update(id, flight) {
  return request(`/flights/${id}`, { method: 'PUT', body: JSON.stringify(flight) })
}

export async function remove(id) {
  return request(`/flights/${id}`, { method: 'DELETE' })
}

function normalizeFlight(raw) {
  if (!raw) return raw
  return {
    id: raw.flightId || raw.id,
    name: raw.flightName || raw.name,
    date: raw.flightDate || raw.date,
    route: raw.route,
    departureTime: raw.departureTime,
    arrivalTime: raw.arrivalTime,
    totalSeats: raw.totalSeats || raw.totalSeats,
    availableSeats: raw.availableSeats,
    services: raw.services || (raw.servicesJson ? JSON.parse(raw.servicesJson) : []),
    serviceSubtypes: raw.serviceSubtypes || (raw.serviceSubtypesJson ? JSON.parse(raw.serviceSubtypesJson) : {}),
    seatMap: raw.seatMap || (raw.seatMapJson ? JSON.parse(raw.seatMapJson) : []),
    aircraftType: raw.aircraftType
  }
}

