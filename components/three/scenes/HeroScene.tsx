'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei'
import { Suspense } from 'react'
import { MetallicStructure } from '../models/MetallicStructure'
import { WeldingSparks } from '../effects/WeldingSparks'

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Iluminación */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b35" />
          
          {/* Cámara */}
          <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          {/* Modelos */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <MetallicStructure />
          </Float>
          
          {/* Efectos */}
          <WeldingSparks count={300} />
          
          {/* Entorno */}
          <Environment preset="city" />
          
          {/* Niebla */}
          <fog attach="fog" color="#0a0a0a" near={10} far={50} />
        </Suspense>
      </Canvas>
    </div>
  )
}