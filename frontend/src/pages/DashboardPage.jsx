import MissionViewport from '../components/MissionViewport'
import MonitoringConsole from '../components/MonitoringConsole'
import SimulationPanel from '../components/SimulationPanel'
import { mockThreats } from '../data/mockMissionData'
import { useMissionContext } from '../layouts/useMissionContext'
import { adaptConjunctionResult, screenConjunction } from '../services/conjunctionService'
import { resolveObject, useOrbitalObjects } from '../services/objectService'

export default function DashboardPage() {
  const {
    selectedThreat,
    setSelectedThreat,
    simulation,
    setSimulation,
  } = useMissionContext()

  const { objects: orbitalObjects } = useOrbitalObjects()

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
      const objectA = resolveObject(
        orbitalObjects,
        selectedThreat.objectA,
      )

      const objectB = resolveObject(
        orbitalObjects,
        selectedThreat.objectB,
      )

      if (!objectA || !objectB) {
        throw new Error(
          'Unable to resolve both objects for screening.',
        )
      }

      const start = new Date()
      const end = new Date(
        start.getTime() + 90 * 60 * 1000,
      )

      const result = await screenConjunction({
        objectA: objectA.id,
        objectB: objectB.id,
        start: start.toISOString(),
        end: end.toISOString(),
        stepMinutes: 5,
      })

      setSimulation({
        active: false,
        progress: 100,
        result: adaptConjunctionResult(result),
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