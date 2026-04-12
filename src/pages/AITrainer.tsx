import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { getProfile } from '../lib/localStore'
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react'
import { getAITrainerResponse } from '../lib/minimax'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AITrainer() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Hey ${user?.username || 'there'}! I'm your AI fitness coach powered by MiniMax. I have access to your profile and current plans. Ask me anything about your workouts, nutrition, or how to adjust your routine!` }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    setError('')

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const profile = getProfile()
      console.log('Sending message to MiniMax API...')
      const response = await getAITrainerResponse(currentInput, {
        username: user?.username || 'User',
        goals: profile?.goals || [],
        bodyType: profile?.bodyType || 'mesomorph',
      })
      console.log('Received response:', response)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      console.error('AI Trainer error:', err)
      setError(err.message || 'Failed to get AI response. Please try again.')
      // Remove the user message if API fails
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Personal Trainer</h1>
        </div>
        <p className="text-gray-400">Chat with your personal AI coach powered by MiniMax. Ask anything about workouts, meals, or fitness goals.</p>
      </div>

      {/* API Key Notice */}
      {!import.meta.env.VITE_MINIMAX_API_KEY && (
        <div className="mb-6 bg-amber-900/30 border border-amber-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-medium">MiniMax API Key Required</p>
            <p className="text-amber-300/70 text-sm mt-1">
              Add <code className="bg-amber-900/50 px-1 rounded">VITE_MINIMAX_API_KEY</code> to your .env file to enable AI chat.
              Get your key at <a href="https://platform.minimax.chat/" target="_blank" rel="noopener" className="underline">platform.minimax.chat</a>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-orange-500' : 'bg-amber-500'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-amber-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask me anything about your fitness journey..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
