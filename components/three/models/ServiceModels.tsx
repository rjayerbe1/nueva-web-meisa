'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cone, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Modelo 3D para Diseño Estructural - Plano 3D
export function DesignModel({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      if (isHovered) {
        groupRef.current.scale.setScalar(1.1)
      } else {
        groupRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Base del plano */}
      <Box args={[2, 0.05, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Líneas de diseño */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={`line-h-${i}`}
          args={[2, 0.02, 0.02]}
          position={[0, 0.05, -0.8 + i * 0.4]}
        >
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
        </Box>
      ))}
      {[...Array(5)].map((_, i) => (
        <Box
          key={`line-v-${i}`}
          args={[0.02, 0.02, 2]}
          position={[-0.8 + i * 0.4, 0.05, 0]}
        >
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
        </Box>
      ))}
    </group>
  )
}

// Modelo 3D para Fabricación - Máquina soldadora
export function FabricationModel({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const sparkRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
      if (isHovered && sparkRef.current) {
        sparkRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.5)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Brazo de soldadura */}
      <Cylinder args={[0.1, 0.15, 1.5]} position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Punta de soldadura */}
      <Cone args={[0.1, 0.3]} position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#ff6b35" metalness={0.9} roughness={0.1} />
      </Cone>
      
      {/* Chispa */}
      {isHovered && (
        <Box ref={sparkRef} args={[0.1, 0.1, 0.1]} position={[0.7, 0.2, 0]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ff6b35"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Box>
      )}
      
      {/* Base */}
      <Box args={[1.5, 0.1, 1]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
      </Box>
    </group>
  )
}

// Modelo 3D para Montaje - Grúa
export function AssemblyModel({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const hookRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      if (isHovered) {
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
        if (hookRef.current) {
          hookRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.2 - 1
        }
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Torre de la grúa */}
      <Box args={[0.2, 3, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* Brazo horizontal */}
      <Box args={[2, 0.2, 0.2]} position={[0.9, 1.4, 0]}>
        <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* Cable */}
      <Cylinder args={[0.02, 0.02, 1]} position={[1.8, 0.9, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Gancho */}
      <group ref={hookRef} position={[1.8, -1, 0]}>
        <Torus args={[0.15, 0.03, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ff6b35" metalness={0.9} roughness={0.1} />
        </Torus>
      </group>
      
      {/* Base */}
      <Box args={[1, 0.2, 1]} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.5} roughness={0.5} />
      </Box>
    </group>
  )
}

// Modelo 3D para Obra Civil - Edificio
export function CivilWorkModel({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const buildingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
      if (isHovered && buildingRef.current) {
        const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
        buildingRef.current.scale.y = scale
      }
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={buildingRef}>
        {/* Pisos del edificio */}
        {[...Array(4)].map((_, i) => (
          <Box
            key={`floor-${i}`}
            args={[1.5, 0.3, 1.5]}
            position={[0, i * 0.4 - 0.6, 0]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? "#1e3a5f" : "#ff6b35"}
              metalness={0.4}
              roughness={0.6}
            />
          </Box>
        ))}
        
        {/* Ventanas */}
        {[...Array(3)].map((_, floor) =>
          [...Array(3)].map((_, window) => (
            <Box
              key={`window-${floor}-${window}`}
              args={[0.2, 0.2, 0.05]}
              position={[
                -0.5 + window * 0.5,
                floor * 0.4 - 0.4,
                0.78
              ]}
            >
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={isHovered ? 0.5 : 0.2}
              />
            </Box>
          ))
        )}
      </group>
      
      {/* Base */}
      <Box args={[2, 0.1, 2]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.3} roughness={0.7} />
      </Box>
    </group>
  )
}