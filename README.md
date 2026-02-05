# Ultimate Siegery 
The tool to help customize, randomize and store your operator loadouts and find fun challenges to make playing Siege fun!

## Key Features:
- Interface for customizing and saving operator loadouts
- Loadout randomizer to force playstyle variety and test player skill
- Generate individual and team challenges to keep matches fun and engaging

## Tech Stack
- Frontend: Next.js w/ Shadcn
- Backend: Next.js Route Handlers and React Server Actions
- Database: Supabase w/ Drizzle (ORM)
- Authentication: Clerk



## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)
- [Supabase](https://supabase.com/) & [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Clerk](https://clerk.com/)
- [Docker](https://www.docker.com/)

### Setup Guide
1. Clone and access the repository:

   ```bash
   git clone https://github.com/bcw117/ultimate-siegery.git
   ```
2. Install node packages:
   
   ```bash
   pnpm i
   ```
3. Start a local Supabase instance w/ Docker:
   
   Make sure that you have Docker installed and that it is running
   ```bash
   supabase start
   supabase status
   ```
   
4. Populate your .env file
   
   Use the [.env.template](.env.template) in the repository and fill it with your own environment variables:
   ```env
   
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
   NEXT_PUBLIC_SUPABASE_KEY=<your_supabase_key>
   DATABASE_URL=<your_database_url>
   
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   CLERK_SECRET_KEY=<your_secret_key>
   
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
   ```
   
5. Run your local development server
   ```bash
   pnpm run dev
   ```
6. Happy coding!

## License 
This project is licensed under the [MIT license](LICENSE)
