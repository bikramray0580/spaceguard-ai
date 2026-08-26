import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockThreats } from '../data/mockMissionData'
import { adaptConjunctionResult, screenConjunction } from '../services/conjunctionService'
import { resolveObject, useOrbitalObjects } from '../services/objectService'
import '../styles/risk.css'

const riskOrder = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW']

export default function RiskPage() {
  const [filter, setFilter] = useState('ALL')
  const [selectedThreat, setSelectedThreat] = useState(
    mockThreats[0],
  )

  const [screenResult, setScreenResult] = useState(null)

  const { objects: orbitalObjects } = useOrbitalObjects()

  useEffect(() => {
    let cancelled = false

    async function screenSelectedThreat() {
      const objectA = resolveObject(
        orbitalObjects,
        selectedThreat.objectA,
      )

      const objectB = resolveObject(
        orbitalObjects,
        selectedThreat.objectB,
      )

      if (!objectA || !objectB) return

      try {
        const start = new Date()
        const end = new Date(
          start.getTime() + 90 * 60 * 1000,
        )

        const result = await screenConjunction({
          objectA: objectA.id,
          objectB: objectB.id,
          start: start.toISOString(),
          end: end.toISOString(),
          stepMinutes: 5,
        })

        if (!cancelled) {
          setScreenResult(adaptConjunctionResult(result))
        }
      } catch {
        if (!cancelled) {
          setScreenResult(null)
        }
      }
    }

    screenSelectedThreat()

    return () => {
      cancelled = true
    }
  }, [selectedThreat, orbitalObjects])

  // Calculate risk distribution from active threats.
  const riskCounts = useMemo(() => {
    return riskOrder.reduce((counts, level) => {
      counts[level] = mockThreats.filter(
        (threat) => threat.level === level,
      ).length

      return counts
    }, {})
  }, [])

  const filteredThreats = useMemo(() => {
    if (filter === 'ALL') return mockThreats

    return mockThreats.filter(
      (threat) => threat.level === filter,
    )
  }, [filter])

  const highestRisk =
    mockThreats.find(
      (threat) => threat.level === 'CRITICAL',
    ) ?? mockThreats[0]

  const detailThreat = screenResult
    ? {
        ...selectedThreat,
        objectA: screenResult.objectA,
        objectB: screenResult.objectB,
        level: screenResult.riskLevel,
        distance: `${screenResult.missDistanceKm.toFixed(2)} km`,
        velocity: `${screenResult.relativeVelocityKmS.toFixed(1)} km/s`,
        window: screenResult.window,
      }
    : selectedThreat

  return (
    <section className="risk-page">
      {/* Page header */}
      <div className="risk-page-header">
        <div>
          <span className="eyebrow">RISK MONITOR</span>

          <h1>Risk Assessment</h1>

          <p>
            Monitor active conjunction threats and assess
            current orbital exposure.
          </p>
        </div>

        <div className="risk-status">
          <i />
          SYSTEM EXPOSURE: ELEVATED
        </div>
      </div>

      {/* Risk summary */}
      <div className="risk-summary">
        {riskOrder.map((level) => (
          <button
            key={level}
            type="button"
            className={`risk-summary-card ${level.toLowerCase()} ${
              filter === level ? 'selected' : ''
            }`}
            onClick={() =>
              setFilter(
                filter === level ? 'ALL' : level,
              )
            }
          >
            <span>{level}</span>

            <strong>{riskCounts[level]}</strong>

            <small>
              {level === 'CRITICAL'
                ? 'immediate review'
                : level === 'HIGH'
                  ? 'requires attention'
                  : level === 'MODERATE'
                    ? 'monitor closely'
                    : 'nominal exposure'}
            </small>
          </button>
        ))}
      </div>

      <div className="risk-grid">
        {/* Threat list */}
        <div className="risk-threats">
          <div className="risk-section-header">
            <div>
              <span className="eyebrow">
                ACTIVE THREATS
              </span>

              <h2>Conjunction risk assessment</h2>
            </div>

            <span className="risk-count">
              {filteredThreats.length} THREATS
            </span>
          </div>

          <div className="risk-threat-list">
            {filteredThreats.map((threat) => (
              <button
                key={threat.id}
                type="button"
                className={`risk-threat ${
                  selectedThreat.id === threat.id
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setSelectedThreat(threat)
                }
              >
                <span
                  className={`risk-threat-dot ${threat.level.toLowerCase()}`}
                />

                <span className="risk-threat-main">
                  <strong>
                    {threat.objectA}
                    <span> × </span>
                    {threat.objectB}
                  </strong>

                  <small>
                    TCA {threat.window}
                  </small>
                </span>

                <span className="risk-threat-distance">
                  {threat.distance}
                </span>

                <span
                  className={`risk-level ${threat.level.toLowerCase()}`}
                >
                  {threat.level}
                </span>

                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Selected threat */}
        <aside className="risk-detail">
          <div className="risk-detail-header">
            <span className="eyebrow">
              SELECTED THREAT
            </span>

            <ShieldAlert size={19} />
          </div>

          <span
            className={`risk-detail-level ${detailThreat.level.toLowerCase()}`}
          >
            {detailThreat.level}
          </span>

          <h2>
            {detailThreat.objectA}
            <span> × </span>
            {detailThreat.objectB}
          </h2>

          <p className="risk-detail-description">
            Orbital conjunction requiring monitoring based
            on predicted closest approach parameters.
          </p>

          <div className="risk-metrics">
            <div>
              <span>TIME TO TCA</span>
              <strong>{detailThreat.window}</strong>
            </div>

            <div>
              <span>MISS DISTANCE</span>
              <strong>{detailThreat.distance}</strong>
            </div>

            <div>
              <span>RELATIVE VELOCITY</span>
              <strong>{detailThreat.velocity}</strong>
            </div>

            <div>
              <span>THREAT LEVEL</span>
              <strong>{detailThreat.level}</strong>
            </div>
          </div>

          <Link
            to="/"
            className="risk-dashboard-button"
          >
            <AlertTriangle size={15} />
            VIEW ON DASHBOARD
          </Link>
        </aside>
      </div>

      {/* Highest-risk callout */}
      <div className="risk-callout">
        <div>
          <span className="eyebrow">
            HIGHEST PRIORITY
          </span>

          <strong>
            {highestRisk.objectA} × {highestRisk.objectB}
          </strong>

          <small>
            {highestRisk.distance} miss distance ·{' '}
            {highestRisk.window}
          </small>
        </div>

        <span className="risk-callout-badge">
          {highestRisk.level}
        </span>
      </div>
    </section>
  )
}