# GitHub Upload and Launch Checklist

This package is GitHub-ready. It excludes `node_modules`, private `.env` files, and temporary syntax-check files.

## 1. Confirm these files are in your GitHub repo

Your repo should include:

- `package.json`
- `package-lock.json`
- `server.js`
- `index.html`
- `login.html`
- `pricing.html`
- `supabase-schema.sql`
- `.env.example`
- `.gitignore`
- `README.md`

Your repo should not include:

- `node_modules/`
- `.env`
- local database files
- log files
- temporary generated files

## 2. Upload to GitHub

From inside this folder, run:

```bash
git init
git add .
git commit -m "Initial GitHub-ready app upload"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPO_URL` with the HTTPS URL from your GitHub repository.

## 3. Test locally after upload

Clone the repo into a fresh folder, then run:

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

If your app needs live Supabase or Stripe features locally, create a `.env` file from `.env.example` and fill in your real keys. Do not commit `.env`.

## 4. Configure Supabase

In Supabase, run the SQL in:

```text
supabase-schema.sql
```

Then copy your project values into your hosting platform environment variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 5. Configure Stripe

In Stripe, create your products/prices and add these environment variables to your host:

```env
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_ANNUAL=
STRIPE_PRICE_PREMIUM_MONTHLY=
```

Set your Stripe webhook endpoint to:

```text
https://YOUR_DOMAIN/api/stripe-webhook
```

## 6. Deploy

For Render/Railway/Fly-style Node hosting, use:

```bash
npm install
npm start
```

Recommended environment variables:

```env
NODE_ENV=production
PORT=3000
APP_URL=https://YOUR_DOMAIN
SESSION_SECRET=use-a-long-random-secret
```

Some hosts provide `PORT` automatically. If so, use their value.

## 7. Final pre-launch checks

Run:

```bash
npm audit
npm start
```

Then test the site on desktop and mobile widths. Check login/signup, journal saving, pricing, checkout, Stripe webhook handling, and Supabase data writes.
