import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  embedded?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, embedded = false }) => {
  if (embedded) {
    // Embedded mode - minimal layout
    return (
      <div className="w-full h-full bg-white">
        {children}
      </div>
    )
  }

  // Full layout with header and footer
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Tripoto AI
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/chat" className="text-gray-700 hover:text-gray-900">
                Plan Trip
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Tripoto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 