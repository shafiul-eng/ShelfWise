# ShelfWise — Inventory & Cash Tracker

A lightweight, static SaaS-style demo app for tracking inventory and cash flow. No backend, no build step — pure HTML/CSS/JS, so it runs directly on GitHub Pages.

## Features
- Dashboard with stock value, unit counts, and low-stock alerts
- Inventory table with search, status filtering, add/remove items
- Cash ledger with cash-in / cash-out tracking and running balance
- Data persists in the browser via `localStorage` (per-visitor, no server)

## Run locally
Just open `index.html` in a browser — no installation needed.

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Unzip this project and push its contents to the repo root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ShelfWise inventory app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder, then **Save**.
5. After a minute, your app will be live at:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

## File structure
```
index.html          Main app shell (dashboard, inventory, ledger views)
assets/style.css     Visual design
assets/script.js     App logic and localStorage persistence
README.md            This file
```

## Notes
- Since GitHub Pages only serves static files, there is no shared/multi-user database — each visitor's data lives only in their own browser.
- To turn this into a true multi-user SaaS product, you'd swap the `localStorage` calls in `assets/script.js` for calls to a backend API (e.g. Supabase, Firebase, or your own service).
