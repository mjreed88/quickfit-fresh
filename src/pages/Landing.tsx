import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Heart, Flame, Activity, Wind, Leaf, ChevronRight, Check, User, Trash2, Crown, Zap, TrendingUp, Users } from 'lucide-react'
import { UserProfile, Goal, WorkoutExercise } from '../lib/types'
import { saveProfile, getProfile, hasPlan, clearAll, saveWorkoutPlan, saveMealPlan } from '../lib/localStore'
import { injuries } from '../data/injuries'
import { foodAllergies } from '../data/foodAllergies'
import { exercises } from '../data/exercises'
import { generateMealPlan } from '../data/meals'

const BODY_TYPES = [
  { value: 'ectomorph', label: 'Ectomorph', desc: 'Thin frame, long limbs, struggle to gain weight and muscle. Fast metabolism.', traits: ['Hard gainer', 'Fast metabolism', 'Linear build'] },
  { value: 'mesomorph', label: 'Mesomorph', desc: 'Athletic, muscular build. Gains muscle and loses fat relatively easily.', traits: ['Muscular', 'Fast metabolism', 'Responsive to training'] },
  { value: 'endomorph', label: 'Endomorph', desc: 'Broader, heavier build. Gains muscle and fat easily, struggles to lose weight.', traits: ['Wider frame', 'Slow metabolism', 'Stores fat easily'] },
] as const

const GOALS: { value: Goal; label: string; icon: typeof Dumbbell; desc: string }[] = [
  { value: 'muscle-building', label: 'Muscle Building', icon: Dumbbell, desc: 'Gain strength and mass' },
  { value: 'strength', label: 'Strength Training', icon: Flame, desc: 'Get stronger and more powerful' },
  { value: 'weight-loss', label: 'Weight Loss', icon: Heart, desc: 'Burn fat and get lean' },
  { value: 'cardio', label: 'Cardio', icon: Activity, desc: 'Improve endurance and heart health' },
  { value: 'flexibility', label: 'Flexibility', icon: Wind, desc: 'Improve mobility and stretching' },
  { value: 'general-health', label: 'General Health', icon: Leaf, desc: 'Stay fit and healthy' },
]

const SESSION_DURATIONS = [15, 30, 45, 60, 90, 120]

// Exercise restrictions by injury
const EXERCISE_RESTRICTIONS: Record<string, string[]> = {
  'Knee Pain': ['squat', 'leg-press', 'romanian-deadlift', 'leg-curl', 'leg-extension', 'lunge', 'calf-raise', 'box-jump', 'burpee', 'mountain-climber', 'cycling', 'treadmill-run'],
  'Shoulder Pain': ['overhead-press', 'lateral-raise', 'bench-press', 'push-up', 'pull-up', 'lat-pulldown', 'seated-row', 'dumbbell-fly', 'cable-crossover', 'battle-ropes'],
  'Lower Back Pain': ['barbell-row', 'romanian-deadlift', 'squat', 'leg-press', 'burpee', 'crunch', 'bicycle-crunch', 'reverse-crunch', 'mountain-climber'],
  'Wrist Pain': ['push-up', 'plank', 'cobra-stretch', 'cat-cow', 'wrist-curl', 'handstand', 'dumbbell-fly'],
  'Ankle Pain': ['jump-rope', 'box-jump', 'calf-raise', 'treadmill-run', 'burpee', 'high-knees'],
  'Hip Pain': ['lunge', 'hip-thrust', 'pigeon-pose', 'squat', 'romanian-deadlift', 'leg-curl', 'cycling'],
  'Neck Pain': ['shrug', 'overhead-press', 'upright-row', 'neck-curl', 'neck-extension'],
  'Shin Splints': ['treadmill-run', 'jump-rope', 'box-jump', 'burpee', 'sprint-interval', 'high-knees'],
  'Tennis Elbow': ['bicep-curl', 'tricep-pushdown', 'wrist-curl', 'hammer-curl', 'overhead-press', 'lat-pulldown'],
  'Golfer\'s Elbow': ['bicep-curl', 'tricep-pushdown', 'wrist-curl', 'hammer-curl', 'lat-pulldown'],
  'Plantar Fasciitis': ['jump-rope', 'box-jump', 'treadmill-run', 'calf-raise', 'high-knees', 'burpee'],
  'Carpal Tunnel': ['push-up', 'plank', 'wrist-curl', 'cobra-stretch', 'cat-cow'],
  'Rotator Cuff Injury': ['bench-press', 'overhead-press', 'lateral-raise', 'pull-up', 'lat-pulldown', 'seated-row', 'dumbbell-fly'],
  'ACL Injury': ['squat', 'lunge', 'leg-press', 'leg-curl', 'leg-extension', 'box-jump', 'burpee', 'jump-rope'],
  'MCL Injury': ['squat', 'lunge', 'leg-press', 'leg-extension', 'box-jump', 'burpee'],
  'Meniscus Tear': ['squat', 'lunge', 'leg-press', 'leg-curl', 'leg-extension', 'cycling'],
  'Achilles Tendinitis': ['jump-rope', 'box-jump', 'calf-raise', 'treadmill-run', 'burpee', 'high-knees'],
  'Bursitis': ['push-up', 'plank', 'tricep-pushdown', 'overhead-press'],
  'Herniated Disc': ['squat', 'deadlift', 'romanian-deadlift', 'barbell-row', 'leg-press', 'crunch', 'burpee'],
  'Sciatica': ['squat', 'deadlift', 'romanian-deadlift', 'leg-press', 'lunge', 'hamstring-stretch', 'pigeon-pose'],
  'Scoliosis': ['deadlift', 'romanian-deadlift', 'barbell-row', 'cable-crossover'],
}

// High-impact exercises not suitable for seniors (55+) or beginners with balance issues
const HIGH_IMPACT_EXERCISES = ['burpee', 'box-jump', 'mountain-climber', 'sprint-interval', 'battle-ropes', 'high-knees', 'jump-rope']

// Exercises requiring significant strength - not for true beginners
const ADVANCED_STRENGTH_EXERCISES = ['pull-up', 'muscle-up', 'handstand-push-up', 'pistol-squat']

// Senior-friendly modifications
function isSenior(age: number): boolean {
  return age >= 55
}

function isVerySenior(age: number): boolean {
  return age >= 65
}

function isElderly(age: number): boolean {
  return age >= 70
}

function getAppropriateExercises(profile: UserProfile): WorkoutExercise[] {
  const { age, fitnessLevel, injuries, goals } = profile

  let filtered = [...exercises]

  // Filter by age-appropriate exercises
  if (isElderly(age)) {
    // 70+: Very gentle, primarily flexibility and light cardio
    filtered = filtered.filter(e =>
      e.difficulty === 'beginner' &&
      !HIGH_IMPACT_EXERCISES.includes(e.id)
    )
  } else if (isVerySenior(age)) {
    // 65-69: Senior-friendly, low impact
    filtered = filtered.filter(e =>
      (e.difficulty === 'beginner' || e.difficulty === 'intermediate') &&
      !HIGH_IMPACT_EXERCISES.includes(e.id) &&
      !ADVANCED_STRENGTH_EXERCISES.includes(e.id)
    )
  } else if (isSenior(age)) {
    // 55-64: Moderate - exclude only high impact
    filtered = filtered.filter(e =>
      !HIGH_IMPACT_EXERCISES.includes(e.id) ||
      e.category === 'flexibility'
    )
  }

  // Filter by fitness level
  if (fitnessLevel === 'beginner') {
    // True beginners: only beginner exercises (no pull-ups, no advanced)
    filtered = filtered.filter(e =>
      e.difficulty === 'beginner' ||
      e.category === 'flexibility'
    )
  } else if (fitnessLevel === 'intermediate') {
    filtered = filtered.filter(e =>
      e.difficulty === 'beginner' || e.difficulty === 'intermediate'
    )
  }
  // advanced: keep all

  // Filter by injuries
  injuries.forEach(injury => {
    const restricted = EXERCISE_RESTRICTIONS[injury]
    if (restricted) {
      filtered = filtered.filter(e => !restricted.includes(e.id))
    }
  })

  // Filter by goal
  const isFlexibility = goals.includes('flexibility')
  const isWeightLoss = goals.includes('weight-loss')
  const isCardio = goals.includes('cardio')
  const isMuscleBuilding = goals.includes('muscle-building') || goals.includes('strength')

  if (isFlexibility) {
    filtered = filtered.filter(e => e.category === 'flexibility')
  } else if (isWeightLoss || isCardio) {
    // For weight loss/cardio: prioritize cardio and full-body, deprioritize isolated exercises
    const cardioExercises = filtered.filter(e => e.category === 'cardio')
    const strengthExercises = filtered.filter(e => e.category === 'strength')
    // Mix cardio with some strength
    filtered = [...cardioExercises.slice(0, Math.ceil(cardioExercises.length * 0.6)), ...strengthExercises.slice(0, Math.ceil(strengthExercises.length * 0.4))]
  } else if (isMuscleBuilding) {
    filtered = filtered.filter(e => e.category === 'strength')
  }

  // If no exercises match after filtering, fall back to safe defaults
  if (filtered.length === 0) {
    filtered = exercises.filter(e =>
      e.difficulty === 'beginner' &&
      !HIGH_IMPACT_EXERCISES.includes(e.id)
    )
  }

  return filtered
}

function generateWorkoutPlan(profile: UserProfile) {
  const isFlexibility = profile.goals.includes('flexibility')
  const isWeightLoss = profile.goals.includes('weight-loss')
  const isCardio = profile.goals.includes('cardio')
  const isMuscleBuilding = profile.goals.includes('muscle-building') || profile.goals.includes('strength')

  // Focus areas based on goals
  let focusAreas: string[]
  if (isFlexibility) {
    focusAreas = ['Lower Body & Hips', 'Upper Body & Shoulders', 'Spine & Core', 'Full Body Flow', 'Recovery & Release']
  } else if (isWeightLoss || isCardio) {
    focusAreas = ['Full Body & Cardio', 'Lower Body', 'Upper Body & Core', 'Cardio Intervals', 'Active Recovery']
  } else if (isMuscleBuilding) {
    focusAreas = ['Upper Body Push', 'Lower Body', 'Upper Body Pull', 'Full Body', 'Arms & Shoulders']
  } else {
    focusAreas = ['Upper Body', 'Lower Body', 'Full Body', 'Cardio', 'Core']
  }

  const availableExercises = getAppropriateExercises(profile)

  const days = []
  for (let day = 0; day < profile.workoutDays; day++) {
    const dayExercises: WorkoutExercise[] = []
    const exerciseCount = isFlexibility ? Math.min(5, profile.workoutDays + 2) : Math.min(4, profile.workoutDays + 2)

    // Shuffle exercises for variety but deterministically based on day
    const shuffled = [...availableExercises].sort((a, b) => {
      const hashA = (day * 17 + a.id.charCodeAt(0)) % 100
      const hashB = (day * 17 + b.id.charCodeAt(0)) % 100
      return hashA - hashB
    })

    for (let i = 0; i < exerciseCount && i < shuffled.length; i++) {
      const exercise = shuffled[i]
      if (!exercise) continue

      let sets = 3, reps = '12-15', restSeconds = 60

      // Adjust based on fitness level
      if (profile.fitnessLevel === 'beginner') {
        sets = 2
        reps = isFlexibility ? '20-30s' : '10-12'
        restSeconds = 90 // More rest for beginners
      } else if (profile.fitnessLevel === 'advanced') {
        sets = 4
        reps = isFlexibility ? '45-60s' : '15-20'
        restSeconds = isFlexibility ? 15 : 60
      } else {
        // intermediate
        reps = isFlexibility ? '30-45s' : '12-15'
        restSeconds = isFlexibility ? 15 : 75
      }

      // Senior adjustments
      if (isVerySenior(profile.age)) {
        sets = Math.max(2, sets - 1)
        reps = isFlexibility ? '20-30s' : '10-12'
        restSeconds = Math.min(120, restSeconds + 30)
      }

      // Cardio/weight loss: more reps, shorter rest
      if ((isWeightLoss || isCardio) && exercise.category === 'cardio') {
        reps = profile.fitnessLevel === 'beginner' ? '15-20 min' : '20-30 min'
      }

      dayExercises.push({ ...exercise, sets, reps, restSeconds })
    }

    // For flexibility, we want longer duration sessions
    const duration = isFlexibility ? Math.max(profile.sessionDuration, 30) : profile.sessionDuration

    days.push({
      dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day % 7],
      focus: focusAreas[day % focusAreas.length],
      exercises: dayExercises,
      estimatedCalories: dayExercises.reduce((acc, ex) => acc + (ex.caloriesPerMinute * (duration / Math.max(dayExercises.length, 1))), 0),
      duration,
    })
  }

  return { days, generatedAt: new Date().toISOString() }
}

export default function Landing() {
  const navigate = useNavigate()
  const [existingName, setExistingName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ name?: string; goals?: string }>({})

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'male',
    height: 70,
    weight: 170,
    bodyType: 'mesomorph',
    goals: [],
    injuries: [],
    foodAllergies: [],
    lactoseIntolerant: false,
    fitnessLevel: 'beginner',
    workoutDays: 3,
    sessionDuration: 30,
  })

  useEffect(() => {
    if (hasPlan()) {
      const saved = getProfile()
      if (saved?.name) {
        setExistingName(saved.name)
      }
    }
  }, [])

  const updateProfile = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleGoal = (goal: Goal) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal],
    }))
  }

  const toggleInjury = (injury: string) => {
    if (injury === 'None') { updateProfile('injuries', []); return }
    updateProfile('injuries', profile.injuries.includes(injury) ? profile.injuries.filter(i => i !== injury) : [...profile.injuries.filter(i => i !== 'None'), injury])
  }

  const toggleAllergy = (allergy: string) => {
    updateProfile('foodAllergies', profile.foodAllergies.includes(allergy) ? profile.foodAllergies.filter(a => a !== allergy) : [...profile.foodAllergies, allergy])
  }

  const canSubmit = () => {
    return (
      profile.name.trim() !== '' &&
      profile.age >= 16 && profile.age <= 100 &&
      profile.height > 0 && profile.weight > 0 &&
      profile.goals.length > 0 &&
      profile.fitnessLevel &&
      profile.workoutDays >= 1 && profile.workoutDays <= 7
    )
  }

  const handleContinue = () => navigate('/dashboard')

  const handleStartFresh = () => {
    clearAll()
    window.location.replace('/')
  }

  const handleSubmit = () => {
    setValidationErrors({})

    // Basic validation
    if (!profile.name || profile.name.trim() === '') {
      setValidationErrors(prev => ({ ...prev, name: 'Please enter your name' }))
      return
    }
    if (profile.goals.length === 0) {
      setValidationErrors(prev => ({ ...prev, goals: 'Please select at least one goal' }))
      return
    }

    setIsGenerating(true)

    // Generate and save workout plan
    const workoutPlan = generateWorkoutPlan(profile)
    saveWorkoutPlan(workoutPlan)

    // Generate and save meal plan
    const goal = profile.goals[0] || 'general-health'
    const mealPlan = generateMealPlan(goal, 7, {
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      bodyType: profile.bodyType,
      workoutDays: profile.workoutDays,
      sessionDuration: profile.sessionDuration
    })
    saveMealPlan(mealPlan)

    // Save profile
    saveProfile(profile)

    // Navigate to dashboard
    window.location.replace('/dashboard')
  }

  // Welcome back screen
  if (existingName && !profile.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-orange-500">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full inline-block mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {existingName}!</h2>
          <p className="text-gray-400 mb-6">You already have a personalized fitness plan.</p>
          <div className="flex flex-col gap-3">
            <button onClick={handleContinue} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-colors">
              Continue with my plan
            </button>
            <button onClick={handleStartFresh} className="w-full py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-bold hover:border-red-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" /> Start fresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            WORKOUTS THAT<br />
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">ACTUALLY FIT YOUR BODY</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Free personalized workout and meal plans that adapt to your injuries, fitness level, and goals. No credit card required.
          </p>
        </div>

        {/* Pain Points We Solve */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white text-center mb-4">Unlike Other Apps, We Actually Work</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-900/30 to-gray-800 rounded-xl p-5 border border-red-500/30">
              <div className="text-red-400 text-2xl mb-2">X</div>
              <h3 className="text-lg font-bold text-white mb-1">75% Quit Within a Month</h3>
              <p className="text-gray-400 text-sm">Generic plans that don't adapt? We fix that.</p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-gray-800 rounded-xl p-5 border border-red-500/30">
              <div className="text-red-400 text-2xl mb-2">X</div>
              <h3 className="text-lg font-bold text-white mb-1">Ignores Your Injuries</h3>
              <p className="text-gray-400 text-sm">We customize every exercise around your pain points.</p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-gray-800 rounded-xl p-5 border border-red-500/30">
              <div className="text-red-400 text-2xl mb-2">X</div>
              <h3 className="text-lg font-bold text-white mb-1">No Real Feedback</h3>
              <p className="text-gray-400 text-sm">Chat with AI to adjust your plan in real-time.</p>
            </div>
          </div>
        </div>

        {/* Premium Features Teaser */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full">
              <Crown className="h-4 w-4" /> ALL USERS GET PREMIUM - FREE
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-amber-500/30">
              <Zap className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">AI Personal Trainer</h3>
              <p className="text-gray-400 text-sm">Chat with AI that adjusts your meal and workout plans in real-time</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-amber-500/30">
              <TrendingUp className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Progress Tracking</h3>
              <p className="text-gray-400 text-sm">Track weight, measurements, and progress photos over time</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-amber-500/30">
              <Users className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Spot Me Partner</h3>
              <p className="text-gray-400 text-sm">Find workout partners, trainers, and clients in your area</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Tell Us About Yourself</h2>

          {/* Personal Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Personal Info
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" value={profile.name} onChange={e => { updateProfile('name', e.target.value); setValidationErrors(prev => ({ ...prev, name: undefined })) }}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-orange-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-600'}`} placeholder="Enter your name" />
                {validationErrors.name && <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                <input type="number" value={profile.age} onChange={e => updateProfile('age', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                <div className="flex gap-4">
                  {(['male', 'female', 'other'] as const).map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-white">
                      <input type="radio" name="gender" value={g} checked={profile.gender === g} onChange={() => updateProfile('gender', g)} className="w-4 h-4 text-orange-500" />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Height (inches)</label>
                <input type="number" value={profile.height} onChange={e => updateProfile('height', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-orange-500" placeholder="e.g., 70" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Weight (lbs)</label>
                <input type="number" value={profile.weight} onChange={e => updateProfile('weight', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-orange-500" placeholder="e.g., 170" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Body Type</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {BODY_TYPES.map(bt => (
                    <button key={bt.value} onClick={() => updateProfile('bodyType', bt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${profile.bodyType === bt.value ? 'border-orange-500 bg-orange-900/30' : 'border-gray-600 hover:border-orange-400 bg-gray-700/50'}`}>
                      <div className="font-bold text-white text-sm">{bt.label}</div>
                      <div className="text-xs text-gray-400 mb-2">{bt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Fitness Goals <span className="text-red-400 text-sm">(select at least 1)</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {GOALS.map(({ value, label, icon: Icon, desc }) => (
                <button key={value} onClick={() => { toggleGoal(value); setValidationErrors(prev => ({ ...prev, goals: undefined })) }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${profile.goals.includes(value) ? 'border-orange-500 bg-orange-900/30' : 'border-gray-600 hover:border-orange-400 bg-gray-700/50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-5 w-5 ${profile.goals.includes(value) ? 'text-orange-400' : 'text-gray-400'}`} />
                    <span className="font-semibold text-white">{label}</span>
                    {profile.goals.includes(value) && <Check className="h-4 w-4 text-orange-400 ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-400">{desc}</p>
                </button>
              ))}
            </div>
            {validationErrors.goals && <p className="text-red-400 text-sm mt-2">{validationErrors.goals}</p>}
          </div>

          {/* Workout Preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              Workout Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Level</label>
                <div className="flex gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <label key={level}
                      className={`flex-1 p-3 rounded-lg border-2 text-center cursor-pointer transition-colors capitalize ${profile.fitnessLevel === level ? 'border-orange-500 bg-orange-900/30 text-orange-400' : 'border-gray-600 text-gray-300 hover:border-orange-400'}`}>
                      <input type="radio" name="fitnessLevel" value={level} checked={profile.fitnessLevel === level} onChange={() => updateProfile('fitnessLevel', level)} className="sr-only" />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workout Days per Week: <span className="text-orange-400 font-bold">{profile.workoutDays}</span></label>
                <input type="range" min={1} max={7} value={profile.workoutDays} onChange={e => updateProfile('workoutDays', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1 day</span><span>7 days</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Session Duration</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {SESSION_DURATIONS.map(duration => (
                    <button key={duration} type="button" onClick={() => updateProfile('sessionDuration', duration)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${profile.sessionDuration === duration ? 'border-orange-500 bg-orange-900/30 text-orange-400' : 'border-gray-600 text-gray-300 hover:border-orange-400'}`}>
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health & Dietary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
              Health & Injury Accommodation
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
              <p className="text-sm text-gray-300">
                <span className="text-orange-400 font-semibold">We customize every exercise around your limitations.</span> Select any injuries, chronic pain, or conditions below - we'll automatically modify exercises and suggest alternatives.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Injuries & Chronic Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {injuries.map(injury => (
                    <button key={injury} type="button" onClick={() => toggleInjury(injury)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${(injury === 'None' && profile.injuries.length === 0) || profile.injuries.includes(injury) ? 'bg-red-900/50 text-red-400 border border-red-500' : 'bg-gray-700 text-gray-300 border border-gray-600 hover:border-red-400'}`}>
                      {injury}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Food Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {foodAllergies.map(allergy => (
                    <button key={allergy} type="button" onClick={() => toggleAllergy(allergy)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${profile.foodAllergies.includes(allergy) ? 'bg-amber-900/50 text-amber-400 border border-amber-500' : 'bg-gray-700 text-gray-300 border border-gray-600 hover:border-amber-400'}`}>
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={profile.lactoseIntolerant} onChange={e => updateProfile('lactoseIntolerant', e.target.checked)} className="w-4 h-4 text-orange-500 rounded" />
                  <span className="text-sm font-medium text-gray-300">Lactose Intolerant</span>
                </label>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleSubmit} disabled={!canSubmit() || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg">
            {isGenerating ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              <>GENERATE MY FREE PLAN <ChevronRight className="h-5 w-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
