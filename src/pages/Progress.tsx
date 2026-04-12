import { useState } from 'react'
import { TrendingUp, Plus, Trash2 } from 'lucide-react'

interface ProgressEntry {
  id: string
  date: string
  weight: number
  notes: string
}

export default function Progress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([
    { id: '1', date: '2026-04-01', weight: 175, notes: 'Starting fresh!' },
    { id: '2', date: '2026-04-03', weight: 174.2, notes: 'Feeling good, sticking to plan' },
  ])
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [showForm, setShowForm] = useState(false)

  const addEntry = () => {
    if (!weight) return
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      notes,
    }
    setEntries(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setWeight('')
    setNotes('')
    setShowForm(false)
  }

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Calculate weight change
  const weightChange = entries.length >= 2 ? entries[0].weight - entries[entries.length - 1].weight : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Progress Tracker</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Log Weight
          </button>
        </div>
        <p className="text-gray-400">Track your weight and progress over time</p>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Log New Entry</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Weight (lbs)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="175.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="How are you feeling? Any observations?"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={addEntry} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700">
              Save Entry
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Current Weight</div>
          <div className="text-3xl font-bold text-white">{entries[0]?.weight || '--'} <span className="text-lg font-normal text-gray-400">lbs</span></div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Weight Change</div>
          <div className={`text-3xl font-bold ${weightChange < 0 ? 'text-green-400' : weightChange > 0 ? 'text-red-400' : 'text-white'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} <span className="text-lg font-normal text-gray-400">lbs</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="text-sm text-gray-500 mb-1">Entries</div>
          <div className="text-3xl font-bold text-white">{entries.length}</div>
        </div>
      </div>

      {/* Progress List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">History</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-gray-700 rounded-lg px-3 py-2">
                  <div className="text-xs text-gray-500">{entry.date}</div>
                  <div className="text-xl font-bold text-white">{entry.weight} lbs</div>
                </div>
                <div className="text-gray-400 text-sm">{entry.notes}</div>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
