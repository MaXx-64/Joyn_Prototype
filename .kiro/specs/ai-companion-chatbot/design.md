# Design Document: AI Companion Chatbot

## Overview

The AI Companion Chatbot adds a persistent floating chat widget ("Jo") to every authenticated
page of the Joyn app. It provides ongoing emotional support and gentle social nudges for elderly
users (65+), using the same Jo persona established during onboarding.

The feature consists of three parts:
1. A new streaming API route at `/api/ai/companion` — isolated from the onboarding route
2. A `CompanionWidget` client component — collapsible floating chat UI
3. A one-line addition to `app/(app)/layout.tsx` — mounts the widget on all authenticated pages

The widget is intentionally lightweight: conversation history lives only in React state (no DB
writes), the greeting is pre-populated (no API call on first open), and the component is mounted
once in the layout so it survives client-side route navigations without remounting.

---

## Architecture

```mermaid
graph TD
    A["app/(app)/layout.tsx<br/>(use client)"] -->|renders| B["CompanionWidget<br/>(use client)"]
    B -->|useChat hook| C["DefaultChatTransport<br/>/api/ai/companion"]
    C -->|POST messages[]| D["app/api/ai/companion/route.ts"]
    D -->|createClient| E["Supabase Server Client<br/>(session validation)"]
    D -->|streamText| F["HuggingFace<br/>meta-llama/Meta-Llama-3-8B-Instruct"]
    F -->|toUIMessageStreamResponse| B
```

**Key architectural decisions:**

- The layout is already `"use client"`, so importing `CompanionWidget` directly is straightforward
  with no Server/Client boundary issues.
- The companion route is a completely separate file from `/api/ai/chat/route.ts` — different
  system prompt, different auth check, no shared module state.
- Conversation history is managed entirely by the `useChat` hook's internal state. No Zustand,
  no Context, no localStorage — intentionally ephemeral.
- The greeting message is injected as the `messages` initial value in `useChat`, matching the
  exact pattern used in `app/(app)/onboard/page.tsx`.

---

## Components and Interfaces

### `app/api/ai/companion/route.ts`

A Next.js Route Handler (POST only). Mirrors the structure of `app/api/ai/chat/route.ts` with
two additions: session validation and a companion-specific system prompt.

```ts
// Request body
{ messages: UIMessage[] }

// Success: streaming UI message stream response
// Failure: 401 Response if no valid session
```

Auth check uses `createClient()` from `lib/supabase/server.ts` (which calls `await cookies()`
internally — compatible with Next.js 16's async cookies API).

### `components/companion/CompanionWidget.tsx`

A `"use client"` component with two visual states driven by a single `isOpen: boolean`.

**Props:** none (self-contained)

**Internal state:**
- `isOpen: boolean` — controls collapsed vs expanded
- `useChat` hook state — `messages`, `sendMessage`, `status`

**`useChat` configuration:**
```ts
useChat({
  transport: new DefaultChatTransport({ api: "/api/ai/companion" }),
  messages: [WELCOME_MESSAGE],  // pre-populated, no API call
})
```

**Collapsed state** (trigger button):
- `position: fixed`, `bottom: 24px`, `right: 24px`, `zIndex: 100`
- Circular button, 64×64px, `#173124` background, white "Jo" text
- Green pulse dot (4×4px, `#4CAF50`) — CSS `@keyframes` pulse animation via inline style

**Expanded state** (chat panel):
- `position: fixed`, `bottom: 24px`, `right: 24px`, `zIndex: 100`
- 360px wide, 480px tall (full viewport on screens <480px wide)
- `role="dialog"`, `aria-label="Jo companion chat"`
- Header: "Jo" title + "Your Joyn companion" subtitle + close button (44×44px)
- Message list: scrollable div, `aria-live="polite"`, auto-scroll via `useEffect` + `ref`
- Typing indicator: shown when `status === "streaming" || status === "submitted"`
- Input: `<textarea>` (min-height 52px, font-size 16px) + send button (disabled when empty or streaming)

### `app/(app)/layout.tsx` (modification)

Add one import and one JSX element after `<main>`:

```tsx
import { CompanionWidget } from "@/components/companion/CompanionWidget";

// Inside the return, after </main>:
<CompanionWidget />
```

The layout is already `"use client"` and already renders `<main>` — no structural changes needed.

---

## Data Models

### `UIMessage` (from `ai` package)

The `useChat` hook and the companion route both use the Vercel AI SDK v6 `UIMessage` type:

```ts
type UIMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: "text"; text: string } | ...>;
}
```

The welcome message is a static constant:

```ts
const WELCOME_MESSAGE: UIMessage = {
  id: "companion-welcome",
  role: "assistant",
  parts: [{ type: "text", text: "Hi there! 😊 How are you feeling today? I'm Jo, and I'm here whenever you want to chat." }],
};
```

### Conversation State

All conversation state lives in the `useChat` hook. No database schema changes are required.
No server-side session storage. History is intentionally lost on page refresh (requirement 9.5).

### System Prompt

The companion route uses a dedicated system prompt constant (not exported, not shared):

```
You are Jo, a warm and caring companion for Joyn users — retired adults in Arizona.
You are NOT a fitness coach, therapist, or crisis counselor. You are a friendly neighbor
who checks in and listens. Keep every response to 2-3 sentences. Use gentle emojis
occasionally (🌻 ☀️ 😊). When a user seems lonely or bored, gently suggest connecting
with one of their matches, browsing upcoming events, or scheduling a session — but only
when it feels natural, not on every turn. If a user expresses serious distress or mentions
self-harm, respond warmly and suggest they reach out to a trusted family member or call
988 (the Suicide and Crisis Lifeline). Never diagnose conditions, recommend medications,
interpret medical symptoms, or provide crisis counseling. You are a caring friend, not a
hotline operator.
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions
of a system — essentially, a formal statement about what the system should do. Properties serve
as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Widget persistence across navigations

*For any* sequence of client-side route navigations within the authenticated layout, the
`CompanionWidget` component instance should not remount — its React state (including full
conversation history) should be identical before and after navigation.

**Validates: Requirements 1.6, 9.4**

### Property 2: Panel toggle preserves conversation state

*For any* conversation containing N messages, closing the chat panel and reopening it should
result in exactly the same N messages being displayed — no messages added, removed, or
reordered, and no new greeting appended.

**Validates: Requirements 2.5, 3.3, 9.1**

### Property 3: Unauthenticated requests receive 401

*For any* POST request to `/api/ai/companion` that does not carry a valid Supabase session
cookie, the response status code should be 401.

**Validates: Requirements 4.7**

### Property 4: Full conversation history included in each request

*For any* conversation of N prior messages, when the user sends message N+1, the request body
sent to `/api/ai/companion` should contain all N prior messages plus the new message — no
history truncation.

**Validates: Requirements 5.3, 9.2**

### Property 5: Send button disabled when input empty or streaming

*For any* widget state where the input textarea is empty (or whitespace-only) OR the chat
status is `"streaming"` or `"submitted"`, the send button should have its `disabled` attribute
set to `true`.

**Validates: Requirements 8.5**

### Property 6: All interactive elements meet minimum touch target size

*For any* rendered state of the `CompanionWidget` (collapsed or expanded), every interactive
element (trigger button, close button, send button) should have a width and height of at least
44×44px.

**Validates: Requirements 1.4, 2.4, 8.3**

### Property 7: ARIA attributes present in all widget states

*For any* rendered state of the `CompanionWidget`, the required ARIA attributes should be
present: `aria-label` on the trigger button, `role="dialog"` and `aria-label` on the chat
panel when expanded, and `aria-live="polite"` on the message list when expanded.

**Validates: Requirements 8.7**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| No session cookie on companion route | Return `new Response("Unauthorized", { status: 401 })` before calling `streamText` |
| Supabase `getUser()` returns error | Treat as unauthenticated — return 401 |
| HuggingFace API error / timeout | `streamText` throws; Next.js route handler returns 500; `useChat` surfaces error in `status` |
| Empty `messages` array in request body | `convertToModelMessages([])` returns empty array; LLM responds from system prompt only — acceptable |
| Network failure on client | `useChat` sets `status` to `"error"`; UI should show a retry affordance (input re-enabled) |
| `maxDuration` exceeded (30s) | Vercel function timeout; client receives truncated stream; `useChat` handles gracefully |

The companion route follows the same `maxDuration = 30` export as the existing chat route.

---

## Testing Strategy

### Dual approach

Both unit/example tests and property-based tests are required. They are complementary:
unit tests catch concrete bugs in specific scenarios; property tests verify universal
correctness across all inputs.

### Unit / example tests (`__tests__/companion-widget.test.tsx`)

Focus on specific states and interactions:

- Widget renders in collapsed state by default
- Trigger button click expands the panel
- Close button click collapses the panel
- Welcome message is present on first render (no network call)
- Send button is disabled when input is empty
- Send button is disabled when status is "streaming"
- Send button is enabled when input has content and status is "ready"
- Message list has `aria-live="polite"`
- Trigger button has `aria-label`
- Chat panel has `role="dialog"` when open
- Input textarea has minimum font size 16px
- Message text has minimum font size 18px
- Input textarea has minimum height 52px
- Panel dimensions are at least 360×480px when open
- No Supabase DB calls during conversation (mock verification)

### Unit tests (`__tests__/companion-route.test.ts`)

- Returns 401 when `supabase.auth.getUser()` returns no user
- Returns streaming response when session is valid (mock HuggingFace)

### Property-based tests (`__tests__/companion-widget.property.test.tsx`)

Uses `fast-check` (already in devDependencies). Minimum 100 runs per property.

Each test is tagged with a comment referencing the design property:
```
// Feature: ai-companion-chatbot, Property N: <property text>
```

**Property 1 — Widget persistence across navigations:**
Generate a random sequence of route paths. Render the layout, navigate between paths, assert
the widget's message count is unchanged after each navigation.

**Property 2 — Panel toggle preserves conversation state:**
Generate an arbitrary array of mock messages. Inject them into the widget's state, toggle the
panel closed then open, assert the message array is identical (same length, same content, same
order).

**Property 3 — Unauthenticated requests receive 401:**
Generate arbitrary `UIMessage` arrays. POST each to the companion route handler with no session
cookie. Assert every response has status 401.

**Property 4 — Full history in each request:**
Generate a conversation of N messages using `fc.array(messageArbitrary, { minLength: 1 })`.
Simulate sending message N+1 and capture the outgoing fetch body. Assert the `messages` array
in the body has length N+1 and contains all prior messages.

**Property 5 — Send button disabled when empty or streaming:**
Generate combinations of `(inputValue: string, status: ChatStatus)`. For any input that is
empty/whitespace OR any status that is "streaming"/"submitted", assert the send button is
disabled. For non-empty input with "ready" status, assert it is enabled.

**Property 6 — Touch targets ≥44×44px:**
For both collapsed and expanded states, enumerate all interactive elements and assert each
has `offsetWidth >= 44` and `offsetHeight >= 44`.

**Property 7 — ARIA attributes present:**
For both collapsed and expanded states (generated via `fc.boolean()` for `isOpen`), assert
the required ARIA attributes are present on the correct elements.

### Property-based test configuration

```ts
// vitest.config.ts already configures jsdom environment
// fast-check default: 100 runs — sufficient for these properties
// For property 3 (route handler), use fc.assert with fc.asyncProperty
```
