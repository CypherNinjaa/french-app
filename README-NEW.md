# French Learning App

A modern, interactive French learning platform built with React, TypeScript, and Supabase. Features AI-powered lessons, pronunciation practice, and gamified learning experiences.

## 🚀 Current Status: Stage 2 Complete

**✅ Stage 1:** User Authentication & Profiles (Complete)  
**✅ Stage 2:** Modern UI/UX & Module-Based Learning System (Complete)  
**🚧 Stage 3:** Content & Learning Features (Next)

## 🎯 Features

### ✅ Completed Features

- **Modern Authentication System**

  - Email/password login and registration
  - Google OAuth integration
  - User profile management
  - Secure session handling

- **Modern UI/UX**

  - shadcn/ui component library
  - Tailwind CSS styling
  - Framer Motion animations
  - Responsive design
  - Dark mode support

- **Learning Dashboard**

  - Module progress tracking
  - Learning statistics
  - Interactive module cards
  - Progress visualization

- **Advanced Data Management**
  - TanStack Query for server state
  - Optimistic updates
  - Background refetching
  - Error handling with retries

### 🚧 Upcoming Features (Stage 3)

- Interactive lesson content
- Vocabulary flashcards
- Assessment system
- AI chat assistance (Groq API)
- Pronunciation practice
- Audio integration
- Offline capabilities

## 🛠 Technology Stack

### Frontend

- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation

### UI/UX

- **shadcn/ui** - Modern, accessible components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **CSS Variables** - Theme customization

### Backend

- **Supabase** - Authentication, database, and storage
- **PostgreSQL** - Relational database
- **Row Level Security** - Data protection
- **Real-time subscriptions** - Live updates

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **React Query DevTools** - Development debugging
- **Hot Module Replacement** - Fast development

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── learning/       # Learning dashboard components
│   ├── layout/         # Layout and navigation
│   └── common/         # Shared components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API service layer
├── types/              # TypeScript definitions
└── contexts/           # React contexts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd french-learning-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   - Run the SQL schema in your Supabase SQL editor:

     ```bash
     # Copy the contents of supabase-schema.sql
     # Paste and execute in Supabase dashboard
     ```

   - Optional: Add sample data:
     ```bash
     # Copy and execute sample-data.sql for test content
     ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**
   ```
   http://localhost:5173
   ```

## 🎨 Design System

### Colors

- **Primary:** Blue to Purple gradient
- **Secondary:** Neutral grays
- **Success:** Green (#22C55E)
- **Warning:** Yellow (#EAB308)
- **Error:** Red (#EF4444)

### Components

- Consistent spacing (4px base unit)
- Accessible color contrasts
- Responsive breakpoints
- Smooth animations

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Tablet:** Adaptive layouts for medium screens
- **Desktop:** Full-featured desktop experience
- **Touch Friendly:** Large touch targets

## 🔒 Security Features

- Row Level Security (RLS) policies
- Secure authentication flows
- Input validation with Zod
- XSS protection
- CSRF protection via Supabase

## 🚀 Performance

- **Bundle Size:** 573 kB (176 kB gzipped)
- **First Load:** Optimized with code splitting
- **Caching:** Aggressive caching with React Query
- **Animations:** 60fps smooth animations

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Consistent code formatting
- Component composition patterns

## 📖 Documentation

- [Stage 1 Documentation](./PHASE-1-COMPLETE.md)
- [Stage 2 Documentation](./STAGE-2-COMPLETE.md)
- [Feature Specifications](./.Roadmap/french_learning_app_features.md)
- [Database Schema](./supabase-schema.sql)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

### Stage 3: Content & Learning Features

- [ ] Lesson content system
- [ ] Vocabulary learning tools
- [ ] Assessment and testing
- [ ] Audio integration
- [ ] AI chat assistant

### Stage 4: Advanced Features

- [ ] Pronunciation analysis
- [ ] Social learning features
- [ ] Offline capabilities
- [ ] Mobile app (React Native)

### Stage 5: AI & Analytics

- [ ] Personalized learning paths
- [ ] Advanced analytics
- [ ] ML-powered recommendations
- [ ] Voice recognition

---

**Built with ❤️ for French language learners**
