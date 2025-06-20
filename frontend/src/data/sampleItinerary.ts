import type { Itinerary } from '@/types'

export const sampleItinerary: Itinerary = {
  id: 'sample-tokyo-itinerary',
  title: 'Tokyo Adventure: Culture & Modern Marvels',
  description: 'A perfect blend of traditional Japanese culture and cutting-edge modernity. Experience ancient temples, vibrant neighborhoods, world-class cuisine, and unforgettable adventures in Japan\'s capital city.',
  destination: {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    coordinates: {
      latitude: 35.6762,
      longitude: 139.6503
    },
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
    language: 'Japanese'
  },
  duration: {
    days: 5,
    startDate: '2024-06-15',
    endDate: '2024-06-19'
  },
  budget: {
    total: 1500,
    currency: 'USD',
    breakdown: {
      accommodation: 500,
      transportation: 200,
      activities: 400,
      meals: 300,
      shopping: 100
    }
  },
  activities: [
    // Day 1
    {
      id: 'activity-1',
      name: 'Senso-ji Temple & Asakusa District',
      description: 'Start your Tokyo journey at the city\'s oldest temple, founded in 628 AD. Explore the traditional Asakusa district with its traditional shops, street food, and cultural experiences.',
      type: 'cultural',
      location: {
        name: 'Senso-ji Temple',
        address: '2-3-1 Asakusa, Taito City, Tokyo',
        coordinates: { latitude: 35.7148, longitude: 139.7967 },
        type: 'attraction'
      },
      duration: 180,
      cost: { amount: 0, currency: 'USD', type: 'per_person' },
      rating: 4.5,
      day: 1,
      timeSlot: 'morning',
      bookingUrl: 'https://www.senso-ji.jp/'
    },
    {
      id: 'activity-2',
      name: 'Traditional Sushi Lunch at Daiwa Sushi',
      description: 'Experience authentic Edo-style sushi at one of Tokyo\'s most famous sushi restaurants, located in the historic Tsukiji area.',
      type: 'dining',
      location: {
        name: 'Daiwa Sushi',
        address: 'Tsukiji Fish Market, Chuo City, Tokyo',
        coordinates: { latitude: 35.6654, longitude: 139.7706 },
        type: 'restaurant'
      },
      duration: 90,
      cost: { amount: 35, currency: 'USD', type: 'per_person' },
      rating: 4.8,
      day: 1,
      timeSlot: 'afternoon'
    },
    {
      id: 'activity-3',
      name: 'Tokyo Skytree & Sumida River Cruise',
      description: 'Ascend Tokyo\'s tallest structure for breathtaking panoramic views, then enjoy a scenic cruise along the historic Sumida River.',
      type: 'sightseeing',
      location: {
        name: 'Tokyo Skytree',
        address: '1-1-2 Oshiage, Sumida City, Tokyo',
        coordinates: { latitude: 35.7101, longitude: 139.8107 },
        type: 'attraction'
      },
      duration: 240,
      cost: { amount: 45, currency: 'USD', type: 'per_person' },
      rating: 4.6,
      day: 1,
      timeSlot: 'evening',
      bookingUrl: 'https://www.tokyo-skytree.jp/'
    },

    // Day 2
    {
      id: 'activity-4',
      name: 'Shibuya Crossing & Hachiko Statue',
      description: 'Experience the world\'s busiest pedestrian crossing and meet the famous loyal dog Hachiko. Perfect for photos and people-watching.',
      type: 'sightseeing',
      location: {
        name: 'Shibuya Crossing',
        address: 'Shibuya City, Tokyo',
        coordinates: { latitude: 35.6598, longitude: 139.7006 },
        type: 'landmark'
      },
      duration: 60,
      cost: { amount: 0, currency: 'USD', type: 'per_person' },
      rating: 4.4,
      day: 2,
      timeSlot: 'morning'
    },
    {
      id: 'activity-5',
      name: 'Harajuku & Takeshita Street Shopping',
      description: 'Dive into Tokyo\'s youth culture and fashion scene. Browse unique boutiques, try colorful street food, and witness amazing street fashion.',
      type: 'shopping',
      location: {
        name: 'Takeshita Street',
        address: 'Jingumae, Shibuya City, Tokyo',
        coordinates: { latitude: 35.6702, longitude: 139.7063 },
        type: 'attraction'
      },
      duration: 150,
      cost: { amount: 50, currency: 'USD', type: 'per_person' },
      rating: 4.3,
      day: 2,
      timeSlot: 'afternoon'
    },
    {
      id: 'activity-6',
      name: 'Meiji Shrine Sunset Visit',
      description: 'Find tranquility in this peaceful Shinto shrine dedicated to Emperor Meiji, surrounded by a beautiful forest in the heart of Tokyo.',
      type: 'cultural',
      location: {
        name: 'Meiji Shrine',
        address: '1-1 Kamizono-cho, Shibuya City, Tokyo',
        coordinates: { latitude: 35.6763, longitude: 139.6993 },
        type: 'attraction'
      },
      duration: 120,
      cost: { amount: 0, currency: 'USD', type: 'per_person' },
      rating: 4.7,
      day: 2,
      timeSlot: 'evening'
    },

    // Day 3
    {
      id: 'activity-7',
      name: 'Tsukiji Outer Market Food Tour',
      description: 'Embark on a culinary adventure through the famous fish market. Taste fresh seafood, traditional Japanese breakfast, and local delicacies.',
      type: 'dining',
      location: {
        name: 'Tsukiji Outer Market',
        address: 'Tsukiji, Chuo City, Tokyo',
        coordinates: { latitude: 35.6654, longitude: 139.7706 },
        type: 'attraction'
      },
      duration: 180,
      cost: { amount: 60, currency: 'USD', type: 'per_person' },
      rating: 4.9,
      day: 3,
      timeSlot: 'morning',
      bookingUrl: 'https://www.tokyofoodtours.com/tsukiji'
    },
    {
      id: 'activity-8',
      name: 'Imperial Palace East Gardens',
      description: 'Stroll through the former grounds of Edo Castle with beautiful traditional gardens, historic ruins, and seasonal flowers.',
      type: 'cultural',
      location: {
        name: 'Imperial Palace East Gardens',
        address: '1-1 Chiyoda, Chiyoda City, Tokyo',
        coordinates: { latitude: 35.6852, longitude: 139.7528 },
        type: 'attraction'
      },
      duration: 120,
      cost: { amount: 0, currency: 'USD', type: 'per_person' },
      rating: 4.5,
      day: 3,
      timeSlot: 'afternoon'
    },
    {
      id: 'activity-9',
      name: 'Ginza Premium Shopping & Dining',
      description: 'Experience Tokyo\'s most luxurious district with high-end shopping, art galleries, and world-class dining options.',
      type: 'shopping',
      location: {
        name: 'Ginza District',
        address: 'Ginza, Chuo City, Tokyo',
        coordinates: { latitude: 35.6719, longitude: 139.7648 },
        type: 'attraction'
      },
      duration: 240,
      cost: { amount: 100, currency: 'USD', type: 'per_person' },
      rating: 4.6,
      day: 3,
      timeSlot: 'evening'
    },

    // Day 4
    {
      id: 'activity-10',
      name: 'TeamLab Borderless Digital Art Museum',
      description: 'Immerse yourself in a world of digital art that responds to your presence. A unique blend of technology, art, and nature.',
      type: 'entertainment',
      location: {
        name: 'TeamLab Borderless',
        address: '1-3-8 Daiba, Minato City, Tokyo',
        coordinates: { latitude: 35.6269, longitude: 139.7731 },
        type: 'attraction'
      },
      duration: 240,
      cost: { amount: 40, currency: 'USD', type: 'per_person' },
      rating: 4.8,
      day: 4,
      timeSlot: 'morning',
      bookingUrl: 'https://borderless.teamlab.art/'
    },
    {
      id: 'activity-11',
      name: 'Odaiba Beach & Rainbow Bridge',
      description: 'Relax at Tokyo\'s artificial beach with stunning views of Rainbow Bridge and the city skyline. Perfect for photos and leisure.',
      type: 'relaxation',
      location: {
        name: 'Odaiba Beach',
        address: 'Daiba, Minato City, Tokyo',
        coordinates: { latitude: 35.6297, longitude: 139.7749 },
        type: 'attraction'
      },
      duration: 120,
      cost: { amount: 0, currency: 'USD', type: 'per_person' },
      rating: 4.2,
      day: 4,
      timeSlot: 'afternoon'
    },
    {
      id: 'activity-12',
      name: 'Roppongi Nightlife Experience',
      description: 'Experience Tokyo\'s vibrant nightlife in the international district of Roppongi with bars, clubs, and late-night dining.',
      type: 'entertainment',
      location: {
        name: 'Roppongi District',
        address: 'Roppongi, Minato City, Tokyo',
        coordinates: { latitude: 35.6627, longitude: 139.7311 },
        type: 'attraction'
      },
      duration: 300,
      cost: { amount: 80, currency: 'USD', type: 'per_person' },
      rating: 4.4,
      day: 4,
      timeSlot: 'night'
    },

    // Day 5
    {
      id: 'activity-13',
      name: 'Ueno Park & Tokyo National Museum',
      description: 'Explore Japan\'s largest collection of cultural artifacts and enjoy the beautiful park, especially famous for cherry blossoms.',
      type: 'cultural',
      location: {
        name: 'Tokyo National Museum',
        address: '13-9 Uenokoen, Taito City, Tokyo',
        coordinates: { latitude: 35.7187, longitude: 139.7758 },
        type: 'attraction'
      },
      duration: 180,
      cost: { amount: 15, currency: 'USD', type: 'per_person' },
      rating: 4.6,
      day: 5,
      timeSlot: 'morning',
      bookingUrl: 'https://www.tnm.jp/'
    },
    {
      id: 'activity-14',
      name: 'Ameyoko Market Shopping',
      description: 'Browse the bustling street market for souvenirs, vintage items, and local snacks. A great place for last-minute shopping.',
      type: 'shopping',
      location: {
        name: 'Ameyoko Market',
        address: 'Ueno, Taito City, Tokyo',
        coordinates: { latitude: 35.7082, longitude: 139.7744 },
        type: 'attraction'
      },
      duration: 120,
      cost: { amount: 30, currency: 'USD', type: 'per_person' },
      rating: 4.3,
      day: 5,
      timeSlot: 'afternoon'
    },
    {
      id: 'activity-15',
      name: 'Farewell Dinner at Robot Restaurant',
      description: 'End your Tokyo adventure with an unforgettable dinner show featuring robots, lasers, and high-energy entertainment.',
      type: 'entertainment',
      location: {
        name: 'Robot Restaurant',
        address: '1-7-1 Kabukicho, Shinjuku City, Tokyo',
        coordinates: { latitude: 35.6938, longitude: 139.7034 },
        type: 'restaurant'
      },
      duration: 150,
      cost: { amount: 75, currency: 'USD', type: 'per_person' },
      rating: 4.1,
      day: 5,
      timeSlot: 'evening',
      bookingUrl: 'https://www.robotrestaurant.com/'
    }
  ],
  accommodations: [
    {
      id: 'hotel-1',
      name: 'Park Hyatt Tokyo',
      type: 'hotel',
      location: {
        name: 'Park Hyatt Tokyo',
        address: '3-7-1-2 Nishi-Shinjuku, Shinjuku City, Tokyo',
        coordinates: { latitude: 35.6857, longitude: 139.6947 },
        type: 'hotel'
      },
      checkIn: '2024-06-15',
      checkOut: '2024-06-19',
      cost: { amount: 500, currency: 'USD', type: 'total' },
      rating: 4.8,
      amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Bar', 'Fitness Center', 'Concierge'],
      bookingUrl: 'https://www.hyatt.com/en-US/hotel/japan/park-hyatt-tokyo'
    }
  ],
  transportation: [
    {
      id: 'transport-1',
      type: 'flight',
      from: {
        name: 'John F. Kennedy International Airport',
        address: 'Queens, NY, USA',
        type: 'airport'
      },
      to: {
        name: 'Haneda Airport',
        address: 'Tokyo, Japan',
        type: 'airport'
      },
      departure: '2024-06-14T18:00:00Z',
      arrival: '2024-06-15T22:00:00+09:00',
      cost: { amount: 800, currency: 'USD', type: 'per_person' },
      duration: 840,
      provider: 'Japan Airlines',
      day: 0
    }
  ],
  meals: [
    {
      id: 'meal-1',
      name: 'Traditional Japanese Breakfast',
      type: 'breakfast',
      location: {
        name: 'Hotel Restaurant',
        address: 'Park Hyatt Tokyo',
        type: 'restaurant'
      },
      time: '08:00',
      cost: { amount: 25, currency: 'USD', type: 'per_person' },
      day: 1
    }
  ],
  status: 'generated',
  metadata: {
    generatedBy: 'gpt-4',
    version: 1,
    tags: ['culture', 'modern', 'food', 'adventure', 'city'],
    difficulty: 'moderate',
    season: 'summer',
    groupSize: 2,
    accessibility: 'full'
  },
  createdAt: '2024-05-30T10:30:00Z',
  updatedAt: '2024-05-30T10:30:00Z'
} 