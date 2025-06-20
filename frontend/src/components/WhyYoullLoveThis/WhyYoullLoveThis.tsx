import React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  HeartIcon,
  CameraIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import type { Itinerary } from '@/types'

interface WhyYoullLoveThisProps {
  itinerary: Itinerary
  className?: string
}

export const WhyYoullLoveThis: React.FC<WhyYoullLoveThisProps> = ({ 
  itinerary, 
  className = '' 
}) => {
  const highlights = [
    {
      icon: MapPinIcon,
      title: "Perfect Location Mix",
      description: `Visit ${itinerary.activities.length} carefully selected locations that showcase the best of ${typeof itinerary.destination === 'string' ? itinerary.destination : itinerary.destination.name}`,
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: ClockIcon,
      title: "Optimized Timing",
      description: "Each day is perfectly paced with the right balance of activities and free time",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Budget-Friendly",
      description: "Carefully curated to maximize value while staying within your budget",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: StarIcon,
      title: "Local Favorites",
      description: "Includes hidden gems and local recommendations you won't find in guidebooks",
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      icon: HeartIcon,
      title: "Personal Touch",
      description: "Tailored specifically to your interests and travel style",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: CameraIcon,
      title: "Instagram-Worthy",
      description: "Every stop offers stunning photo opportunities for your social media",
      color: "text-pink-600 bg-pink-100"
    }
  ]

  const quickStats = [
    {
      icon: GlobeAltIcon,
      label: "Activities",
      value: itinerary.activities.length,
      suffix: "experiences"
    },
    {
      icon: ClockIcon,
      label: "Duration",
      value: typeof itinerary.duration === 'number' ? itinerary.duration : itinerary.duration?.days || 0,
      suffix: "days"
    },
    {
      icon: MapPinIcon,
      label: "Locations",
      value: new Set(itinerary.activities.map(a => a.location)).size,
      suffix: "unique spots"
    }
  ]

  const destinationName = typeof itinerary.destination === 'string' 
    ? itinerary.destination 
    : itinerary.destination.name

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Why You'll Love This Itinerary ❤️
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We've crafted the perfect blend of must-see attractions, local experiences, 
          and hidden gems to make your trip unforgettable.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        {quickStats.map((stat, index) => (
          <div key={index} className="text-center bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-center mb-2">
              <stat.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.suffix}</div>
          </div>
        ))}
      </motion.div>

      {/* Highlights Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${highlight.color} mb-4`}>
              <highlight.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {highlight.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {highlight.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Special Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 bg-white rounded-lg p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="bg-blue-100 rounded-full p-2">
              <StarIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              ✨ AI-Powered Optimization
            </h4>
            <p className="text-gray-600 text-sm">
              This itinerary has been optimized using advanced AI algorithms that consider 
              travel times, opening hours, crowd patterns, and weather conditions to ensure 
              you make the most of every moment in {destinationName}.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WhyYoullLoveThis 