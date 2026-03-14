Architecture Documentation: ArvyaX
System Overview

ArvyaX is designed as a full-stack application using Next.js. The frontend is built with React to provide a smooth and immersive user experience, while the backend logic is handled through serverless API routes. This approach keeps the architecture simple, scalable, and easy to maintain.

Data Flow

1. Journal Creation
When a user writes and submits a journal entry, the data flows through an API route and is stored in the database using Prisma ORM with NeonDB.

2. Analysis
If the user requests emotional analysis of their entry, the system sends the journal text to the backend API. The backend uses the Gemini SDK to analyze the content and returns structured JSON data, which is then parsed and displayed in the UI.

3. Insights
To help users understand their emotional patterns over time, the backend runs aggregation queries on stored journal entries. These queries generate statistics and insights that are shown on the user dashboard.

Scalability & Performance
How would you scale this to 100k users?

To support a large number of users, several improvements can be applied:

Database Scaling
The database can be scaled by introducing read replicas to distribute read-heavy workloads. Alternatively, a globally distributed database such as Neon’s edge infrastructure can be used to reduce latency.

Caching Layer
Adding a caching layer using Redis or Upstash can significantly improve performance. Frequently accessed journal entries and LLM analysis results can be served from cache instead of querying the database or calling the model again.

Serverless Infrastructure
Since the app is built with Next.js and deployed on Vercel, it benefits from automatic horizontal scaling. Serverless functions can handle increased traffic without requiring manual infrastructure management.

How would you reduce LLM costs?

LLM calls can become expensive, so a few optimizations help reduce cost:

Prompt Optimization
Using smaller and more efficient models such as Gemini Flash for routine analysis tasks helps reduce token usage and cost.

Response Caching
If the same journal text is analyzed multiple times, the result can be retrieved from a cache instead of calling the LLM again.

Batch Processing
Instead of analyzing entries one by one, multiple journal entries can be grouped together and processed in a single LLM request.

How would you cache repeated analysis?

Currently, the LLM output is stored directly in the JournalEntry table, so repeated analysis of the same entry is avoided.

To further optimize this:

A Redis cache layer can be added.

The hash of the journal text can be used as the cache key.

If the hash already exists in the cache, the system returns the cached result instead of making a new LLM request.

How would you protect sensitive journal data?

Since journal entries may contain personal or emotional information, protecting user data is critical.

Encryption
Sensitive fields such as journal text can be protected using Field-Level Encryption (FLE) in PostgreSQL.

Authentication & Authorization
Implement secure authentication using tools like NextAuth.js or Clerk to ensure users can only access their own journal data.

Compliance
The system can be designed to follow GDPR or HIPAA guidelines, ensuring proper handling of personal and health-related information.

Bonus Features Implemented

Premium UI Design
The interface uses glassmorphism effects, custom color palettes, and subtle noise textures to create a polished and modern look.

Micro-animations
Smooth interactions and transitions are implemented using Framer Motion, improving the overall user experience.

NeonDB Integration
The database is powered by NeonDB, providing a fully serverless PostgreSQL environment.

Gemini AI Integration
Emotion analysis is powered by Google’s Gemini models, enabling detailed and high-quality analysis of journal entries.
