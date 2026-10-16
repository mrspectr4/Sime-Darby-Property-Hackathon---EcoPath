# EcoPath — Visual Studio & Render Deployment Plan

A turnkey roadmap to export the EcoPath Township Command application, open and edit it in Visual Studio / VS Code, and deploy it live to Render (`onrender.com`).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The recommended setup uses **Render Static Site** (the fastest, free-tier-supported method for Vite + React SPAs) paired with GitHub repository linking for automatic continuous deployment whenever you push code from Visual Studio Code.

- **Deployment Model**: Render Static Site with automatic Git continuous deployment.
- **Environment Secrets**: `VITE_GOOGLE_MAPS_API_KEY` stored securely in the Render Environment Variables dashboard.
- **Local IDE**: Standard Visual Studio / VS Code setup with npm/Node.js v20+ and recommended workspace settings.

---

### 1. Overview & Core Concept

- **What It Delivers**:
  - Full codebase portability: Complete files and dependencies ready to open in Visual Studio or VS Code with zero setup friction.
  - Production build configuration optimized for Render (`npm run build` targeting `./dist`).
  - Single-click deployment descriptor (`render.yaml`) that configures the build command, publish directory, and routing rules automatically.
  - Comprehensive step-by-step guide (`DEPLOYMENT.md`) covering Git sync, local dev server execution, and Render dashboard configuration.

---

### 2. Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Developer Machine                         │
│                                                              │
│   Visual Studio / VS Code                                    │
│   ├── npm install                                            │
│   ├── npm run dev (http://localhost:3000)                    │
│   └── git commit & git push origin main                      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  GitHub / GitLab Repository                  │
│                                                              │
│   Branches: main                                             │
│   Contains: source code, render.yaml, .env.example           │
└──────────────────────────────┬───────────────────────────────┘
                               │ Webhook Trigger
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Render Cloud (onrender.com)                  │
│                                                              │
│   Type: Static Site                                          │
│   Build: npm run build                                       │
│   Publish: ./dist                                            │
│   Env Vars: VITE_GOOGLE_MAPS_API_KEY                         │
│   Route Rewrite: /* -> /index.html (SPA routing)             │
│   Output URL: https://ecopath-township.onrender.com          │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Key Decisions & Technical Strategy

1. **Static Site vs. Node Web Service on Render**:
   - *Chosen Approach*: **Render Static Site**.
   - *Why*: The application is a client-side React SPA powered by Vite and Google Maps JavaScript API. Static sites on Render are completely free, offer fast global CDN edge caching, and require zero server management or server sleep delays.

2. **Single-Page Application (SPA) Routing on Render**:
   - *Chosen Approach*: Add Render rewrite rule in `render.yaml` (`source: /*`, `destination: /index.html`).
   - *Why*: Ensures that deep links, page reloads, and browser navigation do not throw 404 errors on Render's CDN.

3. **Google Maps API Key Handling**:
   - *Chosen Approach*: Injected via Render's Environment Variables panel as `VITE_GOOGLE_MAPS_API_KEY`.
   - *Why*: Prevents hardcoding secret keys into Git repositories and allows separate staging/production keys if desired.

4. **IDE Preparation for Visual Studio & VS Code**:
   - *Chosen Approach*: Add standard `.vscode` settings and recommended extensions (`TypeScript`, `Tailwind CSS IntelliSense`, `ESLint`), plus a turnkey `DEPLOYMENT.md` guide.

---

### 4. Implementation Steps

#### Phase 1: Project Configuration Files
- Create `render.yaml` with Static Site blueprint specs:
  - Name: `ecopath-township`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
  - SPA Rewrites: `/*` $\to$ `/index.html`
- Create `.vscode/settings.json` and `.vscode/extensions.json` for optimal Visual Studio Code developer experience.
- Ensure `vite.config.ts` and `package.json` build scripts cleanly generate `./dist` for production.

#### Phase 2: Deployment Guide (`DEPLOYMENT.md`)
- Provide a crystal-clear, step-by-step walkthrough:
  1. **Cloning / Opening in Visual Studio & VS Code** (Git clone, opening folder, running `npm install` and `npm run dev`).
  2. **Pushing to GitHub** (creating repository, git remote, git push).
  3. **Deploying on Render** (connecting GitHub repo, selecting Static Site, setting environment variable `VITE_GOOGLE_MAPS_API_KEY`).
  4. **Custom Domain & SSL** (free automatic HTTPS provided by Render).

#### Phase 3: Verification
- Execute `npm run build` in the project to verify that the `./dist` build artifact compiles cleanly without any errors.
