# 💎 Block by Block — Setup Guide
## Railway · Supabase · Stripe · $29.99/year

---

## 🗂 Files
```
├── index.html           Main app
├── pricing.html         Parent-focused pricing page  ← NEW
├── login.html           Login / signup               ← NEW
├── server.js            Express + Supabase + Stripe  ← NEW
├── package.json         Dependencies                 ← UPDATED
├── .env.example         Copy → .env, fill in values  ← NEW
├── supabase-schema.sql  Paste into Supabase SQL editor ← NEW
└── README.md            This file
```

---

## STEP 1 — Supabase (10 min, free)

1. **supabase.com** → New Project (name it `block-by-block`)
2. Settings → API → copy:
   - Project URL → `SUPABASE_URL`
   - `anon` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. SQL Editor → paste `supabase-schema.sql` → **Run**
4. Authentication → Settings → enable **Email confirmations**
5. (Optional) Authentication → Providers → enable **Google**

---

## STEP 2 — Stripe (15 min, free until you earn)

1. **stripe.com** → create account
2. Developers → API Keys → copy Secret + Publishable keys
3. **Create your product:**
   - Products → Add Product
   - Name: `Block by Block Premium`
   - Add price: **$29.99 / year** (recurring, annual)
   - Copy the Price ID → `STRIPE_PRICE_PREMIUM_ANNUAL`
4. **Webhook:**
   - Developers → Webhooks → Add endpoint
   - URL: `https://YOUR-APP.up.railway.app/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy Signing secret → `STRIPE_WEBHOOK_SECRET`
5. Settings → Billing → **Customer portal → Activate**

---

## STEP 3 — Railway Variables (5 min)

Railway → your project → **Variables** → add:

| Variable | Value |
|---|---|
| `APP_URL` | `https://YOUR-APP.up.railway.app` |
| `SUPABASE_URL` | From Supabase Settings → API |
| `SUPABASE_ANON_KEY` | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings → API |
| `STRIPE_SECRET_KEY` | From Stripe Developers → API Keys |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Developers → Webhooks |
| `STRIPE_PRICE_PREMIUM_ANNUAL` | From Stripe Products → your price ID |
| `NODE_ENV` | `production` |

---

## STEP 4 — Push & Deploy

```bash
git add .
git commit -m "feat: add Stripe + Supabase freemium system"
git push
```

Railway auto-redeploys. Watch logs for:
```
🧱 Block by Block running on port 3000
```

---

## STEP 5 — Test Payments

1. Switch Stripe to **Test Mode** (toggle top-left in dashboard)
2. Go to `/pricing.html` → click "Get Premium"
3. Complete signup → redirected to Stripe checkout
4. Use test card: `4242 4242 4242 4242` · any future date · any CVC
5. Check Supabase → Table Editor → profiles → `plan` should be `premium`

To test webhook locally:
```bash
stripe listen --forward-to localhost:3000/stripe/webhook
```

---

## How Premium Gating Works

In `index.html`, call `/auth/me` on load to check the user's plan:

```javascript
async function initApp() {
  try {
    const res  = await fetch('/auth/me');
    const user = await res.json();

    if (user.isPremium) {
      // Show all features
      unlockAllFeatures();
    } else {
      // Limit journal entries, hide premium tools
      limitToFreeFeatures();
      showUpgradeBanner(); // link to /pricing.html
    }
  } catch {
    // Not logged in — guest mode (limited features)
    guestMode();
  }
}
```

---

## 💰 Revenue Projections

| Paying parents | Monthly revenue | Annual revenue |
|---|---|---|
| 10 | $25 | $300 |
| 50 | $125 | $1,500 |
| 200 | $500 | $6,000 |
| 500 | $1,250 | $15,000 |
| 1,000 | $2,500 | $30,000 |

*(Based on $29.99/year = ~$2.50/month)*

---

## 📧 Support
- Email: hello@blockbyblockjournal.com
- Crisis Text Line: Text HOME to 741741

❤️ You matter. Your story matters. Your future matters.


## Latest launch patch

This package includes remember-me login, clearer Premium welcome text, a functional homepage community signup form, and security hardening. If your Supabase database already exists, run `SUPABASE_COMMUNITY_MIGRATION.sql` once in the Supabase SQL Editor before testing the community form.
