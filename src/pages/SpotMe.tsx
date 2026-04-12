import { useState } from 'react'
import { Users, MapPin, MessageCircle, Dumbbell, Search } from 'lucide-react'

interface Trainer {
  id: string
  name: string
  type: 'trainer' | 'partner'
  specialization: string[]
  bio: string
  location: string
}

const MOCK_TRAINERS: Trainer[] = [
  { id: '1', name: 'Mike T.', type: 'trainer', specialization: ['Strength', 'Bodybuilding'], bio: 'NASM certified trainer with 10 years experience. Specialize in muscle building and strength.', location: 'Los Angeles, CA', },
  { id: '2', name: 'Sarah K.', type: 'trainer', specialization: ['Weight Loss', 'HIIT'], bio: 'Certified nutritionist and trainer. Help clients achieve sustainable weight loss.', location: 'New York, NY', },
  { id: '3', name: 'Alex M.', type: 'partner', specialization: ['Calisthenics', 'Flexibility'], bio: 'Looking for a workout partner for morning sessions. Intermediate level.', location: 'Austin, TX', },
  { id: '4', name: 'Jordan L.', type: 'trainer', specialization: ['Powerlifting', 'Strength'], bio: 'USPA certified powerlifting coach. Help you hit your first 405lb squat.', location: 'Denver, CO', },
]

export default function SpotMe() {
  const [showForm, setShowForm] = useState(false)
  const [bio, setBio] = useState('')
  const [type, setType] = useState<'trainer' | 'partner'>('partner')
  const [specialization, setSpecialization] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trainer' | 'partner'>('all')

  const specOptions = ['Strength', 'Bodybuilding', 'Weight Loss', 'HIIT', 'Cardio', 'Flexibility', 'Powerlifting', 'CrossFit']

  const toggleSpec = (spec: string) => {
    setSpecialization(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec])
  }

  const filteredTrainers = MOCK_TRAINERS.filter(t => {
    if (selectedFilter !== 'all' && t.type !== selectedFilter) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.bio.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Spot Me</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Join as Trainer/Partner'}
          </button>
        </div>
        <p className="text-gray-400">Find workout partners, trainers, or clients in your area</p>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Create Your Profile</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">I am a...</label>
            <div className="flex gap-4">
              <button
                onClick={() => setType('trainer')}
                className={`flex-1 p-4 rounded-xl border-2 transition-colors ${type === 'trainer' ? 'border-orange-500 bg-orange-900/30' : 'border-gray-600 hover:border-gray-500'}`}
              >
                <Dumbbell className="h-6 w-6 mx-auto mb-2 text-orange-400" />
                <div className="font-bold text-white">Trainer</div>
                <div className="text-xs text-gray-400">I train clients</div>
              </button>
              <button
                onClick={() => setType('partner')}
                className={`flex-1 p-4 rounded-xl border-2 transition-colors ${type === 'partner' ? 'border-orange-500 bg-orange-900/30' : 'border-gray-600 hover:border-gray-500'}`}
              >
                <Users className="h-6 w-6 mx-auto mb-2 text-orange-400" />
                <div className="font-bold text-white">Partner</div>
                <div className="text-xs text-gray-400">I need a workout buddy</div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Specialization</label>
            <div className="flex flex-wrap gap-2">
              {specOptions.map(spec => (
                <button
                  key={spec}
                  onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${specialization.includes(spec) ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tell people about yourself and what you're looking for..."
            />
          </div>

          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700">
            Create Profile
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'trainer', 'partner'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${selectedFilter === filter ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {filter === 'all' ? 'All' : filter + 's'}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trainers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Trainer List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTrainers.map(trainer => (
          <div key={trainer.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {trainer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white">{trainer.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${trainer.type === 'trainer' ? 'bg-amber-500/30 text-amber-400' : 'bg-purple-500/30 text-purple-400'}`}>
                    {trainer.type}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3">{trainer.bio}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {trainer.specialization.map(spec => (
                <span key={spec} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">{spec}</span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin className="h-4 w-4" /> {trainer.location}
            </div>

            <button className="w-full py-2 border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500/10 font-medium flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4" /> Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
