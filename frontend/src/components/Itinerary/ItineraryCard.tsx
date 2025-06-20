import React from 'react'
import type { Itinerary } from '@/types'
import { Calendar, MapPin, Clock, DollarSign, Download } from 'lucide-react'

interface ItineraryCardProps {
  itinerary: Itinerary
  onDownload?: () => void
  className?: string
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  onDownload,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {itinerary.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {itinerary.description}
            </p>
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download size={20} />
            </button>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{itinerary.destination.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{itinerary.duration.days} days</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} />
            <span>{itinerary.budget.total ? `${itinerary.budget.total} ${itinerary.budget.currency}` : 'Budget varies'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{itinerary.activities.length} activities</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {itinerary.activities.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{activity.timeSlot || 'Flexible'}</span>
                  <span>{activity.duration ? `${Math.round(activity.duration / 60)}h` : 'Duration varies'}</span>
                  <span>{activity.cost ? `${activity.cost.amount} ${activity.cost.currency}` : 'Free'}</span>
                </div>
              </div>
            </div>
          ))}
          
          {itinerary.activities.length > 3 && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">
                +{itinerary.activities.length - 3} more activities
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItineraryCard 