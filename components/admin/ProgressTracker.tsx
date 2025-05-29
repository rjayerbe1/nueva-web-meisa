"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface Phase {
  name: string
  progress: number
  completed: boolean
}

interface ProgressTrackerProps {
  phases?: Phase[]
  onChange?: (phases: Phase[]) => void
}

const defaultPhases: Phase[] = [
  { name: "Planificación", progress: 0, completed: false },
  { name: "Diseño", progress: 0, completed: false },
  { name: "Fabricación", progress: 0, completed: false },
  { name: "Montaje", progress: 0, completed: false },
  { name: "Finalización", progress: 0, completed: false },
]

export function ProgressTracker({ 
  phases = defaultPhases, 
  onChange 
}: ProgressTrackerProps) {
  const [projectPhases, setProjectPhases] = useState<Phase[]>(phases)

  const updatePhase = (index: number, progress: number) => {
    const updated = [...projectPhases]
    updated[index] = {
      ...updated[index],
      progress: Math.min(100, Math.max(0, progress)),
      completed: progress >= 100
    }
    setProjectPhases(updated)
    onChange?.(updated)
  }

  const overallProgress = Math.round(
    projectPhases.reduce((sum, phase) => sum + phase.progress, 0) / 
    projectPhases.length
  )

  return (
    <div className="space-y-6">
      {/* Progreso general */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-lg font-semibold">Progreso General</Label>
          <span className="text-2xl font-bold text-meisa-blue">
            {overallProgress}%
          </span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      {/* Fases individuales */}
      <div className="space-y-4">
        {projectPhases.map((phase, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {phase.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : phase.progress > 0 ? (
                  <Clock className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <Label className="font-medium">{phase.name}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={phase.progress}
                  onChange={(e) => updatePhase(index, parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <Progress 
              value={phase.progress} 
              className={`h-2 ${
                phase.completed 
                  ? "bg-green-100" 
                  : phase.progress > 0 
                  ? "bg-yellow-100" 
                  : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Timeline visual */}
      <div className="mt-6 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-meisa-blue transition-all duration-300"
          style={{ width: `${overallProgress}%` }}
        />
        <div className="flex justify-between relative">
          {projectPhases.map((phase, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                  phase.completed
                    ? "bg-green-600 border-green-600 text-white"
                    : phase.progress > 0
                    ? "bg-yellow-500 border-yellow-500 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {phase.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-semibold">
                    {index + 1}
                  </span>
                )}
              </div>
              <span className="text-xs mt-2 text-center max-w-[80px]">
                {phase.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}