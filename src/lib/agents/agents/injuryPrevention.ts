/**
 * Injury Prevention Agent
 *
 * Analyzes movement patterns, detects injury risk factors,
 * and adapts exercises based on user's injury history and pain reports.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  InjuryRiskAssessment,
  RiskFactor,
  ExerciseModification,
  WorkoutSession
} from '../types'

interface InjuryPreventionState {
  userProfile: AgentUserProfile | null
  previousSessions: WorkoutSession[]
  painPatterns: Map<string, string[]> // exercise -> pain descriptions
  riskHistory: Map<string, InjuryRiskAssessment>
}

export class InjuryPreventionAgent implements BaseAgent {
  readonly name = 'Injury Prevention Agent'
  readonly description = 'Analyzes movement patterns to detect injury risk and suggest modifications'
  readonly version = '1.0.0'

  private state: InjuryPreventionState = {
    userProfile: null,
    previousSessions: [],
    painPatterns: new Map(),
    riskHistory: new Map()
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    exercise: string
    movementData?: {
      jointAngles?: Record<string, number>
      barPath?: { start: string; middle: string; end: string }
      tempo?: string
    }
    reportedPain?: { location: string; intensity: number; description: string }
    workoutSession?: WorkoutSession
  }): Promise<AgentResponse<InjuryRiskAssessment>> {
    try {
      const { exercise, movementData, reportedPain, workoutSession } = input

      if (!this.state.userProfile) {
        return {
          success: false,
          error: 'Agent not initialized. Call initialize() first.',
          confidence: 0
        }
      }

      // Analyze injury risk
      const assessment = await this.analyzeInjuryRisk(exercise, movementData, reportedPain)

      // Track pain patterns
      if (reportedPain) {
        this.trackPainPattern(exercise, reportedPain)
      }

      // Track session if provided
      if (workoutSession) {
        this.state.previousSessions.push(workoutSession)
      }

      return {
        success: true,
        data: assessment,
        confidence: 0.85,
        followUpNeeded: assessment.overallRisk === 'high' || assessment.overallRisk === 'critical'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private async analyzeInjuryRisk(
    exercise: string,
    movementData?: {
      jointAngles?: Record<string, number>
      barPath?: { start: string; middle: string; end: string }
      tempo?: string
    },
    reportedPain?: { location: string; intensity: number; description: string }
  ): Promise<InjuryRiskAssessment> {
    const userProfile = this.state.userProfile!
    const exerciseLower = exercise.toLowerCase()
    const riskFactors: RiskFactor[] = []
    const modifications: ExerciseModification[] = []

    // 1. Check user's injury history
    const userInjuries = userProfile.injuries.filter(i => i !== 'None')
    if (userInjuries.length > 0) {
      riskFactors.push({
        factor: 'injury_history',
        severity: 8,
        description: `User has ${userInjuries.length} pre-existing condition(s): ${userInjuries.join(', ')}`
      })
    }

    // 2. Check age-related risks
    if (userProfile.age >= 55) {
      riskFactors.push({
        factor: 'age',
        severity: 6,
        description: `Age ${userProfile.age} increases injury susceptibility`
      })
    }

    // 3. Check for movement data issues
    if (movementData?.jointAngles) {
      const angles = movementData.jointAngles

      // Check knee valgus (knock knees)
      if (angles.kneeAngle !== undefined && angles.kneeAngle < 170) {
        riskFactors.push({
          factor: 'knee_valgus',
          severity: 7,
          description: 'Knee angle suggests valgus (knees caving inward)'
        })
      }

      // Check spine flexion
      if (angles.spineAngle !== undefined && angles.spineAngle > 90) {
        riskFactors.push({
          factor: 'spine_flexion',
          severity: 9,
          description: 'Excessive spine flexion detected - high herniated disc risk'
        })
      }

      // Check shoulder external rotation
      if (angles.shoulderRotation !== undefined && angles.shoulderRotation < 45) {
        riskFactors.push({
          factor: 'shoulder_mobility',
          severity: 5,
          description: 'Limited shoulder rotation may stress rotator cuff'
        })
      }
    }

    // 4. Check bar path issues
    if (movementData?.barPath) {
      if (movementData.barPath.middle.includes('drift')) {
        riskFactors.push({
          factor: 'bar_path_drift',
          severity: 6,
          description: 'Bar path drifts forward during movement'
        })
      }
    }

    // 5. Check pain reports
    if (reportedPain) {
      if (reportedPain.intensity >= 7) {
        riskFactors.push({
          factor: 'acute_pain',
          severity: 9,
          description: `Pain intensity ${reportedPain.intensity}/10 reported at ${reportedPain.location}`
        })
      } else if (reportedPain.intensity >= 4) {
        riskFactors.push({
          factor: 'moderate_pain',
          severity: 6,
          description: `Moderate pain reported at ${reportedPain.location}`
        })
      }
    }

    // 6. Check past pain patterns for this exercise
    const pastPain = this.state.painPatterns.get(exerciseLower)
    if (pastPain && pastPain.length > 2) {
      riskFactors.push({
        factor: 'recurring_pain',
        severity: 7,
        description: `${pastPain.length} previous pain episodes with this exercise`
      })
    }

    // 7. Check fitness level (beginners at higher risk for certain exercises)
    if (userProfile.fitnessLevel === 'beginner') {
      const highRiskExercises = ['squat', 'deadlift', 'bench-press', 'overhead-press']
      if (highRiskExercises.some(e => exerciseLower.includes(e))) {
        riskFactors.push({
          factor: 'beginner_complex_lift',
          severity: 5,
          description: 'Beginner attempting compound lift - proper form critical'
        })
      }
    }

    // 8. Check equipment availability (poor equipment = higher risk)
    if (userProfile.availableEquipment.length === 0) {
      riskFactors.push({
        factor: 'equipment_limited',
        severity: 4,
        description: 'Limited equipment may force sub-optimal exercise variations'
      })
    }

    // Calculate overall risk
    const avgSeverity = riskFactors.length > 0
      ? riskFactors.reduce((sum, r) => sum + r.severity, 0) / riskFactors.length
      : 0

    let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (avgSeverity >= 8 || riskFactors.some(r => r.severity >= 9)) {
      overallRisk = 'critical'
    } else if (avgSeverity >= 6 || riskFactors.some(r => r.severity >= 7)) {
      overallRisk = 'high'
    } else if (avgSeverity >= 4 || riskFactors.some(r => r.severity >= 5)) {
      overallRisk = 'medium'
    }

    // Generate modifications based on risk factors and user injuries
    if (userInjuries.length > 0 || overallRisk !== 'low') {
      modifications.push(...this.generateModifications(exerciseLower, userInjuries))
    }

    // Generate warning signs
    const warningSigns = [
      'Sharp pain during exercise',
      'Pain radiating down limbs',
      'Numbness or tingling',
      'Joint clicking with pain',
      'Range of motion suddenly decreased',
      'Feeling of instability'
    ]

    // Generate recommendations
    const recommendations: string[] = []
    if (overallRisk === 'critical' || overallRisk === 'high') {
      recommendations.push('STOP: Consult a physical therapist before continuing')
      recommendations.push('Consider reducing weight by 30-50% and focusing on form')
      recommendations.push('Use assisted variations until strength is rebuilt')
    }
    if (userInjuries.some(i => i.toLowerCase().includes('back'))) {
      recommendations.push('Consider hip hinge patterns instead of squats')
      recommendations.push('Focus on core stability before loading spine')
    }
    if (userInjuries.some(i => i.toLowerCase().includes('knee'))) {
      recommendations.push('Try box squats or goblet squats for reduced joint stress')
      recommendations.push('Ensure knee tracks over toes during movement')
    }

    const assessment: InjuryRiskAssessment = {
      exercise,
      riskFactors,
      overallRisk,
      contributingFactors: riskFactors.map(r => r.factor),
      modifications,
      warningSigns
    }

    // Cache assessment
    this.state.riskHistory.set(exerciseLower, assessment)

    return assessment
  }

  private generateModifications(
    exercise: string,
    userInjuries: string[]
  ): ExerciseModification[] {
    const modifications: ExerciseModification[] = []

    // Knee injury modifications
    if (userInjuries.some(i => i.toLowerCase().includes('knee'))) {
      modifications.push(
        {
          originalExercise: 'squat',
          suggestedAlternative: 'goblet squat',
          reason: 'Reduces compressive load on knee by 40-60%',
          difficultyAdjustment: 'easier'
        },
        {
          originalExercise: 'lunge',
          suggestedAlternative: 'reverse lunge',
          reason: 'Less knee shear force than forward lunges',
          difficultyAdjustment: 'easier'
        },
        {
          originalExercise: 'leg press',
          suggestedAlternative: 'hip thrust',
          reason: 'Bypasses knee joint entirely while targeting glutes',
          difficultyAdjustment: 'same'
        }
      )
    }

    // Back injury modifications
    if (userInjuries.some(i => i.toLowerCase().includes('back'))) {
      modifications.push(
        {
          originalExercise: 'squat',
          suggestedAlternative: 'split squat',
          reason: 'More upright torso reduces spinal loading',
          difficultyAdjustment: 'easier'
        },
        {
          originalExercise: 'deadlift',
          suggestedAlternative: 'trap bar deadlift',
          reason: 'Keeps bar closer to body, reduces spinal flexion',
          difficultyAdjustment: 'easier'
        },
        {
          originalExercise: 'overhead press',
          suggestedAlternative: 'seated dumbbell press',
          reason: 'Back support reduces spinal instability',
          difficultyAdjustment: 'easier'
        }
      )
    }

    // Shoulder injury modifications
    if (userInjuries.some(i => i.toLowerCase().includes('shoulder'))) {
      modifications.push(
        {
          originalExercise: 'bench press',
          suggestedAlternative: 'floor press',
          reason: 'Limited range reduces shoulder stress',
          difficultyAdjustment: 'easier'
        },
        {
          originalExercise: 'overhead press',
          suggestedAlternative: 'landmine press',
          reason: 'More natural shoulder arc, less impingement risk',
          difficultyAdjustment: 'easier'
        }
      )
    }

    // Wrist injury modifications
    if (userInjuries.some(i => i.toLowerCase().includes('wrist'))) {
      modifications.push(
        {
          originalExercise: 'push-up',
          suggestedAlternative: 'push-up with fists',
          reason: 'Eliminates wrist extension stress',
          difficultyAdjustment: 'easier'
        }
      )
    }

    // If no specific injury match, provide general safety modifications
    if (modifications.length === 0) {
      modifications.push(
        {
          originalExercise: exercise,
          suggestedAlternative: exercise + ' (light)',
          reason: 'Start with 50% weight to establish baseline form',
          difficultyAdjustment: 'easier'
        }
      )
    }

    return modifications
  }

  private trackPainPattern(
    exercise: string,
    pain: { location: string; intensity: number; description: string }
  ): void {
    const key = exercise.toLowerCase()
    const existing = this.state.painPatterns.get(key) || []
    existing.push(`${pain.location} (${pain.intensity}/10): ${pain.description}`)
    this.state.painPatterns.set(key, existing)
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      userProfile: this.state.userProfile,
      previousSessionsCount: this.state.previousSessions.length,
      trackedExercises: Array.from(this.state.painPatterns.keys()),
      riskHistoryCount: this.state.riskHistory.size
    }
  }

  reset(): void {
    this.state = {
      userProfile: this.state.userProfile, // Keep user profile
      previousSessions: [],
      painPatterns: new Map(),
      riskHistory: new Map()
    }
  }
}
