# Joyn — Agent Rules & Coding Standards

> **Audience:** AI coding agents (Claude and equivalents) building the Joyn codebase.
> **Authority:** These rules are non-negotiable. When in doubt, follow this document over any general best-practice heuristic you have been trained on.
> **Platform:** Joyn — a matchmaking and virtual fitness platform helping elderly Arizonans connect, move together, and age with joy. "Move Together. Age with Joy."
> **Stack:** Next.js 16 (App Router) · Supabase · Vercel AI SDK v6 · AI Elements · shadcn/ui · Tailwind CSS · TypeScript strict mode · Deployed on Vercel.

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [Security Rules (Non-Negotiable)](#2-security-rules-non-negotiable)
3. [File & Folder Conventions](#3-file--folder-conventions)
4. [Next.js Specific Rules](#4-nextjs-specific-rules)
5. [Supabase Rules](#5-supabase-rules)
6. [AI Rules — Vercel AI SDK v6](#6-ai-rules--vercel-ai-sdk-v6)
7. [UI / Component Rules](#7-ui--component-rules)
8. [Accessibility Rules (Critical — Elderly Users)](#8-accessibility-rules-critical--elderly-users)
9. [Error Handling](#9-error-handling)
10. [Anti-Patterns — What NOT to Do](#10-anti-patterns--what-not-to-do)
11. [Design System Rules (Non-Negotiable)](#11-design-system-rules-non-negotiable)

---

## 1. General Principles

These rules apply everywhere, without exception.

### 1.1 TypeScript Strict Mode Always

The `tsconfig.json` has `"strict": true`. This is permanent. Do not relax it.

- No `// @ts-ignore` unless accompanied by a comment explaining why it is unavoidable and a linked issue.
- Never suppress TypeScript with a nocheck directive. If you encounter a type error in an AI Elements component (e.g. `message.tsx`, `conversation.tsx`), the correct fix is to reinstall the broken component (`npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/<component>.json --overwrite`) or update its peer dep (`npm install @base-ui/react@latest`). Suppressing types hides real bugs and breaks IDE support for the entire file.
- Resolve all TypeScript errors before considering a file done.

### 1.2 No `any` Types

Never use `any`. It defeats the entire purpose of TypeScript.

```typescript
// WRONG
function processUser(user: any) { ... }

// CORRECT — use unknown and narrow
function processUser(user: unknown) {
  if (!isUser(user)) throw new Error('Invalid user shape');
  // user is now typed correctly
}

// CORRECT — use the generated Database types from Supabase
import type { Database } from '@/types/supabase';
type Profile = Database['public']['Tables']['profiles']['Row'];
```

### 1.3 No Commented-Out Code in Commits

Dead code committed as comments pollutes the codebase and confuses future agents. Delete it. Version control preserves history.

```typescript
// WRONG — do not commit this
// const oldHandler = async () => { ... }
const handler = async () => { ... }

// CORRECT
const handler = async () => { ... }
```

### 1.4 Single-Purpose Functions

Every function does one thing. If you need a conjunction ("fetch user and send email"), split it into two functions.

- Maximum function length: 40 lines of logic. If longer, decompose.
- Name functions with a verb that describes exactly what they do: `fetchUserProfile`, `validateOnboardingForm`, `buildMatchSuggestions`.

### 1.5 Composition Over Inheritance

Prefer small, composable functions and components over class hierarchies or deeply nested component trees.

### 1.6 File Length Limit: 200 Lines

If a file exceeds 200 lines, split it. Extract helper functions into `lib/`, sub-components into their own files, or types into `types/`.

This is a hard limit. Exceeding it is a signal the file has too many responsibilities.

### 1.7 No Magic Numbers or Strings

```typescript
// WRONG
if (user.age > 55) { ... }

// CORRECT
const MINIMUM_ELDERLY_AGE = 55;
if (user.age > MINIMUM_ELDERLY_AGE) { ... }
```

### 1.8 Explicit Return Types on All Exported Functions

```typescript
// WRONG
export async function getProfile(userId: string) {
  ...
}

// CORRECT
export async function getProfile(userId: string): Promise<Profile | null> {
  ...
}
```

---

## 2. Security Rules (Non-Negotiable)

> **WARNING:** Violations of this section constitute security vulnerabilities that could expose user data for elderly and vulnerable individuals. These rules are absolute. No exceptions, no shortcuts, no "I'll fix it later."

### 2.1 Never Expose `SUPABASE_SERVICE_ROLE_KEY` on the Client

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security entirely. It must **never** appear in:
- Any file that imports `'use client'`
- Any `NEXT_PUBLIC_` environment variable
- Any client-side utility, hook, or component
- Any bundle that ships to the browser

```typescript
// WRONG — in any client component or hook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // CRITICAL VIOLATION
);

// CORRECT — service role only in Server Actions or admin Route Handlers
// lib/supabase/admin.ts (server-only file — import 'server-only' at the top)
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

Mark any file that uses the service role key with `import 'server-only'` as the first import.

### 2.2 Never Import `createClient` Directly in Components

Always use the project's pre-configured wrappers. They ensure cookies, sessions, and types are handled consistently.

```typescript
// WRONG — importing directly
import { createClient } from '@supabase/supabase-js';

// CORRECT — use project wrappers
// In Server Components, Server Actions, Route Handlers:
import { createServerClient } from '@/lib/supabase/server';

// In Client Components (auth state only):
import { createBrowserClient } from '@/lib/supabase/client';
```

### 2.3 Never Use Raw SQL String Concatenation

SQL string concatenation is an injection vector. Always use the Supabase client's query builder or RPC with parameterized arguments.

```typescript
// WRONG — SQL injection vulnerability
const { data } = await supabase
  .rpc(`SELECT * FROM profiles WHERE name = '${userName}'`);

// WRONG — even if templated
const query = `SELECT * FROM profiles WHERE id = ${userId}`;

// CORRECT — use the query builder
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

// CORRECT — use RPC with named parameters
const { data, error } = await supabase
  .rpc('get_matches_for_user', { p_user_id: userId });
```

### 2.4 Row Level Security — Always On, Never Bypassed from Client Code

- Every table in the database must have RLS enabled.
- Never disable RLS on any table, even temporarily.
- Service role (RLS bypass) is only permitted inside:
  - Admin-only Server Actions
  - Internal cron Route Handlers (protected by a shared secret header)
  - Data migration scripts in `supabase/migrations/`
- If you find yourself wanting to bypass RLS in a user-facing flow, you have a schema or policy design problem — fix the policy instead.

### 2.5 Environment Variable Rules

| Variable | Allowed in | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Safe — public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Safe — anon key, RLS protected |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS — never expose |
| `VERCEL_OIDC_TOKEN` | Server only | Auto-provisioned by `vercel env pull` — do not set manually |
| Any third-party API key | Server only | Never in `NEXT_PUBLIC_` |

**Rule:** If a variable starts with `NEXT_PUBLIC_`, assume it is visible to every user and every web scraper. Only put values there that you would be comfortable publishing in a press release.

**AI Gateway auth:** The AI Gateway uses OIDC by default — no provider API keys are needed. Run `vercel env pull .env.local` once to provision `VERCEL_OIDC_TOKEN`. On Vercel deployments the token is auto-refreshed. Never add provider-specific keys (e.g. for OpenAI or Anthropic) to `.env` just to make AI calls — route through the gateway instead.

```typescript
// CORRECT — no provider keys needed anywhere in the codebase
// Run once: vercel env pull .env.local
// VERCEL_OIDC_TOKEN is read automatically by the ai package — never reference it in application code.
// All AI calls use the plain 'provider/model' string format — the gateway handles auth.
import { streamText } from 'ai';
const result = await streamText({ model: 'anthropic/claude-sonnet-4.6', messages });
```

### 2.6 Never Hardcode Secrets

No API keys, tokens, connection strings, or credentials anywhere in source code — not in test files, not in comments, not in seed scripts checked into the repo.

Use `process.env.VARIABLE_NAME` exclusively.

### 2.7 All AI Calls Through Vercel AI Gateway

Never import or call OpenAI, Anthropic, or any other AI provider SDK directly. All AI calls route through the Vercel AI Gateway using a plain `'provider/model'` string — no provider client needed.

```typescript
// CORRECT — Vercel AI SDK with Gateway model string (no provider import required)
import { streamText } from 'ai';

const result = await streamText({
  model: 'anthropic/claude-sonnet-4.6', // 'provider/model' — routes through AI Gateway
  messages,
});

// WRONG — direct provider packages bypass the gateway entirely.
// Do not use: the 'openai' npm package, '@anthropic-ai/sdk', or '@ai-sdk/anthropic' provider wrappers.
// These require separate API keys and circumvent gateway auth, cost tracking, and failover.
```

---

## 3. File & Folder Conventions

### 3.1 Canonical Folder Structure

```
app/
├── (auth)/              # Public auth pages — login, register, forgot password
├── (app)/               # Protected pages — middleware guards all routes here
│   ├── dashboard/
│   ├── matches/
│   ├── events/
│   ├── profile/
│   ├── onboarding/
│   ├── sessions/        # Upcoming/scheduled workout sessions
│   └── workout/[sessionId]/  # Workout session — routine card + video call
├── api/                 # Route handlers — server only, never import client code
│   ├── ai/              # AI streaming endpoints
│   └── sessions/        # Session CRUD endpoint
├── layout.tsx           # Root layout
└── page.tsx             # Public landing page

components/
├── ui/                  # shadcn/ui primitives ONLY — no custom components here
├── ai-elements/         # AI Elements components ONLY
├── layout/              # Header, Footer, Nav — app-wide chrome
├── match/               # Match card, match list, match actions
├── events/              # Event card, event list, RSVP button
├── onboard/             # Onboarding chatbot steps and wrappers
├── profile/             # Profile view, edit form, avatar, fitness fields
├── sessions/            # SessionCard, SessionList, SessionScheduler, StreakBadge
└── workout/             # RoutineCard, VideoCallEmbed, WorkoutTimer

lib/
├── supabase/
│   ├── client.ts        # Browser Supabase client — for auth state only
│   ├── server.ts        # Server Supabase client — for all data access
│   └── middleware.ts    # Session refresh middleware helper
├── ai/                  # AI utility functions, prompt builders, schema definitions
└── utils.ts             # Generic utilities (cn, formatDate, etc.)

types/                   # TypeScript type definitions ONLY — no logic
hooks/                   # Custom React hooks ONLY — no business logic
supabase/
├── migrations/          # Ordered SQL migration files
└── seed.sql             # Dev seed data
```

### 3.2 When to Create a New File vs Add to Existing

**Create a new file when:**
- A component is used in more than one place
- A utility function belongs to a distinct domain (e.g., `lib/ai/prompt-builders.ts` vs `lib/utils.ts`)
- The existing file would exceed 200 lines with the addition
- The code has a clearly different purpose from the existing file

**Add to an existing file when:**
- The function is a small helper used only in that file
- The type is specific to a single module

### 3.3 Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `match-card.tsx`, `use-profile.ts` |
| Folders | `kebab-case` | `ai-elements/`, `match/` |
| React Components | `PascalCase` | `MatchCard`, `ProfileForm` |
| Functions | `camelCase` with verb | `fetchMatches`, `buildPrompt` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_MATCHES_PER_PAGE` |
| TypeScript types/interfaces | `PascalCase` | `UserProfile`, `MatchResult` |
| Database-derived types | Mirror Supabase generated names | `Database['public']['Tables']['profiles']['Row']` |
| Hooks | `use` prefix + `camelCase` | `useProfile`, `useMatchList` |
| Server Actions files | `actions.ts` in feature folder | `app/(app)/profile/actions.ts` |

### 3.4 Import Order

Always order imports as follows, with a blank line between each group:

```typescript
// 1. Node built-ins (rare in Next.js)
import path from 'path';

// 2. External packages
import { streamText } from 'ai';
import { z } from 'zod';

// 3. Next.js internals
import { cookies } from 'next/headers';
import Link from 'next/link';

// 4. Internal aliases (@/)
import { createServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

// 5. Relative imports
import { MatchCard } from './match-card';
```

Use `@/` path aliases exclusively for absolute internal imports. Never use `../../../` chains longer than one level.

### 3.5 No Barrel Files (`index.ts`) Unless Necessary

Barrel files cause bundler issues with tree-shaking and make it unclear where code actually lives. Import from the specific file path.

```typescript
// WRONG
import { MatchCard, MatchList } from '@/components/match';

// CORRECT
import { MatchCard } from '@/components/match/match-card';
import { MatchList } from '@/components/match/match-list';
```

---

## 4. Next.js Specific Rules

### 4.1 Server Components Are the Default

Every component in `app/` is a Server Component by default. Only add `'use client'` when there is a specific, documented reason.

Valid reasons to add `'use client'`:
- The component uses React state (`useState`, `useReducer`)
- The component uses React hooks that require a browser context (`useEffect`, `useRef`, `useContext`)
- The component uses browser-only APIs (e.g., `localStorage`, `window`)
- The component uses the Vercel AI SDK `useChat` hook
- The component is a shadcn/ui interactive primitive that requires client behavior

```typescript
// CORRECT — Server Component (no directive needed)
// app/(app)/matches/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function MatchesPage() {
  const supabase = await createServerClient();
  const { data: matches } = await supabase.from('matches').select('*');
  return <MatchList matches={matches ?? []} />;
}

// CORRECT — Client Component (needs state)
// components/match/match-card.tsx
'use client';
import { useState } from 'react';

export function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);
  ...
}
```

### 4.2 Server Actions for All Mutations

All data mutations (INSERT, UPDATE, DELETE) go through Server Actions — never through client-side fetch calls to internal API routes.

```typescript
// app/(app)/profile/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const displayName = formData.get('displayName') as string;

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id);

  if (error) {
    console.error('[updateProfile]', error);
    return { success: false, error: 'Failed to update profile' };
  }

  revalidatePath('/profile');
  return { success: true };
}
```

### 4.3 Route Handlers for API Endpoints

Use Route Handlers (`app/api/*/route.ts`) when:
- You need a streaming AI response endpoint
- An external service sends a webhook
- You need a public API endpoint consumed by a third party

Route Handlers are server-only. Never import `'use client'` code inside them.

```typescript
// app/api/ai/chat/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { streamText, convertToModelMessages } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { messages } = await req.json();

  const result = await streamText({
    model: 'anthropic/claude-sonnet-4.6',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

### 4.4 Async Request APIs — Always `await`

In Next.js 16, `cookies()`, `headers()`, and `params` are all async. Always `await` them.

```typescript
// WRONG — synchronous access removed in Next.js 16
import { cookies } from 'next/headers';
const cookieStore = cookies(); // throws in Next.js 16

// CORRECT
import { cookies } from 'next/headers';
const cookieStore = await cookies();

// WRONG — params without await
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id; // type error in Next.js 16
}

// CORRECT
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

### 4.5 Never Use `useEffect` for Data Fetching

Data fetching belongs in Server Components. `useEffect` for data fetching causes waterfalls, flash of empty content, and race conditions.

```typescript
// WRONG — useEffect data fetching
'use client';
import { useEffect, useState } from 'react';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile);
  }, []);
  return <div>{profile?.name}</div>;
}

// CORRECT — Server Component
// app/(app)/profile/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  return <ProfileView profile={profile!} />;
}
```

### 4.6 Middleware Authentication

All routes under `app/(app)/` are protected by `middleware.ts`. The middleware must:
1. Refresh the Supabase session
2. Redirect unauthenticated users to `/login`
3. Never expose protected page content to unauthenticated requests

Do not implement authentication guards inside individual page components — that is the middleware's responsibility.

### 4.7 Loading and Error Boundaries

Every `app/(app)/*/page.tsx` route segment should have a corresponding:
- `loading.tsx` — skeleton UI while the page loads
- `error.tsx` — user-friendly error state

---

## 5. Supabase Rules

### 5.1 Always Use the Server Client for Data Access

```typescript
// lib/supabase/server.ts handles cookie-based session management.
// Use it for ALL data operations in Server Components, Actions, and Route Handlers.
import { createServerClient } from '@/lib/supabase/server';

const supabase = await createServerClient();
```

### 5.2 Browser Client for Auth State Only

```typescript
// lib/supabase/client.ts is for client-side auth state listening only.
// Do not use it to query database tables.
import { createBrowserClient } from '@/lib/supabase/client';

// CORRECT use case — listening to auth state changes in a client component
const supabase = createBrowserClient();
supabase.auth.onAuthStateChange((event, session) => { ... });

// WRONG use case — querying data from a client component
const { data } = await supabase.from('profiles').select('*'); // use Server Component instead
```

### 5.3 Always Type Queries with Generated Database Types

Generate types with: `npx supabase gen types typescript --project-id <id> > types/supabase.ts`

```typescript
import type { Database } from '@/types/supabase';

// CORRECT — typed client
const supabase = await createServerClient<Database>();

// CORRECT — typed result
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
```

### 5.4 Always Handle Supabase Errors Explicitly

Never ignore the `error` field from Supabase responses. Treat a non-null error as an exception.

```typescript
// WRONG — ignoring error
const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
return data;

// CORRECT — explicit error handling
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (error) {
  console.error('[getProfile] Supabase error:', error.message, error.code);
  throw new Error('Failed to fetch profile');
}

return data;
```

### 5.5 Correct Query Patterns

```typescript
// Fetching a single row — always use .single() and handle PGRST116 (not found)
const { data, error } = await supabase
  .from('profiles')
  .select('id, display_name, bio, avatar_url')
  .eq('id', userId)
  .single();

if (error?.code === 'PGRST116') return null; // row not found is not an error
if (error) throw new Error(error.message);

// Inserting with typed payload
const payload: ProfileInsert = {
  id: user.id,
  display_name: name,
  created_at: new Date().toISOString(),
};
const { error } = await supabase.from('profiles').insert(payload);
if (error) throw new Error(error.message);

// Updating with a guard — always filter by the authenticated user's id
const { error } = await supabase
  .from('profiles')
  .update({ bio: newBio })
  .eq('id', user.id); // RLS also enforces this, but be explicit
if (error) throw new Error(error.message);
```

### 5.6 RLS Must Cover Every Table

When creating a migration for a new table:
1. `ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;` must be in the migration.
2. Define SELECT, INSERT, UPDATE, DELETE policies before the table is used.
3. Default policy is deny-all. Explicitly grant what is needed.

```sql
-- Example RLS for a messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
```

### 5.7 Never Select `*` in Production Queries

Select only the columns you need. This reduces payload size and prevents accidentally exposing sensitive fields.

```typescript
// WRONG
const { data } = await supabase.from('profiles').select('*');

// CORRECT
const { data } = await supabase
  .from('profiles')
  .select('id, display_name, avatar_url, city');
```

---

## 6. AI Rules — Vercel AI SDK v6

### 6.1 Always Use the Vercel AI Gateway

Pass a plain `'provider/model'` string to the `model` parameter — the AI SDK routes it through the gateway automatically. Never instantiate a provider client directly.

```typescript
import { streamText } from 'ai';

// CORRECT — Gateway model string (dots for version numbers, not hyphens)
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.6',
  messages,
});

// CORRECT — alternative model via Gateway
const result = await streamText({
  model: 'openai/gpt-5.4',
  messages,
});

// WRONG — direct provider packages bypass the gateway entirely.
// Do not use the 'openai' npm package, '@anthropic-ai/sdk', or '@ai-sdk/anthropic' provider wrappers.
// These require separate API keys and circumvent gateway auth, cost tracking, and failover.
```

### 6.2 Always Stream for User-Facing AI

Never use `generateText` for responses the user is waiting for — always `streamText`. Streaming dramatically improves perceived performance, which is critical for elderly users who may be anxious about waiting.

```typescript
// WRONG — blocks until complete, poor UX
const { text } = await generateText({ model: '...', messages });
return Response.json({ text });

// CORRECT — streaming response
const result = await streamText({ model: '...', messages });
return result.toUIMessageStreamResponse();
```

`generateText` is acceptable only for background jobs, cron tasks, or when the result is not directly shown to the user in real-time.

### 6.3 Always Use AI Elements for Rendering AI Text

In AI SDK v6, messages use `message.parts` (an array), not a single `message.content` string. Never render AI text by accessing `message.content` directly or injecting raw HTML. Use the AI Elements `Message` component, which iterates `message.parts` automatically and handles text, tool calls, reasoning, streaming, and markdown safely.

```typescript
// CORRECT — AI Elements Message component handles all part types automatically
import { Message } from '@/components/ai-elements/message';
import { Conversation } from '@/components/ai-elements/conversation';

// Inside your chat component:
<Conversation>
  {messages.map((message) => (
    <Message key={message.id} message={message} />
  ))}
</Conversation>

// CORRECT — MessageResponse for standalone AI-generated text outside chat
import { MessageResponse } from '@/components/ai-elements/message';
<MessageResponse>{generatedText}</MessageResponse>

// WRONG — accessing deprecated .content string
// <p>{message.content}</p>

// WRONG — injecting raw HTML (XSS risk and bypasses AI Elements styling)
// <div dangerouslySetInnerHTML={{ __html: someHtml }} />

// WRONG — manual part iteration without AI Elements (fragile, misses streaming states)
// message.parts.map(part => part.type === 'text' ? <p>{part.text}</p> : null)
```

### 6.4 Client-Side Chat: `useChat` with `DefaultChatTransport`

```typescript
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function OnboardingChat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/onboarding' }),
  });

  return (
    <ChatContainer>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <ChatInput onSend={sendMessage} disabled={status === 'streaming'} />
    </ChatContainer>
  );
}
```

### 6.5 Server-Side Chat: `convertToModelMessages` + `toUIMessageStreamResponse`

```typescript
// app/api/ai/onboarding/route.ts
import { streamText, convertToModelMessages } from 'ai';
import type { UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await streamText({
    model: 'anthropic/claude-sonnet-4.6',
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

### 6.6 AI System Prompts Live in `lib/ai/`

Never write system prompts inline in Route Handlers. Extract them to `lib/ai/prompts.ts` or `lib/ai/[feature]-prompts.ts`.

```typescript
// lib/ai/prompts.ts
export const ONBOARDING_SYSTEM_PROMPT = `
You are a warm, patient companion helping elderly users in Arizona
set up their Joyn profile. Speak clearly and simply.
Never use jargon. Ask one question at a time.
`.trim();
```

### 6.7 Always Validate AI-Generated Structured Data with Zod

`generateObject` was removed in AI SDK v6. Use `generateText` with `output: Output.object({ schema })` instead. Define the schema with Zod — the result is fully typed and validated.

```typescript
import { generateText, Output } from 'ai';
import { z } from 'zod';

const MatchSuggestionSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().max(200),
  compatibilityScore: z.number().min(0).max(1),
});

const { experimental_output: matchSuggestion } = await generateText({
  model: 'anthropic/claude-sonnet-4.6',
  output: Output.object({ schema: MatchSuggestionSchema }),
  prompt: buildMatchPrompt(userProfile),
});
// matchSuggestion is fully typed as z.infer<typeof MatchSuggestionSchema>
```

---

## 7. UI / Component Rules

### 7.1 Always Use shadcn/ui Primitives

Never build custom buttons, inputs, dialogs, dropdowns, or form controls from scratch. Use `components/ui/` which holds shadcn/ui components.

```typescript
// WRONG — hand-rolled button
<button className="px-4 py-2 bg-blue-500 text-white rounded">Click me</button>

// CORRECT — shadcn/ui Button
import { Button } from '@/components/ui/button';
<Button variant="default" size="lg">Click me</Button>
```

To add a new shadcn/ui component: `npx shadcn@latest add <component-name>`

### 7.2 Large Text for Elderly Accessibility

These are minimum sizes — go larger where it improves readability:

| Element | Minimum Size |
|---|---|
| Body text | 16px (`text-base`) |
| Labels | 16px (`text-base`) |
| Primary action buttons | 20px (`text-xl`) |
| Headings H1 | 32px (`text-3xl`) |
| Headings H2 | 24px (`text-2xl`) |
| Navigation links | 18px (`text-lg`) |
| Error messages | 16px (`text-base`) |

```typescript
// WRONG — too small for elderly users
<Button className="text-xs">Send Message</Button>

// CORRECT
<Button className="text-xl py-4 px-8" size="lg">Send Message</Button>
```

### 7.3 No Inline Styles

Never use the `style` prop. Always use Tailwind utility classes. Inline styles are not responsive, not theme-aware, and not searchable.

```typescript
// WRONG
<div style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>

// CORRECT
<div className="p-4 bg-gray-100">
```

### 7.4 Every Image Needs Alt Text

```typescript
// WRONG
<Image src={avatar} />
<img src={avatar} />

// CORRECT
<Image src={avatar} alt={`Profile photo of ${user.displayName}`} />

// CORRECT for decorative images
<Image src={decorativeBanner} alt="" aria-hidden="true" />
```

### 7.5 Every Form Field Needs a Visible Label

```typescript
// WRONG — placeholder is not a label
<Input placeholder="Your name" />

// CORRECT
<div className="space-y-2">
  <Label htmlFor="display-name" className="text-base font-medium">
    Your Name
  </Label>
  <Input id="display-name" name="displayName" placeholder="e.g. Margaret" />
</div>
```

### 7.6 Component Responsibility

Components in `components/` must not contain:
- Database queries (use Server Components in `app/`)
- Business logic (use `lib/`)
- Auth checks (use middleware or Server Components)

Components may contain:
- Rendering logic
- Local UI state (expanded/collapsed, hover state)
- Event handlers that call Server Actions or callbacks passed as props

---

## 8. Accessibility Rules (Critical — Elderly Users)

> **Context:** Joyn's users are elderly individuals who may have reduced vision, motor difficulties, or limited digital literacy. Accessibility is not a nice-to-have — it is the core product requirement.

### 8.1 WCAG AA Compliance is the Minimum

Target WCAG 2.1 AA for all features. Check with a screen reader and keyboard-only navigation before marking any UI task complete.

### 8.2 Minimum Touch Target: 44x44px

Every tappable element must be at least 44x44 CSS pixels. Most elderly users interact on tablets or phones.

```typescript
// WRONG — too small
<button className="p-1 text-sm">X</button>

// CORRECT — minimum 44x44
<Button className="min-w-[44px] min-h-[44px] p-3" aria-label="Close dialog">
  <X className="h-5 w-5" />
</Button>
```

### 8.3 Color Contrast Ratio: 4.5:1 Minimum

- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and focus indicators: 3:1 minimum

Use the Tailwind palette values that have been pre-verified for the design system. Never introduce a custom color without verifying its contrast ratio.

### 8.4 Focus Styles — Mandatory on Every Interactive Element

Never remove focus styles with `outline-none` unless you replace them with a custom focus indicator.

```typescript
// WRONG — removes focus entirely
<button className="outline-none">Click</button>

// CORRECT — keeps default or uses enhanced focus ring
<Button className="focus-visible:ring-4 focus-visible:ring-blue-500">Click</Button>
```

All shadcn/ui components include focus styles by default. Do not override them without adding a replacement.

### 8.5 Keyboard Navigation

All flows must be completable with keyboard only:
- Tab order must be logical (top-to-bottom, left-to-right)
- Modal dialogs must trap focus while open and return focus when closed
- Dropdown menus must support arrow-key navigation
- Forms must submit on Enter

### 8.6 Semantic HTML

Use the correct HTML element for the job. Never use a `<div>` or `<span>` where a semantic element exists.

```typescript
// WRONG
<div onClick={handleClick} className="cursor-pointer">Send Message</div>
<div role="button" onClick={handleClick}>Send Message</div>

// CORRECT
<button type="button" onClick={handleClick}>Send Message</button>
// or using shadcn/ui:
<Button onClick={handleClick}>Send Message</Button>

// WRONG — non-semantic page structure
<div className="header">...</div>
<div className="main-content">...</div>

// CORRECT
<header>...</header>
<main>...</main>
<nav aria-label="Main navigation">...</nav>
<section aria-labelledby="events-heading">...</section>
<footer>...</footer>
```

### 8.7 ARIA Attributes

Use ARIA attributes to supplement semantics where HTML alone is insufficient:

```typescript
// Loading states
<Button disabled aria-busy="true" aria-label="Sending message...">
  <Spinner aria-hidden="true" />
  Sending...
</Button>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// Icon-only buttons must have accessible labels
<Button variant="ghost" size="icon" aria-label="Open settings">
  <Settings className="h-5 w-5" aria-hidden="true" />
</Button>
```

### 8.8 Error Messages Must Be Perceivable

```typescript
// WRONG — color alone conveys error
<Input className="border-red-500" />

// CORRECT — color + text + aria
<div>
  <Input
    id="email"
    aria-describedby="email-error"
    aria-invalid={!!error}
    className={error ? 'border-red-500' : ''}
  />
  {error && (
    <p id="email-error" role="alert" className="text-red-700 text-base mt-1">
      {error}
    </p>
  )}
</div>
```

### 8.9 Simple, Plain Language

AI-generated copy and UI labels must use plain language. Avoid idioms, jargon, or complex sentence structures. Aim for a Grade 6 reading level in all user-facing text.

---

## 9. Error Handling

### 9.1 Never Swallow Errors Silently

```typescript
// WRONG — error disappears
try {
  await updateProfile(formData);
} catch (e) {
  // silent
}

// WRONG — console.log only
try {
  await updateProfile(formData);
} catch (e) {
  console.log(e);
}

// CORRECT
try {
  await updateProfile(formData);
} catch (error) {
  console.error('[ProfileForm] updateProfile failed:', error);
  setFormError('Something went wrong. Please try again.');
}
```

### 9.2 User-Friendly Error Messages

Never show raw error objects, stack traces, database error codes, or technical messages to users.

```typescript
// WRONG — raw error to user
return { error: error.message }; // e.g., "duplicate key value violates unique constraint"

// CORRECT — friendly message, technical details logged server-side
console.error('[createAccount] Supabase error:', error);
return { error: 'We could not create your account. Please try a different email.' };
```

### 9.3 Try/Catch in All Async Functions

Every `async` function that performs I/O (database, AI, external API) must be wrapped in try/catch.

```typescript
export async function fetchUserMatches(userId: string): Promise<Match[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('matches')
      .select('id, matched_user_id, score')
      .eq('user_id', userId);

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('[fetchUserMatches]', error);
    throw new Error('Unable to load matches');
  }
}
```

### 9.4 Server Actions Must Return a Typed Result

Never throw from a Server Action — return a discriminated union result type.

```typescript
// types/actions.ts
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// Usage in Server Action
export async function updateProfile(
  formData: FormData
): Promise<ActionResult> {
  try {
    // ...
    return { success: true, data: undefined };
  } catch (error) {
    console.error('[updateProfile]', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Usage in Client Component
const result = await updateProfile(formData);
if (!result.success) {
  setError(result.error);
}
```

### 9.5 Log Errors Server-Side Only

Do not surface error details in client-side console logs — log them on the server. Client-side logs are visible to all users and can reveal internal structure.

```typescript
// WRONG — in a client component
console.error('DB error:', error); // visible to all users

// CORRECT — in a Server Action or Route Handler
console.error('[server][updateProfile]:', error.message, error.stack);
```

---

## 10. Anti-Patterns — What NOT to Do

The following patterns are explicitly banned in this codebase. If you encounter them, fix them.

### 10.1 Do Not `fetch` Internal API Routes from Server Components

```typescript
// WRONG — HTTP round-trip to your own server
// app/(app)/dashboard/page.tsx (Server Component)
const res = await fetch('/api/matches');
const matches = await res.json();

// CORRECT — call the function directly
import { fetchUserMatches } from '@/lib/matches';
const matches = await fetchUserMatches(userId);
```

### 10.2 Do Not Use `useEffect` for Data Fetching

See Section 4.5 for the correct pattern. `useEffect` for data fetching is always wrong in this codebase.

### 10.3 Do Not Bypass RLS with Service Role from Client Code

See Section 2.1 and 2.4. Service role usage is restricted to server-only admin operations.

### 10.4 Do Not Put Business Logic in Components

```typescript
// WRONG — business logic in a component
export function MatchList() {
  const matches = useMatches();
  const ranked = matches
    .filter(m => m.score > 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  // ...
}

// CORRECT — logic in lib/
// lib/matches.ts
export function getRankedMatches(matches: Match[]): Match[] {
  return matches
    .filter(m => m.score > 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// component only renders
export function MatchList({ matches }: { matches: Match[] }) {
  const ranked = getRankedMatches(matches);
  // ...
}
```

### 10.5 Do Not Use Inline Styles

See Section 7.3. Tailwind classes only.

### 10.6 Do Not Mix Auth Logic into UI Components

Auth checks belong in middleware (`middleware.ts`) and Server Components. UI components receive already-authenticated data as props — they never check auth themselves.

```typescript
// WRONG — auth check in a component
export function Dashboard() {
  const { user } = useUser();
  if (!user) return redirect('/login');
  // ...
}

// CORRECT — middleware handles this; component assumes authenticated context
export default async function DashboardPage() {
  // middleware already redirected unauthenticated users
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  // user is guaranteed to exist here
}
```

### 10.7 Do Not Use `any` Type Assertions to Silence Errors

```typescript
// WRONG — silences a real type error
const profile = data as any;
const profile = data!; // non-null assertion without verifying

// CORRECT — fix the underlying type issue
if (!data) throw new Error('Profile not found');
const profile: Profile = data;
```

### 10.8 Do Not Create Components Without Prop Types

```typescript
// WRONG
export function MatchCard({ match, onConnect }) {
  // ...
}

// CORRECT
interface MatchCardProps {
  match: Match;
  onConnect: (matchId: string) => void;
}

export function MatchCard({ match, onConnect }: MatchCardProps) {
  // ...
}
```

### 10.9 Do Not Call AI Endpoints Without Authentication

Every AI Route Handler must verify the user session before processing. AI calls are expensive and must not be open to unauthenticated requests.

```typescript
// WRONG — no auth check
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({ ... });
  return result.toUIMessageStreamResponse();
}

// CORRECT
export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { messages } = await req.json();
  const result = await streamText({ ... });
  return result.toUIMessageStreamResponse();
}
```

### 10.10 Do Not Skip `loading.tsx` and `error.tsx`

Every page route that fetches data must have both. Elderly users need visual feedback while content loads and a clear, reassuring message if something goes wrong.

---

## 11. Design System Rules (Non-Negotiable)

> **Context:** Joyn's visual identity is "Digital Craftsmanship & The Modern Archive" — a high-end editorial aesthetic that conveys warmth, trust, and accessibility. These rules are as non-negotiable as the security rules. Deviating from them produces an inconsistent, off-brand experience.

### 11.1 Color — Use Design Tokens Only

Never hard-code hex values in component classes. Use only the Tailwind design token aliases defined in `tailwind.config.ts`.

| Token | Hex | Tailwind class | Usage |
|---|---|---|---|
| Forest Green | `#173124` | `bg-primary` / `text-primary` | Headings, CTAs, nav |
| Gold | `#735C00` | `bg-secondary` / `text-secondary` | Accent, focus states, secondary CTAs, label metadata |
| Stone | `#E5E0D5` | `bg-stone` / `border-stone` | Borders, card backgrounds |
| Warm Cream (surface) | `#FEF9ED` | `bg-surface` | Page background |
| Surface Low | `#F8F3E8` | `bg-surface-low` | Sectioning backgrounds |
| Surface High | `#E7E2D7` | `bg-surface-high` | Interactive card backgrounds |
| Outline | `#727973` | `border-outline` | Input borders |
| Outline Variant | `#C2C8C2` | `border-outline-variant` | Card borders |
| On Primary | `#FFFFFF` | `text-on-primary` | Text on Forest Green backgrounds |

**RULE: Never use `bg-white` or `#FFFFFF` as a page, section, or card background.** Always substitute `bg-surface` (`#FEF9ED`) or a surface variant. Pure white is banned from all backgrounds.

### 11.2 Typography — Epilogue & Lexend Only

```typescript
// CORRECT — add to app/layout.tsx
import { Epilogue, Lexend } from 'next/font/google';

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-epilogue',
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lexend',
});
```

- **Display / Headlines**: Epilogue, weight 700–800, letter-spacing `-0.02em`.
- **Body text**: Lexend, minimum 18px (1.125rem / `text-lg`), line-height 1.6.
- **Labels / Metadata**: Lexend 600, all-caps, letter-spacing `+0.05em`, color Gold (`#735C00`).

```typescript
// WRONG — any other font
<h1 className="font-sans text-2xl">Hello</h1>

// CORRECT
<h1 className="font-epilogue font-bold text-3xl tracking-[-0.02em] text-primary">Hello</h1>

// CORRECT — metadata label
<span className="font-lexend font-semibold text-sm uppercase tracking-[0.05em] text-secondary">
  Weekly Goal
</span>
```

### 11.3 No Hairlines — Section Separation via Color Shifts Only

Never use `border-t`, `border-b`, or any 1px border to separate page sections or content areas. Use background color transitions instead.

```typescript
// WRONG — thin divider between sections
<section className="border-t border-gray-200 py-8">

// CORRECT — background color shift creates visual separation
<section className="bg-surface-low py-8">
<section className="bg-surface py-8">
```

Card-level 2px borders (`border-2 border-outline-variant`) are fine — this rule applies to section/layout dividers only.

### 11.4 Card Specification

```typescript
// CORRECT — standard card
<div className="bg-surface-high border-2 border-outline-variant rounded-[3rem] p-8">
  {/* Use space-y-8 between internal sections — NO internal <hr> or border lines */}
  <div className="space-y-8">
    ...
  </div>
</div>
```

- `bg-surface-high` (`#E7E2D7`)
- `border-2 border-outline-variant` (`2px solid #C2C8C2`)
- `rounded-[3rem]` — 48px border radius
- `p-8` — 2rem padding
- Internal spacing: `space-y-8` (2rem) — **no `<hr>` or border lines inside cards**

### 11.5 Button Specification

```typescript
// CORRECT — primary button
<Button className="bg-primary text-on-primary rounded-[3rem] px-6 py-3 min-h-[48px]">
  Join Workout
</Button>

// CORRECT — secondary button
<Button
  variant="outline"
  className="border-2 border-primary text-primary bg-transparent rounded-[3rem] px-6 py-3 min-h-[48px]"
>
  View Schedule
</Button>

// WRONG — gradient or shadow on buttons
<Button className="bg-gradient-to-r from-green-700 to-green-500 ...">

// WRONG — incorrect border-radius
<Button className="rounded-lg ...">
```

### 11.6 Input Specification

```typescript
// CORRECT
<Input
  className="
    border-2 border-outline rounded-2xl
    bg-surface
    focus:border-secondary focus:ring-0
    text-lg min-h-[48px]
    px-4
  "
/>
```

- Fully enclosed 2px border, color `#727973` (`border-outline`)
- On focus: border shifts to Gold `#735C00` (`border-secondary`) — no glow ring
- Border-radius: `rounded-2xl` (1rem / 16px)
- Minimum height: 48px

### 11.7 Shadows — Ambient Only

```typescript
// WRONG — hard or dark shadow
<div className="shadow-lg shadow-black/20">

// CORRECT — ambient, tinted surface shadow
<div style={{ boxShadow: '0 8px 48px 0 rgba(23, 49, 36, 0.05)' }}>
// or with Tailwind arbitrary: shadow-[0_8px_48px_0_rgba(23,49,36,0.05)]
```

- Blur: 40–60px
- Opacity: 4–6%
- Color: tinted with Forest Green (`#173124`) — never pure black

### 11.8 Layout — Asymmetrical Composition

- Push headings (`<h1>`, `<h2>`) to the **left**, with wider left margin.
- Offset body copy **slightly right** of the heading for visual layering.
- Avoid perfectly centered, symmetric layouts on landing and marketing pages.
- Dashboard and functional pages may use standard grid layouts.

### 11.9 Minimum Touch Targets: 48px

All interactive elements (buttons, inputs, links, icon buttons) must meet a minimum height of 48px. This supersedes the general accessibility rule of 44px to align with the design system.

```typescript
// CORRECT
<Button className="min-h-[48px] ...">

// WRONG — below minimum
<button className="h-8 ...">
```

---

## Appendix: Quick-Reference Checklist

Before marking any task complete, verify:

**TypeScript**
- [ ] No `any` types
- [ ] All exported functions have explicit return types
- [ ] No TypeScript errors

**Security**
- [ ] No secrets in `NEXT_PUBLIC_` variables
- [ ] No direct Supabase `createClient` imports in components
- [ ] All database access goes through Server Components / Actions / Route Handlers
- [ ] Service role key used only in server-only admin code
- [ ] All AI calls use Vercel AI Gateway model string format

**Next.js**
- [ ] No `useEffect` for data fetching
- [ ] Dynamic params use `await params`
- [ ] Mutations use Server Actions, not client-side fetch
- [ ] `loading.tsx` and `error.tsx` present for data-fetching routes

**Supabase**
- [ ] Using `@/lib/supabase/server` (not direct import)
- [ ] All errors handled explicitly
- [ ] Only needed columns selected (no `select('*')` in production)
- [ ] New tables have RLS enabled with policies defined

**AI**
- [ ] Streaming used for user-facing responses
- [ ] AI Elements used for rendering (not raw text)
- [ ] Auth check at start of every AI Route Handler

**Accessibility**
- [ ] All interactive elements have focus styles
- [ ] All images have alt text
- [ ] All form fields have visible labels
- [ ] Touch targets are at least 44x44px
- [ ] Text meets minimum size requirements
- [ ] Semantic HTML elements used

**Error Handling**
- [ ] All async functions have try/catch
- [ ] Server Actions return `ActionResult` union type
- [ ] User-facing error messages are friendly (no raw errors)
- [ ] Errors are logged server-side

**Design System**
- [ ] No `bg-white` or `#FFFFFF` backgrounds — using `bg-surface` or variant
- [ ] Only Epilogue (headings) and Lexend (body) fonts used
- [ ] Body text minimum 18px; line-height 1.6
- [ ] No 1px dividers between sections — using background color shifts
- [ ] Cards use `rounded-[3rem]`, `border-2 border-outline-variant`, `p-8`, `bg-surface-high`
- [ ] Primary buttons use `bg-primary text-on-primary rounded-[3rem]` — no gradients
- [ ] Inputs have `border-2 border-outline rounded-2xl`, focus shifts border to Gold (`border-secondary`)
- [ ] All touch targets minimum 48px height
- [ ] Shadows are ambient only (40–60px blur, 4–6% opacity, Forest Green tint)
- [ ] No hard-coded hex colors — using Tailwind design token classes

---

*This document is the authoritative source of truth for all agents and developers building the Joyn codebase. When rules conflict with general AI training knowledge, this document takes precedence.*
