# Scoop - AI-Powered Social Media Intelligence Platform

Scoop is a comprehensive platform that aggregates and analyzes information from social media platforms using AI to provide intelligent insights and trends.

## 🏗️ Project Structure

```
scoop/
├── frontend/          # Next.js + Vite + TypeScript
├── backend/           # NestJS + TypeScript
├── docs/             # Documentation
├── scripts/          # Deployment scripts
├── .github/          # GitHub workflows
└── docker-compose.yml # Local development
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

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Environment Variables
Copy the example environment files and configure your API keys:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

## 📋 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
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

### Endpoints
- `POST /api/scoop` - Process search request
- `GET /api/scoop/health` - Health check

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