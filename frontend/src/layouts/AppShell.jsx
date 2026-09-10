import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import NavigationRail from '../components/NavigationRail'
import TopBar from '../components/TopBar'
import { mockThreats } from '../data/mockMissionData'
export default function AppShell() { const [selectedThreat, setSelectedThreat] = useState(mockThreats[0]); const [navigationOpen, setNavigationOpen] = useState(false); const [simulation, setSimulation] = useState({active:false,progress:0,result:null}); return <main className="app-shell"><TopBar onMenuToggle={() => setNavigationOpen(open => !open)}/><NavigationRail isOpen={navigationOpen} onNavigate={() => setNavigationOpen(false)}/><div className="app-grid"><section className="content-area"><Outlet context={{selectedThreat,setSelectedThreat,simulation,setSimulation}}/></section></div></main> }
