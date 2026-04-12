import { useState } from 'react'
import { Dumbbell, Pill, Apple, ExternalLink } from 'lucide-react'
import { getSuggestedItems } from '../data/meals'

interface ProductItem {
  name: string
  description: string
  benefit: string
  price: string
  link: string
  category: string
  image?: string
}

const products = getSuggestedItems() as ProductItem[]
const equipmentList: ProductItem[] = [
  { name: 'Adjustable Dumbbell Set', description: '22/33/45/70/90lbs Free Weight Set with Connector, 5-in-1 Dumbbell Set for Barbells, Kettlebells, Push up Stand, Weight Plate, Fitness Exercises for Home Gym', benefit: 'Full body strength training', price: '$79.98', link: 'https://amzn.to/3OndojW', image: 'https://m.media-amazon.com/images/I/71Qnpon80vL._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'MERACH Exercise Bike', description: 'Stationary bike with exclusive app, low noise, 300lbs weight capacity, tablet mount and fitness courses for weight loss', benefit: 'Cardio and weight loss', price: '$209.99', link: 'https://amzn.to/4csB2Vm', image: 'https://m.media-amazon.com/images/I/71gzCwnK0dL._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'ALSO GO Weight Bench', description: 'Adjustable workout bench with leg extension & extended headrest, foldable incline decline bench press, roman chair for full body strength training', benefit: 'Full body strength training', price: '$109.99', link: 'https://amzn.to/4vknNh9', image: 'https://m.media-amazon.com/images/I/61w5F0p50GL._AC_SL1280_.jpg', category: 'equipment' },
  { name: 'Power Tower Pull Up Bar', description: '450LBS Stable Pull Up Dip Station for Home Gym Strength Training Equipment', benefit: 'Upper body and core training', price: '$195.49', link: 'https://amzn.to/3O0qGmq', image: 'https://m.media-amazon.com/images/I/61wUqv1LMzL._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'Mikolo M4 Smith Machine', description: 'All-in-One Home Gym Power Cage with LAT Pulldown & Cable Crossover, Squat Rack for Full Body Workouts', benefit: 'Complete home gym system', price: '$2,999.99', link: 'https://amzn.to/4td3ukl', image: 'https://m.media-amazon.com/images/I/71bfKv1D91L._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'GarveeLife Power Cage', description: 'Power Racks for Home Gym with Pulley System, 1200 LBS Weight Capacity Multi-Functional Squat Rack for Strength Workout', benefit: 'Heavy-duty strength training', price: '$296.99', link: 'https://amzn.to/4v8QddX', image: 'https://m.media-amazon.com/images/I/71ZTJmwgdML._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'Portable Treadmill', description: '3.0HP Walking Pad with Handle Bar, 3-in-1 Foldable Treadmill for Home Office Small Space with Quiet Brushless Motor, 300 LBS Capacity', benefit: 'Cardio and walking workouts', price: '$189.99', link: 'https://amzn.to/4crMFMh', image: 'https://m.media-amazon.com/images/I/71owdJaQz9L._AC_SL1500_.jpg', category: 'equipment' },
  { name: 'Pull-Up Bar', description: 'Doorway mount, no screws needed', benefit: 'Build back and biceps', price: '$34.99', link: 'https://www.amazon.com/dp/B08FQPF6BZ?tag=quickfit0f-20', category: 'equipment' },
  { name: 'Resistance Bands Set', description: '5 levels from light to extra heavy', benefit: 'Versatile home gym', price: '$24.99', link: 'https://www.amazon.com/dp/B07XLW4JYJ?tag=quickfit0f-20', category: 'equipment' },
  { name: 'Foam Roller', description: 'High-density EPP foam', benefit: 'Recovery and flexibility', price: '$29.99', link: 'https://www.amazon.com/dp/B07QMBZ8Y8?tag=quickfit0f-20', category: 'equipment' },
  { name: 'Jump Rope', description: 'Adjustable speed rope with ball bearings', benefit: 'Cardio and coordination', price: '$14.99', link: 'https://www.amazon.com/dp/B07YXS1XYZ?tag=quickfit0f-20', category: 'equipment' },
]

const supplements: ProductItem[] = [
  { name: 'Muscle Milk Pro Series', description: '50g protein, 28 servings, NSF Certified for Sport', benefit: 'Workout recovery', price: '$65.35', link: 'https://www.amazon.com/dp/B01MYZ7CJG?tag=quickfit08-20&th=1', image: 'https://m.media-amazon.com/images/I/71auTS3rzCL._SL1500_.jpg', category: 'supplement' },
  { name: 'Animal 100% Whey Protein', description: 'Whey Blend for Pre Workout or Post Workout, Recovery, or an Anytime Low Sugar Protein Boost Meal Replacement with BCAA – Vanilla, 4 lb', benefit: 'Muscle building and recovery', price: '$59.99', link: 'https://amzn.to/4sVbCFW', image: 'https://m.media-amazon.com/images/I/619KShIiffL._AC_SL1500_.jpg', category: 'supplement' },
  { name: 'Creatine Monohydrate', description: '5g pure creatine per serving', benefit: 'Strength and power', price: '$24.99', link: 'https://www.amazon.com/dp/B07BJ7BSHZ?tag=quickfit0f-20', category: 'supplement' },
  { name: 'Nutricost Creatine Monohydrate', description: '500G, 5000mg Per Serving (5g) - 100 Servings, Micronized Powder', benefit: 'Strength and power', price: '$20.75', link: 'https://amzn.to/4e1HAeP', image: 'https://m.media-amazon.com/images/I/6103RpMQKcL._AC_SL1500_.jpg', category: 'supplement' },
  { name: 'Force Factor Creatine Monohydrate', description: '5g Micronized Dose to Support Muscle Growth, Strength, Recovery, Cognitive Health & Memory, Unflavored, 200 Servings', benefit: 'Strength and recovery', price: '$39.99', link: 'https://amzn.to/4mf6xWk', image: 'https://m.media-amazon.com/images/I/71179fAeScL._AC_SL1500_.jpg', category: 'supplement' },
  { name: 'Creatine Gummies', description: 'Boost Focus, Strength, and Endurance, Anti-Melting Formula, Vegan, Gluten-Free, Non-GMO, 1.5g of Creatine per Gummy (Sour Green Apple)', benefit: 'Strength and endurance', price: '$29.99', link: 'https://amzn.to/3PJEa6D', image: 'https://m.media-amazon.com/images/I/71KBrg01spL._AC_SL1500_.jpg', category: 'supplement' },
  { name: 'BCAA Powder', description: '2:1:1 ratio, 30 servings', benefit: 'Muscle recovery', price: '$29.99', link: 'https://www.amazon.com/dp/B06W9NKX62?tag=quickfit0f-20', category: 'supplement' },
  { name: 'Essential Amino Acids Powder', description: 'Pre + During + Post Workout with EAAs + BCAAs for Energy, Muscle Growth, and Recovery. Non-GMO BCAA and EAA Powders for Men + Women. 3rd Party Tested. Lemon Lime', benefit: 'Energy and muscle recovery', price: '$34.99', link: 'https://amzn.to/3Q58wjU', image: 'https://m.media-amazon.com/images/I/71k0Eivsm6L._AC_SL1500_.jpg', category: 'supplement' },
  { name: 'Whey Protein Isolate', description: '25g protein, low carb', benefit: 'Post-workout recovery', price: '$44.99', link: 'https://www.amazon.com/dp/B00JSQ4X1K?tag=quickfit0f-20', category: 'supplement' },
  { name: 'Pre-Workout Energy', description: '200mg caffeine, beta-alanine', benefit: 'Energy and focus', price: '$34.99', link: 'https://www.amazon.com/dp/B07B7DXDCL?tag=quickfit0f-20', category: 'supplement' },
  { name: 'Fish Oil Omega-3', description: '1000mg EPA/DHA per softgel', benefit: 'Joint health and recovery', price: '$19.99', link: 'https://www.amazon.com/dp/B077TSGRCB?tag=quickfit0f-20', category: 'supplement' },
]

export default function Products() {
  const [tab, setTab] = useState<'equipment' | 'supplement' | 'food'>('equipment')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Recommended Products</h1>
        <p className="text-gray-400 mt-1">Quality gear and supplements to support your fitness journey</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(['equipment', 'supplement', 'food'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${tab === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {t === 'equipment' && <Dumbbell className="h-4 w-4" />}
            {t === 'supplement' && <Pill className="h-4 w-4" />}
            {t === 'food' && <Apple className="h-4 w-4" />}
            <span className="capitalize">{t === 'food' ? 'Foods' : t + 's'}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(tab === 'equipment' ? equipmentList : tab === 'supplement' ? supplements : products).map((item, index) => (
          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer"
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500 transition-all group overflow-hidden">
            {item.image && (
              <div className="h-40 overflow-hidden bg-gray-700">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              {!item.image && <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
                {tab === 'equipment' && <Dumbbell className="h-6 w-6 text-white" />}
                {tab === 'supplement' && <Pill className="h-6 w-6 text-white" />}
                {tab === 'food' && <Apple className="h-6 w-6 text-white" />}
              </div>}
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-400">{item.price}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span>✓ {item.benefit}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
              View on Amazon <ExternalLink className="h-3 w-3" />
            </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>As an affiliate, I earn from qualifying purchases. Thank you for your support!</p>
      </div>
    </div>
  )
}
