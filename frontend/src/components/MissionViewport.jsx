import { MousePointer2 } from 'lucide-react'
import OrbitalScene from './OrbitalScene'
import ClockStatus from './ClockStatus'
export default function MissionViewport({ selectedThreat, onObjectSelect, simulation }) { return <section className="mission-viewport"><div className="staging-canvas orbital-canvas"><OrbitalScene selectedThreat={selectedThreat} onObjectSelect={onObjectSelect} simulation={simulation}/><ClockStatus/><div className="selected-overlay"><MousePointer2 size={15}/>{selectedThreat.objectA} / {selectedThreat.objectB}</div></div></section> }
