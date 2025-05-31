'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'

export function WeldingSparks({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<Float32Array>()

  // Crear posiciones iniciales de partículas
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Posición inicial aleatoria
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      // Velocidad inicial
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = Math.random() * 0.05 + 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    particlesRef.current = positions
    return [positions, velocities]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current || !particlesRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      // Actualizar posición
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]
      
      // Aplicar gravedad
      velocities[i * 3 + 1] -= 0.001
      
      // Reset si la partícula cae demasiado
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = Math.random() * 5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.02
        velocities[i * 3 + 1] = Math.random() * 0.05 + 0.02
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Rotación lenta de todo el sistema
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff6b35"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}