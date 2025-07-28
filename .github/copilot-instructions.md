<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Email Organizer Project Instructions

This is a Next.js App Router project with TypeScript for building an email classification application.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: BetterAuth with organization extension
- **Email Classification**: Mocked OpenAI API simulation

## Project Structure
- `/src/app` - App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utilities, configurations, and BetterAuth setup
- `/src/data` - Mock email data (JSON files)

## Key Features
1. **Authentication System**: BetterAuth with organization support
2. **Email Management**: Display emails from JSON data source
3. **Classification**: Mock OpenAI API for categorizing emails (Sales, Support, Internal, Spam)
4. **Responsive UI**: Clean, professional interface with Tailwind CSS

## Development Guidelines
- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Implement proper error handling
- Use server components where possible
- Mock external APIs (OpenAI) with realistic latency simulation
- Follow security best practices for authentication
