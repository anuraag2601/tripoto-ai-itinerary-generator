# Tripoto AI Itinerary Generator (Simplified Frontend)

A simplified, standalone AI-powered travel itinerary generator that creates personalized travel plans using Anthropic's Claude AI directly from the frontend.

## 🌟 Features

- **Direct AI Integration**: No backend required - calls Anthropic Claude API directly
- **Interactive Chat Interface**: Step-by-step itinerary creation process
- **Smart Customization**: Modify your itinerary with natural language requests
- **PDF Export**: Download your itinerary in multiple formats
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Generation**: See your itinerary being created in real-time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone and setup**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Add your Anthropic API key** to `.env`:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**: Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

```env
# Required: Anthropic API Configuration
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: App Configuration
VITE_APP_ENV=development
VITE_APP_NAME=Tripoto AI
VITE_APP_VERSION=2.0.0

# Optional: Feature Flags
VITE_ENABLE_PDF_DOWNLOAD=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SHARING=false

# Optional: Debugging
VITE_DEBUG=true
VITE_LOG_LEVEL=info

# Optional: Embedding (if you want to embed as widget)
VITE_ALLOW_EMBEDDING=false
VITE_EMBED_DOMAINS=localhost:5173

# Optional: Performance
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
```

## 🏗️ Architecture

This simplified version eliminates the backend complexity by:

- **Direct API Calls**: Frontend communicates directly with Anthropic Claude
- **Client-side Processing**: All itinerary generation happens in the browser
- **Simplified State Management**: Uses React hooks instead of complex state management
- **Reduced Dependencies**: Minimal package footprint

### Key Components

- **ChatPage**: Main interface for step-by-step itinerary creation
- **AnthropicAPIClient**: Handles direct API communication with Claude
- **ItineraryCard**: Displays generated itineraries
- **InterestsSelection**: Interface for selecting travel preferences
- **PDF Generator**: Creates downloadable itinerary PDFs

## 🎯 Usage

### Creating an Itinerary

1. **Destination**: Enter where you want to travel
2. **Dates**: Select your travel dates
3. **Travelers**: Specify travel type (solo, couple, family, friends)
4. **Budget**: Set your total budget and currency
5. **Interests**: Choose activities and experiences you enjoy
6. **Generate**: AI creates your personalized itinerary

### Customizing Your Itinerary

After generation, you can:
- Click "Customize Itinerary" to modify specific aspects
- Use natural language like:
  - "Add more museums to day 2"
  - "Replace dinner with street food"
  - "Include more outdoor activities"
  - "Make the hotel more luxurious"

### Exporting

- **Download PDF**: Full detailed itinerary with styling
- **Quick PDF**: Simple text-based version for easy sharing

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Storybook
npm run storybook    # Start Storybook for component development
```

### Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Itinerary/     # Itinerary display components
│   │   ├── InterestsSelection/
│   │   └── WhyYoullLoveThis/
│   ├── pages/             # Main application pages
│   │   └── ChatPage/      # Primary itinerary creation interface
│   ├── utils/             # Utility functions
│   │   ├── api.ts         # Anthropic API client
│   │   └── pdfGenerator.ts # PDF export functionality
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
└── package.json
```

### Adding New Features

1. **New Step in Itinerary Creation**: Modify `ChatPage.tsx` and add to the step flow
2. **Custom AI Prompts**: Update prompt generation in `utils/api.ts`
3. **UI Components**: Add to the appropriate component directory
4. **PDF Customization**: Modify `utils/pdfGenerator.ts`

## 🔒 Security Notes

- **API Key Protection**: Ensure your Anthropic API key is kept secure
- **Environment Variables**: Never commit your `.env` file
- **Rate Limiting**: Be mindful of API usage limits
- **CORS**: Configure appropriately for production deployment

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup for Production

1. Set environment variables in your hosting platform
2. Ensure VITE_ANTHROPIC_API_KEY is set securely
3. Configure CORS settings if needed
4. Set appropriate caching headers for static assets

### Recommended Hosting

- **Vercel**: Perfect for React apps with environment variable support
- **Netlify**: Great for static site deployment
- **AWS S3 + CloudFront**: For scalable static hosting
- **GitHub Pages**: For simple deployments

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the inline code comments
- **API Reference**: See [Anthropic API docs](https://docs.anthropic.com/)

## 🎉 What's Different from the Full Version?

This simplified version:
- ✅ **No backend required** - Direct API integration
- ✅ **Faster setup** - Just install and add API key
- ✅ **Smaller footprint** - Fewer dependencies
- ✅ **Easier deployment** - Static site hosting
- ❌ **No user authentication** - Simplified for demo use
- ❌ **No data persistence** - Itineraries aren't saved
- ❌ **No sharing features** - Focus on core functionality
- ❌ **Limited analytics** - Basic usage only

Perfect for prototypes, demos, or when you need a simple travel planning interface! 