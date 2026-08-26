import { Html, OrbitControls, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { mockConjunctionPairs, mockOrbitalObjects } from '../data/mockOrbitalData'

const colors = { normal: '#6ee7f5', elevated: '#f3b85d', critical: '#ff7469' }
const axis = new THREE.Vector3(1, 0, 0)
const at = (object, angle) => new THREE.Vector3(Math.cos(angle) * object.radius, 0, Math.sin(angle) * object.radius).applyAxisAngle(axis, object.inclination)

function createNightEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext('2d')
  const ocean = context.createLinearGradient(0, 0, 1024, 512)
  ocean.addColorStop(0, '#0a2944'); ocean.addColorStop(.44, '#16708a'); ocean.addColorStop(.74, '#0a3d61'); ocean.addColorStop(1, '#061a32')
  context.fillStyle = ocean; context.fillRect(0, 0, 1024, 512)
  context.strokeStyle = 'rgba(132, 224, 220, 0.12)'; context.lineWidth = 1
  for (let latitude = 48; latitude < 512; latitude += 52) { context.beginPath(); context.moveTo(0, latitude); context.bezierCurveTo(240, latitude - 18, 700, latitude + 20, 1024, latitude - 5); context.stroke() }
  const land = ['#1b755e', '#32865e', '#21654e', '#3b8e62']
  const continents = [[170, 136, 144, 86], [382, 120, 168, 80], [566, 234, 164, 96], [792, 150, 136, 76], [274, 316, 96, 62]]
  continents.forEach(([x, y, width, height], index) => { context.save(); context.translate(x, y); context.rotate(index % 2 ? -.24 : .2); context.fillStyle = land[index % land.length]; context.beginPath(); context.ellipse(0, 0, width, height, 0, 0, Math.PI * 2); context.fill(); context.strokeStyle = 'rgba(151, 231, 163, 0.32)'; context.lineWidth = 2; context.stroke(); context.fillStyle = 'rgba(220, 245, 175, 0.36)'; for (let dot = 0; dot < 18; dot += 1) context.fillRect(Math.sin(dot * 5.2) * width * .7, Math.cos(dot * 3.7) * height * .65, 3, 2); context.restore() })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Earth() {
  const texture = useMemo(() => createNightEarthTexture(), [])
  return <group rotation={[.08, -.45, .12]}><mesh><sphereGeometry args={[1.72, 64, 64]} /><meshStandardMaterial map={texture} color="#d3f2e8" roughness={.72} metalness={.1} emissive="#0b3643" emissiveIntensity={.58} /></mesh><mesh scale={1.035}><sphereGeometry args={[1.72, 64, 64]} /><meshBasicMaterial color="#58e0ee" transparent opacity={.14} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh><mesh rotation={[.15, .45, 0]} scale={1.006}><sphereGeometry args={[1.72, 48, 48]} /><meshBasicMaterial color="#75dae4" wireframe transparent opacity={.018} /></mesh><directionalLight color="#c7f8e5" intensity={2.15} position={[4.5, 3.2, 4.8]} /><directionalLight color="#2b98bc" intensity={.42} position={[-4, -1, -3]} /></group>
}

function OrbitPath({ object, active }) {
  const points = useMemo(() => Array.from({ length: 161 }, (_, index) => at(object, index / 160 * Math.PI * 2)), [object])
  const positions = useMemo(() => new Float32Array(points.flatMap(point => point.toArray())), [points])
  return <group><line><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length} array={positions} itemSize={3} /></bufferGeometry><lineBasicMaterial color={active ? colors[object.risk] : '#33a8bf'} transparent opacity={active ? .96 : .42} /></line>{active && <line scale={1.002}><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length} array={positions} itemSize={3} /></bufferGeometry><lineBasicMaterial color={colors[object.risk]} transparent opacity={.25} /></line>}</group>
}

function Marker({ object, active, onSelect }) {
  const ref = useRef(); const halo = useRef(); const [hovered, setHovered] = useState(false)
  useFrame(({ clock }) => { const time = clock.getElapsedTime(); ref.current?.position.copy(at(object, object.phase + time * object.speed)); if (halo.current) { const pulse = active ? 1.55 + Math.sin(time * 3) * .18 : 1; halo.current.scale.setScalar(pulse) } })
  const visibleLabel = active || hovered
  return <group ref={ref}><mesh onClick={event => { event.stopPropagation(); onSelect(object.id) }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}><sphereGeometry args={[active ? .135 : .092, 16, 16]} /><meshBasicMaterial color={colors[object.risk]} /><pointLight color={colors[object.risk]} intensity={active ? 2.7 : 1.25} distance={1.9} /></mesh>{active && <mesh ref={halo}><sphereGeometry args={[.16, 16, 16]} /><meshBasicMaterial color={colors[object.risk]} transparent opacity={.14} blending={THREE.AdditiveBlending} /></mesh>}{visibleLabel && <Html distanceFactor={11} center style={{ pointerEvents: 'none' }}><span className="orbital-label">{object.name}</span></Html>}</group>
}

function ConjunctionIndicator({ objects }) {
  const line = useRef(); const beacon = useRef(); const [a, b] = objects
  useFrame(({ clock }) => { const time = clock.getElapsedTime(); const start = at(a, a.phase + time * a.speed); const end = at(b, b.phase + time * b.speed); line.current.geometry.setFromPoints([start, end]); beacon.current.position.copy(start.add(end).multiplyScalar(.5)); beacon.current.scale.setScalar(.85 + Math.sin(time * 3.4) * .18) })
  return <><line ref={line}><bufferGeometry /><lineBasicMaterial color="#ff7469" transparent opacity={.95} /></line><group ref={beacon}><mesh><sphereGeometry args={[.11, 16, 16]} /><meshBasicMaterial color="#ff8c81" /></mesh><mesh scale={2.2}><sphereGeometry args={[.11, 16, 16]} /><meshBasicMaterial color="#ff625a" transparent opacity={.12} blending={THREE.AdditiveBlending} /></mesh><pointLight color="#ff665e" intensity={2.2} distance={2.4} /></group></>
}

function Scene({ selectedThreat, onObjectSelect }) {
  const selectedIds = [selectedThreat.objectA, selectedThreat.objectB]
  const conjunction = mockConjunctionPairs.find(pair => pair.every(id => selectedIds.includes(id)))?.map(id => mockOrbitalObjects.find(object => object.id === id))
  return <><color attach="background" args={['#050d1a']} /><fog attach="fog" args={['#050d1a', 14, 25]} /><ambientLight intensity={.52} /><hemisphereLight args={['#71e5ed', '#071725', .62]} /><Stars radius={30} depth={14} count={720} factor={1.45} saturation={0} fade speed={.12} /><Earth />{mockOrbitalObjects.map(object => <OrbitPath key={`path-${object.id}`} object={object} active={selectedIds.includes(object.id)} />)}{conjunction && <ConjunctionIndicator objects={conjunction} />}{mockOrbitalObjects.map(object => <Marker key={object.id} object={object} active={selectedIds.includes(object.id)} onSelect={onObjectSelect} />)}<OrbitControls makeDefault enableRotate enableZoom enableDamping dampingFactor={.08} enablePan={false} minDistance={6.5} maxDistance={13} minPolarAngle={.55} maxPolarAngle={2.45} autoRotate autoRotateSpeed={.15} /></>
}

export default function OrbitalScene(props) { return <Canvas className="orbital-canvas-root" camera={{ position: [7.4, 5.5, 8.5], fov: 41 }} dpr={[1, 1.7]}><Scene {...props} /></Canvas> }
