"use client"

import { Canvas } from "@react-three/fiber"
import { Float, Text3D } from "@react-three/drei"

export function Loading3D() {
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <Text3D font="/fonts/Geist_Bold.json" size={1} height={0.2}>
            CARREGANDO...
            <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
          </Text3D>
        </Float>
      </Canvas>
    </div>
  )
}
