import React, { useEffect, useRef, useState } from 'react'
import type { Activity, Accommodation } from '@/types'

interface ItineraryMapProps {
  activities: Activity[]
  accommodations: Accommodation[]
  className?: string
}

const ItineraryMap: React.FC<ItineraryMapProps> = ({ 
  activities, 
  accommodations, 
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapLibrary, setMapLibrary] = useState<any>(null)

  // Dynamic import of Leaflet to avoid SSR issues
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet')
        await import('leaflet/dist/leaflet.css')
        
        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })
        
        setMapLibrary(L)
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load Leaflet:', error)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!isLoaded || !mapLibrary || !mapRef.current || leafletMapRef.current) return

    const L = mapLibrary.default || mapLibrary

    // Combine all locations
    const allLocations = [
      ...activities.map(activity => ({
        ...activity.location,
        type: activity.type,
        name: activity.name,
        day: activity.day,
        category: 'activity' as const,
        item: activity
      })),
      ...accommodations.map(accommodation => ({
        ...accommodation.location,
        type: 'accommodation' as const,
        name: accommodation.name,
        day: 0,
        category: 'accommodation' as const,
        item: accommodation
      }))
    ].filter(location => location.coordinates)

    if (allLocations.length === 0) return

    // Calculate center
    const center = [
      allLocations.reduce((sum, loc) => sum + loc.coordinates!.latitude, 0) / allLocations.length,
      allLocations.reduce((sum, loc) => sum + loc.coordinates!.longitude, 0) / allLocations.length
    ] as [number, number]

    // Create map
    const map = L.map(mapRef.current).setView(center, 13)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Create custom icon function
    const createCustomIcon = (type: string, day?: number) => {
      const getIconConfig = (type: string) => {
        switch (type) {
          case 'accommodation':
            return { color: '#10B981', icon: '🏨' }
          case 'sightseeing':
            return { color: '#3B82F6', icon: '🏛️' }
          case 'dining':
            return { color: '#F59E0B', icon: '🍽️' }
          case 'adventure':
            return { color: '#EF4444', icon: '🏔️' }
          case 'cultural':
            return { color: '#8B5CF6', icon: '🎭' }
          case 'shopping':
            return { color: '#EC4899', icon: '🛍️' }
          case 'entertainment':
            return { color: '#06B6D4', icon: '🎪' }
          default:
            return { color: '#6B7280', icon: '📍' }
        }
      }

      const { color, icon } = getIconConfig(type)
      
      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            position: relative;
          ">
            ${icon}
            ${day ? `<div style="
              position: absolute;
              top: -8px;
              right: -8px;
              background: white;
              color: ${color};
              border: 2px solid ${color};
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
            ">${day}</div>` : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      })
    }

    // Add markers
    allLocations.forEach(location => {
      const marker = L.marker(
        [location.coordinates!.latitude, location.coordinates!.longitude],
        { icon: createCustomIcon(location.type, location.day) }
      ).addTo(map)

      // Create popup content based on type
      let popupContent = ''
      if (location.category === 'activity') {
        const activity = location.item as Activity
        popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">${activity.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Day ${activity.day}</p>
            ${activity.description ? `<p style="font-size: 14px; margin-bottom: 8px;">${activity.description}</p>` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888;">
              <span style="text-transform: capitalize;">${activity.type}</span>
              ${activity.duration ? `<span>${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m</span>` : ''}
            </div>
            ${activity.cost ? `<div style="margin-top: 4px; font-size: 14px; font-weight: bold; color: #16a34a;">${activity.cost.currency} ${activity.cost.amount}</div>` : ''}
          </div>
        `
      } else {
        const accommodation = location.item as Accommodation
        popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">${accommodation.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 8px; text-transform: capitalize;">${accommodation.type}</p>
            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
              ${accommodation.checkIn} - ${accommodation.checkOut}
            </div>
            ${accommodation.cost ? `<div style="font-size: 14px; font-weight: bold; color: #16a34a;">${accommodation.cost.currency} ${accommodation.cost.amount}/night</div>` : ''}
          </div>
        `
      }

      marker.bindPopup(popupContent)
    })

    // Create route lines for activities by day
    const routesByDay = activities
      .filter(activity => activity.location.coordinates)
      .reduce((acc, activity) => {
        if (!acc[activity.day]) {
          acc[activity.day] = []
        }
        acc[activity.day].push([
          activity.location.coordinates!.latitude,
          activity.location.coordinates!.longitude
        ] as [number, number])
        return acc
      }, {} as Record<number, [number, number][]>)

    const routeColors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'
    ]

    // Add route lines
    Object.entries(routesByDay).forEach(([, coordinates], index) => {
      if (coordinates.length > 1) {
        L.polyline(coordinates, {
          color: routeColors[index % routeColors.length],
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10'
        }).addTo(map)
      }
    })

    // Fit bounds to show all markers
    if (allLocations.length > 0) {
      const bounds = L.latLngBounds(
        allLocations.map(loc => [loc.coordinates!.latitude, loc.coordinates!.longitude])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    leafletMapRef.current = map

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isLoaded, mapLibrary, activities, accommodations])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  const allLocations = [
    ...activities.filter(a => a.location.coordinates),
    ...accommodations.filter(a => a.location.coordinates)
  ]

  if (allLocations.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🗺️</div>
          <p>No location data available for map display</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height: '400px', width: '100%' }}
        className="rounded-lg z-0"
      />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🏨</div>
            <span>Accommodation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">🏛️</div>
            <span>Sightseeing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">🍽️</div>
            <span>Dining</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🏔️</div>
            <span>Adventure</span>
          </div>
          <div className="text-xs text-gray-500 mt-2 border-t pt-1">
            Dashed lines show daily routes
          </div>
        </div>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { ItineraryMap }
export default ItineraryMap 