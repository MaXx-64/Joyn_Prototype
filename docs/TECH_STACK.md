# Joyn — Tech Stack Reference

> **Platform**: Joyn — A matchmaking and virtual fitness platform connecting elderly Arizonans with each other and with younger volunteers. "Move Together. Age with Joy."
> **Competition**: ASU Principled Innovation Academy (deadline March 31, 2026)
> **Maintainers**: See repository contributors

---

## Table of Contents

1. [Technology Overview](#1-technology-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication Flow](#5-authentication-flow)
6. [AI Architecture](#6-ai-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Design System](#8-design-system)
9. [Environment Variables](#9-environment-variables)
10. [Development Setup](#10-development-setup)
11. [Deployment](#11-deployment)

---

## 1. Technology Overview

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 16 | Full-stack React framework (App Router, Server Components, Server Actions) |
| **Language** | TypeScript | 5.x (strict) | End-to-end type safety; `any` is disallowed |
| **UI Components** | shadcn/ui | Latest | Accessible, composable component primitives built on Radix UI |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS; co-located with components |
| **Backend / Database** | Supabase | Latest | Hosted Postgres + Auth + Row Level Security + Storage |
| **Auth** | Supabase Auth | (via Supabase) | Email/password + OAuth; session management via SSR cookies |
| **AI SDK** | Vercel AI SDK | v6 | Unified streaming interface for LLM calls; runs on the server |
| **AI Gateway** | Vercel AI Gateway | — | Proxies LLM requests; credentials never reach the client |
| **AI UI** | AI Elements | Latest | Pre-built chatbot UI components (message list, input, streaming) |
| **Deployment** | Vercel | — | Edge network, Serverless Functions, preview environments |
| **Package Manager** | npm / pnpm | — | Lock-file committed; consistent installs across environments |

---

## 2. Architecture Overview

### How the Pieces Connect

```
Browser (Client)
  │
  │  React Server Components (no secrets)
  │  Client Components (UI state only)
  │
  ▼
Next.js App Router (Vercel Edge / Serverless)
  │
  ├── Server Components ──────────────► Supabase Server Client
  │     (reads data, renders HTML)          (authenticated session, RLS enforced)
  │
  ├── Server Actions ─────────────────► Supabase Server Client
  │     (mutations, form submissions)       (authenticated session, RLS enforced)
  │
  ├── Route Handlers (app/api/**)
  │     ├── /api/ai/chat     ──────────► Vercel AI Gateway ──► LLM Provider
  │     ├── /api/ai/match    ──────────► Vercel AI Gateway ──► LLM Provider
  │     └── /api/events      ──────────► Supabase Server Client
  │
  └── Middleware (middleware.ts) ──────► Supabase session refresh
                                         Route protection (redirects)
```

### Key Architectural Principles

- **Server-first data access**: All Supabase queries run on the server. The browser never holds service-role credentials or touches the database directly.
- **AI isolation**: LLM API keys live only inside Vercel AI Gateway. Route Handlers call the gateway using a short-lived OIDC token (`VERCEL_OIDC_TOKEN`) that Vercel auto-provisions — no provider keys ever appear in environment variables or code.
- **RLS as the last line of defence**: Every Supabase table has Row Level Security enabled. Even if an unexpected code path reaches the database, the policy layer ensures users can only see and modify their own data.
- **Zero `any`**: TypeScript strict mode is enforced. All Supabase query results are typed via generated `database.types.ts`.

---

## 3. Folder Structure

```
joyn/
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Route group — unauthenticated pages (no layout chrome)
│   │   ├── sign-in/page.tsx          # Sign-in form (Supabase Auth UI or custom)
│   │   └── sign-up/page.tsx          # Registration form
│   │
│   ├── (app)/                        # Route group — requires authenticated session
│   │   ├── dashboard/page.tsx        # Home screen after login; match suggestions + streak display
│   │   ├── onboard/page.tsx          # Multi-step AI chatbot onboarding (incl. fitness fields)
│   │   ├── profile/page.tsx          # View / edit own profile (incl. fitness level, health goals)
│   │   ├── match/[id]/page.tsx       # Individual match detail + contact options
│   │   ├── events/page.tsx           # Browse Arizona community events
│   │   ├── sessions/page.tsx         # Upcoming scheduled workout sessions; schedule new ones
│   │   └── workout/[sessionId]/page.tsx  # Workout session page — routine card + video call embed
│   │
│   ├── api/                          # Route Handlers — server-only, never bundled to client
│   │   ├── ai/
│   │   │   ├── chat/route.ts         # Streaming chatbot endpoint (AI Elements backend)
│   │   │   └── match/route.ts        # AI matching: builds prompt, calls gateway, returns JSON
│   │   ├── events/route.ts           # Event discovery: queries DB / external API, returns list
│   │   └── sessions/route.ts         # Session CRUD: create, list, update status
│   │
│   ├── layout.tsx                    # Root layout (fonts, global providers, Toaster)
│   └── page.tsx                      # Public landing page (marketing copy, CTA)
│
├── components/
│   ├── ui/                           # shadcn/ui generated components (Button, Card, Input…)
│   ├── ai-elements/                  # AI Elements wrappers (ChatWindow, MessageBubble…)
│   ├── layout/                       # Header, Footer, Sidebar, MobileNav
│   ├── match/                        # MatchCard, MatchList, ContactButtons
│   ├── events/                       # EventCard, EventList, EventFilters
│   ├── onboard/                      # OnboardChat, OnboardStep, ProgressBar
│   ├── profile/                      # ProfileForm, AvatarUpload, InterestPicker, FitnessFields
│   ├── sessions/                     # SessionCard, SessionList, SessionScheduler, StreakBadge
│   └── workout/                      # RoutineCard, VideoCallEmbed, WorkoutTimer
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient() — auth actions only (NEXT_PUBLIC vars)
│   │   ├── server.ts                 # createServerClient() — all data queries (cookies-based)
│   │   └── middleware.ts             # refreshSession() helper called from middleware.ts
│   ├── ai/
│   │   ├── matching.ts               # buildMatchPrompt(), parseMatchResponse() helpers
│   │   └── events.ts                 # buildEventPrompt(), parseEventResponse() helpers
│   └── utils.ts                      # cn() (clsx + twMerge), date formatters, validators
│
├── types/
│   ├── database.types.ts             # Auto-generated by `supabase gen types typescript`
│   ├── match.types.ts                # MatchProfile, MatchScore, MatchResult interfaces
│   └── event.types.ts                # Event, EventCategory, EventFilters interfaces
│
├── hooks/                            # Custom React hooks (useProfile, useMatches, useEvents…)
│
├── middleware.ts                     # Next.js middleware — session refresh + route protection
│
├── .env.local                        # Local secrets (gitignored — never commit)
├── .env.example                      # Template with all required keys (no values — committed)
│
└── supabase/
    ├── migrations/                   # Numbered SQL migration files (applied via CLI)
    └── seed.sql                      # Development seed data (fake profiles, interests, events)
```

### Directory Ownership Rules

| Directory | Who writes here | Notes |
|---|---|---|
| `app/api/**` | Backend logic only | No JSX, no client imports |
| `lib/supabase/server.ts` | Server Components, Server Actions, Route Handlers | Never imported by Client Components |
| `lib/supabase/client.ts` | Client Components only | Auth sign-in/sign-out; no data queries |
| `components/ui/` | shadcn CLI | Do not hand-edit; re-generate via `npx shadcn@latest add` |
| `types/database.types.ts` | Supabase CLI | Do not hand-edit; re-generate via `supabase gen types` |

---

## 4. Database Schema

All tables reside in the `public` schema. Row Level Security is **enabled and enforced** on every table. The `auth.users` table is managed by Supabase Auth and is never modified directly.

### 4.1 `profiles`

Extends `auth.users` with application-specific data. Created automatically via a database trigger on user sign-up.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE | Matches the auth user ID |
| `display_name` | `text` | NOT NULL | Publicly visible name |
| `age` | `int2` | CHECK (age >= 18) | User age (18+ required) |
| `role` | `text` | CHECK (role IN ('elder', 'volunteer')) | User type |
| `bio` | `text` | | Short self-description |
| `location` | `text` | | City / neighbourhood in Arizona |
| `avatar_url` | `text` | | Supabase Storage public URL |
| `is_onboarded` | `bool` | NOT NULL DEFAULT false | Whether onboarding chatbot completed |
| `is_active` | `bool` | NOT NULL DEFAULT true | Soft-delete / deactivation flag |
| `fitness_level` | `text` | CHECK (fitness_level IN ('beginner', 'moderate', 'active')) | Collected during onboarding; used for smart matching |
| `health_goals` | `text[]` | | Array of health goal tags (e.g. ['flexibility', 'strength']) |
| `language` | `text` | NOT NULL DEFAULT 'en' | Preferred language; used for matching |
| `timezone` | `text` | | IANA timezone string (e.g. 'America/Phoenix'); used for session scheduling |
| `streak_count` | `int4` | NOT NULL DEFAULT 0 | Consecutive weeks with at least one completed workout session |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() | Updated by trigger |

**RLS Policies**

```sql
-- Anyone authenticated can read any active profile (for matching)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Users can only update their own profile
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

### 4.2 `interests`

Canonical list of interest tags. Managed by admins; users do not insert here.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `label` | `text` | NOT NULL UNIQUE | Human-readable tag (e.g. "Gardening") |
| `category` | `text` | | Optional grouping (e.g. "Outdoors") |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Everyone authenticated can read interests
CREATE POLICY "interests_select" ON interests
  FOR SELECT TO authenticated
  USING (true);
```

---

### 4.3 `user_interests`

Junction table linking profiles to interests.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `uuid` | FK → `profiles.id` ON DELETE CASCADE | |
| `interest_id` | `uuid` | FK → `interests.id` ON DELETE CASCADE | |
| Primary Key | — | (`user_id`, `interest_id`) | Composite PK prevents duplicates |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Users can read their own interest selections
CREATE POLICY "user_interests_select" ON user_interests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can manage their own interests
CREATE POLICY "user_interests_insert" ON user_interests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_interests_delete" ON user_interests
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
```

---

### 4.4 `matches`

Stores AI-generated match pairs. A match record is created server-side; users cannot self-insert.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `user_a_id` | `uuid` | FK → `profiles.id` | First matched user |
| `user_b_id` | `uuid` | FK → `profiles.id` | Second matched user |
| `score` | `float4` | CHECK (score BETWEEN 0 AND 1) | AI compatibility score |
| `reasoning` | `text` | | Human-readable explanation from AI |
| `status` | `text` | CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')) DEFAULT 'pending' | Match state |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Users can see matches they are a participant in
CREATE POLICY "matches_select" ON matches
  FOR SELECT TO authenticated
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Users can update status of their own matches only
CREATE POLICY "matches_update" ON matches
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id)
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);
```

---

### 4.5 `events`

Cached Arizona community events. Populated by a cron job or on-demand via `/api/events`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `title` | `text` | NOT NULL | |
| `description` | `text` | | |
| `location` | `text` | | Physical or virtual location |
| `starts_at` | `timestamptz` | NOT NULL | |
| `ends_at` | `timestamptz` | | |
| `category` | `text` | | e.g. "Social", "Arts", "Health" |
| `source_url` | `text` | | Original event listing URL |
| `is_active` | `bool` | NOT NULL DEFAULT true | Hide expired / cancelled events |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Any authenticated user can read active events
CREATE POLICY "events_select" ON events
  FOR SELECT TO authenticated
  USING (is_active = true);
```

---

### 4.6 `reports`

Tracks user reports and blocks to keep the community safe.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `reporter_id` | `uuid` | FK → `profiles.id` | User who filed the report |
| `reported_id` | `uuid` | FK → `profiles.id` | User being reported |
| `reason` | `text` | NOT NULL | Free-text reason |
| `status` | `text` | CHECK (status IN ('open', 'reviewed', 'dismissed')) DEFAULT 'open' | Admin review status |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Users can only read their own reports
CREATE POLICY "reports_select" ON reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- Users can submit reports
CREATE POLICY "reports_insert" ON reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);
```

---

### 4.7 `sessions`

Stores scheduled virtual workout sessions between matched pairs.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `created_by` | `uuid` | FK → `profiles.id` ON DELETE CASCADE | User who scheduled the session |
| `partner_id` | `uuid` | FK → `profiles.id` ON DELETE CASCADE | The other participant |
| `scheduled_at` | `timestamptz` | NOT NULL | When the session is set to begin |
| `duration_minutes` | `int2` | NOT NULL DEFAULT 30 | Planned duration |
| `routine_id` | `uuid` | FK → `routines.id` | Which routine will be followed |
| `status` | `text` | CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled' | Session lifecycle state |
| `video_call_url` | `text` | | Daily.co or Jitsi room URL generated at creation |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Participants can read their own sessions
CREATE POLICY "sessions_select" ON sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = partner_id);

-- Only the creator can insert a session
CREATE POLICY "sessions_insert" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Either participant can update status (e.g., cancel or complete)
CREATE POLICY "sessions_update" ON sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = partner_id)
  WITH CHECK (auth.uid() = created_by OR auth.uid() = partner_id);
```

---

### 4.8 `routines`

Static library of workout routines shown during session pages. Managed by admins; users do not insert here.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK DEFAULT gen_random_uuid() | |
| `name` | `text` | NOT NULL | e.g. "Morning Chair Yoga" |
| `description` | `text` | | Brief overview of the routine |
| `difficulty` | `text` | CHECK (difficulty IN ('beginner', 'moderate', 'active')) | Maps to `profiles.fitness_level` |
| `duration_minutes` | `int2` | NOT NULL | Expected duration |
| `exercises` | `jsonb` | | Array of exercise objects: `{ name, reps, duration_seconds, instructions }` |
| `thumbnail_url` | `text` | | Preview image URL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() | |

**RLS Policies**

```sql
-- Any authenticated user can read routines
CREATE POLICY "routines_select" ON routines
  FOR SELECT TO authenticated
  USING (true);
```

---

## 5. Authentication Flow

Joyn uses **Supabase Auth** with cookie-based sessions managed by `@supabase/ssr`. This enables session state to be available in both Server Components and Client Components without a client-side hydration gap.

### Sign-Up / Sign-In Sequence

```
1. User submits credentials (Client Component form)
2. Client calls supabase.auth.signInWithPassword() from lib/supabase/client.ts
   └─ Supabase returns a session (access_token + refresh_token)
3. @supabase/ssr writes session cookies (httpOnly, Secure, SameSite=Lax)
4. Next.js middleware (middleware.ts) runs on every request:
   a. Calls refreshSession() from lib/supabase/middleware.ts
   b. Silently refreshes expired access tokens using the refresh token
   c. Redirects unauthenticated requests to /sign-in
   d. Redirects authenticated users away from /sign-in and /sign-up
5. Server Components / Route Handlers call createServerClient() from lib/supabase/server.ts
   └─ Reads session from cookies — no client-side token exposure
```

### Supabase Client Split

```typescript
// lib/supabase/client.ts — imported ONLY by Client Components
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
// Used exclusively for: signIn, signUp, signOut, onAuthStateChange
```

```typescript
// lib/supabase/server.ts — imported ONLY by Server Components, Server Actions, Route Handlers
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  );
}
// All data queries run through this client with the authenticated user's session
// RLS policies are applied automatically based on auth.uid()
```

### Onboarding Guard

After sign-up, users land on `/onboard`. The middleware checks `profiles.is_onboarded`. Any attempt to access `(app)` routes before onboarding is complete redirects back to `/onboard`.

---

## 6. AI Architecture

Joyn has three distinct AI features. All LLM calls are **server-side only**, routed through **Vercel AI Gateway**. No provider API key is ever exposed to the client or stored in environment variables — authentication to the gateway uses a short-lived OIDC token (`VERCEL_OIDC_TOKEN`) that Vercel provisions automatically at request time.

### 6.1 Chatbot Onboarding (`/api/ai/chat`)

The onboarding flow uses a conversational AI to gather user preferences naturally rather than through a static form.

**Flow**

```
Client (AI Elements <Chat /> component)
  │  POST /api/ai/chat  { messages: Message[] }
  ▼
Route Handler: app/api/ai/chat/route.ts
  │  1. Validate session (createServerClient)
  │  2. Build system prompt with persona context
  │  3. Call streamText() via Vercel AI SDK → Vercel AI Gateway
  │  4. Return ReadableStream (text/event-stream)
  ▼
AI Elements renders streaming response token-by-token
  │
  │  On conversation complete:
  │  POST Server Action → extract structured profile data → upsert profiles
```

**Code pattern**

```typescript
// app/api/ai/chat/route.ts
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  // Validate session first — createClient() from lib/supabase/server.ts

  // convertToModelMessages converts UIMessage[] → ModelMessage[] (required in AI SDK v6)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: 'anthropic/claude-haiku-4.5', // plain string routes through Vercel AI Gateway automatically
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: modelMessages,
  });

  // toUIMessageStreamResponse() is required for AI Elements <Message> components (v6)
  return result.toUIMessageStreamResponse();
}
```

---

### 6.2 AI Matching (`/api/ai/match`)

Generates compatibility scores and explanations for potential matches.

**Flow**

```
Server Component: app/(app)/dashboard/page.tsx
  │  Fetches candidate profiles from Supabase (server-side, RLS enforced)
  │  POST /api/ai/match  { currentUser: Profile, candidates: Profile[] }
  ▼
Route Handler: app/api/ai/match/route.ts
  │  1. Validate session
  │  2. lib/ai/matching.ts → buildMatchPrompt() constructs structured prompt
  │  3. Call generateText() with output: Output.object({ schema }) via AI SDK v6 → Vercel AI Gateway
  │     Returns typed JSON: { matches: MatchResult[] }
  │  4. Persist results to matches table (server-side insert)
  │  5. Return ranked matches to caller
  ▼
Dashboard renders MatchCard components
```

**Prompt structure and route handler** (`lib/ai/matching.ts` + `app/api/ai/match/route.ts`)

Note: `generateObject()` was removed in AI SDK v6. Use `generateText` with `output: Output.object({ schema })` for structured JSON responses.

```typescript
// lib/ai/matching.ts
import { z } from 'zod';
import { Output } from 'ai';

export const matchResultSchema = z.object({
  matches: z.array(z.object({
    candidateIndex: z.number(),
    score: z.number().min(0).max(1),
    reasoning: z.string(),
  })),
});

export const matchOutput = Output.object({ schema: matchResultSchema });

export function buildMatchPrompt(currentUser: Profile, candidates: Profile[]): string {
  return `You are a compassionate matching assistant for Joyn, a matchmaking and virtual
fitness platform connecting elderly Arizonans with peers and volunteers. Given the current
user's profile and interests, rank and score the following candidates for compatibility.
Consider shared interests, fitness level, language, and time zone proximity.

Current user:
- Role: ${currentUser.role}
- Age: ${currentUser.age}
- Interests: ${currentUser.interests.join(', ')}
- Fitness level: ${currentUser.fitness_level ?? 'not specified'}
- Language: ${currentUser.language ?? 'en'}
- Timezone: ${currentUser.timezone ?? 'not specified'}
- Bio: ${currentUser.bio}

Candidates:
${candidates.map((c, i) =>
  `${i + 1}. ${c.display_name}, ${c.age}, interests: ${c.interests.join(', ')}, ` +
  `fitness: ${c.fitness_level ?? 'n/a'}, lang: ${c.language ?? 'en'}, tz: ${c.timezone ?? 'n/a'}`
).join('\n')}

Return a JSON object with a "matches" array of { candidateIndex, score, reasoning } ordered by score descending.`;
}
```

```typescript
// app/api/ai/match/route.ts
import { generateText } from 'ai';
import { buildMatchPrompt, matchOutput } from '@/lib/ai/matching';

export async function POST(req: Request) {
  // Validate session first — createClient() from lib/supabase/server.ts
  const { currentUser, candidates } = await req.json();

  const { experimental_output } = await generateText({
    model: 'anthropic/claude-sonnet-4.6', // routes through Vercel AI Gateway automatically
    prompt: buildMatchPrompt(currentUser, candidates),
    experimental_output: matchOutput,
  });

  // experimental_output is fully typed as z.infer<typeof matchResultSchema>
  return Response.json(experimental_output);
}
```

---

### 6.3 Event Discovery (`/api/events`)

Surfaces relevant Arizona community events based on a user's interests and location.

**Flow**

```
Server Component: app/(app)/events/page.tsx
  │  GET /api/events?category=social&location=phoenix
  ▼
Route Handler: app/api/events/route.ts
  │  1. Validate session
  │  2. Query events table (Supabase server client, RLS)
  │  3. Optionally: call AI to re-rank / personalise events for the user
  │     using lib/ai/events.ts → buildEventPrompt()
  │  4. Return sorted EventList
  ▼
EventList component renders EventCard components
```

---

## 7. Security Architecture

### 7.1 API Key Protection

| Secret | Where it lives | Who can access it |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel environment variable (server-only) | Server Actions, Route Handlers (never `NEXT_PUBLIC_`) |
| LLM provider keys | Vercel AI Gateway (internal) | The gateway itself; never in this codebase |
| `VERCEL_OIDC_TOKEN` | Auto-provisioned by Vercel at runtime | Route Handlers only; not a static secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Client bundle (safe — public endpoint) | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client bundle (safe with RLS) | Browser + server |

The `NEXT_PUBLIC_` prefix is a deliberate Next.js convention that inlines values into the client bundle. **Only values that are safe to expose publicly** carry this prefix.

### 7.2 Row Level Security

RLS is the database-level guarantee. It applies regardless of how a query reaches Postgres — whether through a Server Component, a Route Handler, or a misconfigured function. See [Section 4](#4-database-schema) for per-table policies.

The golden rule: **never disable RLS on a table that holds user data**.

```sql
-- Verify RLS is enabled (run in Supabase SQL editor)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All rows should show rowsecurity = true
```

### 7.3 Parameterized Queries

All Supabase queries use the JavaScript SDK's type-safe query builder, which parameterizes values automatically. Raw SQL string concatenation is prohibited.

```typescript
// CORRECT — parameterized via SDK
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)       // userId is passed as a parameter, never interpolated
  .single();

// FORBIDDEN — SQL injection risk
const { data } = await supabase.rpc(`SELECT * FROM profiles WHERE id = '${userId}'`);
```

If raw SQL is ever needed (e.g., in a migration), use `$1` placeholders via Postgres functions or Supabase's `rpc()` with explicit parameter binding.

### 7.4 Middleware Protection

`middleware.ts` at the project root runs on every request before it reaches a Route Handler or page:

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

`updateSession` in `lib/supabase/middleware.ts`:
1. Refreshes the Supabase session token if it has expired.
2. Redirects unauthenticated users accessing `(app)` routes to `/sign-in`.
3. Redirects authenticated users visiting `/sign-in` or `/sign-up` to `/dashboard`.

### 7.5 TypeScript Strict Mode

`tsconfig.json` enforces:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

This eliminates entire classes of runtime errors and forces proper null-checks on all Supabase responses.

### 7.6 Content Security Policy

A `Content-Security-Policy` header should be configured in `next.config.ts` to restrict script sources and prevent XSS. At minimum:

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];
```

---

## 8. Design System

**Theme: "Digital Craftsmanship & The Modern Archive"** — High-End Editorial aesthetic. Tagline: "Move Together. Age with Joy."

### 8.1 Design Tokens (Tailwind CSS custom colors)

Configure the following in `tailwind.config.ts` under `theme.extend.colors`:

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#173124` | Forest Green — headings, CTAs, nav |
| `--color-secondary` | `#735C00` | Gold — accent, focus states, secondary CTAs |
| `--color-stone` | `#E5E0D5` | Stone neutral — borders, card backgrounds |
| `--color-surface` | `#FEF9ED` | Warm cream — page background |
| `--color-surface-low` | `#F8F3E8` | Sectioning backgrounds |
| `--color-surface-high` | `#E7E2D7` | Interactive card backgrounds |
| `--color-outline` | `#727973` | Input borders |
| `--color-outline-variant` | `#C2C8C2` | Card borders |
| `--color-on-primary` | `#FFFFFF` | Text on primary (Forest Green) backgrounds |

**CRITICAL: Never use pure white (`#FFFFFF` / `bg-white`) as a page or section background.** Always use `#FEF9ED` (surface) or a surface variant.

### 8.2 Typography

Both fonts are loaded from Google Fonts. Add to `app/layout.tsx`.

| Element | Font | Weight | Size | Letter-spacing |
|---|---|---|---|---|
| Display / Headlines | Epilogue | 700–800 | — | -0.02em |
| Body text | Lexend | 400–500 | min 18px (1.125rem) | — |
| Labels / Metadata | Lexend | 600 | — | +0.05em (all-caps, gold `#735C00`) |

- Body line-height: 1.6 minimum.
- Minimum body font size enforced at 18px (`text-lg` in Tailwind).

### 8.3 Layout & Spacing Rules

| Rule | Value | Notes |
|---|---|---|
| Card border-radius | `3rem` (48px) | "xl weighted" look — use `rounded-[3rem]` |
| Card borders | `2px solid #C2C8C2` or `#E5E0D5` | Never hairline (1px) borders |
| Card padding | `p-8` (2rem) | |
| Card internal spacing | `space-y-8` (2rem) | NO internal divider lines — use spacing only |
| Minimum touch target | 48px height | All interactive elements; maps to `min-h-12` |
| Shadow style | Ambient only | blur 40–60px, opacity 4–6%, tinted surface color (never black) |
| Section separation | Background color shift | NEVER use thin (1px) dividers between sections |
| Page layout | Asymmetrical | Push headings left; body text slightly right |

### 8.4 Component Specifications

#### Buttons

| Variant | Background | Text | Border | Border-radius | Padding | Notes |
|---|---|---|---|---|---|---|
| Primary | `#173124` (Forest Green) | `#FFFFFF` | None | `3rem` | `px-6 py-3` | No gradients |
| Secondary | Transparent | `#173124` | `2px solid #173124` | `3rem` | `px-6 py-3` | |

#### Cards

```
bg: #E7E2D7 (surface-high)
border: 2px solid #C2C8C2 (outline-variant)
border-radius: 3rem (rounded-[3rem])
padding: p-8
internal separation: space-y-8 — NO divider lines
```

#### Inputs

```
border: 2px solid #727973 (outline) — fully enclosed
border-radius: 1rem (rounded-2xl)
focus: border shifts to #735C00 (Gold)
background: #FEF9ED (surface) or #F8F3E8 (surface-low)
```

---

## 9. Environment Variables
<!-- Note: formerly section 8 — renumbered after Design System was added as section 8 -->

Copy `.env.example` to `.env.local` and fill in the values. **Never commit `.env.local`** — it is listed in `.gitignore`.

```bash
# .env.example

# ─────────────────────────────────────────────────────────────────────────────
# Supabase (safe to expose — protected by RLS)
# ─────────────────────────────────────────────────────────────────────────────

# Your Supabase project URL (found in Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=

# Supabase anonymous/public key (safe for client bundle — RLS enforces access)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ─────────────────────────────────────────────────────────────────────────────
# Supabase — SERVER ONLY (never use NEXT_PUBLIC_ prefix)
# ─────────────────────────────────────────────────────────────────────────────

# Service role key — bypasses RLS; use only in trusted server contexts
# NEVER expose to the browser. NEVER log. NEVER commit.
SUPABASE_SERVICE_ROLE_KEY=

# ─────────────────────────────────────────────────────────────────────────────
# Vercel AI Gateway — provisioned automatically by Vercel at runtime
# Do NOT set this manually in .env.local; it is injected by the Vercel runtime.
# ─────────────────────────────────────────────────────────────────────────────

# Short-lived OIDC token for authenticating to Vercel AI Gateway
# VERCEL_OIDC_TOKEN=  ← auto-provisioned; do not set

# ─────────────────────────────────────────────────────────────────────────────
# Optional — App configuration
# ─────────────────────────────────────────────────────────────────────────────

# Base URL of the deployed app (used for absolute redirects in auth flows)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Variable Reference Table

| Variable | Client bundle? | Required | Source | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase dashboard | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Supabase dashboard | Public key; safe with RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Yes (server) | Supabase dashboard | Bypasses RLS; treat as master password |
| `VERCEL_OIDC_TOKEN` | **No** | Auto | Vercel runtime | Do not set manually |
| `NEXT_PUBLIC_APP_URL` | Yes | Recommended | Manual | Used for auth redirect URLs |

---

## 10. Development Setup

### Prerequisites

- Node.js 20+
- npm 10+ or pnpm 9+
- Supabase CLI (`npm install -g supabase`)
- Vercel CLI (`npm install -g vercel`) — optional but recommended

### Step 1: Clone and Install

```bash
git clone <repo-url> joyn
cd joyn
npm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env.local
# Open .env.local and fill in NEXT_PUBLIC_SUPABASE_URL,
# NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Set Up Supabase Locally (optional — or use cloud project)

```bash
# Start local Supabase stack (Docker required)
supabase start

# Apply migrations
supabase db push

# Load seed data
supabase db reset  # runs migrations + seed.sql

# Update generated types after schema changes
supabase gen types typescript --local > types/database.types.ts
```

For cloud development, create a project at [supabase.com](https://supabase.com), copy the URL and keys into `.env.local`, and run:

```bash
supabase db push --db-url "postgresql://..."
```

### Step 4: Run the Development Server

```bash
npm run dev
# → http://localhost:3000
```

### Step 5: Verify AI Gateway (Vercel Dev)

Because `VERCEL_OIDC_TOKEN` is only provisioned by the Vercel runtime, AI features require the Vercel CLI for local development:

```bash
vercel dev
# → proxies through Vercel's infrastructure, provisions OIDC token
```

Without `vercel dev`, AI route handlers will fail locally. Either use `vercel dev` or temporarily swap the gateway provider with a direct API key **in development only** (never commit this change).

### Step 6: Regenerate Types After Schema Changes

Whenever you add or alter a table:

```bash
supabase gen types typescript --project-id <your-project-id> > types/database.types.ts
```

Commit the updated `database.types.ts` so all team members share the same schema types.

---

## 11. Deployment

### Vercel (Production + Preview)

Joyn is deployed on Vercel. Every push to `main` triggers a production deployment. Every pull request gets an isolated preview URL.

#### Initial Setup

```bash
vercel link          # Link local repo to Vercel project
vercel env pull      # Pull production env vars to .env.local (optional)
```

#### Environment Variable Configuration

Set variables in **Vercel Project Settings → Environment Variables**:

| Variable | Environment | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Mark as **Sensitive** in Vercel UI |
| `NEXT_PUBLIC_APP_URL` | Production | Set to production domain (e.g. `https://joyn.app`) |

`VERCEL_OIDC_TOKEN` is **not** configured manually — Vercel provisions it automatically for projects using Vercel AI Gateway.

#### Build Configuration

```json
// package.json (relevant scripts)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

Vercel automatically runs `npm run build`. TypeScript errors fail the build — this is intentional.

#### Supabase Auth Redirect URLs

In your Supabase project (Authentication → URL Configuration):

- **Site URL**: `https://joyn.app` (or your production domain)
- **Redirect URLs**: Add `https://*.vercel.app/**` to allow preview deployments

#### Database Migrations in CI

Migrations should be applied manually or via a migration step before deployment:

```bash
supabase db push --project-ref <project-ref>
```

Consider using Supabase's GitHub integration for automated migration runs on merge to `main`.

#### Vercel AI Gateway Enablement

In Vercel Project Settings → AI, enable **AI Gateway**. This is required for `VERCEL_OIDC_TOKEN` to be provisioned and for the gateway to proxy requests to LLM providers.

---

*Last updated: March 2026 (v1.1 — Fitness Feature + Design System added). Maintained by the Joyn team for the ASU Principled Innovation Academy competition.*
