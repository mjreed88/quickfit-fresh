import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Shield, Users, Crown, Lock, Search, RefreshCw } from 'lucide-react'

interface UserRecord {
  email: string
  username: string
  isPremium: boolean
  isAdmin: boolean
  createdAt: string
}

const MOCK_USERS: UserRecord[] = [
  { email: 'test@example.com', username: 'fitnessuser1', isPremium: false, isAdmin: false, createdAt: '2026-03-15' },
  { email: 'mike@example.com', username: 'mike_lifts', isPremium: true, isAdmin: false, createdAt: '2026-03-10' },
  { email: 'user@example.com', username: 'gymrat42', isPremium: false, isAdmin: false, createdAt: '2026-03-20' },
  { email: 'michael.j.reed218@gmail.com', username: 'Quickfit_admin', isPremium: true, isAdmin: true, createdAt: '2026-01-01' },
]

export default function Admin() {
  const { isAdmin, updatePremium } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'premium' | 'free'>('all')

  // Redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard')
    }
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  const filteredUsers = users.filter(u => {
    if (filter === 'premium' && !u.isPremium) return false
    if (filter === 'free' && u.isPremium) return false
    if (search && !u.email.toLowerCase().includes(search.toLowerCase()) && !u.username.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const togglePremium = (email: string) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, isPremium: !u.isPremium } : u))
    updatePremium(email, !users.find(u => u.email === email)?.isPremium)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        </div>
        <p className="text-gray-400">Manage users and premium subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500 text-sm">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-white">{users.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-gray-500 text-sm">Premium</span>
          </div>
          <div className="text-3xl font-bold text-amber-400">{users.filter(u => u.isPremium).length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500 text-sm">Free Tier</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{users.filter(u => !u.isPremium).length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'premium', 'free'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or username..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">User</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Joined</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map(u => (
              <tr key={u.email} className="hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{u.username}</div>
                      {u.isAdmin && <span className="text-xs text-red-400 font-bold">ADMIN</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  {u.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                      <Crown className="h-3 w-3" /> PREMIUM
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                      FREE
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{u.createdAt}</td>
                <td className="px-6 py-4">
                  {u.isAdmin ? (
                    <span className="text-gray-500 text-sm">Protected</span>
                  ) : (
                    <button
                      onClick={() => togglePremium(u.email)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        u.isPremium
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {u.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
