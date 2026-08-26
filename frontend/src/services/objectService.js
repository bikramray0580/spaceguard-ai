import { useEffect, useMemo, useState } from 'react'
import {
  mockConjunctionPairs,
  mockOrbitalObjects,
} from '../data/mockOrbitalData'
 
async function request(path) {
  const response = await fetch(path)
 
  if (!response.ok) {
    throw new Error(
      `SpaceGuard API request failed: ${response.status} ${response.statusText}`,
    )
  }
 
  return response.json()
}
 
export async function fetchObjects() {
  return request('/api/objects')
}
 
export async function fetchObject(objectId) {
  return request(`/api/objects/${encodeURIComponent(objectId)}`)
}
 
const templateIndexById = new Map(
  mockOrbitalObjects.map((template, index) => [
    template.id,
    index,
  ]),
)
 
function mergeObjects(backendObjects) {
  return backendObjects
    .slice(0, mockOrbitalObjects.length)
    .map((backendObject, index) => ({
      ...mockOrbitalObjects[index],
      id: backendObject.object_id,
      name: backendObject.name,
      epoch: backendObject.epoch,
      tle: backendObject.tle,
    }))
}
 
export function resolveObject(objects, id) {
  if (!objects.length) return undefined
 
  const direct = objects.find((object) => object.id === id)
  if (direct) return direct
 
  const index = templateIndexById.get(id)
  return index === undefined ? undefined : objects[index]
}
 
export function useOrbitalObjects() {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    let cancelled = false
 
    async function loadObjects() {
      try {
        const backendObjects = await fetchObjects()
 
        if (!cancelled) {
          setObjects(mergeObjects(backendObjects))
        }
      } catch (err) {
        if (!cancelled) {
          setObjects(mockOrbitalObjects)
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
 
    loadObjects()
 
    return () => {
      cancelled = true
    }
  }, [])
 
  const conjunctionPairs = useMemo(() => {
    if (objects.length === 0) return []
 
    return mockConjunctionPairs.map((pair) =>
      pair.map((id) => {
        const index = templateIndexById.get(id)
        return index === undefined ? id : objects[index]?.id ?? id
      }),
    )
  }, [objects])
 
  return { objects, conjunctionPairs, loading, error }
}