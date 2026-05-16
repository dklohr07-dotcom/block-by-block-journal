# Railway Crash Fix

The crash log showed:

`Error: Node.js 20 detected without native WebSocket support.`

This package fixes that by adding the `ws` dependency and passing it to Supabase Realtime.

## What to update in GitHub

Upload/replace these files from this package:

- `package.json`
- `server.js`
- `railway.json`

Also delete the old `package-lock.json` from GitHub for this deploy. Railway will regenerate dependencies during install.

## Railway variables

Keep your existing variables and make sure `SESSION_SECRET` is present.

## Redeploy

After pushing the changes to GitHub, redeploy Railway.
