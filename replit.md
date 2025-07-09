# AI-Powered Personalized Learning Platform

## Overview

This is a comprehensive AI-powered personalized learning platform built with modern web technologies. The platform provides intelligent tutoring, adaptive content delivery, real-time analytics, and collaborative learning features. It uses React for the frontend, Express.js for the backend, PostgreSQL with Drizzle ORM for data persistence, and OpenAI for AI-powered features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Style**: RESTful endpoints with WebSocket support
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Centralized user operations in storage layer
- **Security**: HTTP-only cookies with secure flags

### AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Features**: 
  - Personalized course recommendations
  - AI tutor chat responses
  - Learning path suggestions
  - Progress analysis
- **Configuration**: Environment-based API key management

### Database Schema
- **Users**: Profile information, learning statistics, preferences
- **Courses**: Course content, metadata, skill levels
- **Learning Paths**: Structured learning sequences
- **Assessments**: Quizzes, projects, and evaluations
- **Study Groups**: Collaborative learning spaces
- **AI Tutor Sessions**: Chat history and context
- **Recommendations**: AI-generated learning suggestions

### UI Components
- **Design System**: shadcn/ui with "new-york" style
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Accessibility**: ARIA-compliant components from Radix UI
- **Theming**: CSS custom properties for light/dark mode support

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Middleware checks session validity
3. If invalid, redirects to Replit Auth
4. On success, creates/updates user record
5. Establishes authenticated session

### Learning Data Flow
1. User interactions captured in real-time
2. Progress data stored in PostgreSQL
3. AI analyzes learning patterns
4. Personalized recommendations generated
5. Adaptive content delivered to frontend

### Real-time Features
- WebSocket connections for live collaboration
- Server-sent events for progress updates
- Optimistic updates with TanStack Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **openai**: AI integration for personalization
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe styling utilities

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied automatically
4. **Assets**: Static files served from build directory

### Environment Configuration
- **Development**: Hot reload with Vite dev server
- **Production**: Optimized builds with static file serving
- **Database**: Environment-specific connection strings
- **AI Services**: Secure API key management

### Hosting Requirements
- **Runtime**: Node.js 18+ with ES module support
- **Database**: PostgreSQL 12+ (Neon serverless recommended)
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `OPENAI_API_KEY`: OpenAI API access
  - `SESSION_SECRET`: Session encryption key
  - `REPLIT_DOMAINS`: Authorized domains for auth

### Scalability Considerations
- **Database**: Connection pooling with Neon serverless
- **Sessions**: PostgreSQL-backed for horizontal scaling
- **AI Requests**: Rate limiting and caching strategies
- **Static Assets**: CDN-ready build output

## Recent Changes

### Strategic Planning Documents (January 2025)
- **RuralRise OS Integration Analysis**: Created comprehensive strategic document analyzing potential platform transformation
- **Unified Implementation Plan**: Combined RuralRise insights with existing roadmap into actionable 12-month plan
- **Key Focus Areas**: Offline-first architecture, job-readiness outcomes, AI-scaled mentorship, multi-stakeholder ecosystem
- **Vision**: Transform from learning platform to Human Capital Development Engine
- **Documents**: 
  - Strategic Analysis: `RURALRISE_INTEGRATION_ANALYSIS.md`
  - Implementation Plan: `UNIFIED_IMPLEMENTATION_PLAN.md`

### Supabase Authentication System (July 2025)
- **Complete Authentication Overhaul**: Replaced Replit Auth with Supabase authentication system
- **User Management**: Fixed user ID format from integer to UUID for proper Supabase integration
- **Database Setup**: Created comprehensive SQL setup script with all necessary tables and RLS policies
- **API Security**: Updated all API endpoints to use proper Supabase JWT token validation
- **Sample Data**: Added sample courses and lessons to populate the platform for testing
- **Error Handling**: Improved authentication error handling and user feedback
- **Session Management**: Implemented proper session handling with Supabase auth state changes

### Landing Page Overhaul (July 2025)
- **Today's Learning Section**: Added daily goals with progress tracking and lesson status indicators
- **Weekly Activity Chart**: Interactive line chart showing learning hours and completion trends
- **Upcoming Events Preview**: Color-coded event types with scheduling information
- **AI Insights Section**: Personalized recommendations based on learning patterns
- **Learning Analytics Preview**: Progress tracking with trend indicators for different subjects
- **Interactive AI Tutor Demo**: Quick action buttons and chat interface for platform preview
- **Enhanced Hero Section**: Trust indicators, improved CTAs, and platform statistics
- **Platform Screenshot Update**: Added navigation buttons for Lessons and Community

### Previous Platform Enhancements
- Enhanced AI tutor with suggested questions and comprehensive sidebar
- Overhauled analytics with interactive Recharts visualizations
- Improved community page with polished study groups and leaderboard
- Enhanced courses with filtering, search, and categories sidebar
- Implemented professional visual polish throughout the platform