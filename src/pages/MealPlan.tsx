import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Flame, ChevronDown, ChevronUp, Camera, Sparkles, RefreshCw, AlertCircle, Check } from 'lucide-react'
import { getMealPlan, saveMealPlan, getProfile } from '../lib/localStore'
import { MealPlan as MealPlanType, MealAnalysisResult } from '../lib/types'
import { useAuth } from '../lib/AuthContext'
import { analyzeMealPhoto, regenerateMealPlan } from '../lib/minimax'

export default function MealPlanPage() {
  const navigate = useNavigate()
  const { isPremium } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showRegenModal, setShowRegenModal] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [analyzedMeal, setAnalyzedMeal] = useState<MealAnalysisResult | null>(null)
  const [deviation, setDeviation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const saved = getMealPlan()
    if (!saved) { navigate('/'); return }
    setMealPlan(saved)
  }, [navigate])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setAnalyzing(true)
    setError('')
    setAnalyzedMeal(null)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        try {
          const result = await analyzeMealPhoto(base64)
          setAnalyzedMeal(result)
          setSuccess(`Analyzed: ${result.foodName} - ${result.calories} cal`)
        } catch (err: any) {
          setError(err.message || 'Failed to analyze meal')
        } finally {
          setAnalyzing(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setAnalyzing(false)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze meal')
      setAnalyzing(false)
    }
  }

  const handleRegenerate = async () => {
    if (!isPremium) return

    setRegenerating(true)
    setError('')
    setSuccess('')

    try {
      const profile = getProfile()
      const result = await regenerateMealPlan({
        goals: profile?.goals || [],
        bodyType: profile?.bodyType || 'mesomorph',
        fitnessLevel: profile?.fitnessLevel || 'intermediate',
        foodAllergies: profile?.foodAllergies || [],
        lactoseIntolerant: profile?.lactoseIntolerant || false,
        deviation: deviation || undefined,
      })

      saveMealPlan(result)
      setMealPlan(result)
      setShowRegenModal(false)
      setDeviation('')
      setSuccess('Meal plan regenerated successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate meal plan')
    } finally {
      setRegenerating(false)
    }
  }

  if (!mealPlan) {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Meal Plan</h1>
            <p className="text-gray-400 mt-1">7-day nutrition plan personalized for your goals</p>
          </div>
          {isPremium && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowPhotoModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center gap-2"
              >
                <Camera className="h-4 w-4" /> Analyze Meal
              </button>
              <button
                onClick={() => setShowRegenModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Regenerate Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-900/30 border border-green-500 rounded-xl p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-green-400" />
          <p className="text-green-200">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* API Key Notice for Premium Features */}
      {isPremium && !import.meta.env.VITE_MINIMAX_API_KEY && (
        <div className="mb-6 bg-amber-900/30 border border-amber-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-medium">MiniMax API Key Required for AI Features</p>
            <p className="text-amber-300/70 text-sm mt-1">
              Add <code className="bg-amber-900/50 px-1 rounded">VITE_MINIMAX_API_KEY</code> to your .env file to enable photo analysis and meal regeneration.
            </p>
          </div>
        </div>
      )}

      {/* Daily Macros Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-500">Daily Calories</div>
          <div className="text-2xl font-bold text-white">{mealPlan.days[0]?.totalMacros.calories || 0}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-500">Protein</div>
          <div className="text-2xl font-bold text-white">{mealPlan.days[0]?.totalMacros.protein || 0}g</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-500">Carbs</div>
          <div className="text-2xl font-bold text-white">{mealPlan.days[0]?.totalMacros.carbs || 0}g</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-sm text-gray-500">Fat</div>
          <div className="text-2xl font-bold text-white">{mealPlan.days[0]?.totalMacros.fat || 0}g</div>
        </div>
      </div>

      <div className="space-y-4">
        {mealPlan.days.map((day, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === index ? null : index)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">{day.dayName}</h3>
                  <p className="text-gray-400 text-sm">{day.meals.length} meals</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Flame className="h-4 w-4" /> {day.totalMacros.calories} cal
                  </div>
                </div>
                {expandedDay === index ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </div>
            </button>

            {expandedDay === index && (
              <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                <div className="grid md:grid-cols-2 gap-4">
                  {day.meals.map((meal, mIndex) => (
                    <div key={mIndex} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs uppercase text-orange-400 font-bold">{meal.type}</span>
                          <h4 className="font-semibold text-white">{meal.name}</h4>
                        </div>
                        <span className="text-sm text-gray-400">{meal.macros.calories} cal</span>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400 mb-3">
                        <span>P: {meal.macros.protein}g</span>
                        <span>C: {meal.macros.carbs}g</span>
                        <span>F: {meal.macros.fat}g</span>
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        <span className="text-gray-500">Ingredients:</span> {meal.ingredients.slice(0, 3).join(', ')}...
                      </div>
                      {meal.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {meal.allergens.map(a => (
                            <span key={a} className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded border border-red-800">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Analysis Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-400" /> Analyze Meal Photo
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Take or upload a photo of your meal. Our AI will analyze the nutrition and adjust your remaining meals for the day.
            </p>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzing}
              className="w-full py-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Camera className="h-5 w-5" />
              {analyzing ? 'Analyzing...' : 'Tap to capture meal'}
            </button>

            {analyzing && (
              <div className="text-center py-4">
                <div className="h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-400 text-sm">AI is analyzing your meal...</p>
              </div>
            )}

            {analyzedMeal && (
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-white mb-2">{analyzedMeal.foodName}</h4>
                <p className="text-gray-400 text-sm mb-3">{analyzedMeal.description}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-800 rounded-lg p-2">
                    <div className="text-lg font-bold text-white">{analyzedMeal.calories}</div>
                    <div className="text-xs text-gray-500">cal</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-400">{analyzedMeal.protein}g</div>
                    <div className="text-xs text-gray-500">protein</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2">
                    <div className="text-lg font-bold text-amber-400">{analyzedMeal.carbs}g</div>
                    <div className="text-xs text-gray-500">carbs</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2">
                    <div className="text-lg font-bold text-red-400">{analyzedMeal.fat}g</div>
                    <div className="text-xs text-gray-500">fat</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPhotoModal(false); setAnalyzedMeal(null); setError(''); }}
                className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
              {analyzedMeal && (
                <button
                  onClick={() => {
                    setShowPhotoModal(false)
                    setShowRegenModal(true)
                    setDeviation(`I ate ${analyzedMeal.foodName} which was ${analyzedMeal.calories} calories`)
                    setAnalyzedMeal(null)
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Adjust Remaining
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-amber-400" /> Regenerate Meal Plan
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Let us know if you deviated from your plan and we&apos;ll adjust your remaining meals accordingly.
            </p>

            <textarea
              value={deviation}
              onChange={e => setDeviation(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              placeholder="e.g., I had pizza for dinner instead of planned salmon..."
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRegenModal(false); setDeviation(''); setError(''); }}
                className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {regenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Regenerate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
