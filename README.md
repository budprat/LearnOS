# LearnOS

An intelligent, AI-powered adaptive learning platform that provides personalized educational experiences using advanced machine learning algorithms and modern web technologies.

## Overview

LearnOS is a comprehensive learning management system that leverages OpenAI's GPT-4o model to deliver personalized education through:

- **Adaptive Learning Paths**: AI-generated personalized learning journeys based on user goals and skill levels
- **Intelligent Tutoring**: Socratic method-based AI tutor that guides students through strategic questioning
- **Learning Style Detection**: VARK model-based analysis to identify visual, auditory, reading/writing, and kinesthetic preferences
- **Sentiment Analysis**: Real-time emotional state monitoring to provide better support and motivation
- **Competency Mapping**: Skills analysis and gap identification for career development
- **Predictive Interventions**: Early identification of learners at risk with personalized recommendations
- **Adaptive Assessments**: Dynamic question generation that adjusts difficulty based on user performance

## Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animation library

### Backend
- **Node.js** with **Express** - Server framework
- **TypeScript** - Type-safe development
- **PostgreSQL** (Neon) - Database
- **Drizzle ORM** - Type-safe database queries
- **Supabase** - Authentication and real-time features
- **OpenAI GPT-4o** - AI-powered features
- **Express Session** - Session management

### Authentication
- **Supabase Auth** - User authentication
- **Replit OAuth** - Replit integration (optional)
- **Passport.js** - Authentication middleware

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (Neon or local instance)
- **Supabase account** (for authentication)
- **OpenAI API key** (for AI features)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LearnOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

This project uses environment variables to manage sensitive credentials. **Never commit your actual credentials to version control.**

#### Server Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Supabase Configuration (Server-side)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Replit Authentication (if deploying on Replit)
REPLIT_DOMAINS=your-replit-domains
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc

# Session Configuration
SESSION_SECRET=your-random-session-secret-here
```

#### Client Environment Variables

Create a `client/.env.local` file:

```bash
cp client/.env.local.example client/.env.local
```

Edit `client/.env.local`:

```bash
# Supabase Configuration (Client-side)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Database Setup

#### Option A: Using Neon PostgreSQL (Recommended)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env` file as `DATABASE_URL`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb learnos`
3. Set `DATABASE_URL` in `.env`: `postgresql://localhost:5432/learnos`

#### Run Database Migrations

```bash
npm run db:push
```

This will create all necessary tables and schemas using Drizzle ORM.

#### Seed Initial Data (Optional)

Run the Supabase setup script to create initial tables:

```bash
psql $DATABASE_URL < supabase_setup.sql
```

### 5. Supabase Configuration

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Go to **Settings** → **API**
4. Copy the following to your environment files:
   - **URL**: `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public key**: `VITE_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY`

5. Enable authentication providers in **Authentication** → **Providers**

### 6. OpenAI Configuration

1. Create an [OpenAI](https://platform.openai.com) account
2. Generate an API key in **API Keys** section
3. Add the key to `.env` as `OPENAI_API_KEY`
4. Ensure you have sufficient credits for API usage

## Running the Application

### Development Mode

Start both the frontend and backend in development mode:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Type Checking

Run TypeScript type checking:

```bash
npm run check
```

## Project Structure

```
LearnOS/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries (Supabase client)
│   │   ├── pages/            # Page components
│   │   └── main.tsx          # Application entry point
│   └── .env.local.example    # Client environment template
├── server/                    # Backend Express application
│   ├── db.ts                 # Database connection
│   ├── index.ts              # Server entry point
│   ├── openai.ts             # OpenAI integration
│   ├── replitAuth.ts         # Replit OAuth
│   ├── routes.ts             # API routes
│   └── supabase.ts           # Supabase server client
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Database schema (Drizzle)
├── .env.example              # Server environment template
├── drizzle.config.ts         # Drizzle ORM configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

## Key Features

### 1. AI-Powered Course Recommendations

The system analyzes user progress, learning history, and skill levels to generate personalized course recommendations with priority scoring and estimated durations.

### 2. Adaptive AI Tutor

An intelligent tutoring system that:
- Uses the Socratic method to guide learning
- Provides hints without giving away answers
- Adapts explanations to user skill level
- Celebrates progress and achievements

### 3. Learning Path Generation

Creates customized learning journeys based on:
- User goals
- Current skill level
- Available time commitment
- Learning preferences

### 4. Progress Analytics

Comprehensive analysis of user performance including:
- Strengths and weaknesses identification
- Actionable recommendations
- Next steps guidance
- Motivational messaging

### 5. Learning Style Detection

Automatically detects dominant learning styles using the VARK model:
- **Visual**: Preference for diagrams, charts, and visual content
- **Auditory**: Preference for lectures and discussions
- **Reading/Writing**: Preference for text-based learning
- **Kinesthetic**: Preference for hands-on activities

### 6. Sentiment Analysis

Real-time emotional state monitoring to provide:
- Sentiment detection (positive, neutral, negative, frustrated, engaged)
- Confidence level assessment
- Motivation level tracking
- Adaptive support based on emotional state

### 7. Adaptive Assessments

Dynamic question generation that:
- Adjusts difficulty based on previous answers
- Provides progressive learning challenges
- Includes hints and detailed explanations
- Supports multiple question types (multiple-choice, short-answer, problem-solving)

### 8. Predictive Learning Interventions

AI-powered early warning system that:
- Identifies learners at risk of falling behind
- Recommends targeted interventions
- Prioritizes actions by urgency
- Predicts learning outcomes

### 9. Competency Mapping

Skills assessment and career development tool that:
- Maps acquired competencies from completed courses
- Identifies skill gaps for target roles
- Provides next steps for skill development
- Calculates overall career readiness

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/user` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create new course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### User Progress
- `GET /api/user-courses` - Get user's enrolled courses
- `POST /api/user-courses` - Enroll in a course
- `PUT /api/user-courses/:id` - Update course progress

### AI Features
- `POST /api/ai/recommendations` - Get personalized recommendations
- `POST /api/ai/tutor` - Interact with AI tutor
- `POST /api/ai/learning-path` - Generate learning path
- `POST /api/ai/progress-analysis` - Analyze user progress
- `POST /api/ai/adaptive-questions` - Generate adaptive assessments
- `POST /api/ai/learning-style` - Detect learning style
- `POST /api/ai/sentiment` - Analyze sentiment
- `POST /api/ai/interventions` - Get learning interventions
- `POST /api/ai/competencies` - Map competencies

## Security Best Practices

### Environment Variables

**IMPORTANT**: This project has been audited for security vulnerabilities. All sensitive credentials MUST be stored in environment variables and NEVER hardcoded in source files.

#### Protected Information:
- Database connection strings with credentials
- API keys (OpenAI, Supabase, etc.)
- Session secrets
- OAuth credentials
- Service role keys

#### What's in Version Control:
- `.env.example` - Template with placeholder values
- `client/.env.local.example` - Client-side template
- Source code with environment variable references ONLY

#### What's NOT in Version Control (`.gitignore`):
- `.env` - Actual server environment variables
- `.env.local` - Actual client environment variables
- `.env*.local` - Any local environment files

### Rotating Credentials

If you suspect your credentials have been exposed:

1. **Immediately rotate ALL credentials**:
   - Regenerate Supabase keys in dashboard
   - Reset database password
   - Generate new OpenAI API key
   - Create new session secret

2. **Update environment variables** with new credentials

3. **Review access logs** for any suspicious activity

4. **Update deployed environments** with new credentials

## Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:

- **users** - User accounts and profiles
- **courses** - Course catalog
- **user_courses** - User enrollments and progress
- **assessments** - Quiz and assessment data
- **learning_paths** - Personalized learning journeys
- **competencies** - Skills and competency tracking

See `shared/schema.ts` for detailed schema definitions.

## Deployment

### Replit Deployment

This project is configured for deployment on Replit:

1. Fork or import the project to Replit
2. Configure environment variables in **Secrets** tab
3. Run the application using the **Run** button

### General Deployment

For other platforms (Heroku, Vercel, Railway, etc.):

1. Set all environment variables in the platform's configuration
2. Ensure PostgreSQL database is accessible
3. Run migrations: `npm run db:push`
4. Build: `npm run build`
5. Start: `npm start`

## Development

### Adding New Features

1. Update database schema in `shared/schema.ts`
2. Run migrations: `npm run db:push`
3. Add API routes in `server/routes.ts`
4. Create frontend components in `client/src/components`
5. Update types as needed

### Testing AI Features

AI features require OpenAI API credits. For development:
- Monitor usage in OpenAI dashboard
- Use smaller models for testing if needed
- Implement rate limiting for production

## Troubleshooting

### Common Issues

**"Missing required environment variable"**
- Ensure all required environment variables are set in `.env` and `client/.env.local`
- Check that variable names match exactly (case-sensitive)

**Database connection fails**
- Verify DATABASE_URL is correct
- Check network connectivity to database
- Ensure database credentials are valid

**Supabase authentication errors**
- Confirm SUPABASE_URL and keys are correct
- Check that Supabase project is active
- Verify authentication providers are enabled

**OpenAI API errors**
- Verify OPENAI_API_KEY is valid
- Check API credit balance
- Review rate limits and quotas

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run type checking: `npm run check`
5. Commit your changes: `git commit -m "Add feature"`
6. Push to your fork: `git push origin feature-name`
7. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Review existing documentation
- Check troubleshooting section

## Changelog

### Version 1.0.0 (Current)

#### Security Updates
- Removed all hardcoded credentials from source code
- Implemented environment variable validation
- Added comprehensive .env.example templates
- Updated .gitignore to protect sensitive files
- Enhanced error messages for missing credentials

#### Features
- AI-powered adaptive learning
- Personalized recommendations
- Learning style detection
- Sentiment analysis
- Competency mapping
- Predictive interventions
- Adaptive assessments
- Real-time progress tracking

## Acknowledgments

- OpenAI for GPT-4o API
- Supabase for authentication and real-time features
- Neon for PostgreSQL hosting
- Replit for deployment platform
- All open-source contributors

---

**Built with ❤️ by the LearnOS Team**
