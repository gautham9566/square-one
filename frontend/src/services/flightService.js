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
  const transformedFlight = transformForBackend(flight)
  return request('/flights', { method: 'POST', body: JSON.stringify(transformedFlight) })
}

export async function update(id, flight) {
  const transformedFlight = transformForBackend(flight)
  return request(`/flights/${id}`, { method: 'PUT', body: JSON.stringify(transformedFlight) })
}

export async function remove(id) {
  return request(`/flights/${id}`, { method: 'DELETE' })
}

function normalizeFlight(raw) {
  if (!raw) return raw
  
  // Handle date formatting - convert YYYY-MM-DD to readable format
  let displayDate = raw.flightDate || raw.date;
  if (displayDate && typeof displayDate === 'string' && displayDate.includes('-')) {
    const [year, month, day] = displayDate.split('-');
    displayDate = `${month}/${day}/${year}`;
  }

  return {
    id: raw.flightId || raw.id,
    name: raw.flightName || raw.name,
    date: displayDate,
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

function transformForBackend(flight) {
  // Transform frontend flight object to backend format
  const transformed = {
    // Map frontend field names to backend field names
    flightName: flight.name || flight.flightName,
    flightDate: flight.date || flight.flightDate,
    route: flight.route,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    aircraftType: flight.aircraftType,
    totalSeats: flight.totalSeats ? parseInt(flight.totalSeats) : null,
    // Calculate availableSeats if not provided (assume all seats available for new flights)
    availableSeats: flight.availableSeats ? parseInt(flight.availableSeats) :
                   (flight.totalSeats ? parseInt(flight.totalSeats) : null),
    // Handle services array - convert to JSON string if needed
    servicesJson: Array.isArray(flight.services) ? JSON.stringify(flight.services) :
                 (flight.servicesJson || '[]'),
    // Handle service subtypes
    serviceSubtypesJson: flight.serviceSubtypes ? JSON.stringify(flight.serviceSubtypes) :
                        (flight.serviceSubtypesJson || '{}'),
    // Handle seat map
    seatMapJson: Array.isArray(flight.seatMap) ? JSON.stringify(flight.seatMap) :
                (flight.seatMapJson || '[]')
  }

  // Remove undefined/null values to avoid validation errors
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined || transformed[key] === null || transformed[key] === '') {
      delete transformed[key]
    }
  })

  return transformed
}

