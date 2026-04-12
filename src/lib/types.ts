export interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph'
  goals: Goal[]
  injuries: string[]
  foodAllergies: string[]
  lactoseIntolerant: boolean
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  workoutDays: number
  sessionDuration: number
}

export type Goal = 'muscle-building' | 'strength' | 'weight-loss' | 'cardio' | 'flexibility' | 'general-health'

export interface WorkoutExercise {
  id: string
  name: string
  category: 'strength' | 'cardio' | 'flexibility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  targetMuscles: string[]
  sets: number
  reps: string
  restSeconds: number
  caloriesPerMinute: number
  equipment: string[]
  instructions: string[]
}

export interface WorkoutDay {
  dayName: string
  focus: string
  exercises: WorkoutExercise[]
  estimatedCalories: number
  duration: number
}

export interface WorkoutPlan {
  days: WorkoutDay[]
  generatedAt: string
}

export interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  goal: Goal
  macros: { calories: number; protein: number; carbs: number; fat: number }
  ingredients: string[]
  instructions: string[]
  allergens: string[]
  containsLactose: boolean
  suggestedItems: SuggestedItem[]
}

export interface MealDay {
  dayName: string
  meals: Meal[]
  totalMacros: { calories: number; protein: number; carbs: number; fat: number }
}

export interface MealPlan {
  days: MealDay[]
  generatedAt: string
}

export interface SuggestedItem {
  name: string
  description: string
  benefit: string
  price: string
  link: string
  badge?: string
  category: 'equipment' | 'supplement' | 'food'
  image?: string
}

export interface MealAnalysisResult {
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
}

// Re-export ExerciseInstructionSet for convenience
export interface ExerciseInstructionSet {
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  muscles: string[]
  equipment: string[]
  startPosition: string
  endPosition: string
  steps: string[]
  formCues: string[]
  safetyTips: string[]
  commonMistakes: string[]
  breathing: string
  startImage: string
  endImage: string
}
