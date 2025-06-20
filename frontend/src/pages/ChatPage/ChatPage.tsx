import { useState, useEffect, useRef } from 'react'
import { MapPin, Wand2, Download, Edit3 } from 'lucide-react'
import { ItineraryCard } from '@/components/Itinerary'
import { InterestsSelection } from '@/components/InterestsSelection'
import { WhyYoullLoveThis } from '@/components/WhyYoullLoveThis'
import { generateItineraryPDF, generateSimpleItineraryPDF } from '@/utils/pdfGenerator'
import { api, isAPISuccess, handleAPIError } from '@/utils/api'
import type { ItineraryRequest, CustomizeRequest } from '@/utils/api'
import type { Itinerary } from '@/types'
import toast from 'react-hot-toast'
// import { ItineraryMap } from '@/components/ItineraryMap/ItineraryMap'

type Step = 'destination' | 'dates' | 'travelers' | 'budget' | 'interests' | 'generating' | 'results'

interface TravelData {
  destination: string
  startDate: string
  endDate: string
  travelType: 'solo' | 'couple' | 'friends' | 'family' | ''
  budget: number
  currency: 'USD' | 'EUR' | 'GBP' | 'INR'
  interests: string[]
  preferences: string
}

const top50Cities = [
  "Tokyo, Japan", "Paris, France", "London, United Kingdom", "New York City, USA", "Dubai, UAE",
  "Bangkok, Thailand", "Singapore, Singapore", "Rome, Italy", "Amsterdam, Netherlands", "Barcelona, Spain",
  "Mumbai, India", "Hong Kong, China", "Istanbul, Turkey", "Prague, Czech Republic", "Bali, Indonesia",
  "Lisbon, Portugal", "Vienna, Austria", "Sydney, Australia", "Berlin, Germany", "Buenos Aires, Argentina",
  "Cairo, Egypt", "Stockholm, Sweden", "Zurich, Switzerland", "Florence, Italy", "Santorini, Greece",
  "Kyoto, Japan", "Marrakech, Morocco", "Cape Town, South Africa", "Reykjavik, Iceland", "Dubrovnik, Croatia",
  "Venice, Italy", "Edinburgh, Scotland", "Copenhagen, Denmark", "Budapest, Hungary", "Tel Aviv, Israel",
  "Seoul, South Korea", "Bruges, Belgium", "Seville, Spain", "Porto, Portugal", "Krakow, Poland",
  "San Francisco, USA", "Toronto, Canada", "Vancouver, Canada", "Melbourne, Australia", "Moscow, Russia",
  "St. Petersburg, Russia", "Delhi, India", "Goa, India", "Rio de Janeiro, Brazil", "Mexico City, Mexico"
]

const loadingMessages = [
  "Analyzing your preferences...",
  "Finding the best destinations...",
  "Curating unique experiences...",
  "Optimizing your itinerary...",
  "Adding personal touches...",
  "Discovering hidden gems...",
  "Planning perfect routes...",
  "Checking availability...",
  "Finalizing recommendations..."
]

const ChatPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('destination')
  const [sessionId] = useState<string>(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })
  const [travelData, setTravelData] = useState<TravelData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelType: '',
    budget: 1000,
    currency: 'USD',
    interests: [],
    preferences: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [filteredCities, setFilteredCities] = useState(top50Cities)
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0])
  const [customizeMode, setCustomizeMode] = useState(false)
  const [customizeText, setCustomizeText] = useState('')

  const cityInputRef = useRef<HTMLInputElement>(null)

  // Loading message rotation
  useEffect(() => {
    if (isGenerating || isCustomizing) {
      const interval = setInterval(() => {
        const nextIndex = (loadingMessages.indexOf(currentLoadingMessage) + 1) % loadingMessages.length
        setCurrentLoadingMessage(loadingMessages[nextIndex])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isGenerating, isCustomizing, currentLoadingMessage])

  // Key press handler for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentStep !== 'generating' && currentStep !== 'results') {
        event.preventDefault()
        if (canProceed()) {
          if (currentStep === 'interests') {
            generateItinerary()
          } else {
            handleNext()
          }
        }
      }
    }

    document.addEventListener('keypress', handleKeyPress)
    return () => document.removeEventListener('keypress', handleKeyPress)
  }, [currentStep, travelData])

  // Filter cities based on input
  const handleDestinationChange = (value: string) => {
    setTravelData(prev => ({ ...prev, destination: value }))
    const filtered = top50Cities.filter(city =>
      city.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCities(filtered)
    setShowCityDropdown(value.length > 0 && filtered.length > 0)
  }

  const selectCity = (city: string) => {
    setTravelData(prev => ({ ...prev, destination: city }))
    setShowCityDropdown(false)
    setFilteredCities(top50Cities)
  }

  const handleNext = () => {
    const steps: Step[] = ['destination', 'dates', 'travelers', 'budget', 'interests', 'generating', 'results']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['destination', 'dates', 'travelers', 'budget', 'interests', 'generating', 'results']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleInterestsChange = (interests: string[]) => {
    setTravelData(prev => ({
      ...prev,
      interests
    }))
  }

  const handlePreferencesChange = (text: string) => {
    setTravelData(prev => ({
      ...prev,
      preferences: text
    }))
  }

  const generateItinerary = async () => {
    setCurrentStep('generating')
    setIsGenerating(true)
    
    try {
      const numberOfDays = (() => {
        try {
          const start = new Date(travelData.startDate)
          const end = new Date(travelData.endDate)
          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          return Math.max(1, Math.round(diff))
        } catch {
          return 3
        }
      })()

      const payload: ItineraryRequest = {
        sessionId: sessionId,
        userInput: {
          destination: travelData.destination,
          numberOfDays,
          travelDates: {
            start: travelData.startDate,
            end: travelData.endDate,
          },
          travelStyle: travelData.travelType || 'balanced',
          interests: travelData.interests,
          budget: `${travelData.currency} ${travelData.budget}`,
          additionalRequests: travelData.preferences || '',
        },
      }

      const response = await api.itinerary.generate(payload)

      if (isAPISuccess(response)) {
        setItinerary(response.data.itinerary)
        setCurrentStep('results')
        toast.success('Itinerary generated successfully!')
      } else {
        const errorMessage = handleAPIError(response)
        toast.error(errorMessage)
        console.error('Itinerary generation failed:', response.error)
        setCurrentStep('interests') // Go back to the last step
      }
    } catch (error) {
      console.error('Error generating itinerary:', error)
      toast.error('Failed to generate itinerary. Please try again.')
      setCurrentStep('interests')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!itinerary) return
    
    setIsDownloadingPDF(true)
    try {
      // Create a compatible itinerary object for PDF generation
      const pdfItinerary = {
        title: itinerary.title || `${itinerary.destination?.name || 'Unknown'} Adventure`,
        description: itinerary.description || 'A personalized travel itinerary crafted just for you',
        destination: {
          name: itinerary.destination?.name || 'Unknown Destination',
          country: itinerary.destination?.country || 'Unknown Country'
        },
        duration: {
          days: itinerary.duration?.days || (itinerary.activities || []).length || 1,
          startDate: itinerary.duration?.startDate,
          endDate: itinerary.duration?.endDate
        },
        budget: {
          total: itinerary.budget?.total || 0,
          currency: itinerary.budget?.currency || 'USD'
        },
        activities: (itinerary.activities || []).map(activity => ({
          id: activity.id || `activity-${Math.random()}`,
          name: activity.name || 'Unnamed Activity',
          description: activity.description,
          type: activity.type || 'general',
          location: {
            name: activity.location?.name || 'Unknown Location'
          },
          day: activity.day || 1,
          timeSlot: activity.timeSlot,
          cost: activity.cost ? {
            amount: activity.cost.amount,
            currency: activity.cost.currency
          } : undefined
        }))
      };
      
      await generateItineraryPDF(pdfItinerary, 'itinerary-content')
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  const handleDownloadSimplePDF = () => {
    if (!itinerary) return
    
    // Create a compatible itinerary object for PDF generation
    const pdfItinerary = {
      title: itinerary.title || `${itinerary.destination?.name || 'Unknown'} Adventure`,
      description: itinerary.description || 'A personalized travel itinerary crafted just for you',
      destination: {
        name: itinerary.destination?.name || 'Unknown Destination',
        country: itinerary.destination?.country || 'Unknown Country'
      },
      duration: {
        days: itinerary.duration?.days || (itinerary.activities || []).length || 1,
        startDate: itinerary.duration?.startDate,
        endDate: itinerary.duration?.endDate
      },
      budget: {
        total: itinerary.budget?.total || 0,
        currency: itinerary.budget?.currency || 'USD'
      },
      activities: (itinerary.activities || []).map(activity => ({
        id: activity.id || `activity-${Math.random()}`,
        name: activity.name || 'Unnamed Activity',
        description: activity.description,
        type: activity.type || 'general',
        location: {
          name: activity.location?.name || 'Unknown Location'
        },
        day: activity.day || 1,
        timeSlot: activity.timeSlot,
        cost: activity.cost ? {
          amount: activity.cost.amount,
          currency: activity.cost.currency
        } : undefined
      }))
    };
    
    generateSimpleItineraryPDF(pdfItinerary)
    toast.success('Simple PDF downloaded!')
  }

  const handleCustomizeItinerary = async (customizationText: string) => {
    if (!itinerary || !customizationText.trim()) return

    setIsCustomizing(true)
    try {
      const customizeRequest: CustomizeRequest = {
        sessionId: sessionId,
        itinerary: itinerary,
        customizationRequest: customizationText.trim()
      }

      const response = await api.itinerary.customize(customizeRequest)

      if (isAPISuccess(response)) {
        setItinerary(response.data.itinerary)
        setCustomizeMode(false)
        setCustomizeText('')
        toast.success('Itinerary customized successfully!')
      } else {
        const errorMessage = handleAPIError(response)
        toast.error(`Customization failed: ${errorMessage}`)
        console.error('Customization failed:', response.error)
      }
    } catch (error) {
      console.error('Error customizing itinerary:', error)
      toast.error('Failed to customize itinerary. Please try again.')
    } finally {
      setIsCustomizing(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'destination': return travelData.destination.trim() !== ''
      case 'dates': return travelData.startDate && travelData.endDate
      case 'travelers': return travelData.travelType !== ''
      case 'budget': return travelData.budget > 0
      case 'interests': return travelData.interests.length > 0
      default: return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'destination':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Where would you like to go?
              </h2>
              <p className="text-gray-600">
                Choose your dream destination
              </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={cityInputRef}
                  type="text"
                  value={travelData.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => setShowCityDropdown(filteredCities.length > 0)}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                  placeholder="Enter destination..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-lg"
                  autoFocus
                />
              </div>

              {showCityDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => selectCity(city)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 'dates':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                When are you traveling?
              </h2>
              <p className="text-gray-600">
                Select your travel dates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={travelData.startDate}
                  onChange={(e) => setTravelData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={travelData.endDate}
                  onChange={(e) => setTravelData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={travelData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )

      case 'travelers':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Who's traveling?
              </h2>
              <p className="text-gray-600">
                Tell us about your travel group
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { id: 'solo', label: 'Solo', emoji: '🧳' },
                { id: 'couple', label: 'Couple', emoji: '💑' },
                { id: 'friends', label: 'Friends', emoji: '👥' },
                { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTravelData(prev => ({ ...prev, travelType: type.id as any }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    travelData.travelType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.emoji}</div>
                  <div className="font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What's your budget?
              </h2>
              <p className="text-gray-600">
                Total budget for the entire trip
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="flex space-x-2">
                <select
                  value={travelData.currency}
                  onChange={(e) => setTravelData(prev => ({ ...prev, currency: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  type="number"
                  value={travelData.budget}
                  onChange={(e) => setTravelData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="text-center text-lg font-semibold text-gray-700">
                {travelData.currency} {travelData.budget.toLocaleString()}
              </div>

              {/* Budget suggestions */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[
                  { label: 'Budget', amount: 500 },
                  { label: 'Moderate', amount: 1500 },
                  { label: 'Luxury', amount: 5000 },
                ].map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => setTravelData(prev => ({ ...prev, budget: suggestion.amount }))}
                    className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">{suggestion.label}</div>
                    <div className="text-gray-500">{travelData.currency} {suggestion.amount}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'interests':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What are you interested in?
              </h2>
              <p className="text-gray-600">
                Select activities and experiences you'd enjoy
              </p>
            </div>

            <InterestsSelection
              selectedInterests={travelData.interests}
              onInterestsChange={handleInterestsChange}
              freeFormText={travelData.preferences}
              onFreeFormChange={handlePreferencesChange}
            />
          </div>
        )

      case 'generating':
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Creating your perfect itinerary
              </h2>
              <p className="text-lg text-gray-600 animate-pulse">
                {currentLoadingMessage}
              </p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 space-y-1">
                <div>📍 Destination: {travelData.destination}</div>
                <div>📅 Duration: {(() => {
                  try {
                    const start = new Date(travelData.startDate)
                    const end = new Date(travelData.endDate)
                    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
                    return `${days} day${days > 1 ? 's' : ''}`
                  } catch {
                    return '3 days'
                  }
                })()}</div>
                <div>💰 Budget: {travelData.currency} {travelData.budget.toLocaleString()}</div>
                <div>🎯 Interests: {travelData.interests.join(', ')}</div>
              </div>
            </div>
          </div>
        )

      case 'results':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Perfect Itinerary
              </h2>
              <p className="text-gray-600">
                Here's your personalized travel plan for {travelData.destination}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setCustomizeMode(!customizeMode)}
                disabled={isCustomizing}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {customizeMode ? 'Cancel Customize' : 'Customize Itinerary'}
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloadingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={handleDownloadSimplePDF}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Quick PDF
              </button>
            </div>

            {/* Customization panel */}
            {customizeMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Customize Your Itinerary</h3>
                <div className="space-y-3">
                  <textarea
                    value={customizeText}
                    onChange={(e) => setCustomizeText(e.target.value)}
                    placeholder="Tell us how you'd like to modify your itinerary... 
For example:
• Add more museums to day 2
• Replace dinner on day 1 with street food
• Include more outdoor activities
• Change the hotel to something more luxurious
• Add shopping time in the afternoon"
                    className="w-full h-32 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    disabled={isCustomizing}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setCustomizeMode(false)
                        setCustomizeText('')
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={isCustomizing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCustomizeItinerary(customizeText)}
                      disabled={isCustomizing || !customizeText.trim()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCustomizing ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Customizing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Apply Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Customizing indicator */}
            {isCustomizing && (
              <div className="text-center space-y-4 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 mx-auto">
                    <div className="absolute inset-0 border-3 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                </div>
                <p className="text-lg text-blue-600 animate-pulse">
                  {currentLoadingMessage.replace('Creating', 'Customizing')}
                </p>
              </div>
            )}

            {/* Itinerary content */}
            {itinerary && (
              <div className="space-y-6">
                <ItineraryCard itinerary={itinerary} />
                <WhyYoullLoveThis 
                  itinerary={itinerary}
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        {currentStep !== 'generating' && currentStep !== 'results' && (
          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              {['destination', 'dates', 'travelers', 'budget', 'interests'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    ['destination', 'dates', 'travelers', 'budget', 'interests'].indexOf(currentStep) >= index
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep !== 'generating' && currentStep !== 'results' && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 'destination'}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={currentStep === 'interests' ? generateItinerary : handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {currentStep === 'interests' ? 'Generate Itinerary' : 'Next'}
            </button>
          </div>
        )}

        {/* Results navigation */}
        {currentStep === 'results' && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setCurrentStep('destination')
                setItinerary(null)
                setCustomizeMode(false)
                setCustomizeText('')
              }}
              className="px-6 py-3 text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Plan Another Trip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage 