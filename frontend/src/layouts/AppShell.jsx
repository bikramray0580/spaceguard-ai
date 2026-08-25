import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import IntelPanel from '../components/IntelPanel'
import NavigationRail from '../components/NavigationRail'
import TopBar from '../components/TopBar'
import { mockThreats } from '../data/mockMissionData'
export default function AppShell() { const [selectedThreat, setSelectedThreat] = useState(mockThreats[0]); return <main className="app-shell"><TopBar /><div className="app-grid"><NavigationRail /><section className="content-area"><Outlet context={{ selectedThreat, setSelectedThreat }} /></section><IntelPanel selectedThreat={selectedThreat} /></div></main> }
