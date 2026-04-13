/**
 * Recovery Intelligence Agent
 *
 * Tracks sleep, HRV, and soreness to recommend rest days dynamically
 * and prevent overtraining.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  RecoveryData
} from '../types'

interface RecoveryState {
  userProfile: AgentUserProfile | null
  recoveryHistory: RecoveryData[]
  readinessHistory: { date: string; readiness: number; recommendation: string }[]
}

export class RecoveryIntelligenceAgent implements BaseAgent {
  readonly name = 'Recovery Intelligence Agent'
  readonly description = 'Tracks recovery metrics to recommend rest days and prevent overtraining'
  readonly version = '1.0.0'

  private state: RecoveryState = {
    userProfile: null,
    recoveryHistory: [],
    readinessHistory: []
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    recoveryData: RecoveryData
    trainingLoad?: number // Total sets from recent training
    daysSinceLastSession?: number
  }): Promise<AgentResponse<{
    readiness: number
    recommendation: 'rest' | 'light' | 'moderate' | 'intense' | 'deload'
    reasons: string[]
    suggestedModifications: string[]
  }>> {
    try {
      const { recoveryData, trainingLoad = 0, daysSinceLastSession = 1 } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      // Store recovery data
      this.state.recoveryHistory.push(recoveryData)
      if (this.state.recoveryHistory.length > 90) {
        this.state.recoveryHistory.shift()
      }

      // Calculate readiness
      const { readiness, recommendation, reasons, suggestedModifications } = this.calculateReadiness(
        recoveryData,
        trainingLoad,
        daysSinceLastSession
      )

      // Store readiness history
      this.state.readinessHistory.push({
        date: recoveryData.date,
        readiness,
        recommendation
      })

      return {
        success: true,
        data: { readiness, recommendation, reasons, suggestedModifications },
        confidence: 0.85,
        followUpNeeded: recommendation === 'rest' || recommendation === 'deload'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private calculateReadiness(
    data: RecoveryData,
    trainingLoad: number,
    daysSinceLastSession: number
  ): {
    readiness: number
    recommendation: 'rest' | 'light' | 'moderate' | 'intense' | 'deload'
    reasons: string[]
    suggestedModifications: string[]
  } {
    let readiness = 75 // Base readiness
    const reasons: string[] = []
    const suggestedModifications: string[] = []

    // Sleep factor (most important)
    if (data.sleepHours !== undefined) {
      if (data.sleepHours < 6) {
        readiness -= 30
        reasons.push(`Very poor sleep (${data.sleepHours}h) - recovery severely impaired`)
      } else if (data.sleepHours < 7) {
        readiness -= 15
        reasons.push(`Insufficient sleep (${data.sleepHours}h) - suboptimal recovery`)
      } else if (data.sleepHours >= 8) {
        readiness += 10
        reasons.push(`Good sleep (${data.sleepHours}h) - optimal recovery`)
      }
    }

    if (data.sleepQuality) {
      switch (data.sleepQuality) {
        case 'poor':
          readiness -= 20
          reasons.push('Poor sleep quality compounds recovery deficit')
          break
        case 'fair':
          readiness -= 8
          reasons.push('Fair sleep quality')
          break
        case 'good':
          readiness += 5
          reasons.push('Good sleep quality')
          break
        case 'excellent':
          readiness += 10
          reasons.push('Excellent sleep quality')
          break
      }
    }

    // HRV factor
    if (data.hrvScore !== undefined) {
      const userHRVBaseline = 60 // Would normally come from user's historical average
      const hrvDrop = ((userHRVBaseline - data.hrvScore) / userHRVBaseline) * 100

      if (hrvDrop > 20) {
        readiness -= 25
        reasons.push('HRV significantly below baseline - nervous system stressed')
      } else if (hrvDrop > 10) {
        readiness -= 10
        reasons.push('HRV below baseline - mild autonomic stress')
      }
    }

    // Resting heart rate
    if (data.restingHR !== undefined) {
      if (data.restingHR > 75) {
        readiness -= 15
        reasons.push('Elevated resting HR indicates accumulated stress')
      }
    }

    // Soreness factor
    if (data.sorenessLevel !== undefined) {
      if (data.sorenessLevel >= 8) {
        readiness -= 25
        reasons.push(`High soreness (${data.sorenessLevel}/10) - significant tissue stress`)
        suggestedModifications.push('Foam rolling and gentle mobility only')
      } else if (data.sorenessLevel >= 5) {
        readiness -= 10
        reasons.push(`Moderate soreness (${data.sorenessLevel}/10)`)
      }
    }

    // Stress level
    if (data.stressLevel !== undefined) {
      if (data.stressLevel >= 8) {
        readiness -= 20
        reasons.push('High life stress - training would compound allostatic load')
      } else if (data.stressLevel >= 6) {
        readiness -= 10
        reasons.push('Moderate life stress')
      }
    }

    // Illness
    if (data.illness) {
      readiness -= 40
      reasons.push('Active illness - training contraindicated')
      suggestedModifications.push('Focus on sleep and hydration only')
    }

    // Training load factor
    if (trainingLoad > 20) {
      readiness -= 10
      reasons.push('High recent training load (20+ sets)')
    }

    // Days since last session
    if (daysSinceLastSession === 0) {
      readiness -= 10
      reasons.push('Training today - accounting for fatigue')
    } else if (daysSinceLastSession >= 7) {
      readiness += 10
      reasons.push('Well rested from training break')
    }

    // Clamp readiness
    readiness = Math.max(0, Math.min(100, readiness))

    // Determine recommendation
    let recommendation: 'rest' | 'light' | 'moderate' | 'intense' | 'deload' = 'moderate'
    if (readiness < 30) {
      recommendation = 'rest'
    } else if (readiness < 50) {
      recommendation = 'deload'
    } else if (readiness < 65) {
      recommendation = 'light'
    } else if (readiness < 80) {
      recommendation = 'moderate'
    } else {
      recommendation = 'intense'
    }

    // Add specific modifications based on readiness
    if (recommendation === 'light') {
      suggestedModifications.push('Reduce volume by 40-50%')
      suggestedModifications.push('Focus on technique over loading')
    } else if (recommendation === 'deload') {
      suggestedModifications.push('Use 50% of normal weight')
      suggestedModifications.push('Reduce sets by 30-40%')
      suggestedModifications.push('Focus on mind-muscle connection')
    }

    return { readiness, recommendation, reasons, suggestedModifications }
  }

  async getWeeklyRecommendation(
    weekData: RecoveryData[]
  ): Promise<{
    weeklyReadiness: number
    recommendedSessions: number
    suggestedVolume: number
    warningFlags: string[]
  }> {
    const avgReadiness = weekData.reduce((sum, d) => {
      const result = this.calculateReadiness(d, 0, 3)
      return sum + result.readiness
    }, 0) / weekData.length

    const warningFlags: string[] = []
    let recommendedSessions = 4
    let suggestedVolume = 100

    if (avgReadiness < 50) {
      recommendedSessions = 2
      suggestedVolume = 50
      warningFlags.push('Low average recovery - reduce training frequency')
    } else if (avgReadiness < 70) {
      recommendedSessions = 3
      suggestedVolume = 75
      warningFlags.push('Below average recovery - moderate training recommended')
    } else if (avgReadiness >= 80) {
      recommendedSessions = 5
      suggestedVolume = 110
    }

    return {
      weeklyReadiness: avgReadiness,
      recommendedSessions,
      suggestedVolume,
      warningFlags
    }
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      recoveryDataPoints: this.state.recoveryHistory.length,
      lastRecovery: this.state.recoveryHistory[this.state.recoveryHistory.length - 1]
    }
  }

  reset(): void {
    this.state.recoveryHistory = []
    this.state.readinessHistory = []
  }
}
