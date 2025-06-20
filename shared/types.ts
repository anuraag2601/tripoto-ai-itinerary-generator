// Shared types for Tripoto AI Itinerary Generator

// User Input Types
export interface UserInput {
  destination: string;
  numberOfDays: number;
  travelDates: {
    startDate: string;
    endDate: string;
  };
  travelStyle: 'solo' | 'couple' | 'family' | 'friends';
  interests: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  additionalRequests?: string;
}

// Travel Interests/Personas
export const TRAVEL_INTERESTS = [
  'nature',
  'culture',
  'food',
  'adventure',
  'relaxation',
  'history',
  'nightlife',
  'shopping',
  'music',
  'art',
  'photography',
  'wildlife',
  'beaches',
  'mountains',
  'cities',
  'local-experiences',
  'luxury',
  'budget-friendly'
] as const;

export type TravelInterest = typeof TRAVEL_INTERESTS[number];

// Lead Capture
export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
}

// Media Types
export interface MediaContent {
  type: 'image' | 'video' | 'map' | 'social';
  url: string;
  caption?: string;
  credit?: string;
  thumbnail?: string;
}

// Place Information
export interface Place {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  googleMapsLink: string;
  videoLinks: string[];
  socialMediaLinks: string[];
  tags: string[];
  rating?: number;
  priceLevel?: number;
}

// Activity
export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  place: Place;
  whyYoullLoveThis: string;
  media: MediaContent[];
  estimatedCost?: {
    amount: number;
    currency: string;
  };
}

// Day Plan
export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: {
    breakfast?: Activity;
    lunch?: Activity;
    dinner?: Activity;
  };
  transportation: {
    method: string;
    details: string;
    cost?: number;
  };
  totalEstimatedCost?: {
    amount: number;
    currency: string;
  };
}

// Recommendations
export interface FlightRecommendation {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    amount: number;
    currency: string;
  };
  stops: number;
  bookingLink: string;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  rating: number;
  location: string;
  amenities: string[];
  pricePerNight: {
    amount: number;
    currency: string;
  };
  images: string[];
  bookingLink: string;
  whyRecommended: string;
}

export interface Recommendations {
  flights: {
    outbound: FlightRecommendation[];
    return: FlightRecommendation[];
  };
  hotels: HotelRecommendation[];
  activities: Activity[];
}

// Main Itinerary
export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: number;
  summary: string;
  days: DayPlan[];
  recommendations: Recommendations;
  totalEstimatedCost: {
    amount: number;
    currency: string;
    breakdown: {
      flights: number;
      accommodation: number;
      activities: number;
      meals: number;
      transportation: number;
    };
  };
  media: MediaContent[];
  shareableLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat Messages
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isTyping?: boolean;
  metadata?: {
    itineraryPreview?: boolean;
    fullItinerary?: boolean;
    leadCaptureRequired?: boolean;
  };
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ItineraryGenerationRequest {
  userInput: UserInput;
  chatHistory: ChatMessage[];
  sessionId: string;
}

export interface ItineraryGenerationResponse {
  itinerary: Itinerary;
  requiresLeadCapture: boolean;
  previewOnly: boolean;
}

export interface LeadCaptureRequest {
  leadInfo: LeadInfo;
  itineraryId: string;
  sessionId: string;
}

export interface ShareLinkRequest {
  itineraryId: string;
  leadInfo?: LeadInfo;
}

export interface ShareLinkResponse {
  shareableLink: string;
  expiresAt: string;
}

// Widget Configuration
export interface WidgetConfig {
  apiUrl: string;
  partnerId?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
  features?: {
    enableLeadCapture: boolean;
    enablePdfDownload: boolean;
    enableSharing: boolean;
    enableBooking: boolean;
  };
  customization?: {
    logo?: string;
    headerText?: string;
    placeholderText?: string;
    interests?: TravelInterest[];
  };
}

// Session Management
export interface Session {
  id: string;
  userId?: string;
  chatHistory: ChatMessage[];
  userInput?: UserInput;
  currentItinerary?: Itinerary;
  leadInfo?: LeadInfo;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'completed' | 'abandoned';
}

// Travel Personas
export interface TravelPersona {
  id: string;
  name: string;
  description: string;
  interests: TravelInterest[];
  characteristics: string[];
  preferences: {
    activityLevel: 'low' | 'medium' | 'high';
    groupSize: 'solo' | 'couple' | 'small-group' | 'large-group';
    budgetRange: 'budget' | 'mid-range' | 'luxury';
    pace: 'relaxed' | 'moderate' | 'packed';
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Database Models (for backend)
export interface ItineraryDocument {
  _id: string;
  itinerary: Itinerary;
  userInput: UserInput;
  leadInfo?: LeadInfo;
  sessionId: string;
  shareableId?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface LeadDocument {
  _id: string;
  leadInfo: LeadInfo;
  itineraryId: string;
  sessionId: string;
  source: 'widget' | 'direct' | 'partner';
  partnerId?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

// Agent Types
export interface AgentResponse {
  success: boolean;
  data: any;
  reasoning?: string;
  confidence?: number;
  metadata?: any;
}

export interface UserProfileAgentInput {
  rawInput: string;
  structuredInput?: Partial<UserInput>;
  chatHistory: ChatMessage[];
}

export interface ContentRetrievalAgentInput {
  query: string;
  location: string;
  interests: TravelInterest[];
  persona: TravelPersona;
  maxResults?: number;
}

export interface ItineraryGenerationAgentInput {
  userProfile: UserInput;
  retrievedContent: any[];
  persona: TravelPersona;
  modificationRequest?: string;
}

export interface BookingAgentInput {
  destination: string;
  travelDates: {
    startDate: string;
    endDate: string;
  };
  travelers: number;
  budget?: {
    min: number;
    max: number;
  };
  preferences?: string[];
} 