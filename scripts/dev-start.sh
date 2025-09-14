#!/bin/bash

# Scoop Development Startup Script
echo "🚀 Starting Scoop Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "🎯 To start the development servers:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run start:dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
