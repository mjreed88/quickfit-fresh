/**
 * QuickFit AI Agents
 *
 * Novel AI agents for the fitness industry:
 * 1. Injury Prevention Agent - Analyzes movement, detects risk
 * 2. Form Critique Agent - Video-based form analysis
 * 3. Plateau Detection Agent - Monitors and corrects adaptation stalls
 * 4. Recovery Intelligence Agent - Sleep/HRV/Soreness tracking
 * 5. Motivation Agent - Adaptive motivational language
 * 6. Competition Agent - AI-generated challenges
 * 7. Nutrition Negotiation Agent - Chat-based meal logging
 * 8. Gym Etiquette Agent - Social norms coaching
 * 9. Supplement Advisor Agent - Evidence-based recommendations
 * 10. Periodization Agent - Adaptive training cycles
 */

// Re-export types
export * from './types'

// Agent implementations
export { InjuryPreventionAgent } from './agents/injuryPrevention'
export { FormCritiqueAgent } from './agents/formCritique'
export { PlateauDetectionAgent } from './agents/plateauDetection'
export { RecoveryIntelligenceAgent } from './agents/recoveryIntelligence'
export { MotivationAgent } from './agents/motivation'
export { CompetitionAgent } from './agents/competition'
export { NutritionNegotiationAgent } from './agents/nutrition'
export { GymEtiquetteAgent } from './agents/gymEtiquette'
export { SupplementAdvisorAgent } from './agents/supplement'
export { PeriodizationAgent } from './agents/periodization'
