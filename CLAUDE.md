# 5Sport Client - Frontend

Sports community platform for end users. Built with Next.js 15 (App Router), React 19, TypeScript.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 3 + shadcn/ui (default style, CSS variables) + Radix UI
- **i18n:** next-intl v4 — locales: `vi` (default), `en`
- **API:** Orval (React Query + Axios) — generates hooks from Swagger at `http://localhost:8080/swagger/json`
- **Auth:** next-auth 4.24.10 (Google provider) + custom JWT from backend
- **Font:** Inter (latin + vietnamese)
- **Package Manager:** pnpm

## Project Structure

```
src/
├── app/
│   ├── [locale]/            # Pages (locale-based routing)
│   │   ├── layout.tsx       # Root layout: i18n + providers + header/footer
│   │   └── page.tsx         # Home page
│   └── api/auth/[...nextauth]/route.ts  # NextAuth route handler
├── components/
│   ├── ui/                  # shadcn components (DO NOT edit manually)
│   ├── auth/                # Auth modal, login form, register form
│   ├── layout/              # header, footer, mobile-nav, language-switcher
│   └── home/                # Home page sections
├── lib/
│   ├── api/axiosInstance.ts # Axios instance + defaultMutator (used by orval)
│   ├── auth.ts              # NextAuth options (Google provider + backend JWT exchange)
│   ├── providers.tsx        # SessionProvider + React Query + TooltipProvider + Sonner + AuthSync
│   ├── services/            # Orval-generated API hooks (DO NOT edit)
│   ├── schemas/             # Orval-generated types (DO NOT edit)
│   └── utils.ts             # cn() helper
├── i18n/
│   ├── routing.ts           # Locales config, exports Link/useRouter/usePathname
│   └── request.ts           # Server-side i18n config
├── messages/                # vi.json, en.json (translation files)
├── types/next-auth.d.ts     # NextAuth type augmentation (Session.accessToken, Session.backendUser)
├── hooks/                   # Custom hooks
└── middleware.ts             # next-intl locale routing
```

## Key Commands

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm generate:api     # Generate API hooks from Swagger (orval)
```

## Conventions

### Routing & i18n
- All pages under `src/app/[locale]/` — next-intl handles locale routing
- Use `Link`, `useRouter`, `usePathname` from `@/i18n/routing` (NOT from `next/link` or `next/navigation`)
- Translations in `src/messages/{vi,en}.json` — use `useTranslations("namespace")` hook

### Components
- shadcn components in `src/components/ui/` — install via `pnpm dlx shadcn@latest add <component>`
- Feature components colocated by feature: `src/components/home/`, `src/components/auth/`, `src/components/layout/`, etc.
- Use `"use client"` only for interactive components (hooks, events)
- Import path alias: `@/` maps to `src/`

### Styling — Modern Sports Brand (Nike-inspired)
- **Design style:** Vibrant, block-based, premium sports tech
- **Primary:** `#0000FF` (Pure Blue) — `hsl(240 100% 50%)`
- **Secondary:** `#ECF86E` (Electric Lime) — `hsl(65 91% 70%)` — CTA, login button; always use dark text (`secondary-foreground`) on this color
- **Background:** `#FFFFFF` white, sections use `#F1F5F9` (slate-50/muted)
- **Text primary:** `#0B1220`, Text secondary: `#475569` (slate-500)
- **Border:** `#E2E8F0` (slate-200)
- **Header:** White/glass with backdrop-blur, NOT colored background
- **Footer:** Deep Navy (`bg-secondary`) dark footer
- **Cards:** White with border-slate-200, hover lift `-translate-y-1` + shadow
- **Transitions:** 200-300ms for all interactive elements
- **cursor-pointer** on all clickable elements
- Max container width: `1440px` (`max-w-container`)
- Use `cn()` from `@/lib/utils` for conditional classes

### Authentication
- **NextAuth** handles Google OAuth — config in `src/lib/auth.ts`
- **Flow:** Google sign-in → NextAuth gets Google ID token → JWT callback calls backend `/auth/google/authenticate` with `{ idToken }` → backend returns `{ user, token }` → stored in NextAuth session
- **AuthSync** component in providers.tsx syncs `session.accessToken` to `localStorage("authToken")` for axios interceptor
- **Session types:** `session.accessToken` (backend JWT), `session.backendUser` (user object from backend)
- **Auth modal:** popup dialog with login/register tabs + Google sign-in button — no page redirect
- **Login/Register forms** use orval-generated hooks: `useAuthControllerLogin`, `useAuthControllerRegister`
- **Logout** clears localStorage + calls `signOut({ redirect: false })`

### API Layer
- Orval config: `orval.config.ts` — generates to `lib/services/` and `lib/schemas/`
- Custom axios mutator: `src/lib/api/axiosInstance.ts` (`defaultMutator`)
- Axios interceptor auto-attaches `Bearer {token}` from `localStorage("authToken")`
- Axios interceptor handles 401 (clears token + toast), 400, 500+ errors
- React Query default: staleTime 60s, no refetchOnWindowFocus
- Backend base URL: `NEXT_PUBLIC_API_URL` env var

### Installed shadcn Components
avatar, badge, button, card, dialog, dropdown-menu, separator, sheet, skeleton, tabs, tooltip

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
```
