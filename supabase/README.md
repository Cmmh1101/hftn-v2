# Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (or run locally with `supabase start`, which needs Docker).
2. Copy `.env.local.example` to `.env.local` and fill in the three Supabase values from **Project Settings → API**.
3. Apply the schema:
   - Hosted: `npx supabase link --project-ref <your-project-ref>` then `npx supabase db push`.
   - Local: `npx supabase start` (applies `migrations/` and `seed.sql` automatically).
4. Create your first admin user: **Authentication → Add user** in the Supabase dashboard (email + password). A `profiles` row is created automatically with `role = 'viewer'`.
5. Promote that user to admin in the **SQL Editor**:
   ```sql
   update profiles set role = 'admin' where id = '<the user's UUID from Authentication>';
   ```
6. Log in at `/admin/login` with that email/password once the admin dashboard is wired up.
