/**
 * Plateau Detection Agent
 *
 * Monitors workout performance over time, detects when adaptation stalls,
 * and auto-generates periodization adjustments.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  PlateauAnalysis,
  Adjustment,
  WorkoutSession
} from '../types'

interface PlateauState {
  userProfile: AgentUserProfile | null
  exerciseHistory: Map<string, { date: string; sets: { reps: number; weight: number }[] }[]>
  lastAnalysis: PlateauAnalysis | null
}

export class PlateauDetectionAgent implements BaseAgent {
  readonly name = 'Plateau Detection Agent'
  readonly description = 'Detects training plateaus and generates periodization adjustments'
  readonly version = '1.0.0'

  private state: PlateauState = {
    userProfile: null,
    exerciseHistory: new Map(),
    lastAnalysis: null
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    exercise: string
    currentSession: WorkoutSession
    lookbackWeeks?: number
  }): Promise<AgentResponse<PlateauAnalysis>> {
    try {
      const { exercise, currentSession, lookbackWeeks = 4 } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      // Track history
      this.trackExercise(exercise, currentSession)

      // Analyze for plateau
      const analysis = this.detectPlateau(exercise, lookbackWeeks)
      this.state.lastAnalysis = analysis

      return {
        success: true,
        data: analysis,
        confidence: 0.8,
        followUpNeeded: analysis.urgency === 'high'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private trackExercise(exercise: string, session: WorkoutSession): void {
    const existing = this.state.exerciseHistory.get(exercise) || []
    existing.push({
      date: session.date,
      sets: session.exercises.find(e => e.exerciseName === exercise)?.sets || []
    })
    this.state.exerciseHistory.set(exercise, existing)
  }

  private detectPlateau(exercise: string, lookbackWeeks: number): PlateauAnalysis {
    const history = this.state.exerciseHistory.get(exercise) || []
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - lookbackWeeks * 7)

    const recentHistory = history.filter(h => new Date(h.date) >= cutoff)

    if (recentHistory.length < 2) {
      return {
        exercise,
        stalledSince: 'Not enough data',
        possibleCauses: ['Not enough training history to detect plateau'],
        indicators: [],
        suggestedAdjustments: [],
        urgency: 'low'
      }
    }

    // Calculate volume trends
    const volumes = recentHistory.map(h => {
      const sessionVolume = h.sets.reduce((total, set) => {
        return total + set.reps * set.weight
      }, 0)
      return sessionVolume
    })

    const latestVolume = volumes[volumes.length - 1]
    const previousVolume = volumes[volumes.length - 2]
    const volumeChange = ((latestVolume - previousVolume) / previousVolume) * 100

    const indicators: string[] = []
    const possibleCauses: string[] = []
    const adjustments: Adjustment[] = []

    // Detect plateau indicators
    if (volumeChange < 2 && volumeChange > -2) {
      indicators.push('Volume has plateaued - no meaningful progress in last 2 sessions')
    }

    if (volumeChange < 0) {
      indicators.push(`Volume DECREASED by ${Math.abs(volumeChange).toFixed(1)}% - possible overreaching`)
    }

    // Check if we're stuck at same weight
    const latestWeight = recentHistory[recentHistory.length - 1]?.sets[0]?.weight || 0
    const stalls = volumes.filter(v => v === latestWeight).length

    if (stalls >= 3) {
      indicators.push(`Same weight lifted for ${stalls} sessions - stuck at ${latestWeight}lbs`)
      possibleCauses.push('Neurological adaptation complete - need new stimulus')
      possibleCauses.push('Insufficient recovery between sessions')
      possibleCauses.push('Technique has plateaued')
    }

    // Generate adjustments based on analysis
    if (indicators.length > 0) {
      // Weight adjustment
      if (latestWeight > 0) {
        adjustments.push({
          type: 'weight',
          currentValue: latestWeight,
          suggestedValue: Math.round(latestWeight * 0.9),
          reason: 'Deload to reset neurological adaptation'
        })
      }

      // Rep scheme adjustment
      adjustments.push({
        type: 'reps',
        currentValue: recentHistory[recentHistory.length - 1]?.sets[0]?.reps || 8,
        suggestedValue: 12,
        reason: 'Increase reps with lighter weight to break plateau'
      })

      // Rest adjustment
      adjustments.push({
        type: 'rest',
        currentValue: 90,
        suggestedValue: 120,
        reason: 'Longer rest to allow fuller recovery between sets'
      })

      // Tempo adjustment
      adjustments.push({
        type: 'tempo',
        currentValue: 2,
        suggestedValue: 4,
        reason: 'Slow eccentric (3 seconds) to increase time under tension'
      })
    }

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'low'
    if (indicators.length >= 3) urgency = 'high'
    else if (indicators.length >= 1) urgency = 'medium'

    // If we've been stalled for more than 6 sessions
    if (stalls >= 6) urgency = 'high'

    const stalledSince = stalls >= 2
      ? `${stalls} sessions ago`
      : 'Recent - monitor closely'

    return {
      exercise,
      stalledSince,
      possibleCauses: possibleCauses.length > 0 ? possibleCauses : ['Normal adaptation fluctuation'],
      indicators,
      suggestedAdjustments: adjustments,
      urgency
    }
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      trackedExercises: Array.from(this.state.exerciseHistory.keys()),
      hasLastAnalysis: this.state.lastAnalysis !== null
    }
  }

  reset(): void {
    this.state.exerciseHistory.clear()
    this.state.lastAnalysis = null
  }
}
