import { AlertTriangle, BarChart3, Database, Gauge, Orbit, Settings2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
const nav = [['/', 'Dashboard', Gauge], ['track', 'Track', Orbit], ['risk', 'Risk', AlertTriangle], ['alerts', 'Alert', BarChart3]]
const system = [['data-science', 'Data Science', Database], ['preferences', 'Preferences', Settings2]]
const Group = ({ label, items }) => <div className="rail-group"><span className="rail-label">{label}</span>{items.map(([path, text, Icon]) => <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{text}</span></NavLink>)}</div>
export default function NavigationRail() { return <aside className="navigation-rail"><Group label="NAVIGATION" items={nav} /><Group label="SYSTEM" items={system} /><div className="rail-footer"><span className="demo-dot" /> INTERNAL REVIEW BUILD</div></aside> }
