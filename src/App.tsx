import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Dumbbell, Crown } from 'lucide-react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { Component, ReactNode, lazy, Suspense } from 'react'
import './lib/auth'
import Header from './components/Header'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import WorkoutPlan from './pages/WorkoutPlan'
import MealPlan from './pages/MealPlan'
import Products from './pages/Products'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Lazy load premium routes for code splitting
const AITrainer = lazy(() => import('./pages/AITrainer'))
const Progress = lazy(() => import('./pages/Progress'))
const SpotMe = lazy(() => import('./pages/SpotMe'))
const Admin = lazy(() => import('./pages/Admin'))

// Error Boundary to catch React rendering errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  componentDidCatch(error: Error, info: any) {
    console.error('React Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/50 border border-red-500 rounded-xl p-8 max-w-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-red-400 mb-4">{this.state.error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg">
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Premium Gate - shows upgrade prompt if logged in but not premium
function PremiumGate({ children }: { children: React.ReactNode }) {
  const { user, isPremium, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-amber-500">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-full inline-block mb-4">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
          <p className="text-gray-400 mb-4">
            The <span className="font-semibold text-amber-400">AI Trainer</span> feature is available for Premium members.
          </p>
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl p-4 my-4 border border-amber-500">
            <p className="text-3xl font-bold text-amber-400">$5.99/month</p>
            <p className="text-sm text-gray-500 mt-1">Unlock all premium features</p>
          </div>
          <a
            href="mailto:michael.j.reed218@gmail.com?subject=Upgrade to Premium"
            className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-colors"
          >
            Contact Admin to Upgrade
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2 mt-3 text-gray-400 hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Admin Gate
function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppContent() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />

      <Routes>
        {/* Free tier routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/workout" element={<WorkoutPlan />} />
        <Route path="/meals" element={<MealPlan />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Premium routes - lazy loaded */}
        <Route
          path="/trainer"
          element={
            <PremiumGate>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <AITrainer />
              </Suspense>
            </PremiumGate>
          }
        />
        <Route
          path="/progress"
          element={
            <PremiumGate>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <Progress />
              </Suspense>
            </PremiumGate>
          }
        />
        <Route
          path="/spotme"
          element={
            <PremiumGate>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <SpotMe />
              </Suspense>
            </PremiumGate>
          }
        />

        {/* Dashboard - accessible to both free and premium */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin - lazy loaded */}
        <Route
          path="/admin"
          element={
            <AdminGate>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <Admin />
              </Suspense>
            </AdminGate>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-1.5 rounded-lg">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-300">QuickFit.Tech</span>
            </div>
            <p className="text-sm text-gray-500">
              Personalized fitness plans powered by AI. Free tier includes basic workout and meal plans.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
