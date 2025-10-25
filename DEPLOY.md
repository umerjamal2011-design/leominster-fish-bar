# Deploying to Vercel (recommended)

This project is a Vite + React static app. The repo is ready for a one-click deploy on Vercel. Follow these steps after you create a Vercel account (signing up with GitHub is easiest).

1) Sign up / log in to Vercel
   - Visit https://vercel.com and sign up. Connect your GitHub account so Vercel can import repositories.

2) Import the repository
   - Click "New Project" -> "Import Git Repository" and select `umerjamal2011-design/leominster-fish-bar`.
   - Vercel should detect this is a static site. If asked, set the following build settings:
     - Framework Preset: Other
     - Build Command: npm run build
     - Output Directory: dist

3) Add Environment Variables
   - Before you deploy, add the Supabase environment variables to the Project Settings -> Environment Variables.
   - Add the following names and values (values come from your local `.env.local`):
     - `VITE_SUPABASE_URL` = https://<your-project>.supabase.co
     - `VITE_SUPABASE_ANON_KEY` = <your-anon-key>
   - Add them for BOTH `Production` and `Preview` (so preview deployments also have access).

4) Deploy
   - Click "Deploy". Vercel will install dependencies, run `npm run build`, and publish the `dist/` folder.
   - After deploy, open the live URL and verify the app loads and can fetch data from Supabase.

5) Troubleshooting
   - If you see a white screen, open Browser DevTools -> Console. Look for errors like missing env vars or CORS issues.
   - Check Vercel build logs (Project -> Deployments -> build log) for build-time errors.

Other hosts (brief)
- Netlify: Create a new site from Git -> GitHub, set Build command `npm run build` and Publish directory `dist`. Add the same env vars under Settings -> Build & deploy -> Environment.
- Render: Create a Static Site, connect GitHub, set Build Command `npm run build` and Publish Directory `dist`. Add environment variables under the service settings.

Local checks

Run these locally to verify before deploying:

```powershell
# install deps
npm install

# dev server (fast feedback)
npm run dev

# production build (what Vercel runs)
npm run build

# preview production locally
npm run preview
```

What I added to the repo
- `DEPLOY.md` — step-by-step deploy instructions for Vercel + Netlify/Render notes.
- `vercel.json` — static-build config and SPA rewrite (so client-side routes work).

Next steps I can take for you
- If you want, I can: create these files (done), push them to GitHub (done), and then walk you through the Vercel import UI while you sign in.
- Or I can keep going and trigger a deployment if you provide Vercel access (not recommended — please sign up and connect GitHub yourself).

If you want to proceed now, say "Walk me through Vercel import" or "Push the changes and show me the steps".
