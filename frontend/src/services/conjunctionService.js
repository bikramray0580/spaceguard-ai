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
 
export async function screenConjunction({
  objectA,
  objectB,
  start,
  end,
  stepMinutes,
}) {
  return postJson('/api/conjunctions/screen', {
    object_a: objectA,
    object_b: objectB,
    start,
    end,
    step_minutes: stepMinutes,
  })
}
 
function normalizeRiskLevel(level) {
  return level === 'MEDIUM' ? 'MODERATE' : level
}
 
function formatTcaOffset(minutes) {
  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const mins = abs % 60
  const sign = minutes < 0 ? '-' : '+'
 
  return hours > 0
    ? `TCA ${sign} ${hours}h ${mins}m`
    : `TCA ${sign} ${mins}m`
}
 
export function adaptConjunctionResult(result, now = new Date()) {
  const tca = new Date(result.time_of_closest_approach)
  const minutes = Math.round(
    (tca.getTime() - now.getTime()) / 60000,
  )
 
  return {
    objectA: result.object_a,
    objectB: result.object_b,
    timeToTcaMinutes: minutes,
    missDistanceKm: result.miss_distance_km,
    relativeVelocityKmS: result.relative_velocity_km_s,
    riskLevel: normalizeRiskLevel(result.risk_level),
    riskReason: result.risk_reason,
    window: formatTcaOffset(minutes),
    isMock: false,
  }
}