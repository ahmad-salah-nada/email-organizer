# 🤝 Contributing to Email Organizer

Thank you for your interest in contributing to Email Organizer! This guide will help you get started with contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different skill levels

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (18.0 or higher)
- **npm** (9.0 or higher)
- **Git**
- **Code Editor** (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/email-organizer.git
   cd email-organizer
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/email-organizer.git
   ```

## 🛠️ Development Setup

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`

3. **Initialize the database**:
   ```bash
   npm run db:setup
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Environment Variables

Required environment variables for development:

```env
# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=./database.db

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Gmail OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📝 Contributing Guidelines

### What Can You Contribute?

We welcome contributions in many forms:

- **Bug fixes** and **security improvements**
- **New features** and **enhancements**
- **Documentation** improvements
- **Tests** and **performance optimizations**
- **UI/UX** improvements
- **Accessibility** enhancements

### Before You Start

1. **Check existing issues** to see if your idea is already being worked on
2. **Create an issue** to discuss major changes before implementing
3. **Look for "good first issue"** labels for beginner-friendly tasks
4. **Join discussions** in existing issues and pull requests

### Types of Contributions

#### 🐛 Bug Fixes
- **Small fixes**: Can be submitted directly as a pull request
- **Complex bugs**: Please create an issue first to discuss the approach

#### ✨ New Features
- **Major features**: Must be discussed in an issue before implementation
- **Minor features**: Can be submitted directly with good documentation

#### 📚 Documentation
- **Typos and clarifications**: Submit directly
- **New documentation**: Discuss structure in an issue first

## 🔄 Pull Request Process

### Creating a Pull Request

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [code style guidelines](#code-style-guidelines)

3. **Write tests** for your changes (if applicable)

4. **Update documentation** as needed

5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add email filtering functionality"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a pull request** on GitHub

### Pull Request Guidelines

#### Title Format
Use conventional commit format for PR titles:

- `feat: add new feature`
- `fix: resolve bug in email parsing`
- `docs: update installation guide`
- `style: improve button hover effects`
- `refactor: simplify email classification logic`
- `test: add unit tests for auth service`

#### Description Template
```markdown
## Description
Brief description of what this PR does.

## Changes Made
- List of specific changes
- Another change
- Third change

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Breaking Changes
List any breaking changes (if any)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by maintainers
3. **Address feedback** promptly and professionally
4. **Merge** once approved

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

We use **ESLint** and **Prettier** for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

#### Key Guidelines

- **Use TypeScript** for all new code
- **Prefer functional components** with hooks
- **Use meaningful variable names**
- **Write JSDoc comments** for complex functions
- **Handle errors appropriately**

#### Example Code Style

```typescript
/**
 * Classifies an email using OpenAI GPT-4
 * @param emailContent - The email content to classify
 * @returns Promise resolving to classification result
 */
export async function classifyEmail(
  emailContent: string
): Promise<EmailClassification> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Classify this email: ${emailContent}`,
        },
      ],
    });

    return parseClassificationResponse(response);
  } catch (error) {
    logger.error('Email classification failed:', error);
    throw new EmailClassificationError('Failed to classify email');
  }
}
```

### CSS/Styling

We use **Tailwind CSS** for styling:

- **Use utility classes** instead of custom CSS when possible
- **Follow responsive design** principles
- **Maintain consistent spacing** using Tailwind scale
- **Use semantic color names** from the design system

#### Example Component

```tsx
export function EmailCard({ email }: { email: Email }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {email.subject}
        </h3>
        <span className="text-xs text-gray-500">
          {formatDate(email.date)}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {email.preview}
      </p>
    </div>
  );
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Guidelines

- **Write tests** for new features and bug fixes
- **Use descriptive test names** that explain what is being tested
- **Follow AAA pattern**: Arrange, Act, Assert
- **Mock external dependencies** appropriately

#### Example Test

```typescript
import { classifyEmail } from '../email-classifier';

describe('Email Classifier', () => {
  it('should classify work-related emails correctly', async () => {
    // Arrange
    const workEmail = 'Meeting scheduled for tomorrow at 2 PM';
    
    // Act
    const result = await classifyEmail(workEmail);
    
    // Assert
    expect(result.category).toBe('work');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

## 📖 Documentation

### Documentation Guidelines

- **Keep README.md up-to-date** with installation and usage instructions
- **Update API documentation** for new endpoints
- **Write clear commit messages**
- **Add JSDoc comments** for public functions
- **Update CHANGELOG.md** for notable changes

### Documentation Structure

```
docs/
├── README.md              # Main project documentation
├── DESIGN.md              # Architecture and design decisions
├── CONTRIBUTING.md        # This file
├── API.md                 # API documentation
└── DEPLOYMENT.md          # Deployment instructions
```

## 🐛 Issue Guidelines

### Creating Issues

When creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use clear, descriptive titles**
3. **Provide detailed descriptions**
4. **Include reproduction steps** for bugs
5. **Add labels** and **assign to projects** if you have permissions

### Issue Templates

#### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]
```

#### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
Explain why this feature would be useful.

**Proposed Solution**
Describe how you think this should work.

**Alternatives Considered**
Other solutions you've considered.
```

## 🎯 Priorities and Roadmap

### Current Priorities

1. **Core Functionality**: Email fetching and classification
2. **User Experience**: Improving UI/UX and accessibility
3. **Performance**: Optimization and caching
4. **Testing**: Increasing test coverage
5. **Documentation**: Comprehensive guides and API docs

### Future Roadmap

1. **Organization Support**: Multi-tenant functionality
2. **Mobile App**: React Native application
3. **Advanced Features**: Custom rules, webhooks, analytics
4. **Integrations**: Additional email providers and services

## 🏷️ Labels and Projects

### Issue Labels

- **Type**: `bug`, `feature`, `documentation`, `enhancement`
- **Priority**: `low`, `medium`, `high`, `critical`
- **Difficulty**: `good first issue`, `help wanted`, `expert needed`
- **Status**: `in progress`, `blocked`, `needs review`

### Project Boards

- **Backlog**: Ideas and requests
- **To Do**: Ready for development
- **In Progress**: Currently being worked on
- **Review**: Ready for code review
- **Done**: Completed and merged

## 💬 Communication

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bugs and feature requests
- **Pull Requests**: For code review and technical discussion

### Response Time

- **Issues**: We aim to respond within 2-3 business days
- **Pull Requests**: Review within 1-2 business days
- **Security Issues**: Within 24 hours

## 🙏 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: For significant contributions
- **Release Notes**: For major features and fixes

Thank you for contributing to Email Organizer! Your efforts help make this project better for everyone. 🎉

---

**Questions?** Feel free to ask in [GitHub Discussions](https://github.com/your-username/email-organizer/discussions) or create an issue!
