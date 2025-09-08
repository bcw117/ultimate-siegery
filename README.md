# Ultimate Siegery
A tool to help randomize your operator loadouts and teams

## Tech Stack
- Next.js
- Drizzle
- Supabase
- Clerk

## Requirements
- Node.js
- Supabase account
- Clerk account

## Installation
1. Install dependencies
 ```bash
 npm i
 ```
2. Run development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
#### .env file
```env

NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_KEY=<your_supabase_key>
DATABASE_URL=<your_database_url>

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_secret_key>

NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```
