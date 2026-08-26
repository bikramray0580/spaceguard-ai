import MissionViewport from '../components/MissionViewport'
import MonitoringConsole from '../components/MonitoringConsole'
import SimulationPanel from '../components/SimulationPanel'
import { mockThreats } from '../data/mockMissionData'
import { useMissionContext } from '../layouts/useMissionContext'
import { runMockSimulation } from '../services/simulationService'

export default function DashboardPage() {
  const {
    selectedThreat,
    setSelectedThreat,
    simulation,
    setSimulation,
  } = useMissionContext()

  const selectObject = (id) => {
    const threat = mockThreats.find(
      (item) => item.objectA === id || item.objectB === id
    )

    if (threat) {
      setSelectedThreat(threat)
    }
  }

  const handleSimulation = async () => {
    if (simulation.active) return

    setSimulation({
      active: true,
      progress: 0,
      result: null,
    })

    try {
      const result = await runMockSimulation(
  selectedThreat,
  (progress) => {
    setSimulation((current) => ({
      ...current,
      progress,
    }))
  }
)

      setSimulation({
        active: false,
        progress: 100,
        result,
      })
    } catch (error) {
      console.error('Simulation failed:', error)

      setSimulation({
        active: false,
        progress: 0,
        result: null,
      })
    }
  }

  return (
  <>
    <MissionViewport
      selectedThreat={selectedThreat}
      simulation={simulation}
      onObjectSelect={selectObject}
    />

    <SimulationPanel
      selectedThreat={selectedThreat}
      simulation={simulation}
      onRunSimulation={handleSimulation}
    />

    <MonitoringConsole
      threats={mockThreats}
      selectedThreat={selectedThreat}
      onSelect={setSelectedThreat}
    />
  </>
)
}