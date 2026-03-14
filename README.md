# ArvyaX: AI-Assisted Journal System

ArvyaX is a premium journal system designed for nature immersion sessions. It captures user experiences, analyzes emotional states using LLMs, and provides long-term mental health insights.

## Features
- **Premium Glassmorphic UI**: A state-of-the-art dark mode interface with subtle micro-animations.
- **Atmospheric Sessions**: Track journals for Forest, Ocean, and Mountain environments.
- **LLM Emotion Analysis**: Real-time analysis of entry sentiment and themes using Google Gemini AI.
- **Mental State Insights**: Aggregate dashboard showing emotional trends and keyword clouds.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **AI**: Google Generative AI (Gemini 1.5 Flash)

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="your-postgresql-url"
   GOOGLE_API_KEY="your-gemini-api-key"
   ```
4. Push the database schema:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation
- `POST /api/journal`: Create a new entry.
- `GET /api/journal?userId={id}`: List all entries for a user.
- `POST /api/journal/analyze`: Get LLM analysis for text.
- `GET /api/journal/insights/{userId}`: Get user mental state statistics.
