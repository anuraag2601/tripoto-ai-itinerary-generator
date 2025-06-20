const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
const USE_BACKEND_PROXY = import.meta.env.VITE_USE_BACKEND_PROXY === 'true'
const USE_MOCK_DATA = !USE_BACKEND_PROXY && (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here')

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  message?: string
}

export interface ItineraryRequest {
  sessionId: string
  userInput: {
    destination: string
    numberOfDays: number
    travelDates: {
      start: string
      end: string
    }
    travelStyle: string
    interests: string[]
    budget: string
    additionalRequests?: string
  }
}

export interface CustomizeRequest {
  sessionId: string
  itinerary: any
  customizationRequest: string
}

class AnthropicAPIClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async callAnthropic(prompt: string): Promise<any> {
    // For development, use mock data if API key is not configured
    if (USE_MOCK_DATA) {
      console.log('Using mock data for development. Configure VITE_ANTHROPIC_API_KEY for real API calls.')
      return this.generateMockItinerary(prompt)
    }

    try {
      const { Anthropic } = await import('@anthropic-ai/sdk')
      
      const anthropic = new Anthropic({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true
      } as any)

      console.log('Making request to Anthropic Claude API...')
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Fast and efficient model
        max_tokens: 4000,
        temperature: 0.7,
        system: "You are a professional travel planning expert. You create detailed, realistic travel itineraries based on user preferences. Always respond with valid JSON only, no markdown formatting or additional text.",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      // Extract the text content from the response
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic API')
      }

      console.log('Successfully received response from Anthropic Claude API')
      return content.text

    } catch (error) {
      console.error('Anthropic API error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
          console.log('CORS error detected. Consider using a backend proxy for production.')
        } else if (error.message.includes('401') || error.message.includes('authentication')) {
          console.log('Authentication error. Please check your API key.')
        }
      }
      
      console.log('Falling back to mock data...')
      return this.generateMockItinerary(prompt)
    }
  }

  private generateMockItinerary(prompt: string): any {
    // Extract destination from prompt for personalized mock data
    const destinationMatch = prompt.match(/for (.+?)\./);
    const destination = destinationMatch ? destinationMatch[1] : 'Your Destination';
    const daysMatch = prompt.match(/(\d+)-day/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;

    return JSON.stringify({
      id: `mock_${Date.now()}`,
      title: `Amazing ${days}-Day Trip to ${destination}`,
      description: `A carefully curated ${days}-day itinerary for ${destination} featuring the best attractions, local cuisine, and cultural experiences.`,
      destination: {
        name: destination,
        country: "Demo Country",
        coordinates: { latitude: 40.7128, longitude: -74.0060 }
      },
      duration: {
        days: days,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      budget: {
        total: days * 150,
        currency: "USD"
      },
      activities: Array.from({ length: days }, (_, dayIndex) => [
        {
          id: `activity_${dayIndex}_1`,
          name: `Morning Adventure in ${destination}`,
          description: `Start your day ${dayIndex + 1} with an exciting exploration of ${destination}'s most famous landmarks and hidden gems.`,
          type: "sightseeing",
          location: {
            name: `${destination} City Center`,
            address: `Main Street, ${destination}`,
            coordinates: { latitude: 40.7128 + dayIndex * 0.01, longitude: -74.0060 + dayIndex * 0.01 }
          },
          duration: 180,
          cost: { amount: 25, currency: "USD", type: "per_person" },
          day: dayIndex + 1,
          timeSlot: "morning",
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
          bookingUrl: "https://example.com/book"
        },
        {
          id: `activity_${dayIndex}_2`,
          name: `Local Cuisine Experience`,
          description: `Discover authentic local flavors and traditional dishes that make ${destination} special.`,
          type: "dining",
          location: {
            name: `Traditional Restaurant`,
            address: `Food Street, ${destination}`,
            coordinates: { latitude: 40.7128 + dayIndex * 0.01, longitude: -74.0060 + dayIndex * 0.01 }
          },
          duration: 120,
          cost: { amount: 40, currency: "USD", type: "per_person" },
          day: dayIndex + 1,
          timeSlot: "afternoon",
          images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836"],
          bookingUrl: "https://example.com/book"
        }
      ]).flat(),
      accommodations: [{
        id: "accommodation_1",
        name: `Cozy ${destination} Hotel`,
        type: "hotel",
        location: {
          name: `${destination} Downtown`,
          address: `Hotel Street, ${destination}`
        },
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cost: { amount: days * 80, currency: "USD", type: "total" },
        rating: 4.5,
        amenities: ["wifi", "breakfast", "gym", "spa"],
        bookingUrl: "https://example.com/book-hotel"
      }],
      transportation: [{
        id: "transport_1",
        type: "flight",
        from: { name: "Your City" },
        to: { name: destination },
        departure: new Date().toISOString(),
        arrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        cost: { amount: 300, currency: "USD", type: "per_person" },
        day: 1
      }],
      meals: Array.from({ length: days }, (_, dayIndex) => [
        {
          id: `meal_${dayIndex}_breakfast`,
          name: `Local Breakfast Spot`,
          type: "breakfast",
          location: {
            name: `Cafe ${destination}`,
            address: `Breakfast Street, ${destination}`
          },
          time: "08:00",
          cost: { amount: 15, currency: "USD", type: "per_person" },
          cuisine: "local",
          rating: 4.2,
          day: dayIndex + 1
        },
        {
          id: `meal_${dayIndex}_lunch`,
          name: `Popular ${destination} Restaurant`,
          type: "lunch",
          location: {
            name: `Best Local Eatery`,
            address: `Food Square, ${destination}`
          },
          time: "12:30",
          cost: { amount: 25, currency: "USD", type: "per_person" },
          cuisine: "fusion",
          rating: 4.6,
          day: dayIndex + 1
        }
      ]).flat()
    });
  }

  private generateItineraryPrompt(request: ItineraryRequest): string {
    const { userInput } = request
    
    return `Create a detailed ${userInput.numberOfDays}-day travel itinerary for ${userInput.destination}.

User Requirements:
- Destination: ${userInput.destination}
- Duration: ${userInput.numberOfDays} days
- Travel dates: ${userInput.travelDates.start} to ${userInput.travelDates.end}
- Travel style: ${userInput.travelStyle}
- Interests: ${userInput.interests.join(', ')}
- Budget level: ${userInput.budget}
- Additional requests: ${userInput.additionalRequests || 'None'}

CRITICAL: Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "id": "itinerary_${Date.now()}",
  "title": "Engaging trip title for ${userInput.destination}",
  "description": "Compelling 2-3 sentence description highlighting unique experiences",
  "destination": {
    "name": "${userInput.destination}",
    "country": "Actual country name",
    "region": "Region/state if applicable",
    "coordinates": {"latitude": actual_latitude, "longitude": actual_longitude},
    "timezone": "Timezone (e.g., America/New_York)",
    "currency": "Local currency code",
    "language": "Primary language"
  },
  "duration": {
    "days": ${userInput.numberOfDays},
    "startDate": "${userInput.travelDates.start}",
    "endDate": "${userInput.travelDates.end}"
  },
  "budget": {
    "total": realistic_total_estimate,
    "currency": "USD",
    "breakdown": {
      "accommodation": accommodation_cost,
      "transportation": transport_cost,
      "activities": activities_cost,
      "meals": meals_cost,
      "shopping": shopping_estimate,
      "miscellaneous": misc_cost
    }
  },
  "activities": [
    {
      "id": "activity_day_sequence",
      "name": "Specific activity name",
      "description": "Detailed description explaining why this is special and what to expect",
      "type": "sightseeing|adventure|cultural|entertainment|dining|shopping|relaxation",
      "location": {
        "name": "Exact location name",
        "address": "Complete address with city",
        "coordinates": {"latitude": precise_lat, "longitude": precise_lng},
        "type": "attraction|restaurant|hotel|landmark"
      },
      "duration": duration_in_minutes,
      "cost": {
        "amount": realistic_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "rating": 4.0_to_5.0,
      "day": day_number_1_to_${userInput.numberOfDays},
      "timeSlot": "morning|afternoon|evening|night",
      "images": ["https://images.unsplash.com/relevant-image"],
      "bookingUrl": "https://example.com/book-if-available"
    }
  ],
  "accommodations": [
    {
      "id": "accommodation_1",
      "name": "Specific hotel/accommodation name",
      "type": "hotel|hostel|apartment|resort|guesthouse",
      "location": {
        "name": "Hotel location area",
        "address": "Complete hotel address",
        "coordinates": {"latitude": hotel_lat, "longitude": hotel_lng},
        "type": "hotel"
      },
      "checkIn": "${userInput.travelDates.start}",
      "checkOut": "${userInput.travelDates.end}",
      "cost": {
        "amount": total_accommodation_cost,
        "currency": "USD",
        "type": "total"
      },
      "rating": 4.0_to_5.0,
      "amenities": ["Free WiFi", "Breakfast", "Gym", "Pool", "Spa", "Restaurant"],
      "bookingUrl": "https://booking-site.com/hotel-link"
    }
  ],
  "transportation": [
    {
      "id": "transport_arrival",
      "type": "flight|train|bus|car",
      "from": {"name": "Origin city/airport", "address": "Origin address", "type": "airport|station"},
      "to": {"name": "${userInput.destination} airport/station", "address": "Destination address", "type": "airport|station"},
      "departure": "${userInput.travelDates.start}T10:00:00Z",
      "arrival": "${userInput.travelDates.start}T14:00:00Z",
      "cost": {
        "amount": realistic_transport_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "duration": duration_in_minutes,
      "provider": "Airline/transport company",
      "day": 0
    }
  ],
  "meals": [
    {
      "id": "meal_day_mealtype",
      "name": "Specific restaurant name",
      "type": "breakfast|lunch|dinner|snack",
      "location": {
        "name": "Restaurant name",
        "address": "Restaurant address",
        "coordinates": {"latitude": restaurant_lat, "longitude": restaurant_lng},
        "type": "restaurant"
      },
      "time": "HH:MM",
      "cost": {
        "amount": realistic_meal_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "cuisine": "cuisine_type",
      "rating": 4.0_to_5.0,
      "day": day_number,
      "bookingUrl": "restaurant-booking-link-if-available"
    }
  ],
  "status": "generated",
  "metadata": {
    "generatedBy": "claude-3-haiku",
    "version": 1,
    "tags": ["${userInput.interests.join('", "')}"],
    "difficulty": "easy|moderate|challenging",
    "season": "spring|summer|autumn|winter",
    "groupSize": estimated_group_size,
    "accessibility": "full|partial|limited"
  },
  "createdAt": "${new Date().toISOString()}",
  "updatedAt": "${new Date().toISOString()}"
}

REQUIREMENTS:
1. Create ${userInput.numberOfDays * 3-4} activities total (3-4 per day) with realistic timing
2. Include specific, real places with accurate coordinates and addresses
3. Balance activities based on interests: ${userInput.interests.join(', ')}
4. Respect ${userInput.budget} budget level with realistic pricing
5. Consider travel time between locations (group nearby activities)
6. Include breakfast, lunch, dinner recommendations for each day
7. Suggest 1-2 accommodation options that fit the budget and location
8. Add transportation details (flights, local transport)
9. Use real restaurant names, attractions, and hotels when possible
10. Ensure all coordinates are accurate for the destination
11. Make descriptions engaging and informative (2-3 sentences each)
12. Include practical details like duration, costs, and booking info

CRITICAL: Return ONLY the JSON object. No markdown formatting, no explanations, no additional text.`
  }

  private generateCustomizePrompt(request: CustomizeRequest): string {
    return `Modify the existing travel itinerary based on the user's request.

CURRENT ITINERARY:
${JSON.stringify(request.itinerary, null, 2)}

USER'S MODIFICATION REQUEST:
${request.customizationRequest}

INSTRUCTIONS:
1. Keep the same JSON structure and format
2. Only modify the specific parts requested by the user
3. Maintain logical flow, timing, and geographical proximity
4. Update costs and budget breakdown if activities change
5. Ensure new suggestions fit the destination, dates, and original preferences
6. Keep the same destination, duration, and travel dates unless specifically requested to change
7. Update the "updatedAt" timestamp to current time
8. Increment the version number in metadata

CRITICAL: Return ONLY the complete updated JSON object. No markdown, no explanations, no additional text.`
  }

  async generateItinerary(request: ItineraryRequest): Promise<APIResponse<any>> {
    try {
      if (USE_BACKEND_PROXY) {
        console.log('🔄 Using backend proxy for itinerary generation')
        return await this.callBackendProxy('/api/itinerary/generate', request)
      }

      const prompt = this.generateItineraryPrompt(request)
      const response = await this.callAnthropic(prompt)
      
      // Parse the JSON response
      let itineraryData
      try {
        itineraryData = JSON.parse(response)
      } catch (parseError) {
        console.error('Failed to parse Anthropic response:', response)
        throw new Error('Invalid response format from AI service')
      }

      return {
        success: true,
        data: { itinerary: itineraryData }
      }
    } catch (error) {
      console.error('Generate itinerary error:', error)
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to generate itinerary',
          code: 'GENERATION_ERROR'
        }
      }
    }
  }

  async customizeItinerary(request: CustomizeRequest): Promise<APIResponse<any>> {
    try {
      if (USE_BACKEND_PROXY) {
        console.log('🔄 Using backend proxy for itinerary customization')
        return await this.callBackendProxy('/api/itinerary/customize', { itinerary: request.itinerary, customizationRequest: request.customizationRequest })
      }

      const prompt = this.generateCustomizePrompt(request)
      const response = await this.callAnthropic(prompt)
      
      // Parse the JSON response
      let itineraryData
      try {
        itineraryData = JSON.parse(response)
      } catch (parseError) {
        console.error('Failed to parse Anthropic response:', response)
        throw new Error('Invalid response format from AI service')
      }

      return {
        success: true,
        data: { itinerary: itineraryData }
      }
    } catch (error) {
      console.error('Customize itinerary error:', error)
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to customize itinerary',
          code: 'CUSTOMIZATION_ERROR'
        }
      }
    }
  }

  private async callBackendProxy(endpoint: string, data: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Backend proxy error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Backend proxy returned error')
      }

      return {
        success: true,
        data: result.data
      }
    } catch (error) {
      console.error('Backend proxy call failed:', error)
      throw error
    }
  }
}

// Create singleton instance
const anthropicClient = new AnthropicAPIClient(ANTHROPIC_API_KEY || '')

// Simplified API
export const api = {
  itinerary: {
    generate: (params: ItineraryRequest) => anthropicClient.generateItinerary(params),
    customize: (params: CustomizeRequest) => anthropicClient.customizeItinerary(params)
  }
}

// Utility functions
export const handleAPIError = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.error?.message) {
    return error.error.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export const isAPIError = (response: any): response is { success: false; error: any } => {
  return response && response.success === false
}

export const isAPISuccess = <T>(response: APIResponse<T>): response is { success: true; data: T } => {
  return response && response.success === true && response.data !== undefined
}          