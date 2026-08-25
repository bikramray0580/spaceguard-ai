import MissionViewport from '../components/MissionViewport'
import MonitoringConsole from '../components/MonitoringConsole'
import { mockThreats } from '../data/mockMissionData'
import { useMissionContext } from '../layouts/useMissionContext'
export default function DashboardPage() { const { selectedThreat, setSelectedThreat } = useMissionContext(); const selectObject = id => { const threat = mockThreats.find(item => item.objectA === id || item.objectB === id); if (threat) setSelectedThreat(threat) }; return <><MissionViewport selectedThreat={selectedThreat} onObjectSelect={selectObject} /><MonitoringConsole threats={mockThreats} selectedThreat={selectedThreat} onSelect={setSelectedThreat} /></> }
