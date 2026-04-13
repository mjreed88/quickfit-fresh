/**
 * Competition Agent
 *
 * Creates AI-generated competitions with matched users,
 * generates point systems, and manages challenge dynamics.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  Challenge,
  ChallengeParticipant
} from '../types'

interface CompetitionState {
  userProfile: AgentUserProfile | null
  activeChallenges: Challenge[]
  completedChallenges: Challenge[]
  participants: Map<string, ChallengeParticipant>
}

export class CompetitionAgent implements BaseAgent {
  readonly name = 'Competition Agent'
  readonly description = 'AI-generated fitness competitions and challenges with matched participants'
  readonly version = '1.0.0'

  private state: CompetitionState = {
    userProfile: null,
    activeChallenges: [],
    completedChallenges: [],
    participants: new Map()
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    action: 'create' | 'join' | 'update_score' | 'complete' | 'list' | 'match'
    challengeId?: string
    params?: {
      type?: 'volume' | 'streak' | 'exercise' | 'group'
      title?: string
      description?: string
      durationDays?: number
      targetValue?: number
      participants?: string[]
    }
    score?: number
    userId?: string
  }): Promise<AgentResponse<unknown>> {
    try {
      const { action, challengeId, params, score, userId } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      switch (action) {
        case 'create':
          if (!params?.type) {
            return { success: false, error: 'Type is required to create a challenge', confidence: 0 }
          }
          const challenge = await this.createChallenge(params as { type: 'volume' | 'streak' | 'exercise' | 'group'; title?: string; description?: string; durationDays?: number; targetValue?: number; participants?: string[] })
          return { success: true, data: challenge, confidence: 0.85 }

        case 'join':
          const joined = this.joinChallenge(challengeId!, userId || this.state.userProfile.userId)
          return { success: true, data: joined ?? { error: 'Challenge not found' }, confidence: 0.9 }

        case 'update_score':
          this.updateScore(challengeId!, userId || this.state.userProfile.userId, score!)
          return { success: true, data: { updated: true, challengeId }, confidence: 0.9 }

        case 'complete':
          const completed = this.completeChallenge(challengeId!)
          return { success: true, data: completed ?? { error: 'Challenge not found' }, confidence: 0.95 }

        case 'list':
          return { success: true, data: this.listChallenges(), confidence: 0.9 }

        case 'match':
          const match = this.findMatch(params?.targetValue)
          return { success: true, data: match, confidence: 0.7 }

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

  private async createChallenge(params: {
    type: 'volume' | 'streak' | 'exercise' | 'group'
    title?: string
    description?: string
    durationDays?: number
    targetValue?: number
    participants?: string[]
  }): Promise<Challenge> {
    const {
      type,
      title,
      description,
      durationDays = 7,
      targetValue,
      participants = []
    } = params

    const startDate = new Date().toISOString()
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()

    const challenge: Challenge = {
      challengeId: `challenge_${Date.now()}`,
      type,
      title: title || this.generateTitle(type),
      description: description || this.generateDescription(type, targetValue),
      startDate,
      endDate,
      participants: participants.map((p, index) => ({
        userId: p,
        username: `User_${p}`,
        score: 0,
        rank: index + 1,
        lastUpdate: startDate,
        streakDays: type === 'streak' ? 0 : undefined
      })),
      rules: this.generateRules(type, targetValue),
      scoring: type === 'streak' ? 'cumulative' : 'best',
      status: 'pending'
    }

    this.state.activeChallenges.push(challenge)
    return challenge
  }

  private generateTitle(type: string): string {
    const titles = {
      volume: ['October Volume Challenge', 'Winter Strength Push', 'Monthly Max Volume'],
      streak: ['30-Day Consistency Streak', 'Holiday Workout Streak', 'New Year New You Streak'],
      exercise: ['Squattoberfest', 'Plank Challenge', 'Push-up Challenge'],
      group: ['Office Fitness Showdown', 'Gym Buddies Battle', 'Fitness Fam Challenge']
    }
    const options = titles[type as keyof typeof titles] || ['Fitness Challenge']
    return options[Math.floor(Math.random() * options.length)]
  }

  private generateDescription(type: string, targetValue?: number): string {
    const descriptions = {
      volume: `Cumulative weight volume over the challenge period. Target: ${targetValue || 50000}lbs total.`,
      streak: `Work out every single day. Missing even one day disqualifies you.`,
      exercise: `Complete as many reps as possible of the target exercise. Best single session counts.`,
      group: `Team challenge - combine scores across participants. Highest cumulative score wins.`
    }
    return descriptions[type as keyof typeof descriptions] || 'Fitness challenge'
  }

  private generateRules(type: string, _targetValue?: number): string[] {
    const rules = {
      volume: [
        'Log every workout with total weight volume (weight × reps)',
        'Volume accumulates across all exercises',
        'Highest cumulative volume by end date wins',
        'Must complete minimum 3 workouts per week to qualify'
      ],
      streak: [
        'Work out every day - no exceptions',
        'Any missed day = elimination from challenge',
        'Workout must be minimum 30 minutes',
        'Photo/check-in required daily'
      ],
      exercise: [
        `Complete the target exercise for max total reps in single session`,
        'Rest periods allowed but clock keeps running',
        'Form must be maintained or reps don\'t count',
        'Video submission optional but recommended'
      ],
      group: [
        'Teams of 3-5 participants',
        'Individual scores combine for team total',
        'Most active team (most sessions) gets bonus points',
        'End date determines winning team'
      ]
    }
    return rules[type as keyof typeof rules] || ['Compete fairly and honestly']
  }

  private joinChallenge(challengeId: string, userId: string): Challenge | null {
    const challenge = this.state.activeChallenges.find(c => c.challengeId === challengeId)
    if (!challenge) return null

    if (challenge.participants.some(p => p.userId === userId)) {
      return challenge // Already joined
    }

    challenge.participants.push({
      userId,
      username: `User_${userId}`,
      score: 0,
      rank: challenge.participants.length + 1,
      lastUpdate: new Date().toISOString()
    })

    if (challenge.status === 'pending' && challenge.participants.length >= 2) {
      challenge.status = 'active'
    }

    return challenge
  }

  private updateScore(challengeId: string, userId: string, score: number): void {
    const challenge = this.state.activeChallenges.find(c => c.challengeId === challengeId)
    if (!challenge) return

    const participant = challenge.participants.find(p => p.userId === userId)
    if (!participant) return

    if (challenge.scoring === 'cumulative') {
      participant.score += score
    } else if (challenge.scoring === 'best') {
      participant.score = Math.max(participant.score, score)
    } else {
      participant.score = score
    }

    participant.lastUpdate = new Date().toISOString()
    participant.streakDays = score > 0 ? (participant.streakDays || 0) + 1 : 0

    // Re-rank participants
    challenge.participants.sort((a, b) => b.score - a.score)
    challenge.participants.forEach((p, index) => {
      p.rank = index + 1
    })
  }

  private completeChallenge(challengeId: string): Challenge | null {
    const challenge = this.state.activeChallenges.find(c => c.challengeId === challengeId)
    if (!challenge) return null

    challenge.status = 'completed'

    this.state.completedChallenges.push(challenge)
    this.state.activeChallenges = this.state.activeChallenges.filter(
      c => c.challengeId !== challengeId
    )

    return challenge
  }

  private listChallenges(): { active: Challenge[]; completed: Challenge[] } {
    return {
      active: this.state.activeChallenges,
      completed: this.state.completedChallenges
    }
  }

  private findMatch(_targetScore?: number): { matchQuality: number; matchedUsers: string[] } {
    // In production, this would use ML to match users based on:
    // - Similar fitness levels
    // - Similar goals
    // - Similar availability
    // - Complimentary strengths/weaknesses
    // For now, return placeholder
    return {
      matchQuality: 0.75,
      matchedUsers: []
    }
  }

  async generateChallenge(params: {
    type: 'volume' | 'streak' | 'exercise' | 'group'
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
    goals: string[]
    userCount?: number
  }): Promise<Challenge> {
    const { type, fitnessLevel, goals } = params

    let title = ''
    let description = ''
    let duration = 7
    let targetValue: number | undefined

    // Customize based on user's context
    if (fitnessLevel === 'beginner') {
      duration = 14 // Longer for beginners
      if (type === 'volume') {
        targetValue = 20000 // Lower target
        title = 'Build Your Foundation Volume Challenge'
      } else if (type === 'streak') {
        title = '14-Day Starter Streak'
      }
    } else if (fitnessLevel === 'advanced') {
      duration = 7
      if (type === 'volume') {
        targetValue = 100000 // Higher target
        title = 'Elite Volume Crusher'
      }
    }

    if (goals.includes('weight-loss')) {
      title = title.replace('Volume', 'Calorie Burn')
    }

    return this.createChallenge({
      type,
      title,
      description,
      durationDays: duration,
      targetValue,
      participants: []
    })
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      activeChallenges: this.state.activeChallenges.length,
      completedChallenges: this.state.completedChallenges.length
    }
  }

  reset(): void {
    this.state.activeChallenges = []
    this.state.completedChallenges = []
    this.state.participants.clear()
  }
}
