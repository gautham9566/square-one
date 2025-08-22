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

// CRUD for travel history
export async function list() {
  const data = await request('/history', { method: 'GET' })
  return Array.isArray(data) ? data : []
}

export async function findById(id) {
  return request(`/history/${id}`, { method: 'GET' })
}

export async function create(record) {
  return request('/history', { method: 'POST', body: JSON.stringify(record) })
}

export async function update(id, record) {
  return request(`/history/${id}`, { method: 'PUT', body: JSON.stringify(record) })
}

export async function remove(id) {
  return request(`/history/${id}`, { method: 'DELETE' })
}

// Passenger-specific queries
export async function findByPassengerAndStatus(passengerId, status) {
  return request(`/history/passenger/${passengerId}/status/${encodeURIComponent(status)}`, { method: 'GET' })
}

export async function findByPassenger(passengerId) {
  return request(`/history/passenger/${passengerId}`, { method: 'GET' })
}

export async function listByUser(userId) {
  return request(`/history/user/${userId}`, { method: 'GET' })
}

export async function userSummary(userId) {
  return request(`/history/user/${userId}/summary`, { method: 'GET' })
}

export async function userStats(userId) {
  return request(`/history/user/${userId}/stats`, { method: 'GET' })
}

export default {
  list,
  findById,
  create,
  update,
  remove,
  findByPassengerAndStatus,
  listByUser,
  userSummary,
  userStats
}
