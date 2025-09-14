# 🚀 Scoop AI - API Integration Guide

## Overview
Scoop AI now integrates with real APIs for both AI models and social media data scraping. This guide will help you set up and configure the backend services.

## 🏗️ Architecture

### Frontend (Port 8080)
- **HTML/CSS/JavaScript** - User interface
- **Real-time API calls** to backend
- **Fallback to mock data** if API fails

### Backend (Port 3001)
- **Node.js/Express** - API server
- **AI Model Integration** - OpenAI, Anthropic, Google
- **Social Media APIs** - Twitter, Reddit, LinkedIn, Quora

## 🔧 Setup Instructions

### 1. Backend Setup
```bash
# Run the setup script
./setup-backend.sh

# Or manually:
cd backend
npm install
cp env.example .env
# Edit .env with your API keys
npm start
```

### 2. Frontend Setup
```bash
# Start the frontend server
python3 -m http.server 8080
```

## 🔑 Required API Keys

### AI Models
| Service | API Key | Cost | Usage |
|---------|---------|------|-------|
| **OpenAI** | `OPENAI_API_KEY` | Pay-per-token | GPT-4, GPT-3.5 |
| **Anthropic** | `ANTHROPIC_API_KEY` | Pay-per-token | Claude 3 |
| **Google** | `GOOGLE_API_KEY` | Free tier | Gemini Pro |

### Social Media APIs
| Platform | API Key | Cost | Rate Limits |
|----------|---------|------|-------------|
| **Twitter** | `TWITTER_BEARER_TOKEN` | Free tier | 300 requests/15min |
| **Reddit** | `REDDIT_CLIENT_ID` + `REDDIT_CLIENT_SECRET` | Free | 60 requests/min |
| **LinkedIn** | Requires approval | Paid | Limited |
| **Quora** | Web scraping | Free | Rate limited |

## 📊 API Endpoints

### Main Endpoint
```
POST http://localhost:3001/api/scoop
```

**Request Body:**
```json
{
  "query": "recent trends in RISC-V",
  "platforms": ["twitter", "reddit", "linkedin"],
  "aiModel": "gpt-4",
  "timeRange": "week",
  "keywords": ["risc-v", "architecture"]
}
```

**Response:**
```json
{
  "success": true,
  "query": "recent trends in RISC-V",
  "platforms": ["twitter", "reddit"],
  "aiModel": "gpt-4",
  "timeRange": "week",
  "keywords": ["risc-v", "architecture"],
  "dataCount": 25,
  "rawData": [...],
  "analysis": "Based on the social media data..."
}
```

### Health Check
```
GET http://localhost:3001/api/health
```

## 🔄 Data Flow

1. **User Input** → Frontend collects query and filters
2. **API Call** → Frontend sends POST to backend
3. **Data Collection** → Backend scrapes selected platforms
4. **AI Processing** → Backend sends data to selected AI model
5. **Response** → Backend returns analysis + raw data
6. **Display** → Frontend shows formatted results

## 🛠️ Configuration

### Environment Variables (.env)
```bash
# AI API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-api-key

# Social Media API Keys
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 🚨 Error Handling

### API Failures
- **Network errors** → Fallback to mock data
- **Rate limiting** → Retry with exponential backoff
- **Invalid keys** → Show error message
- **Platform unavailable** → Skip and continue

### Frontend Fallbacks
- **Backend down** → Show mock data with error notice
- **CORS issues** → Use proxy or CORS headers
- **Timeout** → Show loading timeout message

## 📈 Rate Limiting & Costs

### AI Models
- **OpenAI GPT-4**: ~$0.03/1K tokens
- **Anthropic Claude**: ~$0.015/1K tokens  
- **Google Gemini**: Free tier available

### Social Media APIs
- **Twitter**: 300 requests/15min (free tier)
- **Reddit**: 60 requests/min (free tier)
- **LinkedIn**: Requires business approval
- **Quora**: Web scraping (rate limited)

## 🔒 Security Considerations

1. **API Keys** - Store in environment variables only
2. **CORS** - Configure for production domains
3. **Rate Limiting** - Implement per-user limits
4. **Data Privacy** - Don't store user queries
5. **HTTPS** - Use in production

## 🚀 Deployment

### Local Development
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
python3 -m http.server 8080
```

### Production
- **Backend**: Deploy to Heroku, Railway, or AWS
- **Frontend**: Deploy to Netlify, Vercel, or AWS S3
- **Environment**: Set production API keys

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors** → Add CORS headers to backend
2. **API key invalid** → Check .env file format
3. **Rate limited** → Wait and retry
4. **No data returned** → Check platform availability
5. **Frontend not loading** → Check port 8080 is free

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```

## 📝 Next Steps

1. **Get API Keys** - Sign up for required services
2. **Configure Backend** - Set up .env file
3. **Test Integration** - Run both servers
4. **Monitor Usage** - Track API costs and limits
5. **Scale Up** - Add more platforms and AI models

---

**Need Help?** Check the console logs for detailed error messages and API responses.
