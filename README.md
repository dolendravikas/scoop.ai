# Scoop - AI-Powered Social Media Intelligence Platform

Scoop is a comprehensive platform that aggregates and analyzes information from social media platforms using AI to provide intelligent insights and trends.

## 🏗️ Project Structure

```
scoop/
├── frontend/          # Next.js + Vite + TypeScript
├── backend/           # NestJS + TypeScript
├── docs/             # Documentation
├── scripts/          # Deployment scripts
└── .github/          # GitHub workflows
```

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 14
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: (To be added)
- **AI Integration**: Google Gemini, OpenAI, Anthropic
- **Social Media APIs**: Reddit, Twitter, LinkedIn, Quora

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Quick Start (Local Development)

#### Option 1: Automated Setup

```bash
# Install all dependencies and get setup instructions
npm run setup
```

#### Option 2: Manual Setup

**Start Backend Server:**

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on: http://localhost:3001

**Start Frontend Server (in a new terminal):**

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:3000

#### Option 3: Run Both Servers Together

```bash
# Install all dependencies first
npm run install:all

# Start both servers simultaneously
npm run dev
```

#### Access the Application

Open your browser and go to: http://localhost:3000

### Environment Variables

Copy the example environment files and configure your API keys:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

## 📋 Available Scripts

### Root Level (Project-wide)

- `npm run setup` - Automated setup with dependency installation
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run dev` - Start both frontend and backend servers simultaneously
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run tests for both frontend and backend

### Frontend (cd frontend)

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend (cd backend)

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload (http://localhost:3001)
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🤝 Contributing

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write tests for new features
4. Submit a pull request

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Messages

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🚀 Deployment

### Frontend (Netlify)

- Automatic deployment from `main` branch
- Environment variables configured in Netlify dashboard

### Backend (Railway/Render)

- Deploy from `main` branch
- Environment variables configured in service dashboard

## 📚 API Documentation

### Main Endpoints

- `POST /api/scoop` - Process search request across multiple platforms
- `GET /api/scoop/health` - Health check
- `GET /api/scoop/platforms` - Get supported platforms
- `GET /api/scoop/ai-models` - Get available AI models

### Platform-Specific Endpoints

#### Reddit

- `POST /api/reddit/search` - Search Reddit posts
- `GET /api/reddit/search` - Search Reddit posts (GET)
- `GET /api/reddit/health` - Reddit service health

#### Twitter

- `POST /api/twitter/search` - Search Twitter posts
- `GET /api/twitter/search` - Search Twitter posts (GET)
- `POST /api/twitter/user` - Get user tweets
- `GET /api/twitter/user` - Get user tweets (GET)
- `GET /api/twitter/health` - Twitter service health

### Request Format

```json
{
  "query": "search query",
  "platforms": ["reddit", "twitter"],
  "aiModel": "gemini-pro",
  "timeRange": "week",
  "keywords": "optional keywords"
}
```

### Twitter Integration

The platform now includes full Twitter/X integration using the official Twitter API v2. See [TWITTER_SETUP.md](backend/TWITTER_SETUP.md) for detailed setup instructions.

**Features:**

- Search recent tweets by query
- Get tweets from specific users
- Real-time engagement metrics (likes, retweets, replies)
- Verified user indicators
- Hashtag and mention extraction

## 🔧 Configuration

### Environment Variables

#### Frontend

- `NEXT_PUBLIC_API_URL` - Backend API URL

#### Backend

- `GOOGLE_API_KEY` - Google Gemini API key
- `REDDIT_CLIENT_ID` - Reddit API client ID
- `REDDIT_CLIENT_SECRET` - Reddit API client secret
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `TWITTER_BEARER_TOKEN` - Twitter API bearer token

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Frontend Team**: Next.js, React, TypeScript
- **Backend Team**: NestJS, TypeScript, AI Integration
- **DevOps Team**: Deployment, CI/CD, Infrastructure

## 🆘 Support

For questions and support:

- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Contact the development team
