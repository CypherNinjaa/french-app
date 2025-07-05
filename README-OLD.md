# French Learning App

A modern, AI-powered French learning application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🚀 **Phase 1: User Authentication & Profiles** (✅ COMPLETED)

- **Multiple Authentication Methods**
  - Email & password login
  - Google OAuth integration
  - Anonymous login support
- **User Profile Management**
  - Profile creation and customization
  - Learning level tracking (Beginner, Intermediate, Advanced)
  - Custom preferences (notifications, theme)
  - Progress tracking and history
- **Error Handling & Validation**
  - Comprehensive form validation
  - User-friendly error messages
  - Loading states and feedback
  - Toast notifications for user actions

### 📋 **Coming Next (In Order of Development)**

1. **Module-Based Learning System**
2. **Lesson Content Management**
3. **Vocabulary Learning**
4. **Grammar Learning**
5. **Pronunciation System**
6. **AI Chat & Pronunciation Help**
7. **Reading Practice With Feedback**
8. **Assessment System**
9. **Admin Panel**
10. **Offline Capabilities**

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Groq API for conversational features
- **Speech**: Web Speech API (TTS/STT)
- **State Management**: React Context
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd french-learning-app
npm install
```

### 2. Environment Setup

**⚠️ SECURITY NOTICE**: Never commit actual API keys to version control!

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

3. The `.env` file is already in `.gitignore` to prevent accidental commits.

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables, indexes, and policies

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   └── profile/        # Profile management components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client configuration
├── App.tsx             # Main app component with routing
├── index.css           # Global styles with Tailwind
└── main.tsx            # App entry point
```

## Key Features Implemented

### Authentication System

- **Secure Authentication**: Built with Supabase Auth
- **Multiple Sign-in Methods**: Email/password and Google OAuth
- **Form Validation**: Real-time validation with error handling
- **Password Visibility**: Toggle for better UX
- **Loading States**: Visual feedback during authentication

### Profile Management

- **Editable Profiles**: In-place editing with save/cancel
- **Learning Levels**: Beginner, Intermediate, Advanced
- **Preferences**: Notifications, theme settings
- **Progress Tracking**: Ready for lesson completion data

### Error Handling

- **Comprehensive Validation**: Client-side form validation
- **User-Friendly Messages**: Clear error descriptions
- **Toast Notifications**: Success and error feedback
- **Loading States**: Prevents multiple submissions

### Platform Independence

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Browser Support**: Uses standard web APIs
- **Progressive Enhancement**: Graceful fallbacks
- **Cross-Platform Ready**: Can be built for web, iOS, Android

## Database Schema

The app uses a comprehensive database schema with:

- **User Management**: Profiles, preferences, progress tracking
- **Content Structure**: Modules, lessons, vocabulary, grammar
- **Learning Progress**: Detailed tracking of user advancement
- **Assessment System**: Tests, results, and scoring
- **AI Features**: Chat logs, pronunciation records
- **Security**: Row Level Security (RLS) policies

## Environment Variables

| Variable                 | Description                  | Required |
| ------------------------ | ---------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL    | ✅       |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key  | ✅       |
| `VITE_GROQ_API_KEY`      | Groq API key for AI features | ✅       |

## Development Guidelines

### Error Handling Strategy

1. **Input Validation**: Client-side validation for immediate feedback
2. **API Error Handling**: Graceful handling of network/server errors
3. **User Feedback**: Toast notifications for all user actions
4. **Loading States**: Visual indicators for async operations
5. **Fallback UI**: Error boundaries for component failures

### Code Organization

- **Component Separation**: Clear separation of concerns
- **TypeScript**: Full type safety throughout the app
- **Custom Hooks**: Reusable logic extraction
- **Context Pattern**: Global state management
- **Modular CSS**: Tailwind utility classes with component patterns

## Next Steps

1. **Setup Supabase Database**: Run the provided SQL schema
2. **Test Authentication**: Create accounts and test login flow
3. **Verify Profiles**: Check profile creation and editing
4. **Start Module System**: Begin implementing the learning modules

## Contributing

1. Follow the established patterns for components and hooks
2. Add comprehensive error handling for new features
3. Include TypeScript types for all new interfaces
4. Test authentication flows thoroughly
5. Maintain responsive design principles

## Support

- **Documentation**: Check the `.md` files in `.Roadmap/`
- **Database Schema**: See `supabase-schema.sql` for complete setup
- **Error Logs**: Check browser console and network tab
- **Supabase Dashboard**: Monitor auth and database activity

---

**Status**: ✅ Phase 1 Complete - User Authentication & Profiles
**Next**: 🔄 Phase 2 - Module-Based Learning System
