import { ChevronRight, Crosshair, Orbit, Radar, Satellite, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockConjunctionPairs, mockOrbitalObjects } from '../data/mockOrbitalData'
import '../styles/track.css'

const RISK_LABEL = { normal: 'Normal', elevated: 'Elevated', critical: 'Critical' }
const typeOf = object => object.id.startsWith('DEBRIS') ? 'Debris' : object.id.startsWith('OBJECT') ? 'Unknown object' : 'Satellite'
const conjunctionPartnerId = id => {
  const pair = mockConjunctionPairs.find(pair => pair.includes(id))
  return pair ? pair.find(member => member !== id) : null
}

export default function TrackPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('overview')

  const counts = useMemo(() => ({
    all: mockOrbitalObjects.length,
    normal: mockOrbitalObjects.filter(o => o.risk === 'normal').length,
    elevated: mockOrbitalObjects.filter(o => o.risk === 'elevated').length,
    critical: mockOrbitalObjects.filter(o => o.risk === 'critical').length,
  }), [])

  const objects = useMemo(() => mockOrbitalObjects.filter(o =>
    (filter === 'all' || o.risk === filter) &&
    (!search.trim() || `${o.id} ${o.name}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [filter, search])

  const selectObject = object => { setSelected(object); setTab('overview') }

  const partnerId = selected ? conjunctionPartnerId(selected.id) : null
  const partner = partnerId ? mockOrbitalObjects.find(o => o.id === partnerId) : null

  return (
    <section className="registry-page">
      <header className="registry-page-heading">
        <div>
          <h1>Orbital object registry</h1>
          <p>Search, inspect, and maintain awareness of the active tracking catalogue.</p>
        </div>
        <span><i/> Live tracking</span>
      </header>

      <div className={`registry-stage ${selected ? 'has-selection' : ''}`}>
        <section className="registry-surface" aria-label="Orbital object registry">
          <div className="registry-tools">
            <label>
              <Search size={17}/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search an orbital object"/>
            </label>
            <div className="registry-filters">
              {['all', 'normal', 'elevated', 'critical'].map(value => (
                <button
                  type="button"
                  key={value}
                  className={`${filter === value ? 'active' : ''} ${value}`}
                  onClick={() => setFilter(value)}
                >
                  {value}<b>{counts[value]}</b>
                </button>
              ))}
            </div>
          </div>

          <div className="registry-list">
            <div className="registry-columns"><span>Object</span><span>Risk</span><span>Last seen</span></div>
            {objects.length ? objects.map(object => (
              <button
                key={object.id}
                type="button"
                onClick={() => selectObject(object)}
                className={`registry-row ${selected?.id === object.id ? 'selected' : ''}`}
              >
                <span className="registry-object">
                  <i className={object.risk}/>
                  <strong>{object.name}</strong>
                  <small>{object.id} · {typeOf(object)}</small>
                </span>
                <span className={`risk-badge ${object.risk}`}>{RISK_LABEL[object.risk]}</span>
                <span className="registry-seen">just now</span>
                <ChevronRight size={16}/>
              </button>
            )) : <p className="registry-empty">No objects match the current filter.</p>}
          </div>
        </section>

        {selected && (
          <>
            <button
              type="button"
              className="detail-backdrop"
              aria-label="Close selected object details"
              onClick={() => setSelected(null)}
            />

            <aside className="registry-detail" aria-label="Selected object detail">
              <div className="detail-top">
                <span className="detail-symbol"><Satellite size={22}/></span>
                <div>
                  <p>Selected object</p>
                  <h2>{selected.name}</h2>
                  <small>{selected.id} · {typeOf(selected)}</small>
                </div>
                <button
                  type="button"
                  className="detail-close"
                  aria-label="Close selected object details"
                  onClick={() => setSelected(null)}
                >
                  <X size={17}/>
                </button>
              </div>

              <div className="detail-status">
                <span className={`risk-badge ${selected.risk}`}>{RISK_LABEL[selected.risk]} risk</span>
                <span className="tracked"><i/>Tracked</span>
              </div>

              <nav className="detail-tabs" aria-label="Object detail sections">
                <button type="button" className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
                <button type="button" className={tab === 'orbit' ? 'active' : ''} onClick={() => setTab('orbit')}>Orbit</button>
                <button type="button" className={tab === 'telemetry' ? 'active' : ''} onClick={() => setTab('telemetry')}>Telemetry</button>
                <button type="button" className={tab === 'risk' ? 'active' : ''} onClick={() => setTab('risk')}>Risk</button>
              </nav>

              <div className="detail-body">
                {tab === 'overview' && (
                  <div className="detail-values">
                    <div><span>Orbit radius</span><strong>{selected.radius.toFixed(2)} R⊕</strong></div>
                    <div><span>Inclination</span><strong>{(selected.inclination * 57.3).toFixed(1)}°</strong></div>
                    <div><span>Orbital phase</span><strong>{selected.phase.toFixed(2)} rad</strong></div>
                    <div><span>Track rate</span><strong>{selected.speed.toFixed(3)}</strong></div>
                  </div>
                )}

                {tab === 'orbit' && (
                  <div className="detail-orbit">
                    <div className="orbit-visual">
                      <div className="orbit-ring"><Orbit size={26}/><i/></div>
                      <span>Current orbital path</span>
                    </div>
                    <div className="detail-values">
                      <div><span>Orbital phase</span><strong>{selected.phase.toFixed(2)} rad</strong></div>
                      <div><span>Track rate</span><strong>{selected.speed.toFixed(3)}</strong></div>
                      <div><span>Orbit radius</span><strong>{selected.radius.toFixed(2)} R⊕</strong></div>
                      <div><span>Inclination</span><strong>{(selected.inclination * 57.3).toFixed(1)}°</strong></div>
                    </div>
                  </div>
                )}

                {tab === 'telemetry' && (
                  <p className="detail-message">Live telemetry is not yet connected for this object. The figures shown here reflect the current simulation state, not a real-time downlink.</p>
                )}

                {tab === 'risk' && (
                  <div className="detail-risk">
                    {partner ? (
                      <>
                        <p className="detail-message">This object is part of an active conjunction pair being monitored.</p>
                        <div className="conjunction-pair">
                          <Radar size={15}/>
                          <span>Closest tracked object</span>
                          <strong>{partner.name}</strong>
                        </div>
                      </>
                    ) : (
                      <p className="detail-message">No active conjunction pairs involve this object right now.</p>
                    )}
                  </div>
                )}
              </div>

              <Link to="/" className="detail-action"><Crosshair size={16}/> View on dashboard</Link>
            </aside>
          </>
        )}
      </div>
    </section>
  )
}
