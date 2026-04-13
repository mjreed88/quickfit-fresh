/**
 * QuickFit AI Agents - Core Types
 */

// User profile for agent context
export interface AgentUserProfile {
  userId: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // inches
  weight: number // lbs
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph'
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: Goal[]
  injuries: string[]
  workoutDays: number
  sessionDuration: number
  bodyWeight: boolean // vs barbells/dumbbells preference
  availableEquipment: string[]
}

export type Goal = 'muscle-building' | 'strength' | 'weight-loss' | 'cardio' | 'flexibility' | 'general-health'

// Workout data
export interface WorkoutSession {
  date: string
  dayName: string
  exercises: ExerciseLog[]
  duration: number
  totalVolume?: number // weight * reps
  perceivedExertion?: number // 1-10
  notes?: string
}

export interface ExerciseLog {
  exerciseName: string
  sets: { reps: number; weight: number; completed: boolean }[]
  restSeconds?: number
  painLevel?: number // 0-10
  formNotes?: string
}

// Recovery data
export interface RecoveryData {
  date: string
  sleepHours?: number
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent'
  restingHR?: number
  hrvScore?: number
  sorenessLevel?: number // 0-10
  recoveryStatus?: 'underrecovered' | 'neutral' | 'recovered' | 'peaked'
  stressLevel?: number // 1-10
  illness?: boolean
}

// Form analysis
export interface FormAnalysisResult {
  exercise: string
  jointAngles: Record<string, number>
  issues: FormIssue[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  score: number // 0-100
}

export interface FormIssue {
  bodyPart: string
  issue: string
  severity: 'minor' | 'moderate' | 'severe'
  description: string
  correction: string
}

// Plateau detection
export interface PlateauAnalysis {
  exercise: string
  stalledSince: string
  possibleCauses: string[]
  indicators: string[]
  suggestedAdjustments: Adjustment[]
  urgency: 'low' | 'medium' | 'high'
}

export interface Adjustment {
  type: 'weight' | 'reps' | 'sets' | 'exercise' | 'rest' | 'tempo'
  currentValue: number
  suggestedValue: number
  reason: string
}

// Motivation state
export interface MotivationState {
  engagement: number // 0-100
  tone: 'aggressive' | 'supportive' | 'neutral' | 'direct'
  lastInteraction: string
  streakDays: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  predictedDropoutRisk: number // 0-100
  recommendedTone: 'aggressive' | 'supportive' | 'neutral' | 'direct'
  message?: string
}

// Nutrition
export interface MealEntry {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: FoodItem[]
  totalMacros: MacroInfo
  photoBase64?: string
}

export interface FoodItem {
  name: string
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients?: string[]
}

export interface MacroInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Competition
export interface Challenge {
  challengeId: string
  type: 'volume' | 'streak' | 'exercise' | 'group'
  title: string
  description: string
  startDate: string
  endDate: string
  participants: ChallengeParticipant[]
  rules: string[]
  scoring: 'cumulative' | 'best' | 'average'
  status: 'pending' | 'active' | 'completed'
}

export interface ChallengeParticipant {
  userId: string
  username: string
  score: number
  rank: number
  lastUpdate: string
  streakDays?: number
}

// Supplement recommendation
export interface SupplementRecommendation {
  name: string
  reason: string
  dosage: string
  timing: string
  evidenceLevel: 'strong' | 'moderate' | 'weak'
  benefits: string[]
  risks: string[]
  interactions: string[]
  costEfficiency: 'high' | 'medium' | 'low'
}

// Periodization
export interface TrainingCycle {
  cycleId: string
  weeks: TrainingWeek[]
  currentWeek: number
  focus: 'hypertrophy' | 'strength' | 'peaking' | 'deload' | 'general'
  startDate: string
  endDate: string
  nextMicrocycle: string // recommended adjustment
}

export interface TrainingWeek {
  weekNumber: number
  volume: number // total sets
  intensity: number // % of 1RM or RPE
  focus: string
  sessions: number
  deload: boolean
  recommendedExercises: string[]
}

// Injury risk
export interface InjuryRiskAssessment {
  exercise: string
  riskFactors: RiskFactor[]
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  contributingFactors: string[]
  modifications: ExerciseModification[]
  warningSigns: string[]
}

export interface RiskFactor {
  factor: string
  severity: number // 1-10
  description: string
}

export interface ExerciseModification {
  originalExercise: string
  suggestedAlternative: string
  reason: string
  difficultyAdjustment: 'easier' | 'harder' | 'same'
}

// Generic agent response
export interface AgentResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  confidence: number // 0-1
  sources?: string[]
  followUpNeeded?: boolean
}

// Base agent interface
export interface BaseAgent {
  readonly name: string
  readonly description: string
  readonly version: string

  initialize(userProfile: AgentUserProfile): Promise<void>
  process(input: unknown): Promise<AgentResponse<unknown>>
  getContext(): Record<string, unknown>
  reset(): void
}
