/**
 * Nutrition Negotiation Agent
 *
 * Chat-based meal logging that adapts to user's food preferences,
 * negotiates calorie targets, and suggests swaps based on what's available.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  MealEntry,
  MacroInfo,
  FoodItem
} from '../types'

interface NutritionState {
  userProfile: AgentUserProfile | null
  dailyLog: MealEntry[]
  calorieTarget: number
  userPreferences: Map<string, number> // food -> preference score
  foodDatabase: Map<string, FoodItem>
}

export class NutritionNegotiationAgent implements BaseAgent {
  readonly name = 'Nutrition Negotiation Agent'
  readonly description = 'Chat-based meal logging with adaptive calorie negotiation and food swaps'
  readonly version = '1.0.0'

  private state: NutritionState = {
    userProfile: null,
    dailyLog: [],
    calorieTarget: 2000,
    userPreferences: new Map(),
    foodDatabase: new Map()
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
    this.calculateCalorieTarget(userProfile)
  }

  private calculateCalorieTarget(profile: AgentUserProfile): void {
    // Mifflin-StJeor approximation
    let bmr: number

    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height * 2.54 - 5 * profile.age + 5
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height * 2.54 - 5 * profile.age - 161
    }

    // Activity multiplier based on workout days
    const activityMultiplier = 1.2 + (profile.workoutDays * 0.05)
    let tdee = bmr * activityMultiplier

    // Adjust based on goals
    if (profile.goals.includes('weight-loss')) {
      tdee *= 0.8 // 20% deficit
    } else if (profile.goals.includes('muscle-building')) {
      tdee *= 1.15 // 15% surplus
    }

    this.state.calorieTarget = Math.round(tdee)
  }

  async process(input: {
    action: 'log' | 'negotiate' | 'swap' | 'analyze' | 'chat'
    message?: string
    meal?: MealEntry
    currentCalories?: number
    preferences?: Record<string, number>
  }): Promise<AgentResponse<unknown>> {
    try {
      const { action, message, meal, currentCalories } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      switch (action) {
        case 'log':
          return this.logMeal(meal!)

        case 'negotiate':
          return this.negotiateTarget(currentCalories || 0, message || '')

        case 'swap':
          return this.suggestSwaps(meal!)

        case 'analyze':
          return this.analyzeDailyIntake()

        case 'chat':
          return this.chat(message || '')

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

  private logMeal(meal: MealEntry): AgentResponse<{
    response: string
    macros: MacroInfo
    remaining: MacroInfo
    suggestions?: string[]
  }> {
    this.state.dailyLog.push(meal)

    const totalMacros = this.calculateTotalMacros()
    const remaining = {
      calories: this.state.calorieTarget - totalMacros.calories,
      protein: Math.max(0, (this.state.userProfile!.weight * 1.2) - totalMacros.protein), // 1.2g per lb
      carbs: Math.max(0, (this.state.calorieTarget * 0.4) / 4 - totalMacros.carbs),
      fat: Math.max(0, (this.state.calorieTarget * 0.25) / 9 - totalMacros.fat)
    }

    let suggestions: string[] = []

    if (remaining.calories < 0) {
      suggestions.push(`You're ${Math.abs(remaining.calories)} calories over target. Consider lighter options.`)
    } else if (remaining.protein > 50) {
      suggestions.push(`Add ${Math.round(remaining.protein / 30)} servings of protein to hit your protein goal.`)
    }

    return {
      success: true,
      data: {
        response: this.generateLogConfirmation(meal, totalMacros),
        macros: totalMacros,
        remaining,
        suggestions
      },
      confidence: 0.9
    }
  }

  private async negotiateTarget(currentCalories: number, userMessage: string): Promise<AgentResponse<{
    response: string
    newTarget: number
    reasoning: string
  }>> {
    const currentDeficit = this.state.calorieTarget - currentCalories
    const lower = this.state.calorieTarget * 0.85
    const upper = this.state.calorieTarget * 1.15

    let negotiationResult: string
    let newTarget = this.state.calorieTarget

    const userMessageLower = userMessage.toLowerCase()

    // User wants lower target
    if (userMessageLower.includes('less') || userMessageLower.includes('lower') || userMessageLower.includes('cut')) {
      if (currentDeficit > 200) {
        newTarget = Math.round((this.state.calorieTarget + currentCalories) / 2)
        negotiationResult = `I hear you want to be more aggressive. Let's meet in the middle at ${newTarget} calories.`
      } else {
        newTarget = lower
        negotiationResult = `I can drop your target to ${newTarget}, but that's aggressive. Make sure you're eating enough to fuel recovery.`
      }
    }
    // User wants higher target
    else if (userMessageLower.includes('more') || userMessageLower.includes('higher') || userMessageLower.includes('hungry')) {
      if (currentDeficit < -100) {
        newTarget = Math.round((this.state.calorieTarget + currentCalories) / 2)
        negotiationResult = `Based on what you've logged, let's bump to ${newTarget} calories. That feels more sustainable.`
      } else {
        newTarget = upper
        negotiationResult = `Let's give you ${newTarget} calories. Your training load suggests you can handle the extra fuel.`
      }
    }
    // User is struggling
    else if (userMessageLower.includes('struggling') || userMessageLower.includes('hard') || userMessageLower.includes('can\'t')) {
      newTarget = upper
      negotiationResult = `Sustainability over perfection. Let's raise to ${newTarget} and build from there.`
    }
    // Happy with current
    else {
      negotiationResult = `Your ${this.state.calorieTarget} calorie target looks good. Keep it up!`
    }

    this.state.calorieTarget = newTarget

    return {
      success: true,
      data: {
        response: negotiationResult,
        newTarget,
        reasoning: negotiationResult
      },
      confidence: 0.8
    }
  }

  private suggestSwaps(meal: MealEntry): AgentResponse<{
    swaps: { from: string; to: string; reason: string }[]
    caloriesSaved: number
  }> {
    const swaps: { from: string; to: string; reason: string }[] = []
    let caloriesSaved = 0

    for (const food of meal.foods) {
      // Sugary drinks -> diet alternatives
      if (food.name.toLowerCase().includes('soda') || food.name.toLowerCase().includes('juice')) {
        swaps.push({ from: food.name, to: 'Sparkling water', reason: 'Save 150 calories' })
        caloriesSaved += 150
      }

      // White rice -> cauliflower rice
      if (food.name.toLowerCase().includes('white rice')) {
        swaps.push({ from: 'White rice', to: 'Cauliflower rice', reason: 'Save 130 calories, more fiber' })
        caloriesSaved += 130
      }

      // Regular yogurt -> greek yogurt
      if (food.name.toLowerCase().includes('yogurt') && !food.name.toLowerCase().includes('greek')) {
        swaps.push({ from: 'Regular yogurt', to: 'Greek yogurt', reason: 'Double the protein, half the carbs' })
        caloriesSaved += 50
      }

      // Chips -> air-popped popcorn
      if (food.name.toLowerCase().includes('chips')) {
        swaps.push({ from: 'Chips', to: 'Air-popped popcorn', reason: 'Save 200 calories per serving' })
        caloriesSaved += 200
      }
    }

    return {
      success: true,
      data: { swaps, caloriesSaved },
      confidence: 0.85
    }
  }

  private analyzeDailyIntake(): AgentResponse<{
    totalMacros: MacroInfo
    targetMacros: MacroInfo
    balance: 'on_track' | 'over' | 'under'
    message: string
  }> {
    const totalMacros = this.calculateTotalMacros()
    const proteinTarget = this.state.userProfile!.weight * 1.2
    const carbsTarget = (this.state.calorieTarget * 0.4) / 4
    const fatTarget = (this.state.calorieTarget * 0.25) / 9

    const targetMacros = {
      calories: this.state.calorieTarget,
      protein: proteinTarget,
      carbs: carbsTarget,
      fat: fatTarget
    }

    const balance: 'on_track' | 'over' | 'under' =
      Math.abs(totalMacros.calories - this.state.calorieTarget) < 200 ? 'on_track' :
        totalMacros.calories > this.state.calorieTarget ? 'over' : 'under'

    let message = ''
    if (balance === 'on_track') {
      message = 'Perfect! Your intake is right on target.'
    } else if (balance === 'over') {
      message = `You're ${totalMacros.calories - this.state.calorieTarget} calories over. Consider lighter options for dinner.`
    } else {
      message = `You have ${this.state.calorieTarget - totalMacros.calories} calories remaining. Great for hitting your target!`
    }

    return {
      success: true,
      data: { totalMacros, targetMacros, balance, message },
      confidence: 0.9
    }
  }

  private async chat(message: string): Promise<AgentResponse<{
    response: string
    action?: string
  }>> {
    const lowerMessage = message.toLowerCase()

    // Respond to common queries
    if (lowerMessage.includes('protein')) {
      const proteinRemaining = (this.state.userProfile!.weight * 1.2) - this.calculateTotalMacros().protein
      return {
        success: true,
        data: {
          response: `You need about ${Math.round(proteinRemaining)}g more protein today. Good sources: chicken breast (165g), eggs (6g each), greek yogurt (10g), salmon (140g).`,
          action: 'protein_info'
        },
        confidence: 0.9
      }
    }

    if (lowerMessage.includes('what') && lowerMessage.includes('eat')) {
      return {
        success: true,
        data: {
          response: `Based on your ${this.state.calorieTarget} calorie target, try: Grilled chicken with rice and broccoli (~500 cal), greek yogurt with banana (~200 cal), or salmon with sweet potato (~450 cal).`,
          action: 'meal_suggestion'
        },
        confidence: 0.8
      }
    }

    if (lowerMessage.includes('cheat') || lowerMessage.includes('treat')) {
      return {
        success: true,
        data: {
          response: `Treats are fine in moderation! A small treat (200-300 cal) won't hurt. Just log it and adjust your other meals slightly. Life is about balance.`,
          action: 'treat_info'
        },
        confidence: 0.85
      }
    }

    // Default response
    return {
      success: true,
      data: {
        response: "Got it! Let me know what you're eating or if you have questions about your nutrition.",
        action: 'general'
      },
      confidence: 0.6
    }
  }

  private calculateTotalMacros(): MacroInfo {
    return this.state.dailyLog.reduce(
      (total, meal) => ({
        calories: total.calories + meal.totalMacros.calories,
        protein: total.protein + meal.totalMacros.protein,
        carbs: total.carbs + meal.totalMacros.carbs,
        fat: total.fat + meal.totalMacros.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  private generateLogConfirmation(meal: MealEntry, macros: MacroInfo): string {
    return `${meal.mealType} logged: ${macros.calories} cal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat. ${this.state.dailyLog.length} meals today.`
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      calorieTarget: this.state.calorieTarget,
      mealsLoggedToday: this.state.dailyLog.length,
      totalMacros: this.calculateTotalMacros()
    }
  }

  reset(): void {
    this.state.dailyLog = []
  }
}
