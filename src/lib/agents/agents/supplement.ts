/**
 * Supplement Advisor Agent
 *
 * Evidence-based supplement recommendations cross-referenced with
 * user's goals, diet, training, and warns about medication interactions.
 */

import type {
  BaseAgent,
  AgentResponse,
  AgentUserProfile,
  SupplementRecommendation
} from '../types'

interface SupplementState {
  userProfile: AgentUserProfile | null
  userSupplements: string[]
  medications: string[]
  recommendations: SupplementRecommendation[]
}

interface Supplement {
  name: string
  category: 'protein' | 'creatine' | 'preworkout' | 'vitamin' | 'mineral' | 'recovery' | 'other'
  evidenceLevel: 'strong' | 'moderate' | 'weak'
  benefits: string[]
  risks: string[]
  dosage: string
  timing: string
  interactions: string[]
  contraindications: string[]
  costEfficiency: 'high' | 'medium' | 'low'
}

// Supplement database
const SUPPLEMENTS: Record<string, Supplement> = {
  creatine: {
    name: 'Creatine Monohydrate',
    category: 'creatine',
    evidenceLevel: 'strong',
    benefits: [
      'Increases strength and power output',
      'Enhances muscle recovery between sets',
      'Supports lean muscle mass gain',
      'May improve brain function',
      'Safe for long-term use at maintenance doses'
    ],
    risks: [
      'Water retention (temporary)',
      'Minor GI distress if not taken with food',
      'Potential kidney stress with pre-existing conditions'
    ],
    dosage: '3-5g daily',
    timing: 'Any time, consistency matters more',
    interactions: ['NSAIDs may reduce absorption', 'Caffeine may slightly reduce benefits'],
    contraindications: ['Pre-existing kidney disease'],
    costEfficiency: 'high'
  },
  wheyProtein: {
    name: 'Whey Protein',
    category: 'protein',
    evidenceLevel: 'strong',
    benefits: [
      'Fast-absorbing protein for post-workout recovery',
      'Convenient way to hit protein targets',
      'Complete amino acid profile',
      'Supports muscle protein synthesis'
    ],
    risks: [
      'Digestive issues for lactose intolerant',
      'May cause acne in some individuals',
      'Unnecessary if whole food protein is sufficient'
    ],
    dosage: '20-40g post-workout, or to meet daily protein target',
    timing: 'Within 2 hours post-workout, or anytime',
    interactions: [],
    contraindications: ['Milk allergy', 'Lactose intolerance (use isolate)'],
    costEfficiency: 'medium'
  },
  caffeine: {
    name: 'Caffeine',
    category: 'preworkout',
    evidenceLevel: 'strong',
    benefits: [
      'Increases alertness and focus',
      'Boosts power output for short-duration exercise',
      'Reduces perceived exertion',
      'Enhances fat oxidation'
    ],
    risks: [
      'Sleep disruption if taken too late',
      'Anxiety and jitters in some people',
      'Tolerance build-up with daily use',
      'Potential heart palpitations at high doses'
    ],
    dosage: '3-6mg per kg body weight, max 400mg daily',
    timing: '30-60 minutes pre-workout, avoid after 2pm',
    interactions: ['May interact with certain antidepressants', 'Amplifies effects of stimulants'],
    contraindications: ['Anxiety disorder', 'Heart arrhythmias', 'Pregnancy'],
    costEfficiency: 'high'
  },
  vitaminD: {
    name: 'Vitamin D3',
    category: 'vitamin',
    evidenceLevel: 'strong',
    benefits: [
      'Supports bone health',
      'Enhances immune function',
      'May improve muscle function',
      'Supports testosterone production'
    ],
    risks: [
      'Toxicity possible with very high doses',
      'Requires K2 for optimal calcium metabolism'
    ],
    dosage: '2000-5000 IU daily, higher for deficiency',
    timing: 'With fatty meal for absorption',
    interactions: ['May interact with certain steroids', 'Best with Vitamin K2'],
    contraindications: ['Hypercalcemia', 'Pre-existing hypervitaminosis D'],
    costEfficiency: 'high'
  },
  omega3: {
    name: 'Omega-3 Fish Oil',
    category: 'other',
    evidenceLevel: 'moderate',
    benefits: [
      'Reduces inflammation',
      'Supports heart health',
      'May aid recovery',
      'May reduce muscle soreness'
    ],
    risks: [
      'Fishy burps if not concentrated',
      'Blood thinning effect',
      'May interact with anticoagulants'
    ],
    dosage: '1-3g EPA+DHA combined daily',
    timing: 'With meals to reduce GI issues',
    interactions: ['Anticoagulants (Warfarin)', 'Blood pressure medications'],
    contraindications: ['Fish allergy', 'Blood clotting disorders'],
    costEfficiency: 'medium'
  },
  magnesium: {
    name: 'Magnesium Glycinate',
    category: 'mineral',
    evidenceLevel: 'moderate',
    benefits: [
      'Supports muscle relaxation',
      'Improves sleep quality',
      'Reduces muscle cramps',
      'Supports over 300 enzymatic reactions'
    ],
    risks: [
      'Loose stools at high doses',
      'May interact with certain antibiotics'
    ],
    dosage: '200-400mg daily',
    timing: 'Evening, with food',
    interactions: ['Antibiotics (separate by 2 hours)', 'Bisphosphonates'],
    contraindications: ['Severe kidney disease'],
    costEfficiency: 'high'
  },
  betaAlanine: {
    name: 'Beta-Alanine',
    category: 'preworkout',
    evidenceLevel: 'moderate',
    benefits: [
      'Increases carnosine stores for buffer against acidity',
      'May improve endurance performance',
      'Supports resistance training volume'
    ],
    risks: [
      'Paresthesia (tingling sensation) - harmless but odd feeling'
    ],
    dosage: '3-6g daily split into smaller doses',
    timing: 'Consistent daily use, not pre-workout specific',
    interactions: [],
    contraindications: [],
    costEfficiency: 'medium'
  },
  citrulline: {
    name: 'L-Citrulline',
    category: 'preworkout',
    evidenceLevel: 'moderate',
    benefits: [
      'May improve blood flow and pumps',
      'Reduces fatigue',
      'Supports cardiovascular health'
    ],
    risks: ['Generally very safe'],
    dosage: '3-8g L-Citrulline or 6-12g Citrulline Malate',
    timing: '30-60 minutes pre-workout',
    interactions: ['Blood pressure medications (may amplify effect)'],
    contraindications: [],
    costEfficiency: 'medium'
  },
  ashwagandha: {
    name: 'Ashwagandha',
    category: 'other',
    evidenceLevel: 'moderate',
    benefits: [
      'May reduce cortisol (stress hormone)',
      'May improve sleep quality',
      'May increase testosterone slightly',
      'May reduce anxiety'
    ],
    risks: [
      'May affect thyroid function',
      'May cause drowsiness',
      'Not recommended during pregnancy'
    ],
    dosage: '300-600mg KSM-66 extract daily',
    timing: 'Evening or before bed',
    interactions: ['Thyroid medications', 'Sedatives', 'Immunosuppressants'],
    contraindications: ['Pregnancy', 'Thyroid disorders'],
    costEfficiency: 'medium'
  }
}

export class SupplementAdvisorAgent implements BaseAgent {
  readonly name = 'Supplement Advisor Agent'
  readonly description = 'Evidence-based supplement recommendations with medication interaction warnings'
  readonly version = '1.0.0'

  private state: SupplementState = {
    userProfile: null,
    userSupplements: [],
    medications: [],
    recommendations: []
  }

  async initialize(userProfile: AgentUserProfile): Promise<void> {
    this.state.userProfile = userProfile
  }

  async process(input: {
    action: 'recommend' | 'analyze' | 'check' | 'explain'
    goals?: string[]
    currentStack?: string[]
    medications?: string[]
    supplementName?: string
  }): Promise<AgentResponse<unknown>> {
    try {
      const { action, goals, currentStack, medications, supplementName } = input

      if (!this.state.userProfile) {
        return { success: false, error: 'Not initialized', confidence: 0 }
      }

      if (medications) {
        this.state.medications = medications
      }

      switch (action) {
        case 'recommend':
          return this.generateRecommendations(goals || this.state.userProfile.goals, currentStack || [])

        case 'analyze':
          return this.analyzeCurrentStack(currentStack || [])

        case 'check':
          return this.checkSupplement(supplementName!)

        case 'explain':
          return this.explainSupplement(supplementName!)

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

  private generateRecommendations(
    goals: string[],
    currentStack: string[]
  ): AgentResponse<unknown> {
    const recommendations: SupplementRecommendation[] = []
    const warnings: string[] = []

    // Universal recommendations based on goals
    for (const goal of goals) {
      switch (goal) {
        case 'muscle-building':
        case 'strength':
          // Creatine is essential
          if (!currentStack.includes('creatine')) {
            recommendations.push(this.createRecommendation('creatine', ['strength', 'muscle']))
          }

          // Whey if protein intake is difficult
          if (!currentStack.includes('whey')) {
            recommendations.push(this.createRecommendation('whey', ['protein']))
          }
          break

        case 'weight-loss':
          // Caffeine for thermogenesis and energy
          if (!currentStack.includes('caffeine')) {
            recommendations.push(this.createRecommendation('caffeine', ['energy']))
          }

          // Omega-3 for anti-inflammatory
          if (!currentStack.includes('omega3')) {
            recommendations.push(this.createRecommendation('omega3', ['recovery']))
          }
          break

        case 'general-health':
          // Vitamin D if indoors/low sun
          if (!currentStack.includes('vitamind')) {
            recommendations.push(this.createRecommendation('vitamind', ['health']))
          }
          break
      }
    }

    // Add based on training needs
    if (this.state.userProfile!.age >= 40) {
      if (!currentStack.includes('magnesium')) {
        recommendations.push(this.createRecommendation('magnesium', ['recovery']))
      }
    }

    // Check for medication interactions
    for (const rec of recommendations) {
      if (this.hasInteraction(rec.name, this.state.medications)) {
        warnings.push(`${rec.name} may interact with your current medications. Consult your doctor.`)
      }
    }

    return {
      success: true,
      data: {
        recommendations,
        warnings,
        reasoning: this.generateReasoning(recommendations, goals)
      },
      confidence: 0.85
    }
  }

  private analyzeCurrentStack(currentStack: string[]): AgentResponse<unknown> {
    const valid: SupplementRecommendation[] = []
    const questionable: SupplementRecommendation[] = []
    const missing: SupplementRecommendation[] = []

    for (const suppName of currentStack) {
      const supp = SUPPLEMENTS[suppName.toLowerCase()]
      if (supp) {
        if (supp.evidenceLevel === 'strong') {
          valid.push(this.convertToRecommendation(supp))
        } else {
          questionable.push(this.convertToRecommendation(supp))
        }
      }
    }

    // Suggest missing essentials
    if (!currentStack.includes('creatine')) {
      missing.push(this.createRecommendation('creatine', ['strength']))
    }

    return {
      success: true,
      data: { validSupplements: valid, questionable, missing },
      confidence: 0.8
    }
  }

  private checkSupplement(supplementName: string): AgentResponse<unknown> {
    const supp = SUPPLEMENTS[supplementName.toLowerCase()]

    if (!supp) {
      return {
        success: false,
        error: `Unknown supplement: ${supplementName}`,
        confidence: 0
      }
    }

    const recommendation = this.convertToRecommendation(supp)
    const hasInteraction = this.hasInteraction(supplementName, this.state.medications)
    const warnings: string[] = []

    // Add interaction warnings
    if (hasInteraction) {
      warnings.push(`WARNING: ${supp.name} may interact with your current medications.`)
    }

    // Add contraindications
    if (supp.contraindications.length > 0) {
      warnings.push(`Contraindicated for: ${supp.contraindications.join(', ')}`)
    }

    // Add risk warnings
    if (supp.risks.length > 0) {
      warnings.push(`Potential risks: ${supp.risks.join(', ')}`)
    }

    return {
      success: true,
      data: {
        recommendation,
        safe: !hasInteraction && supp.contraindications.length === 0,
        warnings,
        interactionCheck: hasInteraction
      },
      confidence: 0.9
    }
  }

  private explainSupplement(supplementName: string): AgentResponse<unknown> {
    const supp = SUPPLEMENTS[supplementName.toLowerCase()]

    if (!supp) {
      return {
        success: false,
        error: `Unknown supplement: ${supplementName}`,
        confidence: 0
      }
    }

    const evidenceRating = {
      strong: 'Based on multiple high-quality studies',
      moderate: 'Supported by some research but needs more study',
      weak: 'Limited evidence - use with caution'
    }[supp.evidenceLevel]

    const goals = this.state.userProfile?.goals || []
    let whoShouldTake = ''
    let whoShouldAvoid = ''
    const alternatives: string[] = []

    if (supp.category === 'creatine') {
      whoShouldTake = goals.includes('muscle-building') || goals.includes('strength')
        ? 'Yes, especially if training for strength/muscle'
        : 'Optional but may help with any training goal'
      whoShouldAvoid = 'Those with pre-existing kidney conditions'
    }

    return {
      success: true,
      data: {
        explanation: `${supp.name}: ${supp.benefits.join('. ')} Dosage: ${supp.dosage}.`,
        evidenceRating: evidenceRating,
        whoShouldTake,
        whoShouldAvoid,
        alternatives
      },
      confidence: 0.85
    }
  }

  private createRecommendation(
    supplementKey: string,
    _reasons: string[]
  ): SupplementRecommendation {
    const supp = SUPPLEMENTS[supplementKey]
    return this.convertToRecommendation(supp)
  }

  private convertToRecommendation(supp: Supplement): SupplementRecommendation {
    return {
      name: supp.name,
      reason: supp.benefits[0],
      dosage: supp.dosage,
      timing: supp.timing,
      evidenceLevel: supp.evidenceLevel,
      benefits: supp.benefits,
      risks: supp.risks,
      interactions: supp.interactions,
      costEfficiency: supp.costEfficiency
    }
  }

  private hasInteraction(supplementName: string, medications: string[]): boolean {
    const supp = SUPPLEMENTS[supplementName.toLowerCase()]
    if (!supp) return false

    for (const med of medications) {
      if (supp.interactions.some(i => i.toLowerCase().includes(med.toLowerCase()))) {
        return true
      }
    }
    return false
  }

  private generateReasoning(recommendations: SupplementRecommendation[], goals: string[]): string {
    if (recommendations.length === 0) {
      return 'Your current supplement stack looks adequate based on your goals.'
    }

    const names = recommendations.map(r => r.name).join(', ')
    return `Based on your goals (${goals.join(', ')}), I recommend considering: ${names}. These have the strongest evidence and best value.`
  }

  getContext(): Record<string, unknown> {
    return {
      initialized: this.state.userProfile !== null,
      medicationsCount: this.state.medications.length,
      recommendationsGenerated: this.state.recommendations.length
    }
  }

  reset(): void {
    this.state.medications = []
    this.state.recommendations = []
  }
}