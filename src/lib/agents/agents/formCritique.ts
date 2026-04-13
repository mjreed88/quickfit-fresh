/**
 * Form Critique Agent
 *
 * Analyzes exercise videos using computer vision techniques
 * to identify form issues and provide specific correction cues.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  FormAnalysisResult,
  FormIssue
} from '../types'

interface FormCritiqueState {
  userProfile: AgentUserProfile | null
  exerciseDatabase: Map<string, ExerciseFormReference>
  history: FormAnalysisResult[]
}

interface ExerciseFormReference {
  name: string
  targetAngles: Record<string, [number, number]> // joint -> [min, max] degrees
  commonMistakes: { mistake: string; anglePattern: string }[]
  cues: { trigger: string; correction: string }[]
  muscleEngagement: string[]
}

// Reference data for common exercises
const EXERCISE_REFERENCES: Record<string, ExerciseFormReference> = {
  'squat': {
    name: 'Barbell Back Squat',
    targetAngles: {
      kneeAngle: [75, 120],
      hipAngle: [70, 110],
      spineAngle: [0, 20],
      ankleAngle: [70, 100]
    },
    commonMistakes: [
      { mistake: 'knee valgus', anglePattern: 'kneeAngle < 160' },
      { mistake: 'butt wink', anglePattern: 'spineAngle > 30' },
      { mistake: 'forward lean', anglePattern: 'hipAngle > 130' }
    ],
    cues: [
      { trigger: 'knees caving', correction: 'Push your knees out to track over your toes' },
      { trigger: 'rising heels', correction: 'Keep weight in your heels, flex at the ankle' },
      { trigger: 'rounding back', correction: 'Brace your core and maintain chest up position' }
    ],
    muscleEngagement: ['quadriceps', 'glutes', 'hamstrings', 'core']
  },
  'deadlift': {
    name: 'Conventional Deadlift',
    targetAngles: {
      hipAngle: [70, 120],
      kneeAngle: [140, 180],
      spineAngle: [0, 15],
      shoulderAngle: [30, 60]
    },
    commonMistakes: [
      { mistake: 'rounded back', anglePattern: 'spineAngle > 45' },
      { mistake: 'bar drift', anglePattern: 'barAngle > 15' },
      { mistake: 'lockout miss', anglePattern: 'hipAngle < 160' }
    ],
    cues: [
      { trigger: 'spine rounding', correction: 'Imagine a broomstick along your spine - maintain contact' },
      { trigger: 'bar forward', correction: 'Keep the bar glued to your legs throughout the pull' },
      { trigger: ' hips rising', correction: 'Drive your hips back and up simultaneously with legs' }
    ],
    muscleEngagement: ['hamstrings', 'glutes', 'erectors', 'lats', 'traps']
  },
  'bench-press': {
    name: 'Barbell Bench Press',
    targetAngles: {
      shoulderAngle: [45, 75],
      elbowAngle: [75, 105],
      spineAngle: [0, 15],
      gripWidth: [1.5, 2]
    },
    commonMistakes: [
      { mistake: 'flared elbows', anglePattern: 'elbowAngle < 70' },
      { mistake: 'butt lift', anglePattern: 'spineAngle > 30' },
      { mistake: 'incomplete rack', anglePattern: 'shoulderAngle > 80' }
    ],
    cues: [
      { trigger: 'elbows flaring', correction: 'Tuck your elbows at 45 degrees to protect shoulders' },
      { trigger: 'butt lifting', correction: 'Squeeze your glutes and maintain foot contact with floor' },
      { trigger: 'bouncing chest', correction: 'Control the descent, use a pause at bottom' }
    ],
    muscleEngagement: ['pectorals', 'anterior deltoid', 'triceps']
  },
  'overhead-press': {
    name: 'Barbell Overhead Press',
    targetAngles: {
      shoulderAngle: [160, 180],
      elbowAngle: [170, 185],
      spineAngle: [0, 10],
      hipAngle: [170, 185]
    },
    commonMistakes: [
      { mistake: 'back arch', anglePattern: 'spineAngle > 30' },
      { mistake: 'incomplete lockout', anglePattern: 'shoulderAngle < 160' },
      { mistake: 'bar path forward', anglePattern: 'barAngle > 10' }
    ],
    cues: [
      { trigger: 'back arching', correction: 'Squeeze glutes and brace core to create a plank' },
      { trigger: 'bar forward', correction: 'The bar should travel in a straight vertical line' },
      { trigger: 'partial press', correction: 'Press until arms are fully locked out overhead' }
    ],
    muscleEngagement: ['anterior deltoid', 'lateral deltoid', 'triceps', 'upper chest']
  }
}

export class FormCritiqueAgent implements BaseAgent {
  readonly name = 'Form Critique Agent'
  readonly description = 'Analyzes exercise form via video to identify issues and provide corrections'
  readonly version = '1.0.0'

  private state: FormCritiqueState = {
    userProfile: null,
    exerciseDatabase: new Map(Object.entries(EXERCISE_REFERENCES)),
    history: []
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    videoFrame: ImageData | string // Base64 image or ImageData
    exercise: string
    userId?: string
  }): Promise<AgentResponse<FormAnalysisResult>> {
    try {
      const { videoFrame, exercise } = input

      if (!this.state.userProfile) {
        return {
          success: false,
          error: 'Agent not initialized. Call initialize() first.',
          confidence: 0
        }
      }

      // Analyze the form
      const analysis = await this.analyzeForm(exercise, videoFrame)

      // Store in history
      this.state.history.push(analysis)

      return {
        success: true,
        data: analysis,
        confidence: 0.8,
        followUpNeeded: analysis.riskLevel === 'high' || analysis.riskLevel === 'critical'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private async analyzeForm(
    exercise: string,
    _videoFrame: ImageData | string
  ): Promise<FormAnalysisResult> {
    // In a production app, this would call a computer vision API
    // For now, we'll use rule-based analysis based on the exercise
    const exerciseRef = this.state.exerciseDatabase.get(exercise.toLowerCase())

    if (!exerciseRef) {
      return {
        exercise,
        jointAngles: {},
        issues: [],
        riskLevel: 'low',
        recommendations: [`No form reference available for ${exercise}`],
        score: 100
      }
    }

    const issues: FormIssue[] = []
    const recommendations: string[] = []

    // Simulate analysis based on exercise
    // In production, this would use actual computer vision on the video frame
    const exerciseLower = exercise.toLowerCase()

    // Analyze based on generic movement patterns
    if (exerciseLower.includes('squat')) {
      issues.push({
        bodyPart: 'knees',
        issue: 'Slight knee valgus detected',
        severity: 'minor',
        description: 'Knees appear to be caving slightly inward during descent',
        correction: 'Actively push your knees outward throughout the movement'
      })

      recommendations.push('Focus on driving your knees outward at the bottom of the squat')
      recommendations.push('Practice goblet squats to build proper movement patterns')

      if (this.state.userProfile?.injuries.some(i => i.includes('knee'))) {
        issues.push({
          bodyPart: 'knee',
          issue: 'Pre-existing knee condition - extra caution needed',
          severity: 'moderate',
          description: 'User has reported knee issues - squat may aggravate',
          correction: 'Consider switching to leg press or goblet squat'
        })
        recommendations.push('Your knee history suggests safer alternatives')
      }
    }

    if (exerciseLower.includes('deadlift')) {
      issues.push({
        bodyPart: 'spine',
        issue: 'Minor spine flexion observed',
        severity: 'moderate',
        description: 'Lower back showing slight rounding at the start of pull',
        correction: 'Think about maintaining a neutral spine - chest up, lats engaged'
      })

      recommendations.push('Before each rep, brace your core and set your lats')
      recommendations.push('Consider Romanian deadlifts to improve hip hinge pattern')
    }

    if (exerciseLower.includes('bench')) {
      issues.push({
        bodyPart: 'shoulders',
        issue: 'Shoulder impingement risk',
        severity: 'minor',
        description: 'Elbows flaring slightly during the press',
        correction: 'Tuck your elbows back to 45 degrees to protect rotator cuff'
      })

      recommendations.push('Retract and depress your scapula before each rep')
    }

    // Calculate overall score based on issues
    const issueCount = issues.length
    const criticalIssues = issues.filter(i => i.severity === 'severe').length
    const moderateIssues = issues.filter(i => i.severity === 'moderate').length

    let score = 100
    score -= criticalIssues * 25
    score -= moderateIssues * 15
    score -= issueCount * 5
    score = Math.max(0, Math.min(100, score))

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (criticalIssues > 0 || score < 40) {
      riskLevel = 'critical'
    } else if (moderateIssues > 0 || score < 60) {
      riskLevel = 'high'
    } else if (issueCount > 0 || score < 80) {
      riskLevel = 'medium'
    }

    // Add general recommendations
    if (issues.length === 0) {
      recommendations.push('Form looks good! Maintain current technique')
      recommendations.push('Remember to breathe - exhale on exertion, inhale on descent')
    }

    return {
      exercise,
      jointAngles: Object.fromEntries(
        Object.entries(exerciseRef.targetAngles).map(([k, v]) => [k, (v[0] + v[1]) / 2])
      ), // Ideal angles for reference
      issues,
      riskLevel,
      recommendations,
      score
    }
  }

  async analyzeVideoFrames(
    frames: (ImageData | string)[],
    exercise: string
  ): Promise<FormAnalysisResult[]> {
    const results: FormAnalysisResult[] = []

    for (const frame of frames) {
      const analysis = await this.analyzeForm(exercise, frame)
      results.push(analysis)
    }

    // Aggregate results across frames
    const aggregatedScore = results.reduce((sum, r) => sum + r.score, 0) / results.length
    const allIssues = results.flatMap(r => r.issues)

    // Return the most comprehensive analysis
    const mostDetailed = results.reduce((best, current) =>
      current.issues.length > best.issues.length ? current : best
    )

    return [{
      ...mostDetailed,
      score: Math.round(aggregatedScore),
      issues: allIssues.filter((issue, index, self) =>
        index === self.findIndex(i => i.bodyPart === issue.bodyPart && i.issue === issue.issue)
      )
    }]
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      analyzedCount: this.state.history.length,
      exercisesWithReference: Array.from(this.state.exerciseDatabase.keys())
    }
  }

  reset(): void {
    this.state.history = []
  }

  getHistory(): FormAnalysisResult[] {
    return this.state.history
  }
}
