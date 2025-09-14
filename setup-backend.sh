#!/bin/bash

echo "🚀 Setting up Scoop AI Backend..."

# Navigate to backend directory
cd backend

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create .env file from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Run: cd backend && npm start"
echo "3. The API will be available at http://localhost:3001"
echo ""
echo "Required API Keys:"
echo "- OpenAI API Key (for GPT models)"
echo "- Anthropic API Key (for Claude)"
echo "- Google API Key (for Gemini)"
echo "- Twitter Bearer Token (for Twitter data)"
echo "- Reddit Client ID & Secret (for Reddit data)"
