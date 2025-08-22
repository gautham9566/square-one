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

function tryParseJson(s) { try { return JSON.parse(s) } catch { return null } }

function normalizePassengerService(raw) {
  if (!raw) return raw
  return {
    passengerId: raw.passengerId || raw.id || raw.passenger_id,
    name: raw.name || raw.passengerName || raw.username,
    flightId: raw.flightId || raw.flight_id,
    seat: raw.seat || raw.seatNumber,
    services: raw.services || (raw.servicesJson ? tryParseJson(raw.servicesJson) : []),
    meal: raw.meal || (raw.mealJson ? tryParseJson(raw.mealJson) : null),
    baggage: raw.baggage || null,
    shopping: raw.shopping || null,
    raw
  }
}

// Passenger services for a flight
export async function listPassengersServices(flightId, opts = {}) {
  const params = new URLSearchParams()
  if (opts.serviceType) params.set('serviceType', opts.serviceType)
  const q = params.toString() ? `?${params.toString()}` : ''
  const data = await request(`/services/flight/${flightId}/passengers${q}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizePassengerService) : []
}

export async function listMealPassengers(flightId, mealType) {
  const q = mealType ? `?mealType=${encodeURIComponent(mealType)}` : ''
  const data = await request(`/services/meals/flight/${flightId}${q}`, { method: 'GET' })
  return Array.isArray(data) ? data.map(normalizePassengerService) : []
}

// Update passenger services
export async function updatePassengerServices(passengerId, body) {
  const res = await request(`/services/passenger/${passengerId}`, { method: 'PUT', body: JSON.stringify(body) })
  return res
}

export async function updatePassengerMeal(passengerId, mealBody) {
  return request(`/services/passenger/${passengerId}/meal`, { method: 'PUT', body: JSON.stringify(mealBody) })
}

export async function updatePassengerBaggage(passengerId, baggageBody) {
  return request(`/services/passenger/${passengerId}/baggage`, { method: 'PUT', body: JSON.stringify(baggageBody) })
}

export async function updatePassengerShopping(passengerId, shoppingBody) {
  return request(`/services/passenger/${passengerId}/shopping`, { method: 'PUT', body: JSON.stringify(shoppingBody) })
}

// Categories
export async function listCategories() {
  const data = await request('/services/categories', { method: 'GET' })
  return Array.isArray(data) ? data : []
}

export async function getCategory(id) {
  return request(`/services/categories/${id}`, { method: 'GET' })
}

export async function createCategory(body) {
  return request('/services/categories', { method: 'POST', body: JSON.stringify(body) })
}

export default {
  listPassengersServices,
  listMealPassengers,
  updatePassengerServices,
  updatePassengerMeal,
  updatePassengerBaggage,
  updatePassengerShopping,
  listCategories,
  getCategory,
  createCategory
}
