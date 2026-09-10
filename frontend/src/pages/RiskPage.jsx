import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  MapPinned,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockThreats } from '../data/mockMissionData'
import '../styles/risk.css'

const RISK_ORDER = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW']

const RISK_META = {
  CRITICAL: {
    label: 'Critical',
    short: 'Immediate review',
    tone: 'critical',
    description: 'High-priority conjunction requiring immediate review.',
  },
  HIGH: {
    label: 'High',
    short: 'Requires attention',
    tone: 'high',
    description: 'Elevated conjunction requiring closer monitoring.',
  },
  MODERATE: {
    label: 'Moderate',
    short: 'Monitor closely',
    tone: 'moderate',
    description: 'Moderate conjunction that should remain under observation.',
  },
  LOW: {
    label: 'Low',
    short: 'Nominal exposure',
    tone: 'low',
    description: 'Low-priority conjunction within the current monitoring set.',
  },
}

const formatThreatName = (value) =>
  value
    .toLowerCase()
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase())

const threatSearchText = (threat) =>
  [
    threat.id,
    threat.objectA,
    threat.objectB,
    threat.level,
    threat.window,
    threat.distance,
    threat.velocity,
  ]
    .join(' ')
    .toLowerCase()

function MiniThreatOrbit({ threat }) {
  return (
    <div
      className="risk-orbit-visual"
      data-risk-level={threat.level.toLowerCase()}
      aria-hidden="true"
    >
      <div className="risk-orbit-stars" />
      <div className="risk-orbit-ring risk-orbit-ring-a" />
      <div className="risk-orbit-ring risk-orbit-ring-b" />
      <div className="risk-orbit-earth">
        <span />
      </div>
      <span className="risk-orbit-object risk-orbit-object-a" />
      <span className="risk-orbit-object risk-orbit-object-b" />
      <div className="risk-orbit-link" />
      <div className="risk-orbit-caption">
        <MapPinned size={13} />
        <span>Closest-approach relationship</span>
      </div>
    </div>
  )
}

export default function RiskPage() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedThreatId, setSelectedThreatId] = useState(null)
  const [detailTab, setDetailTab] = useState('overview')
  const searchRef = useRef(null)

  const riskCounts = useMemo(
    () =>
      RISK_ORDER.reduce((counts, level) => {
        counts[level] = mockThreats.filter((threat) => threat.level === level).length
        return counts
      }, {}),
    [],
  )

  const highestRisk = useMemo(
    () =>
      [...mockThreats].sort(
        (a, b) => RISK_ORDER.indexOf(a.level) - RISK_ORDER.indexOf(b.level),
      )[0] ?? null,
    [],
  )

  const filteredThreats = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mockThreats.filter((threat) => {
      const matchesFilter = filter === 'ALL' || threat.level === filter
      const matchesSearch = !query || threatSearchText(threat).includes(query)

      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const selectedThreat =
    mockThreats.find((threat) => threat.id === selectedThreatId) ?? null

  const selectThreat = (threat) => {
    setSelectedThreatId(threat.id)
    setDetailTab('overview')
  }

  const closeThreat = () => {
    setSelectedThreatId(null)
    setDetailTab('overview')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault()
        searchRef.current?.focus()
      }

      if (event.key === 'Escape') {
        closeThreat()
      }

      if (
        (event.key === 'Enter' || event.key === ' ') &&
        document.activeElement?.dataset?.riskThreatId
      ) {
        event.preventDefault()
        const threat = mockThreats.find(
          (item) => item.id === document.activeElement.dataset.riskThreatId,
        )
        if (threat) selectThreat(threat)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="risk-page">
      <header className="risk-page-header">
        <div>
          <span className="eyebrow">RISK MONITOR</span>
          <h1>Collision risk</h1>
          <p>Identify priority conjunctions before diving into the technical detail.</p>
        </div>

        <div className="risk-status">
          <i />
          <span>LIVE RISK SCREENING</span>
        </div>
      </header>

      <section className="risk-overview" aria-label="Risk overview">
        <div className="risk-overview-lead">
          <span className="eyebrow">CURRENT EXPOSURE</span>
          <strong>{mockThreats.length}</strong>
          <span>active conjunctions</span>
        </div>

        <div className="risk-summary" role="group" aria-label="Filter threats by severity">
          <button
            type="button"
            className={`risk-summary-button all ${filter === 'ALL' ? 'selected' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            <span>All</span>
            <b>{mockThreats.length}</b>
          </button>

          {RISK_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              className={`risk-summary-button ${level.toLowerCase()} ${
                filter === level ? 'selected' : ''
              }`}
              onClick={() =>
                setFilter((current) => (current === level ? 'ALL' : level))
              }
            >
              <span>{RISK_META[level].label}</span>
              <b>{riskCounts[level]}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="risk-priority">
        <div className="risk-priority-copy">
          <span className="eyebrow">HIGHEST PRIORITY</span>
          <strong>
            {formatThreatName(highestRisk.objectA)} × {formatThreatName(highestRisk.objectB)}
          </strong>
          <span>
            {highestRisk.distance} miss distance · {highestRisk.window}
          </span>
        </div>

        <div className="risk-priority-side">
          <span className={`risk-severity-dot ${highestRisk.level.toLowerCase()}`} />
          <span className={`risk-priority-badge ${highestRisk.level.toLowerCase()}`}>
            {highestRisk.level}
          </span>
        </div>
      </section>

      <section className="risk-workspace">
        <div className="risk-threats">
          <div className="risk-section-header">
            <div>
              <span className="eyebrow">ACTIVE THREATS</span>
              <h2>Conjunction queue</h2>
            </div>

            <span className="risk-count">
              {filteredThreats.length} of {mockThreats.length}
            </span>
          </div>

          <div className="risk-controls">
            <label className="risk-search">
              <AlertTriangle size={15} />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search threats, objects, or risk levels..."
                aria-label="Search threats, objects, or risk levels"
              />
              <kbd>/</kbd>
            </label>

            <button
              type="button"
              className="risk-clear-search"
              onClick={() => setSearch('')}
              disabled={!search}
            >
              Clear
            </button>
          </div>

          <div className="risk-threat-list">
            {filteredThreats.length ? (
              filteredThreats.map((threat) => {
                const selected = selectedThreatId === threat.id
                const meta = RISK_META[threat.level]

                return (
                  <button
                    key={threat.id}
                    type="button"
                    data-risk-threat-id={threat.id}
                    className={`risk-threat ${selected ? 'selected' : ''}`}
                    onClick={() => selectThreat(threat)}
                    aria-pressed={selected}
                    aria-label={`Inspect ${threat.objectA} and ${threat.objectB}, ${meta.label} risk`}
                  >
                    <span className={`risk-threat-accent ${threat.level.toLowerCase()}`} />

                    <span className="risk-threat-main">
                      <strong>
                        {formatThreatName(threat.objectA)}
                        <span> × </span>
                        {formatThreatName(threat.objectB)}
                      </strong>
                      <small>{threat.window}</small>
                    </span>

                    <span className="risk-threat-context">
                      <small>Miss distance</small>
                      <strong>{threat.distance}</strong>
                    </span>

                    <span className="risk-threat-context time">
                      <small>Time to TCA</small>
                      <strong>{threat.window.replace('TCA ', '')}</strong>
                    </span>

                    <span className={`risk-level ${threat.level.toLowerCase()}`}>
                      {meta.label}
                    </span>

                    <ArrowRight size={16} />
                  </button>
                )
              })
            ) : (
              <div className="risk-empty">
                <span className="risk-empty-icon">
                  <ShieldAlert size={18} />
                </span>
                <strong>No conjunctions match your filters</strong>
                <span>Try clearing the search or switching the severity filter.</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setFilter('ALL')
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedThreat && (
        <div className="risk-detail-layer">
          <button
            type="button"
            className="risk-detail-backdrop"
            aria-label="Close threat details"
            onClick={closeThreat}
          />

          <aside className="risk-detail" aria-label="Selected threat detail">
            <header className="risk-detail-header">
              <div>
                <span className="eyebrow">SELECTED THREAT</span>
                <p>Focused inspection</p>
              </div>

              <button
                type="button"
                className="risk-detail-close"
                onClick={closeThreat}
                aria-label="Close threat details"
              >
                <X size={18} />
              </button>
            </header>

            <div className="risk-detail-title">
              <div className="risk-detail-icon" data-risk-level={selectedThreat.level.toLowerCase()}>
                <ShieldAlert size={20} />
              </div>

              <div>
                <span className="risk-detail-level" data-risk-level={selectedThreat.level.toLowerCase()}>
                  {selectedThreat.level}
                </span>
                <h2>
                  {formatThreatName(selectedThreat.objectA)}
                  <span> × </span>
                  {formatThreatName(selectedThreat.objectB)}
                </h2>
                <p>
                  {RISK_META[selectedThreat.level].description}
                </p>
              </div>
            </div>

            <MiniThreatOrbit threat={selectedThreat} />

            <nav className="risk-detail-tabs" aria-label="Threat detail">
              {['overview', 'orbit', 'risk', 'telemetry'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={detailTab === tab ? 'active' : ''}
                  onClick={() => setDetailTab(tab)}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {detailTab === 'overview' && (
              <div className="risk-detail-body">
                <div className="risk-detail-grid">
                  <div>
                    <span>Miss distance</span>
                    <strong>{selectedThreat.distance}</strong>
                  </div>
                  <div>
                    <span>Time to TCA</span>
                    <strong>{selectedThreat.window.replace('TCA ', '')}</strong>
                  </div>
                  <div>
                    <span>Relative velocity</span>
                    <strong>{selectedThreat.velocity}</strong>
                  </div>
                  <div>
                    <span>Threat level</span>
                    <strong
                      className="risk-detail-risk-value"
                      data-risk-level={selectedThreat.level.toLowerCase()}
                    >
                      {selectedThreat.level}
                    </strong>
                  </div>
                </div>

                <div className={`risk-explanation ${selectedThreat.level.toLowerCase()}`}>
                  <span className="risk-explanation-icon">
                    <Clock3 size={15} />
                  </span>
                  <div>
                    <strong>Why this matters</strong>
                    <p>{RISK_META[selectedThreat.level].description}</p>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'orbit' && (
              <div className="risk-detail-body">
                <div className="risk-detail-grid">
                  <div>
                    <span>Object A</span>
                    <strong>{formatThreatName(selectedThreat.objectA)}</strong>
                  </div>
                  <div>
                    <span>Object B</span>
                    <strong>{formatThreatName(selectedThreat.objectB)}</strong>
                  </div>
                  <div>
                    <span>Closest approach</span>
                    <strong>{selectedThreat.distance}</strong>
                  </div>
                  <div>
                    <span>Relative velocity</span>
                    <strong>{selectedThreat.velocity}</strong>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'risk' && (
              <div className="risk-detail-body">
                <div className={`risk-explanation ${selectedThreat.level.toLowerCase()}`}>
                  <span className="risk-explanation-icon">
                    <ShieldAlert size={15} />
                  </span>
                  <div>
                    <strong>{RISK_META[selectedThreat.level].label} priority</strong>
                    <p>{RISK_META[selectedThreat.level].description}</p>
                  </div>
                </div>

                <div className="risk-detail-grid compact">
                  <div>
                    <span>Risk state</span>
                    <strong>{selectedThreat.level}</strong>
                  </div>
                  <div>
                    <span>Miss distance</span>
                    <strong>{selectedThreat.distance}</strong>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'telemetry' && (
              <div className="risk-detail-body">
                <div className="risk-detail-message">
                  <span className="risk-detail-message-dot" />
                  <p>
                    Detailed live telemetry is not connected in this prototype.
                    The current values describe the simulation/demo state.
                  </p>
                </div>

                <div className="risk-detail-grid compact">
                  <div>
                    <span>Relative velocity</span>
                    <strong>{selectedThreat.velocity}</strong>
                  </div>
                  <div>
                    <span>Screening window</span>
                    <strong>{selectedThreat.window}</strong>
                  </div>
                </div>
              </div>
            )}

            <Link to="/" className="risk-dashboard-button">
              <MapPinned size={15} />
              View on dashboard
              <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}
