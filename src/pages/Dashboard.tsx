import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, ChefHat, ShoppingBag, Activity, ArrowRight, RefreshCw, Crown, Lock, Zap, Users, TrendingUp, ExternalLink, User } from 'lucide-react'
import { getProfile, getWorkoutPlan, getMealPlan, clearAll } from '../lib/localStore'
import { UserProfile, WorkoutPlan, MealPlan } from '../lib/types'
import { getSuggestedItems } from '../data/meals'
import { useAuth } from '../lib/AuthContext'

const PREMIUM_FEATURES = [
  { icon: Zap, title: 'AI Personal Trainer', desc: 'Chat with an AI that knows your plan and adjusts it based on your feedback', locked: true },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track weight, measurements, and progress photos over time', locked: true },
  { icon: Users, title: 'Spot Me Partner', desc: 'Find workout partners, trainers, or clients in your area', locked: true },
]

const products = getSuggestedItems()

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)

  useEffect(() => {
    try {
      const savedProfile = getProfile()
      const savedWorkout = getWorkoutPlan()
      const savedMeal = getMealPlan()

      // If no profile data, stay on dashboard and show prompt to create profile
      if (!savedProfile || !savedWorkout || !savedMeal) {
        setProfile(null)
        setWorkoutPlan(null)
        setMealPlan(null)
        return
      }

      setProfile(savedProfile)
      setWorkoutPlan(savedWorkout)
      setMealPlan(savedMeal)
    } catch (err) {
      console.error('Failed to load profile data:', err)
      setProfile(null)
      setWorkoutPlan(null)
      setMealPlan(null)
    }
  }, [navigate])

  // Show loading while checking auth
  if (profile === null && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show prompt to create profile if logged in but no profile data
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full inline-block mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.username || 'Fitness Enthusiast'}!
          </h1>
          <p className="text-gray-400 mb-8">
            Complete your profile to get personalized workout and meal plans.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-colors"
          >
            Create My Free Plan <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Takes only 2 minutes to get started
          </p>
        </div>
      </div>
    )
  }

  const bmi = ((profile.weight * 0.453592) / Math.pow(profile.height * 0.0254, 2))
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'

  const handleRegenerate = () => {
    if (window.confirm('This will reset your profile and generate a new plan. Continue?')) {
      clearAll()
      navigate('/')
    }
  }

  const goalIcons: Record<string, typeof Activity> = {
    'muscle-building': Dumbbell, strength: Dumbbell, 'weight-loss': Activity,
    cardio: Activity, flexibility: Activity, 'general-health': Activity,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {profile.name}!</h1>
        <p className="text-gray-400 mt-1">Here's your personalized fitness dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Current BMI</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{bmi.toFixed(1)}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bmiCategory === 'Normal' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'}`}>{bmiCategory}</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Workouts/Week</div>
          <div className="text-3xl font-bold text-white">{profile.workoutDays}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Session Length</div>
          <div className="text-3xl font-bold text-white">{profile.sessionDuration} min</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Daily Calories</div>
          <div className="text-3xl font-bold text-white">{mealPlan?.days[0]?.totalMacros.calories || 0}</div>
        </div>
      </div>

      {/* Premium Features Teaser */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Premium Features</h2>
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">$5.99/month</span>
          </div>
          <Link to="/signup" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
            Upgrade Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Lock className="h-4 w-4 text-amber-400" />
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-lg inline-block mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/workout" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-900/50 p-3 rounded-lg"><Dumbbell className="h-6 w-6 text-blue-400" /></div>
            <div><h3 className="font-semibold text-white">View My Workout Plan</h3><p className="text-sm text-gray-500">{workoutPlan?.days.length || 0} days/week</p></div>
          </div>
          <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">View Plan <ArrowRight className="h-4 w-4 ml-1" /></div>
        </Link>

        <Link to="/meals" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-900/50 p-3 rounded-lg"><ChefHat className="h-6 w-6 text-green-400" /></div>
            <div><h3 className="font-semibold text-white">View My Meal Plan</h3><p className="text-sm text-gray-500">Personalized nutrition</p></div>
          </div>
          <div className="flex items-center text-green-400 text-sm font-medium group-hover:gap-2 transition-all">View Plan <ArrowRight className="h-4 w-4 ml-1" /></div>
        </Link>

        <Link to="/products" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-900/50 p-3 rounded-lg"><ShoppingBag className="h-6 w-6 text-purple-400" /></div>
            <div><h3 className="font-semibold text-white">Browse Products</h3><p className="text-sm text-gray-500">Equipment & supplements</p></div>
          </div>
          <div className="flex items-center text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">Browse <ArrowRight className="h-4 w-4 ml-1" /></div>
        </Link>
      </div>

      {/* Suggested Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-orange-400" />
          Recommended For You
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer"
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-orange-500 transition-all">
              <div className="text-xs text-gray-500 mb-1 capitalize">{item.category}</div>
              <h3 className="font-semibold text-white text-sm mb-1 truncate">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-orange-400 font-bold">{item.price}</span>
                <ExternalLink className="h-3 w-3 text-gray-500" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Your Fitness Goals</h2>
        <div className="flex flex-wrap gap-2">
          {profile.goals.map(goal => {
            const Icon = goalIcons[goal] || Activity
            return (
              <div key={goal} className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full">
                <Icon className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-white capitalize">{goal.replace('-', ' ')}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Profile Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><div className="text-sm text-gray-500">Age</div><div className="text-lg font-semibold text-white">{profile.age} years</div></div>
          <div><div className="text-sm text-gray-500">Weight</div><div className="text-lg font-semibold text-white">{profile.weight} lbs</div></div>
          <div><div className="text-sm text-gray-500">Height</div><div className="text-lg font-semibold text-white">{profile.height} in</div></div>
          <div><div className="text-sm text-gray-500">Body Type</div><div className="text-lg font-semibold text-white capitalize">{profile.bodyType}</div></div>
        </div>
      </div>

      <div className="text-center">
        <button onClick={handleRegenerate} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-medium hover:border-orange-500 hover:text-orange-400 transition-colors">
          <RefreshCw className="h-5 w-5" /> Regenerate Plan
        </button>
      </div>
    </div>
  )
}
