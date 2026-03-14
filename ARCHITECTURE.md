# Architecture Documentation: ArvyaX

## System Overview
ArvyaX is built as a full-stack Next.js application, leveraging serverless API routes for backend logic and a React-based frontend for immersive user experience.

### Data Flow
1. **Journal Creation**: User submits experience -> API -> Prisma -> NeonDB.
2. **Analysis**: User requests analysis -> API -> Gemini SDK -> JSON Parsing -> UI Update.
3. **Insights**: Aggregation queries run on the backend to provide user-specific statistics.

## Scalability & Performance

### How would you scale this to 100k users?
- **Database Scaling**: Move to a read-replica architecture or use a globally distributed database (like Neon's edge capabilities).
- **Caching**: Implement Redis/Upstash for entry retrieval and LLM analysis results.
- **Serverless Scaling**: Next.js on Vercel naturally scales horizontally.

### How would you reduce LLM cost?
- **Prompt Engineering**: Use smaller, more efficient models (like Gemini Flash) for routine tasks.
- **Response Caching**: If the same text is analyzed multiple times, serve from cache.
- **Batching**: Allow batch analysis of multiple entries in one LLM call.

### How would you cache repeated analysis?
- Store the LLM result directly in the `JournalEntry` table (already implemented in schema).
- Add a cache layer (Redis) using the hash of the journal text as the key.

### How would you protect sensitive journal data?
- **Encryption**: Implement Field-Level Encryption (FLE) for the `text` field in PostgreSQL.
- **Auth**: Proper JWT-based authentication (e.g., NextAuth.js or Clerk) to ensure user data isolation.
- **Compliance**: Adhere to HIPAA or GDPR standards for PII and health data.

## Bonus Features Implemented
- **Premium Aesthetics**: Glassmorphism, tailored colors, and custom noise filters.
- **Micro-animations**: Used Framer Motion for smooth tab transitions and form interactions.
- **NeonDB Integration**: Fully serverless database setup.
- **Gemini Integration**: High-fidelity emotion analysis using the latest Generative AI.
