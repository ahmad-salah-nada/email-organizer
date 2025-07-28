# 📧 Email Organizer

An intelligent email management application that connects to your Gmail account and automatically classifies emails using AI. Built with Next.js 15, TypeScript, and BetterAuth.

![Email Organizer Demo](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)

## ✨ Features

### 🔐 **Secure Authentication**
- Email/password authentication powered by BetterAuth
- Secure session management with 7-day expiration
- No email verification required for demo purposes

### 📬 **Gmail Integration**
- OAuth2 integration with Gmail API
- Real-time email fetching via IMAP
- Automatic token refresh handling
- Support for both Gmail and custom IMAP servers

### 🤖 **AI-Powered Email Classification**
- Intelligent email categorization using OpenAI GPT-4
- Automatic classification into categories:
  - 💼 **Work** - Professional emails, meetings, business correspondence
  - 👤 **Personal** - Family, friends, personal communications
  - 🛒 **Shopping** - E-commerce, receipts, order confirmations
  - 📰 **Newsletter** - Subscriptions, marketing emails, updates
  - 🔧 **Support** - Customer service, technical support
  - 🎯 **Other** - Miscellaneous emails

### 📱 **Modern UI/UX**
- Clean, responsive design with Tailwind CSS
- Real-time email loading with progress indicators
- Error handling with user-friendly messages
- Mobile-optimized interface

### 🏢 **Organization Support (Coming Soon)**
- Multi-organization workspace management
- Team collaboration features
- Role-based access control
- Shared email classification rules

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Gmail account
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/email-organizer.git
cd email-organizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Gmail OAuth2 Configuration
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# BetterAuth Configuration
BETTER_AUTH_SECRET=your_secure_random_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Gmail OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth2 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/email/gmail/callback`
6. Copy Client ID and Client Secret to your `.env.local`

### 5. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Connect Gmail**: Click "Connect Gmail" and authorize the application
3. **Fetch Emails**: Your emails will be automatically fetched and classified
4. **Browse Categories**: View your emails organized by AI-classified categories

### Email Classification
The AI automatically categorizes your emails based on content analysis:

- **Work**: Professional emails, meeting invitations, business correspondence
- **Personal**: Messages from family, friends, personal communications  
- **Shopping**: E-commerce confirmations, receipts, promotional offers
- **Newsletter**: Subscriptions, marketing emails, regular updates
- **Support**: Customer service, technical support, help requests
- **Other**: Any emails that don't fit the above categories

### Security Features
- Secure OAuth2 flow with Gmail
- Encrypted session management
- No plain text password storage
- Token refresh handling
- CORS protection

## 🛠️ Technical Architecture

### Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Authentication**: BetterAuth
- **Database**: SQLite with better-sqlite3
- **Email**: Gmail API + IMAP integration
- **AI**: OpenAI GPT-4 for classification
- **Icons**: Lucide React

### Project Structure

Check the design document for more details on the architecture and components.

[Design Document](https://github.com/your-repo/email-organizer/DESIGN.md)

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   ├── inbox/                    # Main inbox interface
│   └── signin/                   # Authentication page
├── components/                   # React components
│   ├── EmailConnection.tsx       # Gmail connection component
│   └── OrganizationSelector.tsx  # Organization selector (placeholder)
├── lib/                          # Core utilities
│   ├── auth.ts                   # BetterAuth configuration
│   ├── auth-client.ts            # Client-side auth methods
│   ├── email-connection.ts       # Gmail/IMAP connection logic
│   ├── email-utils.ts            # Email processing utilities
│   └── init-db.ts                # Database initialization
└── types/                        # TypeScript type definitions
```

### Database Schema
- **Users**: Authentication and profile data
- **Sessions**: Secure session management
- **Accounts**: OAuth provider connections
- **Verification**: Email verification tokens

---

