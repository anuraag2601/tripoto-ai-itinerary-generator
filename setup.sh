#!/bin/bash

# Tripoto AI Itinerary Generator - Setup Script
# This script automates the setup process for new users

set -e  # Exit on any error

echo "🧳 Setting up Tripoto AI Itinerary Generator..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup frontend
echo "🚀 Setting up frontend..."
cd frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating environment configuration..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "💡 Edit frontend/.env to add your API keys"
else
    echo "✅ Environment file already exists"
fi

# Build the project to test everything works
echo "🔨 Building project to verify setup..."
npm run build

echo ""
echo "🎉 Setup completed successfully!"
echo "================================================"
echo ""
echo "🚀 Quick Start:"
echo "1. cd frontend"
echo "2. npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "🔧 Configuration:"
echo "- Edit frontend/.env to add API keys"
echo "- App works with mock data if no API keys provided"
echo ""
echo "📖 Documentation:"
echo "- Read README.md for detailed instructions"
echo "- Check out the comprehensive feature list"
echo ""
echo "Happy travel planning! 🗺️" 