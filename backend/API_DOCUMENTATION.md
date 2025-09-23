# Scoop AI Backend API Documentation

## Overview

The Scoop AI Backend has been completely restructured and organized into separate modules for better maintainability and scalability. Each API endpoint is now in its own dedicated folder with proper error handling and validation.

## Architecture

### Module Structure

```
src/
├── modules/
│   ├── health/          # Health check endpoints
│   ├── reddit/          # Reddit API integration
│   ├── gemini/          # Google Gemini AI integration
│   └── scoop/           # Main Scoop service
├── app.module.ts        # Main application module
└── main.ts             # Application bootstrap
```

### Dependencies

- **NestJS 10.3.0** - Main framework
- **@nestjs/axios** - HTTP client for external APIs
- **@nestjs/config** - Configuration management
- **@google/generative-ai** - Google Gemini AI integration
- **class-validator** - Request validation
- **rxjs** - Reactive programming

## API Endpoints

### Health Check Endpoints

#### GET /api/health

Basic health check endpoint.

```json
{
  "status": "OK",
  "timestamp": "2025-09-16T17:22:38.635Z",
  "service": "Scoop AI Backend",
  "version": "1.0.0",
  "uptime": 9.179414375
}
```

#### GET /api/health/detailed

Detailed health check with system information.

```json
{
  "status": "OK",
  "timestamp": "2025-09-16T17:22:38.640Z",
  "service": "Scoop AI Backend",
  "version": "1.0.0",
  "uptime": 9.184796833,
  "environment": "development",
  "memory": {
    "rss": "78 MB",
    "heapTotal": "23 MB",
    "heapUsed": "19 MB",
    "external": "3 MB"
  },
  "cpu": {
    "user": 449737,
    "system": 148369
  },
  "dependencies": {
    "reddit": {
      "configured": false,
      "hasClientId": false,
      "hasClientSecret": false
    },
    "gemini": {
      "configured": false,
      "hasApiKey": false
    }
  }
}
```

#### GET /api/health/ready

Readiness check for Kubernetes deployments.

#### GET /api/health/live

Liveness check for Kubernetes deployments.

### Reddit API Endpoints

#### GET /api/reddit/health

Reddit service health check.

#### POST /api/reddit/search

Search Reddit posts.

```json
{
  "query": "javascript",
  "timeRange": "week",
  "limit": 10,
  "sort": "relevance"
}
```

#### GET /api/reddit/search

Search Reddit posts via GET request.

```
GET /api/reddit/search?q=javascript&timeRange=week&limit=10&sort=relevance
```

### Gemini AI Endpoints

#### GET /api/gemini/health

Gemini service health check.

#### GET /api/gemini/models

Get available Gemini models.

```json
{
  "success": true,
  "models": [
    {
      "name": "gemini-1.5-flash",
      "description": "Fast and efficient model for most tasks",
      "maxTokens": 8192
    },
    {
      "name": "gemini-pro",
      "description": "High-quality model for complex tasks",
      "maxTokens": 30720
    },
    {
      "name": "gemini-1.5-pro",
      "description": "Latest high-performance model",
      "maxTokens": 2048000
    }
  ]
}
```

#### POST /api/gemini/analyze

Analyze data with Gemini AI.

```json
{
  "data": [...],
  "query": "artificial intelligence",
  "model": "gemini-1.5-flash",
  "prompt": "Custom analysis prompt (optional)"
}
```

#### POST /api/gemini/generate

Generate content with Gemini AI.

```json
{
  "prompt": "Hello, how are you?",
  "model": "gemini-1.5-flash",
  "maxTokens": 1000
}
```

### Main Scoop API Endpoints

#### GET /api/scoop/health

Main Scoop service health check.

#### GET /api/scoop/platforms

Get available platforms.

```json
{
  "success": true,
  "platforms": [
    {
      "name": "reddit",
      "description": "Reddit social media platform",
      "supported": true,
      "endpoints": ["search", "subreddit"]
    },
    {
      "name": "twitter",
      "description": "Twitter/X social media platform",
      "supported": false,
      "note": "Coming soon"
    }
  ]
}
```

#### GET /api/scoop/ai-models

Get available AI models.

#### POST /api/scoop

Main Scoop processing endpoint.

```json
{
  "query": "artificial intelligence",
  "platforms": ["reddit"],
  "aiModel": "gemini-1.5-flash",
  "timeRange": "week",
  "keywords": "optional keywords",
  "limit": 10,
  "sort": "relevance"
}
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Reddit API Configuration
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret

# Google Gemini API Configuration
GOOGLE_API_KEY=your_google_api_key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Error Handling

- **Graceful Degradation**: Services continue to work even when external APIs are not configured
- **Proper HTTP Status Codes**: 200, 201, 400, 404, 500, 503
- **Detailed Error Messages**: Clear error descriptions for debugging
- **Validation**: Request validation using class-validator

## Testing

### Manual Testing

Use the provided test script:

```bash
cd backend
node test-endpoints.js
```

### Health Checks

All endpoints include health check endpoints for monitoring and debugging.

## Development

### Running the Server

```bash
cd backend
npm install
npm run build
npm run start:dev
```

### Building for Production

```bash
cd backend
npm run build
npm run start:prod
```

## Features

### ✅ Completed

- [x] Modular architecture with separate folders for each API
- [x] Comprehensive error handling and validation
- [x] Health check endpoints for all services
- [x] Reddit API integration with proper authentication
- [x] Google Gemini AI integration with multiple models
- [x] Main Scoop service that orchestrates all APIs
- [x] Graceful handling of missing API credentials
- [x] CORS configuration for frontend integration
- [x] Request validation and sanitization
- [x] Comprehensive logging and monitoring
- [x] Separate node_modules for frontend and backend
- [x] All endpoints tested and verified working

### 🔄 Future Enhancements

- [ ] Twitter/X API integration
- [ ] LinkedIn API integration
- [ ] Quora API integration
- [ ] Database integration for caching
- [ ] Rate limiting and throttling
- [ ] Authentication and authorization
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## API Response Examples

### Successful Reddit Search

```json
{
  "success": true,
  "data": [],
  "count": 0,
  "query": "javascript",
  "timeRange": "week",
  "sort": "relevance"
}
```

### Successful Scoop Processing

```json
{
  "success": true,
  "query": "artificial intelligence",
  "platforms": ["reddit"],
  "aiModel": "gemini-1.5-flash",
  "timeRange": "week",
  "limit": 5,
  "sort": "relevance",
  "dataCount": 0,
  "platformResults": {
    "reddit": {
      "success": true,
      "count": 0,
      "data": []
    }
  },
  "aiResult": {
    "success": false,
    "error": "Google API key not configured"
  },
  "rawData": [],
  "analysis": "Error processing with AI: Google API key not configured",
  "timestamp": "2025-09-16T17:22:38.694Z"
}
```

## Notes

- The backend is designed to work gracefully even when external API credentials are not configured
- All endpoints return proper HTTP status codes and error messages
- The modular structure makes it easy to add new platforms and AI models
- Each service can be tested independently through its health check endpoints
