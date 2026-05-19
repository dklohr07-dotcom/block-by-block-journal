// ═══════════════════════════════════════════════════════════
//  Block by Block Journal — Production Server
//  Stack: Express · Supabase · Stripe
//  Primary customer: Parents buying for their kids
//  Price: $29.99/year (Premium) · Free tier always available
// ═══════════════════════════════════════════════════════════
const express      = require("express");
const path         = require("path");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
require("dotenv").config();

// ── Supabase ─────────────────────────────────────────────────
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // server-side only
  {
    realtime: {
      transport: WebSocket,
    },
  }
);

// ── Stripe ────────────────────────────────────────────────────
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 3000;

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PREMIUM_ANNUAL",
  "APP_URL",
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.warn(`⚠️  Missing environment variables: ${missingEnv.join(", ")}`);
}

function appOrigin() {
  try { return new URL(process.env.APP_URL).origin; }
  catch { return undefined; }
}

// ── Middleware ────────────────────────────────────────────────
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false, // Inline app scripts/styles are used in this single-file build.
  crossOriginEmbedderPolicy: false,
}));
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes and try again." },
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
const allowedOrigin = appOrigin();
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigin || origin === allowedOrigin) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
  credentials: true,
}));
app.use(cookieParser());
// Stripe webhook must receive raw body — before express.json()
app.use("/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "250kb" }));
app.use(express.static(path.join(__dirname), { extensions: ["html"] }));
app.use("/api", apiLimiter);

// ── Auth helper ───────────────────────────────────────────────
async function requireAuth(req, res, next) {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid session" });
  req.user = user;
  next();
}

async function getProfile(userId) {
  const { data } = await supabase
    .from("profiles").select("*").eq("id", userId).single();
  return data;
}

// ═══════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════

// POST /auth/signup
// Body: { email, password, parentName, childUsername, plan }
app.post("/auth/signup", authLimiter, async (req, res) => {
  const { email, password, parentName, childUsername, plan } = req.body;

  if (!email || !password || !parentName || !childUsername)
    return res.status(400).json({ error: "All fields are required." });
  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters." });

  try {
    // 1. Create Supabase auth user
    const { data: authData, error: signupErr } =
      await supabase.auth.admin.createUser({
        email, password,
        email_confirm: true,
        user_metadata: { parentName, childUsername, plan: plan || "free" },
      });
    if (signupErr) throw signupErr;

    const uid = authData.user.id;

    // 2. Create profile row
    await supabase.from("profiles").insert({
      id:             uid,
      parent_name:    parentName,
      child_username: childUsername,
      email,
      plan:           "free",   // always start free; upgrade via Stripe
      xp:             0,
      created_at:     new Date().toISOString(),
    });

    // 3. Create a server-side session cookie so new users remain signed in after signup.
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
    if (loginErr) throw loginErr;
    res.cookie("access_token", loginData.session.access_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // 4. If premium selected → create Stripe Checkout Session
    if (plan === "premium") {
      const session = await stripe.checkout.sessions.create({
        mode:                 "subscription",
        payment_method_types: ["card"],
        customer_email:       email,
        line_items: [{
          price:    process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
          quantity: 1,
        }],
        // Pass userId so webhook can upgrade the profile
        metadata:   { userId: uid },
        success_url: `${process.env.APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${process.env.APP_URL}/pricing.html`,
        // Pre-fill the Stripe form with a helpful description
        custom_text: {
          submit: {
            message: "Your child's journal and all premium features unlock instantly after payment."
          }
        },
      });
      return res.json({ checkoutUrl: session.url });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Signup error:", err.message);
    if (err.message?.includes("already registered"))
      return res.status(400).json({ error: "An account with that email already exists." });
    if (err.code === "23505" || err.message?.includes("duplicate key"))
      return res.status(400).json({ error: "That child username is already taken." });
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// POST /auth/login
app.post("/auth/login", authLimiter, async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password." });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Set HTTP-only session cookie. "Remember me" keeps the session longer on trusted devices.
    const cookieOptions = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    if (rememberMe) cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    else cookieOptions.maxAge = 8 * 60 * 60 * 1000;
    res.cookie("access_token", data.session.access_token, cookieOptions);

    const profile = await getProfile(data.user.id);
    res.json({
      success: true,
      user: {
        id:             data.user.id,
        email:          data.user.email,
        childUsername:  profile?.child_username,
        parentName:     profile?.parent_name,
        plan:           profile?.plan || "free",
      },
    });
  } catch (err) {
    res.status(401).json({ error: "Incorrect email or password." });
  }
});

// POST /auth/logout
app.post("/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ success: true });
});

// POST /auth/forgot-password
app.post("/auth/forgot-password", authLimiter, async (req, res) => {
  const { email } = req.body;
  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.APP_URL}/reset-password`,
    });
  }
  res.json({ success: true }); // always succeed (don't reveal if email exists)
});

// GET /auth/me — current user info (called on every page load)
app.get("/auth/me", requireAuth, async (req, res) => {
  const profile = await getProfile(req.user.id);
  res.json({
    id:            req.user.id,
    email:         req.user.email,
    childUsername: profile?.child_username,
    parentName:    profile?.parent_name,
    plan:          profile?.plan || "free",
    xp:            profile?.xp || 0,
    isPremium:     ["premium", "school"].includes(profile?.plan),
  });
});

// GET /auth/google — starts Google OAuth flow
app.get("/auth/google", (req, res) => {
  // Supabase handles the OAuth dance; it redirects back to APP_URL with #access_token
  const redirectTo = encodeURIComponent(process.env.APP_URL);
  const url = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
  res.redirect(url);
});

// POST /auth/google-callback — called by the frontend after it reads #access_token from URL
// Exchanges the token for a server-side session cookie
app.post("/auth/google-callback", async (req, res) => {
  const { access_token, refresh_token } = req.body;
  if (!access_token)
    return res.status(400).json({ error: "Missing access token" });

  try {
    // Verify the token with Supabase and get the user
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) throw error || new Error("Invalid token");

    // Check if a profile row already exists
    const existing = await getProfile(user.id);

    // First time Google login — create a profile row
    if (!existing) {
      const username = user.user_metadata?.full_name?.split(" ")[0] ||
                       user.email?.split("@")[0] ||
                       "Adventurer";
      await supabase.from("profiles").insert({
        id:             user.id,
        parent_name:    user.user_metadata?.full_name || "",
        child_username: username,
        email:          user.email,
        plan:           "free",
        xp:             0,
        created_at:     new Date().toISOString(),
      });
    }

    // Set session cookie so user stays logged in
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    const profile = existing || await getProfile(user.id);
    res.json({
      success:       true,
      isNewUser:     !existing,   // ← tells frontend to show onboarding
      childUsername: profile?.child_username,
      plan:          profile?.plan || "free",
    });
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.status(401).json({ error: "Google sign-in failed" });
  }
});

// ═══════════════════════════════════════════════════════════
//  STRIPE ROUTES
// ═══════════════════════════════════════════════════════════

// GET /checkout?plan=premium_annual  (logged-in users)
app.get("/checkout", requireAuth, async (req, res) => {
  const PRICES = {
    premium_annual:  process.env.STRIPE_PRICE_PREMIUM_ANNUAL,   // $29.99/yr
    premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,  // optional $3.99/mo
  };
  const priceId = PRICES[req.query.plan] || PRICES.premium_annual;

  try {
    const session = await stripe.checkout.sessions.create({
      mode:                 "subscription",
      payment_method_types: ["card"],
      customer_email:       req.user.email,
      line_items:           [{ price: priceId, quantity: 1 }],
      metadata:             { userId: req.user.id },
      success_url: `${process.env.APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.APP_URL}/pricing.html`,
    });
    res.redirect(session.url);
  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: "Could not start checkout." });
  }
});

// GET /checkout-success — after Stripe redirects back
app.get("/checkout-success", (req, res) => {
  // Fulfillment done by webhook; just show a success page
  res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Welcome to Premium!</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet"/>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Nunito',sans-serif;background:#111;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;}
.box{max-width:480px;}.icon{font-size:4rem;margin-bottom:1rem;display:block;}
h1{font-family:'Press Start 2P',monospace;font-size:clamp(1.15rem,5vw,1.75rem);color:#f9a825;text-shadow:3px 3px 0 #000;margin-bottom:.8rem;line-height:1.7;}
p{font-size:clamp(1.05rem,3.4vw,1.28rem);color:#aaa;font-weight:700;line-height:1.6;margin-bottom:1.2rem;}
a{display:inline-block;font-family:'Press Start 2P',monospace;font-size:.38rem;padding:.7rem 1.3rem;background:#3d6b1e;border:2px solid #7ec832;color:#fff;text-decoration:none;line-height:1.6;box-shadow:inset 2px 2px 0 rgba(255,255,255,.2),3px 3px 0 rgba(0,0,0,.6);}
</style></head><body>
<div class="box">
  <span class="icon">💎</span>
  <h1>WELCOME TO PREMIUM!</h1>
  <p>Your child's account has been upgraded. All premium features are now unlocked — including unlimited journaling, the full therapy toolkit, and the parent dashboard.</p>
  <p style="color:#5a9e2f;font-size:.88rem;">"Dream big, build bigger." — Let's go! ⛏️</p>
  <a href="/">START THE ADVENTURE →</a>
</div>
</body></html>`);
});

// GET /billing/portal — Stripe customer portal (manage subscription)
app.get("/billing/portal", requireAuth, async (req, res) => {
  const profile = await getProfile(req.user.id);
  if (!profile?.stripe_customer_id)
    return res.redirect("/pricing.html");

  const session = await stripe.billingPortal.sessions.create({
    customer:   profile.stripe_customer_id,
    return_url: `${process.env.APP_URL}/`,
  });
  res.redirect(session.url);
});

// POST /stripe/webhook — Stripe posts events here
app.post("/stripe/webhook", async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ── Checkout completed → upgrade user ───────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId  = session.metadata?.userId;
    if (userId) {
      try {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        await supabase.from("profiles").update({
          plan:               "premium",
          stripe_customer_id: session.customer,
          subscription_id:    session.subscription,
          plan_expires_at:    new Date(sub.current_period_end * 1000).toISOString(),
        }).eq("id", userId);
        console.log(`✅ Upgraded user ${userId} to premium`);
      } catch (e) {
        console.error("Failed to upgrade user:", e.message);
      }
    }
  }

  // ── Subscription cancelled → downgrade to free ──────────
  if (event.type === "customer.subscription.deleted") {
    const customerId = event.data.object.customer;
    await supabase.from("profiles").update({
      plan:            "free",
      subscription_id: null,
      plan_expires_at: null,
    }).eq("stripe_customer_id", customerId);
    console.log(`⬇️  Downgraded customer ${customerId} to free`);
  }

  // ── Renewal succeeded → extend expiry date ──────────────
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    if (invoice.subscription) {
      const sub = await stripe.subscriptions.retrieve(invoice.subscription);
      await supabase.from("profiles").update({
        plan_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
      }).eq("stripe_customer_id", invoice.customer);
    }
  }

  // ── Payment failed → could email the parent here ────────
  if (event.type === "invoice.payment_failed") {
    console.warn("⚠️  Payment failed for customer:", event.data.object.customer);
    // TODO: send "payment failed" email via Resend / SendGrid
  }

  res.json({ received: true });
});

// ═══════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════

// POST /auth/update-profile — update child username & parent name
app.post("/auth/update-profile", requireAuth, async (req, res) => {
  const { childUsername, parentName } = req.body;
  if (!childUsername) return res.status(400).json({ error: "Username required" });
  try {
    await supabase.from("profiles").update({
      child_username: childUsername,
      parent_name:    parentName || "",
    }).eq("id", req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not update profile" });
  }
});

// POST /api/xp  — sync XP to database (cloud save)
app.post("/api/xp", requireAuth, async (req, res) => {
  const xp = Number(req.body?.xp);
  if (!Number.isFinite(xp) || xp < 0 || xp > 1000000)
    return res.status(400).json({ error: "Invalid XP value" });

  const { error } = await supabase
    .from("profiles")
    .update({ xp: Math.floor(xp) })
    .eq("id", req.user.id);

  if (error) return res.status(500).json({ error: "Could not save XP" });
  res.json({ success: true });
});

// POST /api/mood — sync mood check-ins for the premium parent dashboard
app.post("/api/mood", requireAuth, async (req, res) => {
  const { emoji, label, date } = req.body || {};
  if (!emoji || !label || !date)
    return res.status(400).json({ error: "Missing mood data" });

  const { error } = await supabase.from("mood_logs").insert({
    user_id: req.user.id,
    emoji: String(emoji).slice(0, 8),
    label: String(label).slice(0, 40),
    date: String(date).slice(0, 40),
  });

  if (error) return res.status(500).json({ error: "Could not save mood" });
  res.json({ success: true });
});

// GET /api/parent-dashboard  — mood trend data (never journal text)
app.get("/api/parent-dashboard", requireAuth, async (req, res) => {
  const profile = await getProfile(req.user.id);
  if (!["premium"].includes(profile?.plan))
    return res.status(403).json({ error: "Premium feature" });

  // Return aggregated mood data only — never journal entries
  const { data: moods } = await supabase
    .from("mood_logs")
    .select("emoji, label, date")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false })
    .limit(30);

  res.json({
    childUsername: profile.child_username,
    xp:            profile.xp,
    plan:          profile.plan,
    recentMoods:   moods || [],
    // journal entries are deliberately NOT included
  });
});



// POST /api/community — email signup for parent community/newsletter
app.post("/api/community", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const source = String(req.body?.source || "footer").slice(0, 40);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) return res.status(400).json({ error: "Please enter a valid email address." });

  const payload = {
    email,
    source,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("community_members")
    .upsert(payload, { onConflict: "email" });

  if (error) {
    console.error("Community signup error:", error.message);
    return res.status(500).json({ error: "Could not join right now. Please try again." });
  }

  res.json({ success: true, message: "You are in! Welcome to the community." });
});

// ─────────────────────────────────────────────────────────
//  SPA Fallback
// ─────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─────────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🧱 Block by Block running on port ${PORT}`);
  console.log(`   App URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
});
