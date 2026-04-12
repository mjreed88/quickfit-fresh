import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Menu, X, LogOut, Crown, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function Header() {
  const { user, isPremium, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                QuickFit.Tech
              </h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Products
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Dashboard
                </Link>

                {isPremium && (
                  <>
                    <Link to="/trainer" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-400" /> AI Trainer
                    </Link>
                    <Link to="/progress" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-400" /> Progress
                    </Link>
                    <Link to="/spotme" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1">
                      <Users className="h-4 w-4 text-purple-400" /> Spot Me
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link to="/admin" className="px-2 py-1 bg-red-900/50 text-red-400 text-xs font-bold rounded-full border border-red-500 flex items-center gap-1">
                    <Crown className="h-3 w-3" /> ADMIN
                  </Link>
                )}

                {isPremium && (
                  <span className="px-2 py-1 bg-amber-900/50 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-500">
                    <Crown className="h-3 w-3" /> PREMIUM
                  </span>
                )}

                <span className="text-gray-500 text-sm">@{user.username}</span>

                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-300"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-2">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800">
                Products
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800">
                    Dashboard
                  </Link>
                  {isPremium && (
                    <>
                      <Link to="/trainer" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-400" /> AI Trainer
                      </Link>
                      <Link to="/progress" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" /> Progress
                      </Link>
                      <Link to="/spotme" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" /> Spot Me
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-red-400 font-bold rounded-lg bg-red-900/50 border border-red-500 flex items-center gap-2">
                      <Crown className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-2 text-left text-red-400 font-medium rounded-lg hover:bg-red-900/50 flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-gray-300 hover:text-orange-400 font-medium rounded-lg hover:bg-gray-800">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
