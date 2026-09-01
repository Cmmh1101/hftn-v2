# Hope For The Nations

Public site + admin dashboard for Hope For The Nations, built with Next.js, Supabase, Stripe, Resend, and a Google Sheets sync.

## Stack

- **Next.js 16** (App Router) + **Tailwind CSS v4** + **Storybook** for the component kit (`components/ui`)
- **Supabase**: Postgres, Auth (admin dashboard only), Storage
- **Stripe Checkout**: one-time, monthly, and School of Hope sponsorship donations
- **Resend**: contact form emails + donation receipts
- **Google Apps Script**: donations/contact syncs to a Google Sheet (`apps-script/hftn-sync.gs`)
- **Netlify**: deploy target (`netlify.toml`)

## Local setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in the values (see below for where each comes from).
3. Set up Supabase — see [supabase/README.md](supabase/README.md).
4. `npm run dev` — public site at [localhost:3010](http://localhost:3010) (or whatever port is free), admin at `/admin/login`.
5. `npm run storybook` — component kit at [localhost:6006](http://localhost:6006).

## Where each credential comes from

| Env var | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (use the test key while developing) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → your endpoint's signing secret (or `stripe listen` output locally) |
| `RESEND_API_KEY` | Resend → API Keys |
| `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_SHARED_SECRET` | Set up per `apps-script/hftn-sync.gs`'s header comment |

## Testing the money paths locally

```bash
stripe listen --forward-to localhost:3010/api/webhooks/stripe
```

Use a [Stripe test card](https://docs.stripe.com/testing) on `/donate` and confirm a row appears in the `donations` table.

## Deploying

Connect the repo to Netlify (uses `netlify.toml` + `@netlify/plugin-nextjs`), then set every variable from `.env.local` in Netlify's Site settings → Environment variables. Point the Stripe webhook endpoint at `https://<your-site>/api/webhooks/stripe` once deployed.
