import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Layout from '@/components/Layout/Layout'

// Lazy load components for better performance
const HomePage = lazy(() => import('@/pages/HomePage/HomePage'))
const ChatPage = lazy(() => import('@/pages/ChatPage/ChatPage'))
const SharedItineraryPage = lazy(() => import('@/pages/SharedItinerary/SharedItineraryPage'))
const EmbedPage = lazy(() => import('@/pages/EmbedPage/EmbedPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'))

function App() {
  // Check if we're in embedded mode
  const isEmbedded = window !== window.parent || 
                    new URLSearchParams(window.location.search).get('embedded') === 'true'

  // If embedded, only show the chat interface
  if (isEmbedded) {
    return (
      <div className="h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/embed" element={<EmbedPage />} />
            <Route path="*" element={<EmbedPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </div>
    )
  }

  // Regular full application
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/itinerary/:id" element={<SharedItineraryPage />} />
            <Route path="/embed" element={<EmbedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="top-right" />
    </div>
  )
}

export default App 