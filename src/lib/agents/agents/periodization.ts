/**
 * Periodization Agent
 *
 * Generates adaptive multi-week training cycles with volume/intensity adjustment
 * based on recovery data and performance metrics.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  TrainingCycle,
  TrainingWeek
} from '../types'

interface PeriodizationState {
  userProfile: AgentUserProfile | null
  currentCycle: TrainingCycle | null
  performanceHistory: { date: string; volume: number; intensity: number; readiness: number }[]
}

type MesocycleFocus = 'hypertrophy' | 'strength' | 'peaking' | 'deload' | 'general'

export class PeriodizationAgent implements BaseAgent {
  readonly name = 'Periodization Agent'
  readonly description = 'Adaptive periodization planning with automatic load management'
  readonly version = '1.0.0'

  private state: PeriodizationState = {
    userProfile: null,
    currentCycle: null,
    performanceHistory: []
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    action: 'generate' | 'adjust' | 'analyze' | 'deload'
    cycleLength?: number
    baseVolume?: number
    baseIntensity?: number
    performanceMetrics?: { volume: number; intensity: number; readiness: number }
    targetFocus?: MesocycleFocus
  }): Promise<AgentResponse<unknown>> {
    try {
      const {
        action,
        cycleLength = 4,
        baseVolume = 100,
        baseIntensity = 70,
        performanceMetrics,
        targetFocus = 'hypertrophy'
      } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      switch (action) {
        case 'generate':
          const cycle = this.generateCycle(cycleLength, baseVolume, baseIntensity, targetFocus)
          return {
            success: true,
            data: { cycle, reasoning: this.generateReasoning(targetFocus), warnings: [] },
            confidence: 0.85
          }

        case 'adjust':
          const adjusted = this.adjustCurrentCycle(performanceMetrics!)
          return {
            success: true,
            data: adjusted,
            confidence: 0.8
          }

        case 'analyze':
          return this.analyzeCurrentProgress()

        case 'deload':
          return this.generateDeload()

        default:
          return { success: false, error: 'Unknown action', confidence: 0 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private generateCycle(
    weeks: number,
    baseVolume: number,
    baseIntensity: number,
    focus: MesocycleFocus
  ): TrainingCycle {
    const trainingWeeks: TrainingWeek[] = []
    const startDate = new Date()

    for (let i = 1; i <= weeks; i++) {
      const isDeload = i === weeks // Last week is always deload

      // Progressive overload for first 3 weeks
      let volumeMultiplier = 1 + (i - 1) * 0.05 // 5% increase per week
      let intensityMultiplier = 1 + (i - 1) * 0.025 // 2.5% increase per week

      if (isDeload) {
        volumeMultiplier = 0.6 // 40% reduction
        intensityMultiplier = 0.85
      }

      const sessionCount = this.state.userProfile!.workoutDays
      const weekVolume = Math.round(baseVolume * volumeMultiplier * sessionCount)
      const weekIntensity = Math.round(Math.min(100, baseIntensity * intensityMultiplier))

      trainingWeeks.push({
        weekNumber: i,
        volume: weekVolume,
        intensity: weekIntensity,
        focus: isDeload ? 'deload' : focus,
        sessions: sessionCount,
        deload: isDeload,
        recommendedExercises: this.getExercisesForWeek(i, focus, isDeload)
      })
    }

    const endDate = new Date(startDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)

    const cycle: TrainingCycle = {
      cycleId: `cycle_${Date.now()}`,
      weeks: trainingWeeks,
      currentWeek: 1,
      focus,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      nextMicrocycle: this.generateNextMicrocycleAdvice(trainingWeeks[1])
    }

    this.state.currentCycle = cycle
    return cycle
  }

  private adjustCurrentCycle(metrics: {
    volume: number
    intensity: number
    readiness: number
  }): {
    cycle: TrainingCycle
    reasoning: string
    adjustments: string[]
  } {
    if (!this.state.currentCycle) {
      return {
        cycle: this.generateCycle(4, 100, 70, 'hypertrophy'),
        reasoning: 'No current cycle found. Generated a new standard hypertrophy cycle.',
        adjustments: []
      }
    }

    const adjustments: string[] = []
    const cycle = this.state.currentCycle

    // Store performance history
    this.state.performanceHistory.push({
      date: new Date().toISOString(),
      volume: metrics.volume,
      intensity: metrics.intensity,
      readiness: metrics.readiness
    })

    // Analyze recent performance
    const recentHistory = this.state.performanceHistory.slice(-3)
    if (recentHistory.length >= 2) {
      const volumeTrend = recentHistory[recentHistory.length - 1].volume -
        recentHistory[0].volume
      const readinessAvg = recentHistory.reduce((sum, h) => sum + h.readiness, 0) / recentHistory.length

      // If volume is declining but readiness is also declining, reduce load
      if (volumeTrend < -10 && readinessAvg < 60) {
        adjustments.push('Volume trending down with low readiness - reducing next week by 15%')
        cycle.weeks[cycle.currentWeek - 1].volume = Math.round(cycle.weeks[cycle.currentWeek - 1].volume * 0.85)
      }

      // If we're crushing it (high volume, high readiness), progress faster
      if (volumeTrend > 10 && readinessAvg > 75) {
        adjustments.push('Excellent performance with good readiness - accelerating progression by 10%')
        cycle.weeks[cycle.currentWeek - 1].volume = Math.round(cycle.weeks[cycle.currentWeek - 1].volume * 1.1)
        cycle.weeks[cycle.currentWeek - 1].intensity = Math.min(100, cycle.weeks[cycle.currentWeek - 1].intensity + 5)
      }

      // If readiness is low, suggest deload
      if (readinessAvg < 50 && !cycle.weeks[cycle.currentWeek - 1].deload) {
        adjustments.push('Low readiness for 3+ sessions - consider unplanned deload week')
      }
    }

    cycle.nextMicrocycle = this.generateNextMicrocycleAdvice(cycle.weeks[cycle.currentWeek])

    return {
      cycle,
      reasoning: adjustments.length > 0 ? adjustments.join('. ') : 'No adjustments needed - continue as planned',
      adjustments
    }
  }

  private analyzeCurrentProgress(): AgentResponse<{
    currentWeek: TrainingWeek
    progressSummary: string
    projectedEndVolume: number
    trend: 'improving' | 'stable' | 'declining'
    recommendations: string[]
  }> {
    if (!this.state.currentCycle) {
      return {
        success: false,
        error: 'No active cycle. Generate one first.',
        confidence: 0
      }
    }

    const cycle = this.state.currentCycle
    const currentWeekData = cycle.weeks[cycle.currentWeek - 1]

    // Calculate projected volume
    const remainingWeeks = cycle.weeks.slice(cycle.currentWeek - 1)
    const projectedEndVolume = remainingWeeks.reduce((sum, w) => sum + w.volume, 0)

    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable'
    if (this.state.performanceHistory.length >= 3) {
      const recent = this.state.performanceHistory.slice(-3)
      const trendCalc = (recent[2].volume - recent[0].volume) / recent[0].volume * 100
      if (trendCalc > 5) trend = 'improving'
      else if (trendCalc < -5) trend = 'declining'
    }

    // Generate recommendations
    const recommendations: string[] = []
    if (trend === 'improving') {
      recommendations.push('Great progress! Consider adding 1 extra set per session if recovery allows.')
    } else if (trend === 'declining') {
      recommendations.push('Performance declining. Ensure adequate sleep and nutrition, or reduce volume.')
    } else {
      recommendations.push('Maintain current load. Focus on movement quality over adding weight.')
    }

    return {
      success: true,
      data: {
        currentWeek: currentWeekData,
        progressSummary: `Week ${cycle.currentWeek}/${cycle.weeks.length}: ${currentWeekData.focus} focus, ${currentWeekData.volume} total volume`,
        projectedEndVolume,
        trend,
        recommendations
      },
      confidence: 0.8
    }
  }

  private generateDeload(): AgentResponse<{
    deloadWeek: TrainingWeek
    exercises: string[]
    reasoning: string
  }> {
    if (!this.state.userProfile) {
      return { success: false, error: 'Not initialized', confidence: 0 }
    }

    const deloadWeek: TrainingWeek = {
      weekNumber: 0,
      volume: Math.round((this.state.userProfile.workoutDays * 25) * 0.6), // 60% reduction
      intensity: 65, // Lighter
      focus: 'deload',
      sessions: this.state.userProfile.workoutDays,
      deload: true,
      recommendedExercises: [
        'Light compound movements at 50-60% 1RM',
        'Emphasis on tempo and control (3-1-3 pattern)',
        'Mobility work',
        'Active recovery (walking, light cycling)'
      ]
    }

    return {
      success: true,
      data: {
        deloadWeek,
        exercises: deloadWeek.recommendedExercises,
        reasoning: 'Deload weeks allow supercompensation. Reduce volume significantly while maintaining intensity in a controlled manner.'
      },
      confidence: 0.9
    }
  }

  private getExercisesForWeek(_weekNum: number, focus: MesocycleFocus, isDeload: boolean): string[] {
    if (isDeload) {
      return [
        'All movements at 50-60% 1RM',
        'High rep schemes (15-20)',
        'Focus on mind-muscle connection',
        'Extended rest periods'
      ]
    }

    switch (focus) {
      case 'hypertrophy':
        return [
          'Progressive overload on compound lifts',
          'Volume emphasis (8-12 reps)',
          'Time under tension training',
          'Isolation work for lagging muscles'
        ]
      case 'strength':
        return [
          'Heavy singles and triples',
          'Low rep ranges (1-5 reps)',
          'Progressive overload on big lifts',
          'Minimal accessory work'
        ]
      case 'peaking':
        return [
          'Peaked attempts at near-max loads',
          'Very low volume',
          'Technical precision drills',
          'Mental preparation practice'
        ]
      default:
        return [
          'Varied rep ranges',
          'Mix of compound and isolation',
          'Circuit training',
          'Functional movements'
        ]
    }
  }

  private generateNextMicrocycleAdvice(weekData: TrainingWeek): string {
    if (weekData.deload) {
      return 'Recovery week - reduce volume, focus on form, prepare for next mesocycle'
    }

    if (weekData.intensity >= 90) {
      return 'High intensity week - prioritize sleep, consider pre/post-workout nutrition'
    }

    if (weekData.volume >= 150) {
      return 'High volume week - ensure adequate protein intake and sleep for recovery'
    }

    return 'Standard training week - maintain consistency and focus on progressive overload'
  }

  private generateReasoning(focus: MesocycleFocus): string {
    switch (focus) {
      case 'hypertrophy':
        return 'Hypertrophy mesocycle: 4 weeks of progressive volume increase. Aim for 8-12 rep range on main lifts. Deload in week 4.'
      case 'strength':
        return 'Strength mesocycle: 4 weeks of intensity progression. Heavy triples and singles. Focus on CNS adaptation.'
      case 'peaking':
        return 'Peaking phase: Short cycle designed to peak strength for a specific date. Very low volume, high intensity.'
      default:
        return 'General fitness cycle: Varied stimulus to maintain broad adaptations and prevent plateaus.'
    }
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      hasActiveCycle: this.state.currentCycle !== null,
      currentWeek: this.state.currentCycle?.currentWeek || 0,
      performanceDataPoints: this.state.performanceHistory.length
    }
  }

  reset(): void {
    this.state.currentCycle = null
    this.state.performanceHistory = []
  }
}
