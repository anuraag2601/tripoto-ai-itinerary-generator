import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface InterestCategory {
  id: string
  name: string
  icon: string
  children?: InterestCategory[]
}

interface InterestsSelectionProps {
  selectedInterests: string[]
  onInterestsChange: (interests: string[]) => void
  freeFormText: string
  onFreeFormChange: (text: string) => void
}

const interestCategories: InterestCategory[] = [
  {
    id: 'adventure',
    name: 'Adventure',
    icon: '🏔️',
    children: [
      { id: 'hiking', name: 'Hiking', icon: '🥾' },
      { id: 'rock-climbing', name: 'Rock Climbing', icon: '🧗‍♂️' },
      { id: 'skydiving', name: 'Skydiving', icon: '🪂' },
      { id: 'bungee-jumping', name: 'Bungee Jumping', icon: '🤸‍♂️' },
      { id: 'water-sports', name: 'Water Sports', icon: '🏄‍♂️' },
      { id: 'zip-lining', name: 'Zip Lining', icon: '🧗‍♀️' },
      { id: 'paragliding', name: 'Paragliding', icon: '🪂' }
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    children: [
      { id: 'national-parks', name: 'National Parks', icon: '🏞️' },
      { id: 'wildlife-safari', name: 'Wildlife Safari', icon: '🦁' },
      { id: 'beaches', name: 'Beaches', icon: '🏖️' },
      { id: 'mountains', name: 'Mountains', icon: '⛰️' },
      { id: 'forests', name: 'Forests', icon: '🌲' },
      { id: 'botanical-gardens', name: 'Botanical Gardens', icon: '🌺' },
      { id: 'bird-watching', name: 'Bird Watching', icon: '🦅' }
    ]
  },
  {
    id: 'culture',
    name: 'Culture & History',
    icon: '🏛️',
    children: [
      { id: 'museums', name: 'Museums', icon: '🏛️' },
      { id: 'art-galleries', name: 'Art Galleries', icon: '🎨' },
      { id: 'historical-sites', name: 'Historical Sites', icon: '🏰' },
      { id: 'local-traditions', name: 'Local Traditions', icon: '🎭' },
      { id: 'festivals', name: 'Festivals', icon: '🎪' },
      { id: 'architecture', name: 'Architecture', icon: '🏗️' },
      { id: 'religious-sites', name: 'Religious Sites', icon: '⛪' }
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍽️',
    children: [
      { id: 'fine-dining', name: 'Fine Dining', icon: '🍷' },
      { id: 'street-food', name: 'Street Food', icon: '🌮' },
      { id: 'local-cuisine', name: 'Local Cuisine', icon: '🍜' },
      { id: 'cooking-classes', name: 'Cooking Classes', icon: '👨‍🍳' },
      { id: 'food-tours', name: 'Food Tours', icon: '🚶‍♂️' },
      { id: 'wine-tasting', name: 'Wine Tasting', icon: '🍇' },
      { id: 'coffee-culture', name: 'Coffee Culture', icon: '☕' }
    ]
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    icon: '🌃',
    children: [
      { id: 'bars', name: 'Bars', icon: '🍸' },
      { id: 'clubs', name: 'Clubs', icon: '🕺' },
      { id: 'live-music', name: 'Live Music', icon: '🎵' },
      { id: 'rooftop-venues', name: 'Rooftop Venues', icon: '🏙️' },
      { id: 'night-markets', name: 'Night Markets', icon: '🌙' },
      { id: 'casinos', name: 'Casinos', icon: '🎰' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    children: [
      { id: 'luxury-brands', name: 'Luxury Brands', icon: '💎' },
      { id: 'local-markets', name: 'Local Markets', icon: '🏪' },
      { id: 'vintage-stores', name: 'Vintage Stores', icon: '👗' },
      { id: 'souvenirs', name: 'Souvenirs', icon: '🎁' },
      { id: 'designer-outlets', name: 'Designer Outlets', icon: '🏬' },
      { id: 'artisan-crafts', name: 'Artisan Crafts', icon: '🎨' }
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: '🧘‍♀️',
    children: [
      { id: 'spas', name: 'Spas', icon: '💆‍♀️' },
      { id: 'yoga-retreats', name: 'Yoga Retreats', icon: '🧘‍♂️' },
      { id: 'meditation', name: 'Meditation', icon: '🧠' },
      { id: 'hot-springs', name: 'Hot Springs', icon: '♨️' },
      { id: 'massage-therapy', name: 'Massage Therapy', icon: '💆‍♂️' },
      { id: 'fitness', name: 'Fitness', icon: '💪' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎭',
    children: [
      { id: 'theme-parks', name: 'Theme Parks', icon: '🎢' },
      { id: 'shows', name: 'Shows', icon: '🎪' },
      { id: 'concerts', name: 'Concerts', icon: '🎤' },
      { id: 'sports-events', name: 'Sports Events', icon: '⚽' },
      { id: 'theater', name: 'Theater', icon: '🎭' },
      { id: 'comedy-shows', name: 'Comedy Shows', icon: '😂' }
    ]
  }
]

const InterestsSelection: React.FC<InterestsSelectionProps> = ({
  selectedInterests,
  onInterestsChange,
  freeFormText,
  onFreeFormChange
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showFreeForm, setShowFreeForm] = useState(false)

  // Auto-expand categories that have selected children
  useEffect(() => {
    const categoriesToExpand = interestCategories
      .filter(category => 
        category.children?.some(child => selectedInterests.includes(child.id))
      )
      .map(category => category.id)
    
    setExpandedCategories(prev => [...new Set([...prev, ...categoriesToExpand])])
  }, [selectedInterests])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleInterest = (interestId: string) => {
    const isSelected = selectedInterests.includes(interestId)
    if (isSelected) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId))
    } else {
      onInterestsChange([...selectedInterests, interestId])
    }
  }

  const isParentSelected = (category: InterestCategory) => {
    return selectedInterests.includes(category.id) || 
           (category.children?.some(child => selectedInterests.includes(child.id)) ?? false)
  }

  return (
    <div className="space-y-6">
      {/* Interest Categories */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full p-4 flex items-center justify-between transition-all duration-200 ${
                  isParentSelected(category)
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  {category.children && (
                    <span className="text-sm text-gray-500">
                      ({category.children.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isParentSelected(category) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                  {category.children && (
                    <motion.div
                      animate={{ rotate: expandedCategories.includes(category.id) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              </button>

              {/* Children */}
              <AnimatePresence>
                {expandedCategories.includes(category.id) && category.children && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 space-y-2">
                      {category.children.map((child) => (
                        <motion.button
                          key={child.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          onClick={() => toggleInterest(child.id)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                            selectedInterests.includes(child.id)
                              ? 'bg-blue-100 border-2 border-blue-300 text-blue-800'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <span className="text-lg">{child.icon}</span>
                          <span className="font-medium">{child.name}</span>
                          {selectedInterests.includes(child.id) && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Free Form Input Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tell us more about your preferences</h3>
              <p className="text-sm text-gray-600">Share any specific interests, requirements, or experiences you're looking for</p>
            </div>
            <button
              onClick={() => setShowFreeForm(!showFreeForm)}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {showFreeForm ? (
                <XMarkIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <PlusIcon className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFreeForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  value={freeFormText}
                  onChange={(e) => onFreeFormChange(e.target.value)}
                  placeholder="E.g., I'm interested in sustainable tourism, local cooking experiences, photography spots, accessibility-friendly venues, or avoiding crowded places..."
                  className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-xs text-gray-500">
                  This helps our AI create more personalized recommendations for you
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected Interests Summary */}
      {selectedInterests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Your Selected Interests ({selectedInterests.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interestId) => {
                const interest = interestCategories
                  .flatMap(cat => cat.children || [])
                  .find(child => child.id === interestId)
                if (!interest) return null
                
                return (
                  <motion.span
                    key={interestId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                    <button
                      onClick={() => toggleInterest(interestId)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </motion.span>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default InterestsSelection 