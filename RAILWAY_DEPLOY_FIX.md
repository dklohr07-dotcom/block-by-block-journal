# Railway deployment fix

This package fixes the Railway deploy issue seen in the logs.

## What changed

The previous `package-lock.json` contained internal package URLs like:

`packages.applied-caas-gateway1.internal.api.openai.org`

Railway cannot access those URLs, so `npm ci` timed out while downloading dependencies. This version changes dependency tarball URLs back to the public npm registry and asks Railway to use Node 20.

## Required Railway variables

Add your real values in Railway under Variables:

```env
NODE_ENV=production
SESSION_SECRET=replace_with_a_long_random_secret
SUPABASE_URL=replace_with_your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=replace_with_your_supabase_service_role_key
STRIPE_SECRET_KEY=replace_with_your_stripe_secret_key
STRIPE_PRICE_ID=replace_with_your_stripe_price_id
STRIPE_WEBHOOK_SECRET=replace_with_your_stripe_webhook_secret
PUBLIC_BASE_URL=https://your-railway-domain.up.railway.app
```

## Deploy steps

1. Replace your GitHub repo files with this package, or at minimum replace `package.json`, `package-lock.json`, and add `railway.json`.
2. Commit and push to GitHub.
3. In Railway, open your service and trigger Redeploy.
4. After it deploys, generate/open the Railway public domain.
5. Update `PUBLIC_BASE_URL` to the final Railway domain.
6. Configure your Stripe webhook endpoint to `https://your-domain/stripe/webhook`.
