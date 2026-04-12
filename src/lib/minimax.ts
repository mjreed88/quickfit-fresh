// MiniMax AI Integration
// API docs: https://platform.minimax.chat/document

const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || ''
const MINIMAX_TEXT_BASE = 'https://api.minimax.io/anthropic/v1'
const MINIMAX_IMAGE_BASE = 'https://api.minimax.io/v1'

interface MiniMaxMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface MiniMaxContentBlock {
  type: 'text' | 'thinking'
  text?: string
  thinking?: string
}

interface MiniMaxAPIResponse {
  id: string
  content: MiniMaxContentBlock[]
  model: string
}

interface MealAnalysisResult {
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
}

// Text chat with MiniMax (Anthropic-compatible API)
export async function chatWithMiniMax(
  messages: MiniMaxMessage[],
  model: string = 'MiniMax-M2.7'
): Promise<string> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY
  console.log('MiniMax API key loaded:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO')
  if (!apiKey) {
    throw new Error('MiniMax API key not found. Make sure VITE_MINIMAX_API_KEY is set in your .env file.')
  }

  try {
    const response = await fetch(`${MINIMAX_TEXT_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMsg = `API error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.base_resp?.status_msg) {
          errorMsg = errorJson.base_resp.status_msg
        }
      } catch {}
      throw new Error(errorMsg)
    }

    const data: MiniMaxAPIResponse = await response.json()
    // Handle both thinking and text content
    const content = data.content || []
    if (Array.isArray(content)) {
      // Find text content, skip thinking
      const textContent = content.find((c) => c.type === 'text')
      return textContent?.text || ''
    }
    return data.content?.[0]?.text || 'No response from AI'
  } catch (err: any) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('network')) {
      throw new Error('Unable to connect to AI server. Please check your internet connection and try again.')
    }
    throw err
  }
}

interface ExerciseInstruction {
  startImage: string
  endImage: string
  instructions: string[]
  tips: string[]
}

interface ExerciseDetail {
  name: string
  startPosition: string
  endPosition: string
  steps: string[]
  formCues: string[]
  safetyTips: string[]
}

export async function generateExerciseImage(
  exerciseName: string,
  exerciseDetail: ExerciseDetail | null,
  _targetMuscle: string,
  fitnessLevel: string
): Promise<ExerciseInstruction> {
  if (!MINIMAX_API_KEY) {
    throw new Error('MiniMax API key not configured')
  }

  // Build accurate prompts using the detailed exercise instructions
  const startPrompt = exerciseDetail
    ? `Professional fitness demonstration photo showing the CORRECT STARTING POSITION for ${exerciseName}.

Exercise details to show accurately:
- Starting position description: "${exerciseDetail.startPosition}"
- Key form cues: ${exerciseDetail.formCues.slice(0, 3).join(', ')}

The athlete should be in the proper starting position ready to perform ${exerciseName}. Full body visible from front or side view. Clean gym or solid color background. Professional fitness photography. No text, no watermarks, no diagrams or arrows. The form must be anatomically correct and demonstrate proper technique.`
    : `Professional fitness demonstration photo showing STARTING POSITION for ${exerciseName} for ${fitnessLevel} level. Full body visible, front-facing view, proper form demonstrated. Clean background. No text or watermarks.`

  const endPrompt = exerciseDetail
    ? `Professional fitness demonstration photo showing the CORRECT END/FINISHED POSITION for ${exerciseName}.

Exercise details to show accurately:
- End position description: "${exerciseDetail.endPosition}"
- Key form cues: ${exerciseDetail.formCues.slice(0, 3).join(', ')}

The athlete should be in the fully contracted/completed position of ${exerciseName}. Full body visible from front or side view matching the starting position. Clean gym or solid color background. Professional fitness photography. No text, no watermarks, no diagrams or arrows. The form must be anatomically correct and demonstrate proper technique.`
    : `Professional fitness demonstration photo showing END/FINISHED POSITION for ${exerciseName} for ${fitnessLevel} level. Full body visible, showing proper form in completed position. Clean background. No text or watermarks.`

  // Generate both images in parallel
  const [startResponse, endResponse] = await Promise.all([
    fetch(`${MINIMAX_IMAGE_BASE}/image_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: startPrompt,
        num_images: 1,
        width: 1024,
        height: 768
      })
    }),
    fetch(`${MINIMAX_IMAGE_BASE}/image_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: endPrompt,
        num_images: 1,
        width: 1024,
        height: 768
      })
    })
  ])

  if (!startResponse.ok || !endResponse.ok) {
    throw new Error('Failed to generate exercise images')
  }

  const startData = await startResponse.json()
  const endData = await endResponse.json()

  const startImage = startData.data?.image_urls?.[0] || ''
  const endImage = endData.data?.image_urls?.[0] || ''

  if (!startImage || !endImage) {
    throw new Error('Image URLs not returned')
  }

  // Get instructions from MiniMax if we don't have them
  let instructions: string[] = exerciseDetail?.steps || []
  let tips: string[] = exerciseDetail?.safetyTips || []

  if (!exerciseDetail) {
    try {
      const instructionPrompt = `Provide clear, concise instructions for ${exerciseName} for a ${fitnessLevel} level person.
Return ONLY valid JSON with this exact structure: {"instructions": ["Step 1", "Step 2", "Step 3"], "tips": ["Safety tip 1", "Tip 2"]}`

      const messages: MiniMaxMessage[] = [
        { role: 'system', content: 'You are a certified personal trainer. Return only valid JSON.' },
        { role: 'user', content: instructionPrompt }
      ]

      const responseText = await chatWithMiniMax(messages)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        instructions = parsed.instructions || []
        tips = parsed.tips || []
      }
    } catch {
      instructions = ['Stand with feet shoulder-width apart', 'Perform the movement with control', 'Return to starting position']
      tips = ['Keep core engaged', 'Move with control', 'Stop if you feel pain']
    }
  }

  return {
    startImage,
    endImage,
    instructions,
    tips
  }
}

// Analyze meal photo and return nutrition info
export async function analyzeMealPhoto(imageBase64: string): Promise<MealAnalysisResult> {
  // Use chat to analyze the meal
  const messages: MiniMaxMessage[] = [
    {
      role: 'user',
      content: `Analyze this meal photo and provide nutrition information in JSON format. Return ONLY valid JSON with these fields: foodName, calories (number in kcal), protein (number in grams), carbs (number in grams), fat (number in grams), and description. No markdown, no explanation, just the JSON object. Example: {"foodName": "Grilled chicken salad", "calories": 450, "protein": 35, "carbs": 20, "fat": 25, "description": "A balanced meal with grilled protein and fresh vegetables"}`
    },
    {
      role: 'user',
      content: `[Image: ${imageBase64}]`
    }
  ]

  const response = await chatWithMiniMax(messages)

  // Try to parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  // Fallback
  return {
    foodName: 'Analyzed Meal',
    calories: 500,
    protein: 25,
    carbs: 40,
    fat: 20,
    description: response
  }
}

// Generate or regenerate meal plan using AI
export async function regenerateMealPlan(
  profile: {
    goals: string[]
    bodyType: string
    fitnessLevel: string
    foodAllergies: string[]
    lactoseIntolerant: boolean
    currentMealPlan?: any
    deviation?: string
  }
): Promise<any> {
  const messages: MiniMaxMessage[] = [
    {
      role: 'system',
      content: `You are an expert nutritionist creating personalized 7-day meal plans. Return valid JSON only.`
    },
    {
      role: 'user',
      content: `Create a 7-day meal plan for someone with:
- Goals: ${profile.goals.join(', ')}
- Body type: ${profile.bodyType}
- Fitness level: ${profile.fitnessLevel}
- Food allergies: ${profile.foodAllergies.join(', ') || 'none'}
- Lactose intolerant: ${profile.lactoseIntolerant ? 'yes' : 'no'}
${profile.deviation ? `- They deviated from their plan with: ${profile.deviation}. Adjust the remaining meals accordingly.` : ''}
${profile.currentMealPlan ? '- Update/adjust the existing meal plan based on their needs.' : ''}

Return JSON format:
{
  "days": [
    {
      "dayName": "Day 1",
      "meals": [
        {
          "id": "1",
          "name": "Meal name",
          "type": "breakfast/lunch/dinner/snack",
          "goal": "muscle-building/weight-loss/etc",
          "macros": {"calories": 500, "protein": 30, "carbs": 50, "fat": 20},
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "allergens": ["dairy", "gluten"],
          "containsLactose": false,
          "suggestedItems": []
        }
      ],
      "totalMacros": {"calories": 2000, "protein": 150, "carbs": 200, "fat": 65}
    }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`
    }
  ]

  const response = await chatWithMiniMax(messages)

  // Extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  throw new Error('Failed to generate meal plan')
}

// AI Trainer chat with context
export async function getAITrainerResponse(
  userMessage: string,
  userContext: {
    username: string
    goals: string[]
    bodyType: string
    currentWorkout?: string
    currentMealPlan?: string
  }
): Promise<string> {
  const messages: MiniMaxMessage[] = [
    {
      role: 'system',
      content: `You are QuickFit's AI Fitness Coach - an enthusiastic, knowledgeable personal trainer. You have access to the user's profile and plans. Be encouraging, specific with numbers and recommendations, and always prioritize safety. Keep responses conversational but informative.`
    },
    {
      role: 'user',
      content: `User profile:
- Name: ${userContext.username}
- Goals: ${userContext.goals.join(', ')}
- Body type: ${userContext.bodyType}
${userContext.currentWorkout ? `- Current workout: ${userContext.currentWorkout}` : ''}
${userContext.currentMealPlan ? `- Current meal plan: ${userContext.currentMealPlan}` : ''}

User question: ${userMessage}`
    }
  ]

  return chatWithMiniMax(messages)
}
