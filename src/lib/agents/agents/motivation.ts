/**
 * Motivation Agent
 *
 * Learns user's motivational language over time,
 * adjusts tone dynamically, and detects disengagement early.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  MotivationState
} from '../types'

interface MessageLog {
  timestamp: string
  direction: 'inbound' | 'outbound'
  content: string
  engagement: number // Did user respond positively?
  tone: 'aggressive' | 'supportive' | 'neutral' | 'direct'
}

interface MotivationState2 extends MotivationState {
  userProfile: AgentUserProfile | null
  messageHistory: MessageLog[]
  engagementScores: number[]
  tonePreferences: Map<string, number>
  streakDays: number
  lastSessionDate: string
}

export class MotivationAgent implements BaseAgent {
  readonly name = 'Motivation Agent'
  readonly description = 'Adaptive motivational language that learns user preferences and detects disengagement'
  readonly version = '1.0.0'

  private state: MotivationState2 = {
    userProfile: null,
    messageHistory: [],
    engagementScores: [],
    tonePreferences: new Map(),
    streakDays: 0,
    lastSessionDate: '',
    engagement: 100,
    tone: 'supportive',
    lastInteraction: '',
    riskLevel: 'low',
    predictedDropoutRisk: 0,
    recommendedTone: 'supportive'
  }

  private messageTemplates = {
    aggressive: [
      "Time to push harder. You didn't come this far to quit now.",
      "No excuses. Get it done.",
      "Pain is weakness leaving your body. Let's go.",
      "Your future self will thank you. Now move.",
      "Stop being comfortable. Get uncomfortable."
    ],
    supportive: [
      "You've got this! Every rep counts.",
      "Progress isn't always linear. Show up and that's already a win.",
      "Be proud of yourself for showing up today.",
      "It's not about perfect. It's about showing up.",
      "Your consistency is building something great."
    ],
    neutral: [
      "Session scheduled. Let's get to work.",
      "Time for training. Focus on the fundamentals.",
      "Building habits one session at a time.",
      "Consistency leads to results.",
      "Execute the plan."
    ],
    direct: [
      "Workout: 4 sets squat, 3 sets leg press. Get it done.",
      "Today's focus: Lower body. Complete the session.",
      "Session plan is ready. Execute with focus.",
      "You have a session pending. Complete it today.",
      "Training protocol loaded. Begin when ready."
    ]
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
    // Set initial tone based on goals
    if (userProfile.goals.includes('strength') || userProfile.goals.includes('muscle-building')) {
      this.state.tone = 'aggressive'
      this.state.recommendedTone = 'aggressive'
    }
  }

  async process(input: {
    userMessage?: string
    lastSessionCompleted?: boolean
    daysSinceLastSession?: number
    workoutStreak?: number
    timeOfDay?: 'morning' | 'afternoon' | 'evening'
    triggerType?: 'reminder' | 'checkin' | 'motivation' | 'streak' | 'recovery'
  }): Promise<AgentResponse<{
    message: string
    tone: 'aggressive' | 'supportive' | 'neutral' | 'direct'
    action?: string
    predictedDropoutRisk: number
    engagement: number
  }>> {
    try {
      const {
        userMessage,
        lastSessionCompleted = false,
        daysSinceLastSession = 1,
        workoutStreak = this.state.streakDays,
        timeOfDay = 'afternoon',
        triggerType = 'reminder'
      } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      // Process user's response if provided
      if (userMessage) {
        this.processUserResponse(userMessage)
      }

      // Update streak tracking
      this.updateStreak(lastSessionCompleted, daysSinceLastSession)

      // Detect disengagement risk
      const riskLevel = this.detectDisengagementRisk(daysSinceLastSession, workoutStreak)
      this.state.riskLevel = riskLevel

      // Calculate predicted dropout risk
      const dropoutRisk = this.calculateDropoutRisk()
      this.state.predictedDropoutRisk = dropoutRisk

      // Determine appropriate tone
      const recommendedTone = this.determineTone(triggerType, riskLevel, workoutStreak)
      this.state.recommendedTone = recommendedTone

      // Generate message
      const message = this.generateMessage(triggerType, recommendedTone, timeOfDay, workoutStreak)

      // Log interaction
      this.state.lastInteraction = new Date().toISOString()
      this.state.messageHistory.push({
        timestamp: this.state.lastInteraction,
        direction: 'outbound',
        content: message,
        engagement: 0, // Will be updated on user's response
        tone: recommendedTone
      })

      return {
        success: true,
        data: {
          message,
          tone: recommendedTone,
          action: triggerType === 'reminder' ? 'send_reminder' : 'send_checkin',
          predictedDropoutRisk: dropoutRisk,
          engagement: this.state.engagement
        },
        confidence: 0.75,
        followUpNeeded: riskLevel === 'high' || riskLevel === 'critical'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      }
    }
  }

  private processUserResponse(message: string): void {
    // Analyze user message to determine engagement
    const lowerMessage = message.toLowerCase()

    let engagement = 50 // Default neutral

    // Positive engagement indicators
    if (lowerMessage.includes('yes') || lowerMessage.includes('yep') || lowerMessage.includes('sure')) {
      engagement += 20
    }
    if (lowerMessage.includes('let\'s go') || lowerMessage.includes('lets go') || lowerMessage.includes('woo')) {
      engagement += 30
    }
    if (lowerMessage.includes('completed') || lowerMessage.includes('finished') || lowerMessage.includes('done')) {
      engagement += 25
    }
    if (lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('amazing')) {
      engagement += 20
    }
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      engagement += 10
    }

    // Negative engagement indicators
    if (lowerMessage.includes('no') || lowerMessage.includes('nope') || lowerMessage.includes('nah')) {
      engagement -= 20
    }
    if (lowerMessage.includes('can\'t') || lowerMessage.includes('cant') || lowerMessage.includes('struggling')) {
      engagement -= 15
    }
    if (lowerMessage.includes('skip') || lowerMessage.includes('tomorrow') || lowerMessage.includes('later')) {
      engagement -= 25
    }
    if (lowerMessage.includes('unmotivated') || lowerMessage.includes('burned out') || lowerMessage.includes('tired')) {
      engagement -= 20
    }
    if (lowerMessage.includes('hate') || lowerMessage.includes('dreading')) {
      engagement -= 30
    }

    engagement = Math.max(0, Math.min(100, engagement))
    this.state.engagementScores.push(engagement)
    this.state.engagement = engagement

    // Learn tone preference
    if (lowerMessage.includes('love') || lowerMessage.includes('awesome') || lowerMessage.includes('thanks')) {
      const currentPref = this.state.tonePreferences.get('supportive') || 0
      this.state.tonePreferences.set('supportive', currentPref + 1)
    }
    if (lowerMessage.includes('pump') || lowerMessage.includes('beast') || lowerMessage.includes('let\'s go')) {
      const currentPref = this.state.tonePreferences.get('aggressive') || 0
      this.state.tonePreferences.set('aggressive', currentPref + 1)
    }
  }

  private updateStreak(sessionCompleted: boolean, daysSinceLastSession: number): void {
    const today = new Date().toISOString().split('T')[0]

    if (sessionCompleted) {
      if (this.state.lastSessionDate !== today) {
        this.state.streakDays = this.state.streakDays + 1
        this.state.lastSessionDate = today
      }
    } else if (daysSinceLastSession > 1) {
      // Reset streak if missed sessions
      this.state.streakDays = 0
    }
  }

  private detectDisengagementRisk(daysSinceLastSession: number, streak: number): 'low' | 'medium' | 'high' | 'critical' {
    // Calculate based on recent engagement scores
    const recentScores = this.state.engagementScores.slice(-5)
    const avgEngagement = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : 50

    if (avgEngagement < 30) return 'critical'
    if (avgEngagement < 40) return 'high'
    if (avgEngagement < 50) return 'medium'

    if (daysSinceLastSession > 5) return 'high'
    if (daysSinceLastSession > 7) return 'critical'

    if (streak > 30 && avgEngagement < 60) return 'high'

    return 'low'
  }

  private calculateDropoutRisk(): number {
    let risk = 0

    // Recent engagement trend
    const recentScores = this.state.engagementScores.slice(-10)
    if (recentScores.length >= 3) {
      const trend = recentScores[recentScores.length - 1] - recentScores[0]
      if (trend < -10) risk += 30
    }

    // Check for warning signs
    const lastMessages = this.state.messageHistory.slice(-3)
    const noResponse = lastMessages.filter(m => m.engagement === 0).length
    if (noResponse >= 2) risk += 20

    // Streak behavior
    if (this.state.streakDays === 0) risk += 15
    else if (this.state.streakDays < 7) risk += 5
    else if (this.state.streakDays > 30 && this.state.engagement < 50) risk += 10

    return Math.min(100, risk)
  }

  private determineTone(
    triggerType: string,
    riskLevel: string,
    streak: number
  ): 'aggressive' | 'supportive' | 'neutral' | 'direct' {
    // If disengagement risk is high, use supportive tone
    if (riskLevel === 'high' || riskLevel === 'critical') {
      return 'supportive'
    }

    // If streak is strong, match user's likely preferred tone
    if (streak > 30) {
      const preferredTone = this.getPreferredTone()
      if (preferredTone) return preferredTone
    }

    // Map trigger types to appropriate tones
    switch (triggerType) {
      case 'streak':
        return 'supportive' // Celebration should be warm
      case 'reminder':
        return 'direct' // Reminders should be clear
      case 'motivation':
        return 'aggressive' // Motivation often works with fire
      case 'recovery':
        return 'supportive' // Recovery check-ins should be gentle
      case 'checkin':
        return 'neutral' // Regular check-ins can be factual
      default:
        return 'neutral'
    }
  }

  private getPreferredTone(): 'aggressive' | 'supportive' | 'neutral' | 'direct' | null {
    let maxCount = 0
    let preferredTone: 'aggressive' | 'supportive' | 'neutral' | 'direct' | null = null

    this.state.tonePreferences.forEach((count, tone) => {
      if (count > maxCount) {
        maxCount = count
        preferredTone = tone as 'aggressive' | 'supportive' | 'neutral' | 'direct'
      }
    })

    return maxCount > 2 ? preferredTone : null
  }

  private generateMessage(
    triggerType: string,
    tone: 'aggressive' | 'supportive' | 'neutral' | 'direct',
    _timeOfDay: 'morning' | 'afternoon' | 'evening',
    streak: number
  ): string {
    const templates = this.messageTemplates[tone]

    // Customize based on trigger type
    switch (triggerType) {
      case 'streak':
        if (streak > 30) {
          return `🔥 ${streak}-day streak! You're a machine. Let's keep this going.`
        } else if (streak > 7) {
          return `💪 ${streak} days strong! That's real dedication.`
        } else {
          return `🏃 ${streak} days started! Building momentum.`
        }

      case 'recovery':
        return 'How are you feeling today? Remember, rest is part of training.'

      case 'reminder':
        if (tone === 'direct') {
          return `You have a workout scheduled. Complete it today to maintain your ${streak}-day streak.`
        } else if (tone === 'supportive') {
          return `Hey! Your workout is waiting for you. Even a short session counts. 💪`
        } else {
          return `Time for your training session. Let's go.`
        }

      case 'motivation':
        return templates[Math.floor(Math.random() * templates.length)]

      default:
        return templates[Math.floor(Math.random() * templates.length)]
    }
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      streakDays: this.state.streakDays,
      engagement: this.state.engagement,
      riskLevel: this.state.riskLevel,
      dropoutRisk: this.state.predictedDropoutRisk,
      preferredTone: this.getPreferredTone(),
      messagesSent: this.state.messageHistory.length
    }
  }

  reset(): void {
    this.state.messageHistory = []
    this.state.engagementScores = []
    this.state.tonePreferences.clear()
    this.state.streakDays = 0
    this.state.engagement = 100
  }
}
