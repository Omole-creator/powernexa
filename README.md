# PowerNexa Solutions

Marketing site and admin panel for PowerNexa Solutions, a solar, inverter, and
battery installation business serving Lagos, Nigeria.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Data
lives in Supabase (Postgres), accessed only from the server.

See `docs/PRD.md` and `docs/SPEC.md` for the product and technical spec, and
`CLAUDE.md` for a running summary of decisions and the blog content roadmap.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
   Full step-by-step is in the setup guide (ask for it again if you don't have
   a copy).

3. Copy `.env.example` to `.env.local` and fill in real values (Supabase URL
   and service role key, admin email/password, a random session secret).

4. Create the admin account and launch blog posts:

   ```bash
   npm run seed:admin
   npm run seed:blog
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login`
   for the admin panel.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — run ESLint
- `npm run seed:admin` — create or update the admin account from `.env.local`
- `npm run seed:blog` — publish the 6 launch blog posts (safe to re-run)

## Deployment

Deploy to Vercel and set the same environment variables from `.env.example`
in the Vercel project settings. Supabase is a managed Postgres, so there is
no local database file to worry about on a serverless platform.
