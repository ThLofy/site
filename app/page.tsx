"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Zap, Moon, Sun, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react"
import Image from "next/image"
import * as THREE from "three"

interface Friend {
  id: string
  username: string
  displayName: string
  avatar: string
  description: string
  skills: { name: string; percentage: number; color: string }[]
  info: string
  discordTag: string
  status: "online" | "idle" | "dnd" | "offline"
}

const friends: Friend[] = [
  {
    id: "user1",
    username: "dnz",
    displayName: "DNZ",
    avatar: "/users/user1.png",
    description: "Ninguém Pode Me Encontrar.",
    skills: [
      { name: "Node.js", percentage: 70, color: "#68d391" },
      { name: "OSINT", percentage: 88, color: "#4fd1c7" },
      { name: "Engenharia Social", percentage: 92, color: "#f093fb" },
      { name: "Hacking", percentage: 85, color: "#feca57" },
    ],
    info: "Co-criador do lendário npm infectado e de múltiplas tools privadas. Especialista em operações stealth, códigos exploits que escapam até de EDRs avançados.",
    discordTag: "@comendoputa",
    status: "dnd",
  },
  {
    id: "user2",
    username: "thzz",
    displayName: "THZZ",
    avatar: "/users/user2.png",
    description: "Sim E Meu Carro na foto",
    skills: [
      { name: "Node.js", percentage: 98, color: "#68d391" },
      { name: "Payload Injection", percentage: 85, color: "#ff6b6b" },
      { name: "Obfuscação", percentage: 93, color: "#4ecdc4" },
      { name: "Bug Bounty", percentage: 78, color: "#ffe66d" },
    ],
    info: "Mente por trás do npm infectado que rodou o mundo. Mestre em manipulação de dados e engenharia reversa.",
    discordTag: "@4wqs",
    status: "dnd",
  },
]

const playlist = [
  { name: "Cyberpunk Vibes", url: "/music/track1.mp3" },
  { name: "Digital Dreams", url: "/music/track2.mp3" },
  { name: "Neon Nights", url: "/music/track3.mp3" },
  { name: "Code Matrix", url: "/music/track4.mp3" },
]

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function MusicPlayer({ darkMode }: { darkMode: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
    setIsPlaying(false)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={playlist[currentTrack].url}
        onEnded={nextTrack}
        onLoadedData={() => {
          if (isPlaying && audioRef.current) {
            audioRef.current.play()
          }
        }}
      />

      {}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => setShowPlayer(!showPlayer)}
          variant="outline"
          size="icon"
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
          } transition-all duration-300`}
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>

      {}
      {showPlayer && (
        <div
          className={`fixed top-16 left-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-xl ${
            darkMode ? "bg-black/80 border-gray-700" : "bg-white/90 border-gray-300"
          } border transition-all duration-300 min-w-80`}
        >
          <div className="space-y-4">
            {}
            <div className="text-center">
              <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {playlist[currentTrack].name}
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {currentTrack + 1} de {playlist.length}
              </p>
            </div>

            {}
            <div className="flex items-center justify-center gap-2">
              <Button onClick={prevTrack} variant="ghost" size="icon">
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button onClick={togglePlay} variant="ghost" size="icon" className="bg-purple-600 hover:bg-purple-700">
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </Button>

              <Button onClick={nextTrack} variant="ghost" size="icon">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button onClick={toggleMute} variant="ghost" size="icon">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className={`text-sm w-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {isMuted ? 0 : volume}
                </span>
              </div>
            </div>

            {}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {playlist.map((track, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTrack(index)
                    setIsPlaying(false)
                  }}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    index === currentTrack
                      ? darkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-900"
                      : darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Friend3DCard({ friend, position }: { friend: Friend; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.3

      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4} position={position}>
      <mesh ref={meshRef} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
        <boxGeometry args={[4, 5.5, 0.3]} />
        <meshStandardMaterial
          color={hovered ? "#2a2a2a" : "#1a1a1a"}
          transparent
          opacity={0.9}
          emissive={hovered ? "#7c3aed" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2} position={[0, 1.8, 0.2]}>
        <Sphere args={[0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={hovered ? 0.3 : 0.1} />
        </Sphere>
      </Float>

      {}
      <Sphere args={[0.15]} position={[0.6, 2.1, 0.3]}>
        <meshBasicMaterial
          color={
            friend.status === "online"
              ? "#22c55e"
              : friend.status === "idle"
                ? "#eab308"
                : friend.status === "dnd"
                  ? "#ef4444"
                  : "#6b7280"
          }
        />
      </Sphere>

      {}
      {hovered && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Float key={i} speed={3} rotationIntensity={0.5} floatIntensity={1}>
              <Sphere
                args={[0.02]}
                position={[(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2]}
              >
                <meshBasicMaterial color="#7c3aed" transparent opacity={0.6} />
              </Sphere>
            </Float>
          ))}
        </group>
      )}
    </Float>
  )
}

function StaticScene() {
  return (
    <>
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#7c3aed" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

      {}
      {friends.map((friend, index) => (
        <Friend3DCard key={friend.id} friend={friend} position={[index * 10 - 5, 0, 0]} />
      ))}
    </>
  )
}

function BackgroundParticles({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = 200

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.4,
          originalVx: (Math.random() - 0.5) * 0.8,
          originalVy: (Math.random() - 0.5) * 0.8,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          const force = (120 - distance) / 120
          particle.vx += (dx / distance) * force * 0.015
          particle.vy += (dy / distance) * force * 0.015
        } else {
          particle.vx += (particle.originalVx - particle.vx) * 0.01
          particle.vy += (particle.originalVy - particle.vy) * 0.01
        }

        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.8
          particle.originalVx *= -0.8
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.8
          particle.originalVy *= -0.8
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        const color = darkMode ? "124, 58, 237" : "168, 85, 247"

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${particle.opacity * 0.1})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${particle.opacity})`
        ctx.fill()

        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx2 = particle.x - otherParticle.x
          const dy2 = particle.y - otherParticle.y
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

          if (distance2 < 80) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            const opacity = 0.3 * (1 - distance2 / 80)
            ctx.strokeStyle = `rgba(${color}, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    resizeCanvas()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [darkMode])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

function SkillsDisplay({ friend, darkMode }: { friend: Friend; darkMode: boolean }) {
  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
        <Zap className="w-5 h-5 text-yellow-400" />
        HABILIDADES
      </h4>

      <div className="space-y-3">
        {friend.skills.map((skill, index) => (
          <div key={skill.name} className="skill-item" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {skill.name}
              </span>
              <span className="text-sm font-bold" style={{ color: skill.color }}>
                {skill.percentage}%
              </span>
            </div>

            <div className={`w-full rounded-full h-3 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out skill-bar-fill"
                style={{
                  width: `${skill.percentage}%`,
                  background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                  boxShadow: `0 0 10px ${skill.color}50`,
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DiscordFriends3D() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-black text-white" : "bg-white text-gray-900"} overflow-hidden relative`}
    >
      {}
      <BackgroundParticles darkMode={darkMode} />

      {}
      <MusicPlayer darkMode={darkMode} />

      {}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setDarkMode(!darkMode)}
          variant="outline"
          size="icon"
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
          } transition-all duration-300`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {}
      <div className="h-screen w-full relative z-10">
        <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
          <Suspense fallback={null}>
            <StaticScene />
          </Suspense>
        </Canvas>

        {}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {friends.map((friend, index) => (
              <Card
                key={friend.id}
                className={`${
                  darkMode
                    ? "bg-black/60 border-purple-500/40 hover:border-purple-400/60 hover:bg-black/70"
                    : "bg-white/80 border-purple-300/60 hover:border-purple-400/80 hover:bg-white/90"
                } backdrop-blur-xl overflow-hidden transition-all duration-300 card-hover-effect`}
                style={{
                  animationDelay: `${index * 0.4}s`,
                  animation: "slideInUp 1s ease-out forwards",
                }}
              >
                <CardContent className="p-6">
                  {}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500 transition-all duration-300 group-hover:border-purple-400 group-hover:scale-110">
                        <Image
                          src={friend.avatar || "/placeholder.svg"}
                          alt={friend.username}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${
                          darkMode ? "border-black" : "border-white"
                        } transition-all duration-300 ${
                          friend.status === "online"
                            ? "bg-green-500 shadow-green-500/50"
                            : friend.status === "idle"
                              ? "bg-yellow-500 shadow-yellow-500/50"
                              : friend.status === "dnd"
                                ? "bg-red-500 shadow-red-500/50"
                                : "bg-gray-500"
                        } shadow-lg`}
                      />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {friend.displayName}
                      </h3>
                      <p className="text-purple-400 text-sm mb-2">{friend.description}</p>
                      <div
                        className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <DiscordIcon className="w-4 h-4" />
                        <span>{friend.discordTag}</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="mb-6">
                    <SkillsDisplay friend={friend} darkMode={darkMode} />
                  </div>

                  {}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {friend.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skill.name}
                        className="skill-badge transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: skill.color + "20",
                          borderColor: skill.color + "60",
                          color: skill.color,
                          animationDelay: `${skillIndex * 0.1}s`,
                        }}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>

                  {}
                  <div className="space-y-3">
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {friend.info}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
