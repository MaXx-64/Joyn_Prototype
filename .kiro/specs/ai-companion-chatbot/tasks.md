# Implementation Plan: AI Companion Chatbot

## Overview

Implement the AI companion chatbot in three incremental steps: the API route, the widget component, and wiring it into the authenticated layout.

## Tasks

- [x] 1. Create the companion API route
  - Create `app/api/ai/companion/route.ts` mirroring the structure of `app/api/ai/chat/route.ts`
  - Add `maxDuration = 30` export
  - Import `createClient` from `@/lib/supabase/server` and call `supabase.auth.getUser()` — return `new Response("Unauthorized", { status: 401 })` if no valid user
  - Use `huggingface("meta-llama/Meta-Llama-3-8B-Instruct")` with the companion-specific system prompt (warm companion persona, no medical advice, no crisis counseling, 988 referral for serious distress, gentle connection nudges)
  - Accept `{ messages: UIMessage[] }` body, call `convertToModelMessages`, return `result.toUIMessageStreamResponse()`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 1.1 Write unit test for 401 on unauthenticated request
    - Mock `createClient` so `getUser()` returns `{ data: { user: null } }`
    - POST to the route handler and assert response status is 401
    - _Requirements: 4.7_

  - [ ]* 1.2 Write property test for unauthenticated requests always receiving 401
    - **Property 3: Unauthenticated requests receive 401**
    - Generate arbitrary `UIMessage[]` arrays with `fc.array(messageArbitrary)`; POST each with no session; assert every response status is 401
    - **Validates: Requirements 4.7**

- [x] 2. Create the CompanionWidget component
  - Create `components/companion/CompanionWidget.tsx` as a `"use client"` component
  - Define `WELCOME_MESSAGE` static constant (`id: "companion-welcome"`, role `"assistant"`, greeting text)
  - Add `isOpen: boolean` state (default `false`)
  - Configure `useChat` from `@ai-sdk/react` with `DefaultChatTransport({ api: "/api/ai/companion" })` and `messages: [WELCOME_MESSAGE]` as initial value
  - Collapsed state: `position: fixed`, `bottom: 24px`, `right: 24px`, `zIndex: 100`; circular button 64×64px, `#173124` background, white "Jo" text, pulsing green dot (4×4px, `#4CAF50`); `aria-label` on trigger button
  - Expanded state: 360px wide, 480px tall (full viewport on screens <480px); `role="dialog"`, `aria-label="Jo companion chat"`; header with "Jo" / "Your Joyn companion" (min 18px font) + close button (44×44px); scrollable message list with `aria-live="polite"`, auto-scroll via `useEffect` + `ref`; typing indicator when `status === "streaming" || status === "submitted"`; `<textarea>` input (min-height 52px, font-size 16px); send button disabled when input empty/whitespace or status is streaming/submitted
  - Message text min font size 18px; design tokens: surface `#FEF9ED`, card `#E7E2D7`, border `#C2C8C2`, primary `#173124`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 5.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.7, 8.8, 9.1, 9.2, 10.1, 10.2, 10.3, 10.4_

  - [ ]* 2.1 Write unit tests for widget states and interactions
    - Collapsed by default; trigger click expands; close click collapses
    - Welcome message present on first render (no network call)
    - Send button disabled when input empty; disabled when status is "streaming"; enabled when input has content and status is "ready"
    - `aria-live="polite"` on message list; `aria-label` on trigger button; `role="dialog"` on panel when open
    - Input textarea min font-size 16px; message text min font-size 18px; input min-height 52px; panel ≥360×480px when open
    - _Requirements: 2.1, 2.2, 3.2, 8.1, 8.2, 8.4, 8.5, 8.7_

  - [ ]* 2.2 Write property test for panel toggle preserving conversation state
    - **Property 2: Panel toggle preserves conversation state**
    - Generate arbitrary mock message arrays; inject into widget state; toggle panel closed then open; assert message array is identical (same length, content, order, no new greeting appended)
    - **Validates: Requirements 2.5, 3.3, 9.1**

  - [ ]* 2.3 Write property test for send button disabled states
    - **Property 5: Send button disabled when input empty or streaming**
    - Generate combinations of `(inputValue: string, status: ChatStatus)`; assert send button is disabled for empty/whitespace input or streaming/submitted status; assert enabled for non-empty input with "ready" status
    - **Validates: Requirements 8.5**

  - [ ]* 2.4 Write property test for touch target sizes
    - **Property 6: All interactive elements meet minimum touch target size**
    - For both collapsed and expanded states, enumerate all interactive elements (trigger, close, send buttons); assert each has `offsetWidth >= 44` and `offsetHeight >= 44`
    - **Validates: Requirements 1.4, 2.4, 8.3**

  - [ ]* 2.5 Write property test for ARIA attributes
    - **Property 7: ARIA attributes present in all widget states**
    - Use `fc.boolean()` to generate `isOpen` state; assert `aria-label` on trigger button in collapsed state; assert `role="dialog"`, `aria-label`, and `aria-live="polite"` present when expanded
    - **Validates: Requirements 8.7**

- [x] 3. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Wire CompanionWidget into the authenticated layout
  - Modify `app/(app)/layout.tsx`: add `import { CompanionWidget } from "@/components/companion/CompanionWidget"` and render `<CompanionWidget />` after `</main>` inside the return
  - No structural changes to the layout are needed — it is already `"use client"`
  - _Requirements: 1.1, 1.6, 9.4_

  - [ ]* 4.1 Write property test for widget persistence across navigations
    - **Property 1: Widget persistence across navigations**
    - Generate a random sequence of route paths; render the layout, navigate between paths, assert the widget's message count is unchanged after each navigation
    - **Validates: Requirements 1.6, 9.4**

  - [ ]* 4.2 Write property test for full conversation history in each request
    - **Property 4: Full conversation history included in each request**
    - Generate a conversation of N messages with `fc.array(messageArbitrary, { minLength: 1 })`; simulate sending message N+1 and capture the outgoing fetch body; assert `messages` array has length N+1 and contains all prior messages
    - **Validates: Requirements 5.3, 9.2**

- [x] 5. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` (already in devDependencies), minimum 100 runs per property
- Each property test file should include a comment: `// Feature: ai-companion-chatbot, Property N: <property text>`
- Conversation history is intentionally ephemeral — no DB writes required
