import { passengers as initial } from '../data/dummyData'

let passengers = initial.map(p => ({ ...p }))
const listeners = new Set()

export function list() {
  return passengers.slice()
}

export function findByName(name) {
  return passengers.find(p => p.name === name)
}

export function findById(id) {
  return passengers.find(p => p.id === id)
}

export function addOrUpdate(p) {
  if (p.id) {
    passengers = passengers.map(x => (x.id === p.id ? { ...p } : x))
  } else {
    p.id = Math.max(0, ...passengers.map(x => x.id || 0)) + 1
    passengers = [...passengers, p]
  }
  emit()
}

export function remove(id) {
  passengers = passengers.filter(p => p.id !== id)
  emit()
}

function emit() {
  listeners.forEach(fn => fn(list()))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
