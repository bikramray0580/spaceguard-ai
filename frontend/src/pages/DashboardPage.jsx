import MissionViewport from '../components/MissionViewport'
import MonitoringConsole from '../components/MonitoringConsole'
import { mockThreats } from '../data/mockMissionData'
import { useMissionContext } from '../layouts/useMissionContext'
export default function DashboardPage() { const { selectedThreat, setSelectedThreat } = useMissionContext(); return <><MissionViewport selectedThreat={selectedThreat} /><MonitoringConsole threats={mockThreats} selectedThreat={selectedThreat} onSelect={setSelectedThreat} /></> }
