/**
 * Gym Etiquette Agent
 *
 * Helps beginners navigate gym social norms, teaches equipment etiquette,
 * and reduces gym anxiety barrier.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile
} from '../types'

interface GymEtiquetteState {
  userProfile: AgentUserProfile | null
  questionsAnswered: string[]
  anxietyLevel: number // 0-100
  tipsProvided: Set<string>
}

interface EtiquetteTip {
  category: string
  title: string
  content: string
  priority: 'critical' | 'important' | 'nice'
}

const ETIQUETTE_TIPS: EtiquetteTip[] = [
  // Equipment sharing
  {
    category: 'sharing',
    title: 'Ask Before Using Someone\'s Equipment',
    content: 'If someone is resting between sets, wait or ask "Are you using this?" before grabbing their weights.',
    priority: 'critical'
  },
  {
    category: 'sharing',
    title: 'Offer to Spot',
    content: 'If someone is struggling on a lift, offer to spot. This builds gym community and you might make a training partner.',
    priority: 'important'
  },
  {
    category: 'rest',
    title: 'Rest Timers Are Your Friend',
    content: 'Use your phone or a timer app. Standing around for 5 minutes on a bench is rude when there\'s a line.',
    priority: 'important'
  },
  {
    category: 'rest',
    title: 'Get On, Do Work, Get Off',
    content: 'The bench is for sets, not for sitting, texting, or watching others. Do your work efficiently.',
    priority: 'critical'
  },
  // Hygiene
  {
    category: 'hygiene',
    title: 'Wipe Down Equipment',
    content: 'Always wipe down equipment with the spray and towels provided. Sweat is gross.',
    priority: 'critical'
  },
  {
    category: 'hygiene',
    title: 'Deodorant Is Essential',
    content: 'Apply deodorant before coming. Gyms are small spaces and ventilation isn\'t always great.',
    priority: 'critical'
  },
  {
    category: 'hygiene',
    title: 'Bring a Towel',
    content: 'Place your towel on equipment when using it. It\'s considerate and keeps sweat off the padding.',
    priority: 'important'
  },
  // Noise levels
  {
    category: 'noise',
    title: 'Grunting Is Optional',
    content: 'Exhale during exertion, inhale during rest. You don\'t need to sound like a wounded animal.',
    priority: 'nice'
  },
  {
    category: 'noise',
    title: 'Drop Weights Carefully',
    content: 'Controlled lowering is ideal. Controlled dropping from moderate heights is okay. Slamming is not.',
    priority: 'important'
  },
  // Equipment specific
  {
    category: 'plates',
    title: 'Load/Unload Both Sides',
    content: 'When adding or removing plates, do it on BOTH sides of the bar equally to avoid accidents.',
    priority: 'critical'
  },
  {
    category: 'plates',
    title: 'Return All Weights',
    content: 'Put your weights back where you found them. Nobody wants to hunt for their weight plates.',
    priority: 'critical'
  },
  {
    category: 'cards',
    title: 'Use Gym Cards Properly',
    content: 'Wipe equipment after using it, especially in the cardio area. Nobody wants your sweat on the handles.',
    priority: 'critical'
  },
  // Time management
  {
    category: 'time',
    title: 'Don\'t Super-set Everything',
    content: 'If you\'re super-setting (alternating exercises), be aware others might be waiting for that equipment too.',
    priority: 'important'
  },
  {
    category: 'time',
    title: 'Peak Hours Etiquette',
    content: 'During busy times (5-7pm), limit your rest time to 60-90 seconds and be ready to share equipment.',
    priority: 'important'
  },
  // Social
  {
    category: 'social',
    title: 'Headphone Etiquette',
    content: 'If you\'re wearing headphones and someone talks to you, pull one ear out. They might need the equipment you\'re on.',
    priority: 'nice'
  },
  {
    category: 'social',
    title: 'Mirror Rules',
    content: 'Don\'t stand in front of mirrors fixing your hair. Others need them to check form.',
    priority: 'nice'
  },
  {
    category: 'social',
    title: 'Ask for Help When Lost',
    content: 'Gym staff and experienced lifters are usually happy to show you equipment if you ask politely.',
    priority: 'nice'
  }
]

const ANXIETY_RESPONSES: Record<string, string> = {
  equipment: "Don't know how to use a machine? Here's the secret: Start light, watch others first, and don't be embarrassed to ask staff for a quick tutorial. Everyone was new once.",
  crowded: "Feeling overwhelmed by a crowded gym? Try early mornings (6-7am) or mid-day (10am-12pm) when it's usually quieter. Also, focus on your workout, not others.",
  form: "Worried about people judging your form? Here's the truth: Most people are too focused on their own workout to notice you. Form improves with practice - nobody starts perfect.",
  weights: "Intimidated by the weights area? Start with the dumbbell section. It's less intimidating and you can build confidence there before moving to barbells.",
  questions: "Want to ask someone something? Just be direct and friendly: 'Hey, do you have a minute?' Most gym people are happy to help or chat briefly.",
  singletons: "See someone alone? Don't assume they want to talk or train with you. Some people prefer solo workouts. Offer help once, then respect their space."
}

export class GymEtiquetteAgent implements BaseAgent {
  readonly name = 'Gym Etiquette Agent'
  readonly description = 'Helps beginners navigate gym social norms and reduce gym anxiety'
  readonly version = '1.0.0'

  private state: GymEtiquetteState = {
    userProfile: null,
    questionsAnswered: [],
    anxietyLevel: 50,
    tipsProvided: new Set()
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile

    // Estimate initial anxiety based on fitness level
    if (userProfile.fitnessLevel === 'beginner') {
      this.state.anxietyLevel = 70
    } else if (userProfile.fitnessLevel === 'intermediate') {
      this.state.anxietyLevel = 40
    } else {
      this.state.anxietyLevel = 20
    }
  }

  async process(input: {
    action: 'ask' | 'tip' | 'reassure' | 'learn'
    question?: string
    topic?: string
    anxietySource?: string
  }): Promise<AgentResponse<unknown>> {
    try {
      const { action, question, topic, anxietySource } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      switch (action) {
        case 'ask':
          return this.answerQuestion(question || '')

        case 'tip':
          return this.getRelevantTips(topic || 'general')

        case 'reassure':
          return this.reassure(anxietySource || 'equipment')

        case 'learn':
          return this.learnEtiquette(topic || '')

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

  private answerQuestion(question: string): AgentResponse<{
    response: string
    tips: EtiquetteTip[]
    anxietyReduction: number
  }> {
    const lowerQ = question.toLowerCase()
    this.state.questionsAnswered.push(question)

    let response = ''
    let relevantTips: EtiquetteTip[] = []
    let anxietyReduction = 0

    // Match question to relevant tips
    if (lowerQ.includes('share') || lowerQ.includes('equipment') || lowerQ.includes('wait')) {
      relevantTips = this.getTipsByCategory('sharing')
      response = 'Good question about sharing equipment! Here\'s how it works...'
    } else if (lowerQ.includes('hygiene') || lowerQ.includes('smell') || lowerQ.includes('sweat')) {
      relevantTips = this.getTipsByCategory('hygiene')
      response = 'Gym hygiene is super important. Let me share the key rules...'
    } else if (lowerQ.includes('rest') || lowerQ.includes('time') || lowerQ.includes('how long')) {
      relevantTips = this.getTipsByCategory('rest')
      response = 'Rest periods are important for both recovery and gym etiquette...'
    } else if (lowerQ.includes('dumbbell') || lowerQ.includes('barbell') || lowerQ.includes('machine')) {
      relevantTips = this.getTipsByCategory('plates')
      response = 'Equipment etiquette is straightforward once you know the basics...'
    } else if (lowerQ.includes('social') || lowerQ.includes('talk') || lowerQ.includes('approach')) {
      relevantTips = this.getTipsByCategory('social')
      response = 'Gym social dynamics can be tricky. Here\'s what works...'
    } else if (lowerQ.includes('feel') || lowerQ.includes('nervous') || lowerQ.includes('anxious') || lowerQ.includes('intimidat')) {
      anxietyReduction = 30
      response = ANXIETY_RESPONSES.intimidated || "It's completely normal to feel that way. Here's the truth..."
    } else {
      // Default general tips
      relevantTips = this.getCriticalTips()
      response = 'Here are the essential gym etiquette tips every beginner should know...'
    }

    return {
      success: true,
      data: {
        response: response,
        tips: relevantTips,
        anxietyReduction
      },
      confidence: 0.8,
      followUpNeeded: relevantTips.some(t => t.priority === 'critical')
    }
  }

  private getRelevantTips(topic: string): AgentResponse<{
    response: string
    tips: EtiquetteTip[]
    category: string
  }> {
    const category = topic.toLowerCase()
    const tips = this.getTipsByCategory(category)

    return {
      success: true,
      data: {
        response: `Here are the key etiquette tips for ${topic}...`,
        tips,
        category
      },
      confidence: 0.85
    }
  }

  private reassure(anxietySource: string): AgentResponse<{
    response: string
    anxietyReduction: number
    tips: EtiquetteTip[]
  }> {
    let response = ANXIETY_RESPONSES[anxietySource] || ANXIETY_RESPONSES.equipment
    let anxietyReduction = 20

    // Customize based on user's fitness level and anxiety source
    if (this.state.userProfile?.fitnessLevel === 'beginner') {
      response += " Starting at a lighter weight than you think is smart, not weak."
      anxietyReduction += 15
    }

    // Provide relevant tips that address the anxiety
    const tips = this.getTipsByCategory(anxietySource).slice(0, 3)

    this.state.anxietyLevel = Math.max(10, this.state.anxietyLevel - anxietyReduction)

    return {
      success: true,
      data: {
        response,
        anxietyReduction,
        tips
      },
      confidence: 0.8
    }
  }

  private learnEtiquette(topic: string): AgentResponse<unknown> {
    const tips = this.getTipsByCategory(topic)
    const learned = tips.map(t => t.title)

    learned.forEach(title => this.state.tipsProvided.add(title))
    this.state.anxietyLevel = Math.max(10, this.state.anxietyLevel - 10)

    return {
      success: true,
      data: {
        response: `You've learned ${learned.length} tips about ${topic}`,
        learned,
        tips,
        anxietyReduction: 5
      },
      confidence: 0.85
    }
  }

  private getTipsByCategory(category: string): EtiquetteTip[] {
    return ETIQUETTE_TIPS.filter(tip => tip.category === category)
  }

  private getCriticalTips(): EtiquetteTip[] {
    return ETIQUETTE_TIPS.filter(tip => tip.priority === 'critical')
  }

  async getQuickTips(): Promise<string[]> {
    return [
      "Wipe down equipment after use",
      "Load/unload plates equally on both sides",
      "Return weights where you found them",
      "Keep rest periods to 60-90 seconds during busy times",
      "Bring a towel and use deodorant",
      "Ask if you can use equipment someone's resting on",
      "Don't sit on benches between sets when others are waiting"
    ]
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      questionsAnsweredCount: this.state.questionsAnswered.length,
      currentAnxietyLevel: this.state.anxietyLevel,
      tipsProvidedCount: this.state.tipsProvided.size
    }
  }

  reset(): void {
    this.state.questionsAnswered = []
    this.state.anxietyLevel = 50
    this.state.tipsProvided.clear()
  }
}
