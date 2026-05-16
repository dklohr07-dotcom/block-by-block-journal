# Security notes for launch

This build adds practical production protections for the current Express/Railway/Supabase app:

- HTTP-only auth cookies so browser JavaScript cannot read the session token.
- Secure cookies in production, CORS restricted to `APP_URL`, and `trust proxy` for Railway.
- Helmet security headers, HSTS, nosniff, referrer policy, and disabled Express fingerprinting.
- Rate limiting on signup, login, forgot-password, and API routes.
- Supabase Row Level Security for user profile and mood data.
- Community form submissions go through the server using the Supabase service role key; the key must remain only in Railway variables.

Before public launch, confirm:

- Railway variables do not expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code.
- Your Supabase project has strong email/password settings and any required email confirmation policies.
- Stripe webhook signing is configured and `STRIPE_WEBHOOK_SECRET` matches Railway.
- `APP_URL` is your real Railway/custom domain.
- Run `SUPABASE_COMMUNITY_MIGRATION.sql` once if your Supabase database already exists.
