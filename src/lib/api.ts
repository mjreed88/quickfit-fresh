// API helper for calling Lambda backend
// In production, this calls the API Gateway endpoint

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  userId: string
  message: string
  conversationHistory: ChatMessage[]
}

export interface ChatResponse {
  message: string
  error?: string
}

// Send chat message to AI backend via Lambda/Step Functions
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  if (!API_BASE) {
    return { message: '', error: 'API not configured' }
  }

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Chat API error:', error)
    return {
      message: '',
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}

// Save user profile to backend (for DynamoDB persistence)
export const saveUserProfile = async (userId: string, profileData: object): Promise<boolean> => {
  if (!API_BASE) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, profileData }),
    })
    return response.ok
  } catch (error) {
    console.error('Save profile error:', error)
    return false
  }
}

// Get user profile from backend
export const getUserProfile = async (userId: string): Promise<object | null> => {
  if (!API_BASE) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE}/profile/${userId}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.profileData || null
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}
