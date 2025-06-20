import type { 
  ApiResponse, 
  PaginatedResponse, 
  ChatSession, 
  ChatMessage, 
  Itinerary, 
  Lead, 
  SharedItinerary,
  AnalyticsEvent 
} from '../types'

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message)
    this.name = 'NetworkError'
  }
}

// Export types for backward compatibility
export type { 
  ApiResponse, 
  PaginatedResponse, 
  ChatSession, 
  ChatMessage, 
  Itinerary, 
  Lead, 
  SharedItinerary,
  AnalyticsEvent 
} 