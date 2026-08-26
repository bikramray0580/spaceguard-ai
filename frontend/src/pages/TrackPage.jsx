import {
  Activity,
  Crosshair,
  Search,
  Satellite,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockOrbitalObjects } from '../data/mockOrbitalData'
import '../styles/track.css'

const riskLabels = {
  all: 'ALL',
  normal: 'NORMAL',
  elevated: 'ELEVATED',
  critical: 'CRITICAL',
}

const getRiskLabel = (risk) => {
  if (risk === 'critical') return 'CRITICAL'
  if (risk === 'elevated') return 'ELEVATED'
  return 'NORMAL'
}

const getObjectType = (object) => {
  if (object.id.startsWith('DEBRIS')) return 'DEBRIS'
  if (object.id.startsWith('OBJECT')) return 'UNKNOWN'
  return 'SATELLITE'
}

export default function TrackPage() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [selectedObject, setSelectedObject] = useState(
    mockOrbitalObjects[0],
  )

  const filteredObjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mockOrbitalObjects.filter((object) => {
      const matchesSearch =
        !query ||
        object.id.toLowerCase().includes(query) ||
        object.name.toLowerCase().includes(query)

      const matchesRisk =
        riskFilter === 'all' ||
        object.risk === riskFilter

      return matchesSearch && matchesRisk
    })
  }, [search, riskFilter])

  const riskCounts = useMemo(() => {
    return {
      total: mockOrbitalObjects.length,
      normal: mockOrbitalObjects.filter(
        (object) => object.risk === 'normal',
      ).length,
      elevated: mockOrbitalObjects.filter(
        (object) => object.risk === 'elevated',
      ).length,
      critical: mockOrbitalObjects.filter(
        (object) => object.risk === 'critical',
      ).length,
    }
  }, [])

  return (
    <section className="track-page">
      <div className="track-header">
        <div>
          <span className="eyebrow">OBJECT REGISTRY</span>

          <h1>Track Objects</h1>

          <p>
            Monitor orbital objects currently registered in the
            SpaceGuard tracking system.
          </p>
        </div>

        <div className="track-live-status">
          <i />
          LIVE TRACKING
        </div>
      </div>

      <div className="track-summary">
        <div className="track-summary-card">
          <span>
            <Satellite size={13} />
            OBJECTS
          </span>
          <strong>{riskCounts.total}</strong>
          <small>currently monitored</small>
        </div>

        <div className="track-summary-card">
          <span>
            <Activity size={13} />
            NORMAL
          </span>
          <strong>{riskCounts.normal}</strong>
          <small>nominal risk</small>
        </div>

        <div className="track-summary-card elevated">
          <span>ELEVATED</span>
          <strong>{riskCounts.elevated}</strong>
          <small>requires attention</small>
        </div>

        <div className="track-summary-card critical">
          <span>CRITICAL</span>
          <strong>{riskCounts.critical}</strong>
          <small>requires review</small>
        </div>
      </div>

      <div className="track-workspace">
        <div className="object-registry">
          <div className="registry-header">
            <div>
              <span className="eyebrow">TRACKED OBJECTS</span>
              <h2>Orbital object registry</h2>
            </div>

            <span className="registry-count">
              {filteredObjects.length} / {mockOrbitalObjects.length}
            </span>
          </div>

          <div className="registry-toolbar">
            <label className="track-search">
              <Search size={15} />

              <input
                type="text"
                placeholder="SEARCH OBJECT..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </label>

            <div className="risk-filters">
              {Object.entries(riskLabels).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      riskFilter === value ? 'active' : ''
                    }
                    onClick={() =>
                      setRiskFilter(value)
                    }
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="object-table">
            <div className="object-table-heading">
              <span>OBJECT</span>
              <span>TYPE</span>
              <span>STATUS</span>
              <span>RISK</span>
              <span />
            </div>

            {filteredObjects.length > 0 ? (
              filteredObjects.map((object) => {
                const risk = getRiskLabel(object.risk)

                return (
                  <button
                    key={object.id}
                    type="button"
                    className={`object-table-row ${
                      selectedObject.id === object.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedObject(object)
                    }
                  >
                    <span className="track-object-name">
                      <i
                        className={`severity-dot ${object.risk}`}
                      />

                      <strong>{object.name}</strong>

                      <small>{object.id}</small>
                    </span>

                    <span>
                      {getObjectType(object)}
                    </span>

                    <span className="track-status">
                      <i />
                      TRACKED
                    </span>

                    <span>
                      <b
                        className={`risk-pill ${object.risk}`}
                      >
                        {risk}
                      </b>
                    </span>

                    <span className="track-row-arrow">
                      →
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="empty-registry">
                NO OBJECTS MATCH THE CURRENT FILTER
              </div>
            )}
          </div>
        </div>

        <aside className="object-detail">
          <div className="detail-heading">
            <span className="eyebrow">OBJECT DETAIL</span>

            <Crosshair size={18} />
          </div>

          <div className="detail-object">
            <span
              className={`detail-status ${selectedObject.risk}`}
            >
              {getRiskLabel(selectedObject.risk)}
            </span>

            <h2>{selectedObject.name}</h2>

            <small>{selectedObject.id}</small>
          </div>

          <div className="detail-grid">
            <div>
              <span>STATUS</span>
              <strong>ACTIVE</strong>
            </div>

            <div>
              <span>OBJECT TYPE</span>
              <strong>{getObjectType(selectedObject)}</strong>
            </div>

            <div>
              <span>ORBIT RADIUS</span>
              <strong>
                {selectedObject.radius.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>INCLINATION</span>
              <strong>
                {selectedObject.inclination.toFixed(2)} rad
              </strong>
            </div>

            <div>
              <span>PHASE</span>
              <strong>
                {selectedObject.phase.toFixed(2)} rad
              </strong>
            </div>

            <div>
              <span>TRACK RATE</span>
              <strong>
                {selectedObject.speed.toFixed(3)}
              </strong>
            </div>
          </div>

          <div className="detail-note">
            <span className="eyebrow">
              TRACKING STATUS
            </span>

            <p>
              Object is actively monitored by the
              SpaceGuard orbital tracking workspace.
            </p>
          </div>

          <Link
            to="/"
            className="detail-dashboard-button"
          >
            <Crosshair size={15} />
            VIEW ON DASHBOARD
          </Link>
        </aside>
      </div>
    </section>
  )
}