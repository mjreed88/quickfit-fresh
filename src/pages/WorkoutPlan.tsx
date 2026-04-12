import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Clock, Flame, ChevronDown, ChevronUp, Lock, Crown, CheckCircle, Target, Shield, AlertTriangle, Info, Image as ImageIcon } from 'lucide-react'
import { getWorkoutPlan } from '../lib/localStore'
import { WorkoutPlan, WorkoutExercise, ExerciseInstructionSet } from '../lib/types'
import { useAuth } from '../lib/AuthContext'
import { getExerciseInstruction } from '../lib/exerciseInstructions'
import { getExerciseImage } from '../lib/exerciseImages'

export default function WorkoutPlanPage() {
  const navigate = useNavigate()
  const { isPremium } = useAuth()
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(0)
  const [loadedInstructions, setLoadedInstructions] = useState<Record<string, ExerciseInstructionSet>>({})

  useEffect(() => {
    try {
      const saved = getWorkoutPlan()
      if (!saved) { navigate('/'); return }
      setWorkoutPlan(saved)
    } catch (err) {
      console.error('Failed to load workout plan:', err)
      navigate('/')
    }
  }, [navigate])

  // Toggle exercise instruction loading
  const toggleInstruction = (exercise: WorkoutExercise) => {
    if (!isPremium) return
    if (loadedInstructions[exercise.name]) {
      // Already loaded - hide it
      setLoadedInstructions(prev => {
        const next = { ...prev }
        delete next[exercise.name]
        return next
      })
    } else {
      // Load it
      const instruction = getExerciseInstruction(exercise.name)
      if (instruction) {
        setLoadedInstructions(prev => ({
          ...prev,
          [exercise.name]: instruction
        }))
      }
    }
  }

  if (!workoutPlan) {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Your Workout Plan</h1>
        <p className="text-gray-400 mt-1">{workoutPlan.days.length} days per week personalized for your goals</p>
      </div>

      {/* Premium Feature Banner */}
      {!isPremium && (
        <div className="mb-8 bg-gradient-to-r from-amber-900/30 to-red-900/30 rounded-xl p-6 border border-amber-500/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Premium Exercise Demonstrations</h3>
                <p className="text-gray-400 text-sm">Premium users see photos & proper form guides for every exercise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">$5.99/month</span>
              <a
                href="mailto:michael.j.reed218@gmail.com?subject=Upgrade to Premium"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors"
              >
                Upgrade to Unlock
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {workoutPlan.days.map((day, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === index ? null : index)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">{day.dayName}</h3>
                  <p className="text-gray-400 text-sm">{day.focus} - {day.exercises.length} exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" /> {day.duration} min
                  </div>
                  <div className="flex items-center gap-2 text-orange-400 text-sm">
                    <Flame className="h-4 w-4" /> ~{Math.round(day.estimatedCalories)} cal
                  </div>
                </div>
                {expandedDay === index ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </div>
            </button>

            {expandedDay === index && (
              <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                <div className="space-y-4">
                  {day.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      {/* Premium Content - Stock Image + Form Guide */}
                      {isPremium ? (
                        <div className="mb-4">
                          {/* Stock Image - Always Shown for Premium */}
                          <div className="bg-gray-900/50 rounded-lg overflow-hidden mb-3">
                            <div className="p-3 border-b border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="h-4 w-4 text-orange-400" />
                                <span className="text-sm font-bold text-white">Exercise Demonstration</span>
                              </div>
                              <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                  src={getExerciseImage(exercise.name)?.startImage || ''}
                                  alt={`${exercise.name} demonstration`}
                                  className="max-h-48 w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'
                                  }}
                                />
                              </div>
                            </div>

                            {/* View Form Guide Button */}
                            <div className="p-3">
                              <button
                                onClick={() => toggleInstruction(exercise)}
                                className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <Target className="h-4 w-4" />
                                {loadedInstructions[exercise.name] ? 'Hide Form Guide' : 'View Proper Form Guide'}
                              </button>
                            </div>
                          </div>

                          {/* Form Guide - Only shown when toggled */}
                          {loadedInstructions[exercise.name] && (() => {
                            const inst = loadedInstructions[exercise.name]
                            return (
                              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-3 border-b border-gray-700">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-green-500/20 p-1.5 rounded">
                                      <Target className="h-4 w-4 text-green-400" />
                                    </div>
                                    <span className="text-sm font-bold text-green-400">Proper Form Guide</span>
                                    <span className="text-xs text-gray-500 ml-auto">{inst.difficulty}</span>
                                  </div>
                                </div>

                                {/* Start/End Position */}
                                <div className="p-3 border-b border-gray-700">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-800 rounded-lg p-2">
                                      <div className="text-xs text-orange-400 font-semibold mb-1">START</div>
                                      <p className="text-xs text-gray-300">{inst.startPosition}</p>
                                    </div>
                                    <div className="bg-gray-800 rounded-lg p-2">
                                      <div className="text-xs text-green-400 font-semibold mb-1">END</div>
                                      <p className="text-xs text-gray-300">{inst.endPosition}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Step by Step */}
                                <div className="p-3 border-b border-gray-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-3 w-3 text-green-400" />
                                    <span className="text-xs font-semibold text-white">Step-by-Step:</span>
                                  </div>
                                  <ol className="space-y-1.5">
                                    {inst.steps.map((step: string, i: number) => (
                                      <li key={i} className="flex gap-2 text-xs text-gray-300">
                                        <span className="text-green-400 font-bold min-w-[18px]">{i + 1}.</span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {/* Form Cues */}
                                <div className="p-3 border-b border-gray-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-3 w-3 text-amber-400" />
                                    <span className="text-xs font-semibold text-amber-400">Form Cues:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {inst.formCues.map((cue: string, i: number) => (
                                      <span key={i} className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                                        {cue}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Safety Tips */}
                                <div className="p-3 bg-red-900/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-3 w-3 text-red-400" />
                                    <span className="text-xs font-semibold text-red-400">Safety First:</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {inst.safetyTips.map((tip: string, i: number) => (
                                      <li key={i} className="flex gap-2 text-xs text-red-200">
                                        <AlertTriangle className="h-3 w-3 text-red-400 flex-shrink-0 mt-0.5" />
                                        {tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Breathing */}
                                <div className="p-3 border-t border-gray-700 bg-blue-900/10">
                                  <div className="flex items-center gap-2">
                                    <div className="text-blue-400 text-xs font-semibold">Breathing:</div>
                                    <div className="text-xs text-blue-200">{inst.breathing}</div>
                                  </div>
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      ) : (
                        /* Non-Premium Locked State */
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg py-6 flex items-center justify-center border-2 border-dashed border-gray-600 mb-4">
                          <div className="text-center">
                            <Lock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                              <Crown className="h-4 w-4" />
                              Premium Feature
                              <Crown className="h-4 w-4" />
                            </div>
                            <p className="text-gray-500 text-xs mt-2">Unlock exercise demos & form guides</p>
                          </div>
                        </div>
                      )}

                      {/* Exercise Info - Always Shown */}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{exercise.name}</h4>
                        <span className="text-sm text-orange-400">{exercise.sets} sets × {exercise.reps}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {exercise.targetMuscles.map(muscle => (
                          <span key={muscle} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{muscle}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        <span className="text-gray-500">Equipment:</span> {exercise.equipment.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-500">Rest:</span> {exercise.restSeconds}s between sets
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
