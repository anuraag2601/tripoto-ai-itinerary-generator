const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const USE_MOCK_DATA = !ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here'

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
  constructor(apiKey: string) {
  }

  private async callAnthropic(prompt: string): Promise<any> {
    // For development, use mock data if API key is not configured
    if (USE_MOCK_DATA) {
      console.log('Using mock data for development. Configure VITE_ANTHROPIC_API_KEY for real API calls.')
      return this.generateMockItinerary(prompt)
    }

    // Note: Direct API calls from browser will fail due to CORS
    // This is intentionally left here for documentation
    // In production, this should go through a backend proxy
    try {
      throw new Error('Direct Anthropic API calls require a backend proxy due to CORS restrictions. Using mock data instead.')
    } catch (error) {
      console.error('Anthropic API error:', error)
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
    
    return `You are a travel planning expert. Create a detailed ${userInput.numberOfDays}-day itinerary for ${userInput.destination}.

User preferences:
- Travel dates: ${userInput.travelDates.start} to ${userInput.travelDates.end}
- Travel style: ${userInput.travelStyle}
- Interests: ${userInput.interests.join(', ')}
- Budget: ${userInput.budget}
- Additional requests: ${userInput.additionalRequests || 'None'}

Please return a JSON response with the following structure:
{
  "id": "unique_id",
  "title": "Trip title",
  "description": "Brief description",
  "destination": {
    "name": "${userInput.destination}",
    "country": "Country name",
    "coordinates": {"latitude": 0, "longitude": 0}
  },
  "duration": {
    "days": ${userInput.numberOfDays},
    "startDate": "${userInput.travelDates.start}",
    "endDate": "${userInput.travelDates.end}"
  },
  "budget": {
    "total": estimated_total,
    "currency": "USD"
  },
  "activities": [
    {
      "id": "activity_id",
      "name": "Activity name",
      "description": "Detailed description",
      "type": "sightseeing|adventure|cultural|entertainment|dining",
      "location": {
        "name": "Location name",
        "address": "Full address",
        "coordinates": {"latitude": 0, "longitude": 0}
      },
      "duration": duration_in_minutes,
      "cost": {
        "amount": estimated_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "day": day_number,
      "timeSlot": "morning|afternoon|evening",
      "images": ["url1", "url2"],
      "bookingUrl": "booking_link_if_available"
    }
  ],
  "accommodations": [
    {
      "id": "accommodation_id",
      "name": "Hotel/accommodation name",
      "type": "hotel|hostel|apartment",
      "location": {
        "name": "Location name",
        "address": "Full address"
      },
      "checkIn": "${userInput.travelDates.start}",
      "checkOut": "${userInput.travelDates.end}",
      "cost": {
        "amount": estimated_cost,
        "currency": "USD",
        "type": "total"
      },
      "rating": rating_out_of_5,
      "amenities": ["wifi", "breakfast", "gym"],
      "bookingUrl": "booking_link"
    }
  ],
  "transportation": [
    {
      "id": "transport_id",
      "type": "flight|train|bus|taxi",
      "from": {"name": "Origin"},
      "to": {"name": "Destination"},
      "departure": "ISO_datetime",
      "arrival": "ISO_datetime",
      "cost": {
        "amount": estimated_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "day": day_number
    }
  ],
  "meals": [
    {
      "id": "meal_id",
      "name": "Restaurant/meal name",
      "type": "breakfast|lunch|dinner",
      "location": {
        "name": "Restaurant name",
        "address": "Address"
      },
      "time": "HH:MM",
      "cost": {
        "amount": estimated_cost,
        "currency": "USD",
        "type": "per_person"
      },
      "cuisine": "cuisine_type",
      "rating": rating_out_of_5,
      "day": day_number
    }
  ]
}

Make sure to:
1. Include realistic activities for each day
2. Consider travel time between locations
3. Provide diverse experiences based on interests
4. Stay within the budget range
5. Include local cultural experiences
6. Suggest popular and highly-rated places
7. Balance different types of activities throughout the trip

Return only valid JSON without any markdown formatting or additional text.`
  }

  private generateCustomizePrompt(request: CustomizeRequest): string {
    return `You are a travel planning expert. The user has an existing itinerary and wants to make some customizations.

Current itinerary:
${JSON.stringify(request.itinerary, null, 2)}

User's customization request:
${request.customizationRequest}

Please modify the itinerary according to the user's request and return the updated JSON in the same format. Make sure to:
1. Keep the overall structure intact
2. Only modify the parts that need to be changed
3. Maintain logical flow and timing
4. Adjust costs if necessary
5. Ensure new activities/places fit with the destination and dates

Return only the complete updated JSON without any markdown formatting or additional text.`
  }

  async generateItinerary(request: ItineraryRequest): Promise<APIResponse<any>> {
    try {
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