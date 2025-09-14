# Contributing to Scoop

Thank you for your interest in contributing to Scoop! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of TypeScript, React, and NestJS

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/scoop.git`
3. Install dependencies:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   ```
4. Set up environment variables (see README.md)
5. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 📋 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Making Changes
1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards

3. Write tests for new functionality

4. Commit your changes using conventional commits:
   ```bash
   git add .
   git commit -m "feat: add new search functionality"
   ```

5. Push your branch and create a pull request

## 🎨 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js best practices
- Use TypeScript for all components

### NestJS
- Use dependency injection properly
- Implement proper error handling
- Follow NestJS conventions
- Use decorators appropriately

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful comments
- Keep functions small and focused

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
```

### Backend Testing
```bash
cd backend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
```

### Test Requirements
- Write tests for new features
- Maintain test coverage above 80%
- Test both success and error scenarios
- Use descriptive test names

## 📝 Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Run linting and fix any issues
3. Update documentation if needed
4. Test your changes thoroughly

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Discuss with maintainers first

## 📚 Documentation

### Code Documentation
- Document complex functions
- Add JSDoc comments for public APIs
- Keep README files updated
- Document environment variables

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes
- Keep API docs in sync with code

## 🔒 Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📞 Getting Help

- Check existing issues and discussions
- Join our Discord/Slack community
- Ask questions in GitHub discussions
- Contact maintainers directly

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Scoop! 🚀
