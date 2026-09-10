import { ChevronRight, Crosshair, Orbit, Search, Satellite } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockOrbitalObjects } from '../data/mockOrbitalData'
import '../styles/track.css'

const label = risk => risk === 'critical' ? 'Critical' : risk === 'elevated' ? 'Elevated' : 'Normal'
const type = object => object.id.startsWith('DEBRIS') ? 'Debris' : object.id.startsWith('OBJECT') ? 'Unknown object' : 'Satellite'

export default function TrackPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(mockOrbitalObjects[0])
  const [tab, setTab] = useState('overview')
  const counts = useMemo(() => ({ all: mockOrbitalObjects.length, normal: mockOrbitalObjects.filter(o => o.risk === 'normal').length, elevated: mockOrbitalObjects.filter(o => o.risk === 'elevated').length, critical: mockOrbitalObjects.filter(o => o.risk === 'critical').length }), [])
  const objects = useMemo(() => mockOrbitalObjects.filter(o => (filter === 'all' || o.risk === filter) && (!search.trim() || `${o.id} ${o.name}`.toLowerCase().includes(search.trim().toLowerCase()))), [filter, search])
  return <section className="registry-page">
    <header className="registry-page-heading"><div><h1>Orbital object registry</h1><p>Search, inspect, and maintain awareness of the active tracking catalogue.</p></div><span><i/> Live tracking</span></header>
    <div className="registry-stage">
      <section className="registry-surface" aria-label="Orbital object registry">
        <div className="registry-tools"><label><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search an orbital object"/></label><div className="registry-filters">{['all','normal','elevated','critical'].map(value => <button type="button" key={value} className={`${filter === value ? 'active' : ''} ${value}`} onClick={() => setFilter(value)}>{value}<b>{counts[value]}</b></button>)}</div></div>
        <div className="registry-list"><div className="registry-columns"><span>Object</span><span>Type</span><span>Tracked</span><span>Risk</span><span>Last seen</span></div>{objects.length ? objects.map(object => <button key={object.id} type="button" onClick={() => { setSelected(object); setTab('overview') }} className={`registry-row ${selected.id === object.id ? 'selected' : ''}`}><span className="registry-object"><i className={object.risk}/><strong>{object.name}</strong><small>{object.id}</small></span><span>{type(object)}</span><span className="tracked"><i/>Tracked</span><span className={`object-risk ${object.risk}`}>{label(object.risk)}</span><span>just now</span><ChevronRight size={16}/></button>) : <p className="registry-empty">No objects match the current filter.</p>}</div>
      </section>
      <aside className="registry-detail" aria-label="Selected object detail"><div className="detail-top"><span className="detail-symbol"><Satellite size={22}/></span><div><p>Selected object</p><h2>{selected.name}</h2><small>{selected.id} · {type(selected)}</small></div></div><div className="detail-status"><span className={`object-risk ${selected.risk}`}>{label(selected.risk)} risk</span><span className="tracked"><i/>Tracked</span></div><div className="detail-orbit"><div><Orbit size={31}/><i/></div><span>Current orbital path</span></div><nav className="detail-tabs"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button><button className={tab === 'telemetry' ? 'active' : ''} onClick={() => setTab('telemetry')}>Telemetry</button><button className={tab === 'risk' ? 'active' : ''} onClick={() => setTab('risk')}>Risk</button></nav>{tab === 'overview' ? <div className="detail-values"><div><span>Orbit radius</span><strong>{selected.radius.toFixed(2)} R⊕</strong></div><div><span>Inclination</span><strong>{(selected.inclination * 57.3).toFixed(1)}°</strong></div><div><span>Orbital phase</span><strong>{selected.phase.toFixed(2)} rad</strong></div><div><span>Track rate</span><strong>{selected.speed.toFixed(3)}</strong></div></div> : <p className="detail-message">{tab === 'telemetry' ? 'Additional telemetry is available for this actively tracked object.' : 'Risk context is updated as new conjunction information is received.'}</p>}<Link to="/" className="detail-action"><Crosshair size={16}/> View on dashboard</Link></aside>
    </div>
  </section>
}
