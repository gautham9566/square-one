import { flights as initial } from '../data/dummyData'

let flights = initial.map(f => ({ ...f }))
const listeners = new Set()

export function list() { return flights.slice() }
export function findById(id) { return flights.find(f => f.id === Number(id)) }

export function addOrUpdate(f) {
  if (f.id) {
    flights = flights.map(x => x.id === f.id ? { ...f } : x)
  } else {
    f.id = Math.max(0, ...flights.map(x => x.id || 0)) + 1
    flights = [...flights, f]
  }
  emit()
}

export function remove(id) {
  flights = flights.filter(f => f.id !== Number(id))
  emit()
}

function emit() { listeners.forEach(cb => cb(list())) }
export function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb) }
