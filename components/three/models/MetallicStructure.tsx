'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface BeamProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  delay?: number
}

function Beam({ position, rotation = [0, 0, 0], scale = [0.1, 4, 0.1], delay = 0 }: BeamProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      // Animación de construcción
      const time = state.clock.getElapsedTime()
      const progress = Math.min((time - delay) / 0.5, 1)
      materialRef.current.opacity = progress
      
      if (meshRef.current && progress < 1) {
        meshRef.current.scale.y = progress
      }
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#1e3a5f"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0}
      />
    </Box>
  )
}

function Joint({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      const progress = Math.min((time - delay) / 0.3, 1)
      materialRef.current.opacity = progress
      
      if (meshRef.current) {
        meshRef.current.scale.setScalar(progress)
      }
    }
  })

  return (
    <Cylinder
      ref={meshRef}
      position={position}
      args={[0.15, 0.15, 0.3, 16]}
      castShadow
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#ff6b35"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0}
      />
    </Cylinder>
  )
}

export function MetallicStructure({ autoRotate = true }: { autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3
    }
  })

  // Definir la estructura de vigas
  const beams = useMemo(() => [
    // Base
    { position: [-2, 0, -2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0 },
    { position: [2, 0, -2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0.1 },
    { position: [-2, 0, 2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0.2 },
    { position: [2, 0, 2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0.3 },
    
    // Columnas
    { position: [-2, 2, -2] as [number, number, number], delay: 0.4 },
    { position: [2, 2, -2] as [number, number, number], delay: 0.5 },
    { position: [-2, 2, 2] as [number, number, number], delay: 0.6 },
    { position: [2, 2, 2] as [number, number, number], delay: 0.7 },
    
    // Techo
    { position: [-2, 4, -2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0.8 },
    { position: [2, 4, -2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 0.9 },
    { position: [-2, 4, 2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 1.0 },
    { position: [2, 4, 2] as [number, number, number], rotation: [0, 0, Math.PI / 2] as [number, number, number], scale: [0.1, 4, 0.1] as [number, number, number], delay: 1.1 },
    
    // Diagonales
    { position: [0, 2, -2] as [number, number, number], rotation: [0, 0, Math.PI / 4] as [number, number, number], scale: [0.08, 5.65, 0.08] as [number, number, number], delay: 1.2 },
    { position: [0, 2, 2] as [number, number, number], rotation: [0, 0, -Math.PI / 4] as [number, number, number], scale: [0.08, 5.65, 0.08] as [number, number, number], delay: 1.3 },
  ], [])

  const joints = useMemo(() => [
    // Uniones base
    { position: [-2, 0, -2] as [number, number, number], delay: 0.2 },
    { position: [2, 0, -2] as [number, number, number], delay: 0.3 },
    { position: [-2, 0, 2] as [number, number, number], delay: 0.4 },
    { position: [2, 0, 2] as [number, number, number], delay: 0.5 },
    
    // Uniones techo
    { position: [-2, 4, -2] as [number, number, number], delay: 1.0 },
    { position: [2, 4, -2] as [number, number, number], delay: 1.1 },
    { position: [-2, 4, 2] as [number, number, number], delay: 1.2 },
    { position: [2, 4, 2] as [number, number, number], delay: 1.3 },
  ], [])

  return (
    <group ref={groupRef}>
      {beams.map((beam, index) => (
        <Beam key={`beam-${index}`} {...beam} />
      ))}
      {joints.map((joint, index) => (
        <Joint key={`joint-${index}`} {...joint} />
      ))}
    </group>
  )
}