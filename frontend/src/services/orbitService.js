async function postJson(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
 
  if (!response.ok) {
    throw new Error(
      `SpaceGuard API request failed: ${response.status} ${response.statusText}`,
    )
  }
 
  return response.json()
}
 
export async function propagateObjects({
  objectId,
  start,
  end,
  stepMinutes,
}) {
  return postJson('/api/orbits/propagate', {
    object_id: objectId,
    start,
    end,
    step_minutes: stepMinutes,
  })
}
 
export function adaptPropagationStates(
  orbitResult,
  presentationRadius,
) {
  const points = orbitResult.states.map((state) => ({
    x: state.position.x_km,
    y: state.position.z_km,
    z: state.position.y_km,
  }))
 
  if (points.length === 0) return []
 
  const meanRadius =
    points.reduce(
      (sum, point) =>
        sum + Math.hypot(point.x, point.y, point.z),
      0,
    ) / points.length
 
  const scale =
    meanRadius === 0 ? 1 : presentationRadius / meanRadius
 
  return points.map((point) => ({
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
  }))
}