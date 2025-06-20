import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

interface ItineraryRequest {
  sessionId: string;
  userInput: {
    destination: string;
    numberOfDays: number;
    travelDates: {
      start: string;
      end: string;
    };
    travelStyle: string;
    interests: string[];
    budget: string;
    additionalRequests?: string;
  };
}

interface CustomizeRequest {
  itinerary: any;
  customizationRequest: string;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

function generateItineraryPrompt(request: ItineraryRequest): string {
  const { userInput } = request;
  
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

CRITICAL: Return ONLY the JSON object. No markdown formatting, no explanations, no additional text.`;
}

function generateCustomizePrompt(request: CustomizeRequest): string {
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

CRITICAL: Return ONLY the complete updated JSON object. No markdown, no explanations, no additional text.`;
}

async function callAnthropic(prompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic');
    }
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
}

app.post('/api/itinerary/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const request: ItineraryRequest = req.body;
    
    if (!request.userInput || !request.userInput.destination) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request: missing required fields',
          code: 'INVALID_REQUEST'
        }
      });
      return;
    }

    const prompt = generateItineraryPrompt(request);
    const response = await callAnthropic(prompt);
    
    let itineraryData;
    try {
      itineraryData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse Anthropic response:', response);
      throw new Error('Invalid response format from AI service');
    }

    res.json({
      success: true,
      data: { itinerary: itineraryData }
    });
  } catch (error) {
    console.error('Generate itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate itinerary',
        code: 'GENERATION_ERROR'
      }
    });
  }
});

app.post('/api/itinerary/customize', async (req: Request, res: Response): Promise<void> => {
  try {
    const request: CustomizeRequest = req.body;
    
    if (!request.itinerary || !request.customizationRequest) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request: missing itinerary or customization request',
          code: 'INVALID_REQUEST'
        }
      });
      return;
    }

    const prompt = generateCustomizePrompt(request);
    const response = await callAnthropic(prompt);
    
    let itineraryData;
    try {
      itineraryData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse Anthropic response:', response);
      throw new Error('Invalid response format from AI service');
    }

    res.json({
      success: true,
      data: { itinerary: itineraryData }
    });
  } catch (error) {
    console.error('Customize itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to customize itinerary',
        code: 'CUSTOMIZATION_ERROR'
      }
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
  console.log(`🔑 Anthropic API key: ${process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing'}`);
});
