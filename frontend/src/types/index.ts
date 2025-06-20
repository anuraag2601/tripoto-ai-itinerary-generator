// Base types
export type ID = string
export type Timestamp = string // ISO 8601 format

// Chat types first (to define MessageType before use)
export type MessageType = 'user' | 'assistant' | 'system' | 'error'
export type ChatStatus = 'active' | 'completed' | 'archived' | 'error'
export type ActionType = 'generate_itinerary' | 'save_lead' | 'share' | 'export_pdf' | 'modify_preferences'
export type AttachmentType = 'image' | 'document' | 'link'

export interface MessageAction {
  type: ActionType
  label: string
  data?: any
}

export interface Attachment {
  id: ID
  type: AttachmentType
  url: string
  name: string
  size?: number
}

export interface MessageMetadata {
  suggestions?: string[]
  actions?: MessageAction[]
  attachments?: Attachment[]
  confidence?: number
  processingTime?: number
}

export interface ChatMessage {
  id: ID
  sessionId: ID
  type: MessageType
  content: string
  metadata?: MessageMetadata
  timestamp: Timestamp
  isStreaming?: boolean
}

export interface ChatMetadata {
  userAgent?: string
  ipAddress?: string
  referrer?: string
  sessionDuration?: number
  messageCount?: number
  lastActivity?: Timestamp
}

export interface ChatSession {
  id: ID
  userId?: ID
  messages: ChatMessage[]
  status: ChatStatus
  metadata?: ChatMetadata
  createdAt: Timestamp
  updatedAt: Timestamp
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// User types
export interface User {
  id: ID
  email?: string
  name?: string
  preferences?: UserPreferences
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserPreferences {
  budget?: BudgetRange
  travelStyle?: TravelStyle
  interests?: string[]
  dietaryRestrictions?: string[]
  accessibility?: AccessibilityNeeds
  language?: string
  currency?: string
  timezone?: string
}

export type BudgetRange = 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury'
export type TravelStyle = 'adventure' | 'relaxation' | 'cultural' | 'business' | 'family' | 'romantic' | 'solo'

export interface AccessibilityNeeds {
  mobility?: boolean
  visual?: boolean
  hearing?: boolean
  cognitive?: boolean
  other?: string
}

// Itinerary types
export interface Itinerary {
  id: ID
  sessionId?: ID
  title: string
  description?: string
  destination: Destination
  duration: Duration
  budget: Budget
  activities: Activity[]
  accommodations: Accommodation[]
  transportation: Transportation[]
  meals: Meal[]
  status: ItineraryStatus
  metadata?: ItineraryMetadata
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type ItineraryStatus = 'draft' | 'generated' | 'modified' | 'finalized' | 'shared'

export interface Destination {
  name: string
  country: string
  region?: string
  coordinates?: Coordinates
  timezone?: string
  currency?: string
  language?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Duration {
  days: number
  startDate?: string // YYYY-MM-DD format
  endDate?: string // YYYY-MM-DD format
}

export interface Budget {
  total?: number
  currency: string
  breakdown?: BudgetBreakdown
}

export interface BudgetBreakdown {
  accommodation?: number
  transportation?: number
  activities?: number
  meals?: number
  shopping?: number
  miscellaneous?: number
}

export interface Activity {
  id: ID
  name: string
  description?: string
  type: ActivityType
  location: Location
  duration?: number // in minutes
  cost?: Cost
  rating?: number
  images?: string[]
  bookingUrl?: string
  day: number
  timeSlot?: TimeSlot
}

export type ActivityType = 
  | 'sightseeing' 
  | 'adventure' 
  | 'cultural' 
  | 'entertainment' 
  | 'shopping' 
  | 'relaxation' 
  | 'dining' 
  | 'transportation'

export interface Location {
  name: string
  address?: string
  coordinates?: Coordinates
  type?: LocationType
}

export type LocationType = 'attraction' | 'restaurant' | 'hotel' | 'airport' | 'station' | 'landmark'

export interface Cost {
  amount: number
  currency: string
  type: CostType
}

export type CostType = 'per_person' | 'per_group' | 'total'

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night'

export interface Accommodation {
  id: ID
  name: string
  type: AccommodationType
  location: Location
  checkIn: string // YYYY-MM-DD format
  checkOut: string // YYYY-MM-DD format
  cost?: Cost
  rating?: number
  amenities?: string[]
  images?: string[]
  bookingUrl?: string
}

export type AccommodationType = 'hotel' | 'hostel' | 'apartment' | 'resort' | 'guesthouse' | 'camping'

export interface Transportation {
  id: ID
  type: TransportationType
  from: Location
  to: Location
  departure: string // ISO 8601 format
  arrival: string // ISO 8601 format
  cost?: Cost
  duration?: number // in minutes
  provider?: string
  bookingUrl?: string
  day: number
}

export type TransportationType = 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'walking' | 'cycling'

export interface Meal {
  id: ID
  name: string
  type: MealType
  location: Location
  time: string // HH:MM format
  cost?: Cost
  cuisine?: string
  rating?: number
  bookingUrl?: string
  day: number
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drinks'

export interface ItineraryMetadata {
  generatedBy?: string
  version?: number
  tags?: string[]
  difficulty?: DifficultyLevel
  season?: Season
  groupSize?: number
  accessibility?: AccessibilityLevel
}

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type AccessibilityLevel = 'full' | 'partial' | 'limited' | 'none'

// Lead types
export interface Lead {
  id: ID
  sessionId?: ID
  email: string
  name?: string
  phone?: string
  destination?: string
  travelDates?: {
    start?: string
    end?: string
  }
  budget?: number
  groupSize?: number
  interests?: string[]
  status: LeadStatus
  source?: LeadSource
  notes?: string
  followUpDate?: string
  assignedTo?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type LeadSource = 'chat' | 'form' | 'referral' | 'social' | 'search' | 'direct'

// Sharing types
export interface SharedItinerary {
  id: ID
  itineraryId: ID
  shareId: string
  title: string
  description?: string
  isPublic: boolean
  password?: string
  expiresAt?: Timestamp
  viewCount: number
  settings: ShareSettings
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ShareSettings {
  allowComments?: boolean
  allowDownload?: boolean
  allowCopy?: boolean
  showContact?: boolean
  customMessage?: string
}

// Analytics types
export interface AnalyticsEvent {
  type: EventType
  category: EventCategory
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
  timestamp?: Timestamp
  sessionId?: ID
  userId?: ID
}

export type EventType = 
  | 'page_view' 
  | 'click' 
  | 'form_submit' 
  | 'chat_message' 
  | 'itinerary_generated' 
  | 'lead_captured' 
  | 'share_created' 
  | 'pdf_downloaded' 
  | 'error'

export type EventCategory = 
  | 'navigation' 
  | 'engagement' 
  | 'conversion' 
  | 'user_interaction' 
  | 'system' 
  | 'error'

// UI Component types
export interface ComponentProps {
  className?: string
  children?: any
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends ComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Form types
export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: Option[]
  validation?: ValidationRule[]
}

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'textarea' 
  | 'date' 
  | 'range'

export interface Option {
  value: string
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: ValidationType
  value?: any
  message: string
}

export type ValidationType = 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'

export type FormValidation<T> = {
  [K in keyof T]?: (value: T[K], values: T) => string | undefined | Promise<string | undefined>
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Timestamp
  stack?: string
}

export type ErrorCode = 
  | 'NETWORK_ERROR' 
  | 'VALIDATION_ERROR' 
  | 'AUTHENTICATION_ERROR' 
  | 'AUTHORIZATION_ERROR' 
  | 'NOT_FOUND' 
  | 'SERVER_ERROR' 
  | 'RATE_LIMIT_EXCEEDED'

// Configuration types
export interface AppConfig {
  apiUrl: string
  environment: Environment
  features: FeatureFlags
  analytics: AnalyticsConfig
  maps: MapsConfig
}

export type Environment = 'development' | 'staging' | 'production'

export interface FeatureFlags {
  enableAnalytics: boolean
  enableMapIntegration: boolean
  enablePdfDownload: boolean
  enableSharing: boolean
  enableVoiceInput: boolean
  enableOfflineMode: boolean
}

export interface AnalyticsConfig {
  enabled: boolean
  trackingId?: string
  debug: boolean
}

export interface MapsConfig {
  enabled: boolean
  apiKey?: string
  defaultZoom: number
  defaultCenter: Coordinates
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
} 