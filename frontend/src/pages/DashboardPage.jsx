import { useState } from 'react'
import MissionViewport from '../components/MissionViewport'
import ContextPanel from '../components/ContextPanel'
import FeatureDock from '../components/FeatureDock'
import ViewControls from '../components/ViewControls'
import { mockThreats } from '../data/mockMissionData'
import { useMissionContext } from '../layouts/useMissionContext'
import { runMockSimulation } from '../services/simulationService'
export default function DashboardPage() { const {selectedThreat,setSelectedThreat,simulation,setSimulation}=useMissionContext(); const [activePanel,setActivePanel]=useState(null); const selectObject=id=>{const threat=mockThreats.find(item=>item.objectA===id||item.objectB===id);if(threat){setSelectedThreat(threat);setActivePanel('track')}};const handleSimulation=async()=>{if(simulation.active)return;setSimulation({active:true,progress:0,result:null});try{const result=await runMockSimulation(selectedThreat,progress=>setSimulation(current=>({...current,progress})));setSimulation({active:false,progress:100,result})}catch(error){console.error('Simulation failed:',error);setSimulation({active:false,progress:0,result:null})}};return <section className="dashboard-workspace"><MissionViewport selectedThreat={selectedThreat} simulation={simulation} onObjectSelect={selectObject}/><ContextPanel panel={activePanel} selectedThreat={selectedThreat} onSelectThreat={setSelectedThreat} simulation={simulation} onRunSimulation={handleSimulation} onClose={()=>setActivePanel(null)}/><FeatureDock activePanel={activePanel} onSelect={setActivePanel}/><ViewControls/></section> }
