# Fix White Screen on GitHub Deployments (Vercel & Netlify)

Comprehensive resolution plan to ensure the ProblemBridge platform deploys cleanly without white screens on GitHub-linked Vercel and Netlify platforms, incorporating SPA rewrites, resilient asset resolution, global Error Boundary, and client-side storage fallbacks.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following deployment specifications:
> - **Hosting Target**: Vercel or Netlify connected via GitHub repository.
> - **API Behavior**: Automatic client-side fallback to browser local storage (`localStorage`) and direct client processing when the backend Node/Express server is not deployed as a serverless container.

- **Confirmed Decision 1**: Add native deployment routing configurations (`vercel.json` rewrites and `public/_redirects`) so deep links, hash routes, and page reloads never return a 404 white screen.
- **Confirmed Decision 2**: Implement a global React Error Boundary at the root level (`main.tsx`) so unexpected runtime or storage anomalies display an actionable recovery UI rather than a blank white screen.
- **Confirmed Decision 3**: Ensure `vite.config.ts` asset resolution and SPA routing are fully compatible with both root domains (`*.vercel.app`, `*.netlify.app`) and sub-path repository previews.

---

### 1. Overview & Core Concept

- **What It Does**: Resolves the root causes of the "white screen" when launching ProblemBridge from a GitHub repository on Vercel, Netlify, or static hosting. It handles single-page app (SPA) fallback routing, provides instant recovery from missing server endpoints, and guards the React mounting tree against unhandled initialization errors.
- **Target Audience / Persona**: Developers and reviewers previewing and sharing the platform via GitHub repository deployments on Vercel or Netlify.
- **Key Value**: Guarantees zero-blank-screen deployments with self-healing offline/client-side storage and smooth navigation.

---

### 2. User Experience & Visual Design

- **Error Boundary & Recovery View**:
  - If an unhandled script error or storage corruption occurs, the screen never goes blank. Instead, it displays a refined ProblemBridge branded recovery card with an error explanation, a "Reload Application" action, and a "Clear Cached State & Reset" button.
- **Seamless Offline & Static Experience**:
  - When the app is opened on Vercel/Netlify without an active Express backend, problems, proposals, notifications, and user profiles hydrate instantly from bundled initial data or local storage.
  - Problem posting, status updates, and AI formulation seamlessly operate with intelligent client-side fallbacks.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Hosting Configurations (`vercel.json` + `public/_redirects`)**:
  - *Chosen Approach*: Include both `vercel.json` with rewrite rules (`"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`) and `public/_redirects` (`/* /index.html 200`).
  - *Why*: Allows zero-configuration, instant deployments whether the user connects the GitHub repository to Vercel or Netlify.
  - *Alternatives Considered*: Requiring manual dashboard build settings in Vercel/Netlify; rejected as error-prone.

- **Decision 2: Global Root Error Boundary**:
  - *Chosen Approach*: Wrap `<App />` inside a React class Error Boundary in `src/main.tsx`.
  - *Why*: React 19 completely unmounts the DOM tree on uncaught render/lifecycle errors. An Error Boundary catches these exceptions and renders a helpful recovery interface instead of an opaque white screen.

- **Decision 3: Universal Relative Base in Vite**:
  - *Chosen Approach*: Configure `base: './'` in `vite.config.ts`.
  - *Why*: Ensures asset paths (`.js`, `.css`, SVG/images) resolve reliably regardless of deployment sub-paths or custom root domains.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   GitHub Repository                    │
│      ├── vercel.json (SPA rewrite rules)               │
│      ├── public/_redirects (Netlify SPA rule)          │
│      └── vite.config.ts (base: './')                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Deploy Trigger
                           ▼
┌────────────────────────────────────────────────────────┐
│               Hosting (Vercel / Netlify)               │
│       Build: `vite build` ──▶ dist/ static assets      │
└──────────────────────────┬─────────────────────────────┘
                           │ Serves
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ src/main.tsx                                     │  │
│  │ └── <ErrorBoundary>  ◀── Prevents White Screen   │  │
│  │     └── <AuthProvider>                           │  │
│  │         └── <App />                              │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         ▼                              │
│       Data Hydration & API Fallback Strategy           │
│       ├── Check `/api/*` response validity             │
│       └── Gracefully fallback to localStorage/mockData │
└────────────────────────────────────────────────────────┘
```

#### Interactive Component & State Mapping:
- **`src/main.tsx`**: Add `ErrorBoundary` component with clean fallback UI.
- **`vercel.json`**: Rewrite all routes to `/index.html` for Vercel SPA routing.
- **`public/_redirects`**: Rewrite all routes to `/index.html` with status `200` for Netlify.
- **`vite.config.ts`**: Set `base: './'` for resilient asset pathing.
- **`src/App.tsx`**: Ensure initial API synchronization catches non-JSON HTML error responses (like 404 pages) safely without throwing parse errors.
