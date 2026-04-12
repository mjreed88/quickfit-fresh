import { UserProfile, WorkoutPlan, MealPlan } from './types'

const P = 'qf_profile'
const W = 'qf_workout'
const M = 'qf_meals'

export const saveProfile = (p: UserProfile): boolean => {
  try {
    localStorage.setItem(P, JSON.stringify(p))
    return true
  } catch (e) {
    console.error('Failed to save profile:', e)
    return false
  }
}
export const getProfile = (): UserProfile | null => {
  try {
    const s = localStorage.getItem(P)
    return s ? JSON.parse(s) : null
  } catch (e) {
    console.error('Failed to get profile:', e)
    return null
  }
}

export const saveWorkoutPlan = (w: WorkoutPlan): boolean => {
  try {
    localStorage.setItem(W, JSON.stringify(w))
    return true
  } catch (e) {
    console.error('Failed to save workout plan:', e)
    return false
  }
}
export const getWorkoutPlan = (): WorkoutPlan | null => {
  try {
    const s = localStorage.getItem(W)
    return s ? JSON.parse(s) : null
  } catch (e) {
    console.error('Failed to get workout plan:', e)
    return null
  }
}

export const saveMealPlan = (m: MealPlan): boolean => {
  try {
    localStorage.setItem(M, JSON.stringify(m))
    return true
  } catch (e) {
    console.error('Failed to save meal plan:', e)
    return false
  }
}
export const getMealPlan = (): MealPlan | null => {
  try {
    const s = localStorage.getItem(M)
    return s ? JSON.parse(s) : null
  } catch (e) {
    console.error('Failed to get meal plan:', e)
    return null
  }
}

export const clearAll = () => {
  try {
    localStorage.removeItem(P)
    localStorage.removeItem(W)
    localStorage.removeItem(M)
  } catch (e) {
    console.error('Failed to clear localStorage:', e)
  }
}

export const hasPlan = (): boolean => !!(getProfile() && getWorkoutPlan() && getMealPlan())
